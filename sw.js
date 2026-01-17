const CACHE = "oaks-scorecard-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
  "./sw.js"
  // Add icons once you create them:
  // "./icon-192.png",
  // "./icon-512.png",
];


for (let i = 0; i < 18; i++) {
  const v = state.scores[pIdx][i];
  const par = holes[i].par;

  let extraClass = "";
  if (v !== null) {
    const d = v - par; // delta vs par

    if (d <= -2) extraClass = " delta-eagle";
    else if (d === -1) extraClass = " delta-birdie";
    else if (d === 0) extraClass = " delta-par";
    else if (d === 1) extraClass = " delta-bogey";
    else extraClass = " delta-double"; // d >= 2
  }

  html += `<td class="tap-cell${extraClass}"
              data-type="score"
              data-player="${pIdx}"
              data-hole="${i}">
            ${v === null ? "—" : v}
          </td>`;
}



self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
