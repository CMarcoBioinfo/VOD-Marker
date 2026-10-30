const DEFAULT_APP_URL = 'https://cmarcobioinfo.github.io/VOD-Marker/';
const input = document.getElementById('appUrl');
const status = document.getElementById('status');

chrome.storage.local.get('appUrl').then(async ({ appUrl }) => {
  input.value = appUrl || DEFAULT_APP_URL;
  if (!appUrl) {
    await chrome.storage.local.set({ appUrl: DEFAULT_APP_URL });
    status.textContent = 'Adresse de l’application préremplie. Clique une fois sur Enregistrer et autoriser.';
  }
});

document.getElementById('save').addEventListener('click', async () => {
  let parsed;
  try {
    parsed = new URL(input.value.trim());
    if (parsed.protocol !== 'https:' || parsed.origin !== new URL(DEFAULT_APP_URL).origin || parsed.username || parsed.password) throw new Error();
  } catch (_) {
    status.textContent = 'Utilise l’adresse HTTPS GitHub Pages prévue pour cette extension.';
    return;
  }
  const originPattern = `${parsed.origin}/*`;
  status.textContent = 'Demande d’autorisation…';
  try {
    const granted = await chrome.permissions.request({ origins: [originPattern] });
    if (!granted) {
      status.textContent = 'Autorisation refusée. L’extension ne peut pas joindre l’index.';
      return;
    }
    const appUrl = parsed.href;
    await chrome.storage.local.set({ appUrl });
    const registered = await chrome.runtime.sendMessage({ type: 'vod-marker-configured', appUrl });
    if (!registered?.ok) {
      status.textContent = 'Adresse enregistrée, mais la liaison n’a pas pu être activée. Recharge l’extension.';
      return;
    }
    const opened = await chrome.runtime.sendMessage({ type: 'vod-marker-open-app' });
    status.textContent = opened?.ok
      ? 'Adresse enregistrée : l’application est ouverte. Recharge Twitch pour voir REC.'
      : 'Adresse autorisée. Ouvre l’application depuis l’extension et recharge Twitch.';
  } catch (_) {
    status.textContent = 'Échec de la configuration. Réessaie depuis le menu de l’extension.';
  }
});
