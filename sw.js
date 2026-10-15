// "dev" est remplacé par le tag Git au déploiement (.github/workflows/deploy.yml).
const CACHE = "axonoel-dev";

const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./games.js",
  "./manifest.webmanifest",
  "./fonts/inter-latin.woff2",
  "./assets/logo-blanc.svg",
  "./assets/x.svg",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./images/placeholder.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
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
  const url = new URL(req.url);
  // Les jeux (autres origines) ne passent pas par ce SW.
  if (req.method !== "GET" || url.origin !== location.origin) return;

  if (req.mode === "navigate" || url.pathname.endsWith("/games.js")) {
    e.respondWith(networkFirst(req));
  } else if (url.pathname.includes("/images/")) {
    e.respondWith(staleWhileRevalidate(e, req));
  } else {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req)) || (await cache.match("./index.html"));
  }
}

async function staleWhileRevalidate(e, req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const update = fetch(req).then((res) => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  });
  if (hit) {
    e.waitUntil(update.catch(() => {}));
    return hit;
  }
  return update;
}
