if (!window.__vodMarkerBridgeInstalled) {
  window.__vodMarkerBridgeInstalled = true;
  chrome.runtime.onMessage.addListener(message => {
    if (!message || message.type !== 'vod-marker-record' || typeof message.at !== 'number') return;
    const request = { type: 'mark', at: message.at, channel: message.channel };
    try { localStorage.setItem('vod-marker-extension-pending-v1', JSON.stringify(request)); } catch (_) {}
    window.postMessage({ source: 'vod-marker-extension', ...request }, location.origin);
  });

  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin || event.data?.source !== 'vod-marker-app' || event.data?.type !== 'oauth-required') return;
    try {
      chrome.runtime.sendMessage({ type: 'vod-marker-activate-for-oauth' }, response => {
        try {
          if (!chrome.runtime.lastError && response?.ok) window.postMessage({ source: 'vod-marker-extension', type: 'oauth-activation-ready' }, location.origin);
        } catch (_) {}
      });
    } catch (_) {}
  });
}
