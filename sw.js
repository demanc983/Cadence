/* ============================================================
   Cadence service worker  (#4)  — offline after first load.

   Strategy:
   • App shell (same-origin HTML / navigations): NETWORK-FIRST, so a freshly
     uploaded index.html always wins when you're online; falls back to cache
     when offline.
   • Immutable libraries + fonts + icons: CACHE-FIRST, so the app boots with
     no network once they've been seen.

   Bump CACHE (e.g. cadence-v2) whenever you want to force-evict old assets.
============================================================ */
const CACHE = "cadence-v1";
const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./apple-touch-icon.png",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.26.4/babel.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // allSettled so one failed CDN fetch doesn't abort the whole install
      .then((c) => Promise.allSettled(CORE.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  const sameOrigin = url.origin === self.location.origin;
  const isShell =
    sameOrigin && (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/"));

  if (isShell) {
    // network-first: prefer a fresh upload, fall back to cache offline
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // everything else (CDN libs, Google fonts, icons): cache-first
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => hit);
    })
  );
});
