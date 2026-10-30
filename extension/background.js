const APP_URL_KEY = 'appUrl';

async function registerAppBridge(url) {
  const parsed = new URL(url);
  const originPattern = `${parsed.origin}/*`;
  const existing = await chrome.scripting.getRegisteredContentScripts();
  const oldScript = existing.find(script => script.id === 'vod-marker-app-bridge');
  if (oldScript?.matches?.includes(originPattern)) return;
  if (oldScript) await chrome.scripting.unregisterContentScripts({ ids: ['vod-marker-app-bridge'] });
  await chrome.scripting.registerContentScripts([{
    id: 'vod-marker-app-bridge',
    matches: [originPattern],
    js: ['app-bridge.js'],
    runAt: 'document_start',
    persistAcrossSessions: true
  }]);
}

chrome.runtime.onInstalled.addListener(async () => {
  const { [APP_URL_KEY]: appUrl } = await chrome.storage.local.get(APP_URL_KEY);
  if (!appUrl) return;
  try {
    const originPattern = `${new URL(appUrl).origin}/*`;
    if (await chrome.permissions.contains({ origins: [originPattern] })) await registerAppBridge(appUrl);
  } catch (_) {}
});

async function openAppTab(appUrl, activate = false) {
  const parsed = new URL(appUrl);
  const tabs = await chrome.tabs.query({ url: `${parsed.origin}/*` });
  const existing = tabs.find(tab => tab.url === parsed.href);
  if (existing?.id) {
    await chrome.tabs.update(existing.id, { active: activate });
    return existing.id;
  }
  const created = await chrome.tabs.create({ url: parsed.href, active: activate });
  return created.id;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'vod-marker-open-app') {
    chrome.storage.local.get(APP_URL_KEY).then(async ({ [APP_URL_KEY]: appUrl }) => {
      if (!appUrl) {
        sendResponse({ ok: false });
        return;
      }
      const parsed = new URL(appUrl);
      const originPattern = `${parsed.origin}/*`;
      if (!(await chrome.permissions.contains({ origins: [originPattern] }))) {
        sendResponse({ ok: false });
        return;
      }
      await registerAppBridge(appUrl);
      await openAppTab(appUrl, true);
      sendResponse({ ok: true });
    }).catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (message?.type === 'vod-marker-configured' && typeof message.appUrl === 'string') {
    registerAppBridge(message.appUrl).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (!message || message.type !== 'vod-marker-record') return;
  chrome.storage.local.get(APP_URL_KEY).then(async ({ [APP_URL_KEY]: appUrl }) => {
    if (!appUrl) {
      sendResponse({ ok: false, error: 'Configurez d’abord l’adresse de votre index dans le menu de l’extension.' });
      return;
    }
    let parsed;
    try { parsed = new URL(appUrl); } catch (_) {
      sendResponse({ ok: false, error: 'L’adresse de l’index enregistrée est invalide. Reconfigurez l’extension.' });
      return;
    }
    const originPattern = `${parsed.origin}/*`;
    if (!(await chrome.permissions.contains({ origins: [originPattern] }))) {
      sendResponse({ ok: false, error: 'Autorisez l’accès à votre index dans le menu de l’extension.' });
      return;
    }
    await registerAppBridge(appUrl);
    const tabs = await chrome.tabs.query({ url: `${parsed.origin}/*` });
    const appTab = tabs.find(tab => tab.id !== sender.tab?.id);
    if (!appTab?.id) {
      await openAppTab(appUrl);
      sendResponse({ ok: false, error: 'J’ai ouvert votre index. Cliquez encore une fois sur REC pour envoyer le marqueur.' });
      return;
    }
    try {
      await chrome.tabs.sendMessage(appTab.id, { type: 'vod-marker-record', at: message.at });
      sendResponse({ ok: true });
    } catch (_) {
      sendResponse({ ok: false, error: 'Rechargez l’onglet de l’index pour activer la liaison.' });
    }
  }).catch(() => sendResponse({ ok: false, error: 'Impossible de contacter l’index.' }));
  return true;
});
