chrome.runtime.onMessage.addListener(message => {
  if (!message || message.type !== 'vod-marker-record' || typeof message.at !== 'number') return;
  window.postMessage({ source: 'vod-marker-extension', type: 'mark', at: message.at }, location.origin);
});
