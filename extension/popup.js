const input = document.getElementById('appUrl');
const status = document.getElementById('status');

chrome.storage.local.get('appUrl').then(({ appUrl }) => {
  if (appUrl) input.value = appUrl;
});

document.getElementById('save').addEventListener('click', async () => {
  let parsed;
  try {
    parsed = new URL(input.value.trim());
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error();
  } catch (_) {
    status.textContent = 'Saisis une adresse web valide (https://… ou http://…).';
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
    status.textContent = 'Adresse enregistrée et autorisée. Recharge les onglets de l’index et de Twitch.';
  } catch (_) {
    status.textContent = 'Échec de la configuration. Réessaie depuis le menu de l’extension.';
  }
});
