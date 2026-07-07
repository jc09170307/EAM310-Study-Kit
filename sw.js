// EAM310 Study App — minimal service worker
// Enables "Install App" (not just "Add to Home Screen") on supporting browsers,
// plus basic offline access to the app shell once it's been visited once.

const CACHE_NAME = 'eam310-studyapp-v5';
const APP_SHELL = [
  './',
  './index.html',
  './EAM310_Workbook.html',
  './EAM310_Worksheet.html',
  './EAM310_StudyGuide.html',
  './manifest.json',
  './manifest-workbook.json',
  './manifest-worksheet.json',
  './manifest-studyguide.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network-first strategy: always try to get fresh content, fall back to cache
  event.respondWith(
    fetch(event.request).then(response => {
      if (event.request.method === 'GET' && response.ok) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
      }
      return response;
    }).catch(() =>
      caches.match(event.request)
    )
  );
});
