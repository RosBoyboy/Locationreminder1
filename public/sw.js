const CACHE_NAME = 'reminders-pwa-cache-v3';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((name) => {
        if (name !== CACHE_NAME) return caches.delete(name);
      })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  // Only process GET requests; allow network to handle everything else directly
  if (event.request.method !== 'GET') return;

  // Let browser natively handle cross-origin APIs & RSC fetches
  const url = new URL(event.request.url);
  if (
    url.hostname.includes('supabase.co') ||
    url.protocol.startsWith('chrome-extension') ||
    event.request.headers.get('RSC') === '1'
  ) {
    return;
  }

  // Use Network-First for HTML Document navigations
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Network-First with Cache Fallback for everything else
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone response to cache it
        if (networkResponse.ok && networkResponse.type === 'basic') {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

