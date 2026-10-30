/* Cache statique minimal pour l'installation PWA (hors file://). */
const CACHE = 'vod-marker-v3';
const FILES = ['./', './index.html', './css/style.css', './js/i18n.js', './js/timecode.js', './js/storage.js', './js/twitch.js', './js/export.js', './js/shortcuts.js', './js/app.js', './assets/icon.svg', './manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  })));
});
