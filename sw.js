/* Chess Quest service worker: network-first so updates always load immediately, with offline fallback. */
const CACHE = 'chessquest-v2.2';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'store.js', 'board.js', 'lessons.js', 'puzzles.js', 'manifest.json',
  'assets/chess.min.js', 'assets/anish-jacket.jpg', 'assets/anish-blazer.jpg', 'assets/anish-jacket-fringe.jpg', 'assets/anish-blazer-fringe.jpg',
  'assets/icon-180.png', 'assets/icon-192.png', 'assets/icon-512.png', ...['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'].map(p => 'assets/pieces/' + p + '.svg')];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
