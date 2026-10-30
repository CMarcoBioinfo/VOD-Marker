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
  const existing = tabs.find(tab => {
    try { const current = new URL(tab.url); return current.pathname === parsed.pathname; } catch (_) { return false; }
  });
  if (existing?.id) {
    await chrome.tabs.update(existing.id, { active: activate });
    return existing.id;
  }
  const created = await chrome.tabs.create({ url: parsed.href, active: activate });
  return created.id;
}

function channelFromTwitchUrl(value) {
  try {
    const url = new URL(value);
    if (!['www.twitch.tv', 'twitch.tv'].includes(url.hostname)) return '';
    const login = url.pathname.split('/').filter(Boolean)[0] || '';
    return /^[a-zA-Z0-9_]{1,25}$/.test(login) && !['directory', 'downloads', 'jobs', 'settings', 'videos', 'wallet', 'subscriptions', 'inventory', 'friends', 'search', 'login', 'signup'].includes(login.toLowerCase()) ? login : '';
  } catch (_) { return ''; }
}

function recordUrl(appUrl, channel, at) {
  const url = new URL(appUrl);
  url.searchParams.set('vod-marker-action', 'record');
  url.searchParams.set('vod-marker-at', String(at));
  if (channel) url.searchParams.set('vod-marker-channel', channel);
  return url.href;
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
    const appTab = tabs.find(tab => {
      if (tab.id === sender.tab?.id) return false;
      try { const current = new URL(tab.url); return current.pathname === parsed.pathname; } catch (_) { return false; }
    });
    const channel = channelFromTwitchUrl(sender.tab?.url || '');
    if (!appTab?.id) {
      await chrome.tabs.create({ url: recordUrl(appUrl, channel, message.at), active: true });
      sendResponse({ ok: true, channel, opened: true });
      return;
    }
    try {
      await chrome.tabs.update(appTab.id, { active: true });
      await chrome.tabs.sendMessage(appTab.id, { type: 'vod-marker-record', at: message.at, channel });
      sendResponse({ ok: true, channel });
    } catch (_) {
      await chrome.tabs.update(appTab.id, { url: recordUrl(appUrl, channel, message.at), active: true });
      sendResponse({ ok: true, channel, opened: true });
    }
  }).catch(() => sendResponse({ ok: false, error: 'Impossible de contacter l’index.' }));
  return true;
});
