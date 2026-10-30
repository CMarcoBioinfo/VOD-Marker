(() => {
  const ROOT_ID = 'vod-marker-rec-root';
  const POSITION_KEY = 'recPosition';
  let busy = false;
  let suppressClick = false;
  let statusTimer;

  function install() {
    if (!document.body || document.getElementById(ROOT_ID)) return;
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.style.cssText = 'position:fixed;z-index:2147483647;right:20px;bottom:24px;display:flex;flex-direction:column;align-items:flex-end;gap:10px;';
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.style.cssText = 'display:none;max-width:min(300px,80vw);padding:9px 12px;border-radius:8px;background:#111827;color:white;font:13px system-ui,sans-serif;box-shadow:0 3px 12px #0008;';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '● REC';
    button.title = 'Cliquer pour marquer · déplacer en faisant glisser · raccourci : M';
    button.setAttribute('aria-label', 'Marquer ce moment. Faire glisser pour déplacer le bouton.');
    button.style.cssText = 'border:0;border-radius:999px;padding:12px 18px;background:#d92d45;color:white;font:700 15px system-ui,sans-serif;box-shadow:0 4px 18px #0008;cursor:grab;touch-action:none;user-select:none;';
    button.addEventListener('click', () => {
      if (suppressClick) { suppressClick = false; return; }
      record();
    });
    button.addEventListener('pointerdown', startDrag);
    button.addEventListener('pointermove', moveDrag);
    button.addEventListener('pointerup', endDrag);
    button.addEventListener('pointercancel', endDrag);
    root.append(status, button);
    document.body.append(root);
    chrome.storage.local.get(POSITION_KEY, ({ [POSITION_KEY]: position }) => {
      if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y) || !root.isConnected) return;
      placeRoot(root, position.x, position.y);
    });
  }

  function placeRoot(root, x, y) {
    const maxX = Math.max(0, window.innerWidth - root.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - root.offsetHeight);
    root.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    root.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    root.style.right = 'auto';
    root.style.bottom = 'auto';
  }

  function startDrag(event) {
    if (event.button !== 0) return;
    const root = event.currentTarget.parentElement;
    const rect = root.getBoundingClientRect();
    root._drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, moved: false };
    event.currentTarget.style.cursor = 'grabbing';
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    const button = event.currentTarget;
    const root = button.parentElement;
    const drag = root._drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    placeRoot(root, drag.left + dx, drag.top + dy);
  }

  function endDrag(event) {
    const button = event.currentTarget;
    const root = button.parentElement;
    const drag = root._drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    root._drag = null;
    button.style.cursor = 'grab';
    if (!drag.moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    const rect = root.getBoundingClientRect();
    chrome.storage.local.set({ [POSITION_KEY]: { x: rect.left, y: rect.top } });
  }

  function showStatus(text) {
    const status = document.querySelector(`#${ROOT_ID} [role="status"]`);
    if (!status) return;
    status.textContent = text;
    status.style.display = 'block';
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.style.display = 'none'; }, 3000);
  }

  function record() {
    if (busy) return;
    busy = true;
    const button = document.querySelector(`#${ROOT_ID} button`);
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
    if (typing || event.isComposing || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.key.toLowerCase() !== 'm') return;
    event.preventDefault();
    record();
  });

  if (document.body) install();
  else document.addEventListener('DOMContentLoaded', install, { once: true });
})();
