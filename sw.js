// sw.js
const CACHE_NAME = "congresso2025-v1";
const URLS_TO_CACHE = [
  "/",             // index.html
  "/index.html",
  "/sexta.html",
  "/sabado.html",
  "/domingo.html",

  "/style.css",
  "/components.css",
  "/notas.css",
  "/index-style.css",

  "/script.js",
  "/notas.js",

  // imagens da pasta /imagens
  "/imagens/dom1.jpg",
  "/imagens/index.jpg",
  "/imagens/sab1.jpg",
  "/imagens/sex1.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});