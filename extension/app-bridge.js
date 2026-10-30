if (!window.__vodMarkerBridgeInstalled) {
  window.__vodMarkerBridgeInstalled = true;
  chrome.runtime.onMessage.addListener(message => {
    if (!message || message.type !== 'vod-marker-record' || typeof message.at !== 'number') return;
    const request = { type: 'mark', at: message.at, channel: message.channel };
    try { localStorage.setItem('vod-marker-extension-pending-v1', JSON.stringify(request)); } catch (_) {}
    window.postMessage({ source: 'vod-marker-extension', ...request }, location.origin);
  });
}
