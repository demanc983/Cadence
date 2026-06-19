/* ============================================================
   Cadence service worker  (#4)  — offline after first load.

   Strategy:
   • App shell (same-origin HTML / navigations): NETWORK-FIRST with the HTTP
     cache BYPASSED (cache:"reload"). This is the key to never needing a manual
     Safari cache-clear: a normal reload while online always pulls the freshly
     uploaded index.html. Falls back to the cached shell when offline.
   • Immutable libraries + fonts + icons: CACHE-FIRST, so the app boots with
     no network once they've been seen.

   Bump CACHE (v2 -> v3 ...) whenever you want to force-evict everything.
============================================================ */
const CACHE = "cadence-v2";

// Same-origin shell — must stay fresh, so precache it with the HTTP cache bypassed.
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./apple-touch-icon.png",
];
// Immutable, versioned libraries — fine to cache as-is.
const LIBS = [
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.26.4/babel.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled([
        // reload = ignore the HTTP cache when precaching the shell
        ...SHELL.map((u) => c.add(new Request(u, { cache: "reload" }))),
        ...LIBS.map((u) => c.add(u)),
      ])
    ).then(() => self.skipWaiting())
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
    // Fresh network copy, HTTP cache bypassed; update the offline fallback; fall
    // back to cache only if the network is unavailable.
    e.respondWith(
      fetch(new Request(req.url, { cache: "reload" }))
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy)).catch(() => {});
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
