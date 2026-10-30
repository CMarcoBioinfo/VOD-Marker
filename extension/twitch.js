(() => {
  const BUTTON_ID = 'vod-marker-rec-button';
  const STYLE_ID = 'vod-marker-rec-style';
  let busy = false;

  function install() {
    if (!document.body || document.getElementById(BUTTON_ID)) return;
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `#${BUTTON_ID}{position:fixed;z-index:2147483647;right:20px;bottom:24px;border:0;border-radius:999px;padding:12px 18px;background:#d92d45;color:white;font:700 15px system-ui,sans-serif;box-shadow:0 4px 18px #0008;cursor:pointer}#${BUTTON_ID}:hover{background:#b42335}#${BUTTON_ID}:disabled{opacity:.65;cursor:wait}#vod-marker-rec-status{position:fixed;z-index:2147483647;right:20px;bottom:76px;max-width:300px;padding:9px 12px;border-radius:8px;background:#111827;color:white;font:13px system-ui,sans-serif;box-shadow:0 3px 12px #0008;display:none}`;
      document.head.append(style);
    }
    const status = document.createElement('div');
    status.id = 'vod-marker-rec-status';
    status.setAttribute('role', 'status');
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.textContent = '● REC';
    button.title = 'Ajouter un marqueur à l’index (raccourci : M)';
    button.addEventListener('click', record);
    document.body.append(status, button);
  }

  function showStatus(text) {
    const status = document.getElementById('vod-marker-rec-status');
    if (!status) return;
    status.textContent = text;
    status.style.display = 'block';
    clearTimeout(showStatus.timer);
    showStatus.timer = setTimeout(() => { status.style.display = 'none'; }, 3500);
  }

  function record() {
    if (busy) return;
    busy = true;
    const button = document.getElementById(BUTTON_ID);
    if (button) button.disabled = true;
    chrome.runtime.sendMessage({ type: 'vod-marker-record', at: Date.now() }, response => {
      busy = false;
      if (button) button.disabled = false;
      if (chrome.runtime.lastError) {
        showStatus('Liaison indisponible. Vérifiez la configuration de l’extension.');
      } else if (response?.ok) {
        showStatus('Marqueur envoyé à votre index.');
      } else {
        showStatus(response?.error || 'Impossible d’envoyer le marqueur.');
      }
    });
  }

  document.addEventListener('keydown', event => {
    const target = event.target;
    const typing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (typing || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.key.toLowerCase() !== 'm') return;
    event.preventDefault();
    record();
  });

  install();
  new MutationObserver(install).observe(document.documentElement, { childList: true, subtree: true });
})();
