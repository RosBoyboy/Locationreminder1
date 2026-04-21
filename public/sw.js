const CACHE_NAME = 'reminders-pwa-cache-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  // Clear any existing caches from previous buggy Service Workers
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle ALL network requests naturally. 
  // No respondWith, no caching. Completely passive routing.
  return;
});

