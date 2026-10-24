const CACHE_NAME = "emotion-home-v17";
const ASSETS = [
  "./", "./index.html", "./styles.css?v=17", "./support.js?v=17",
  "./launcher.js?v=17", "./checkin.js?v=17", "./moods.js?v=17", "./emotions.js?v=17", "./app.js?v=17", "./manifest.webmanifest", "./icon.svg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("emotion-home-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    // Online visits receive the latest entry page; offline visits still work.
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(event.request, { cache: "no-cache" });
        if (!response.ok) throw new Error("Page unavailable");
        await cache.put("./index.html", response.clone());
        return response;
      } catch {
        return (await cache.match("./index.html")) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) await cache.put(event.request, response.clone());
    return response;
  })());
});










