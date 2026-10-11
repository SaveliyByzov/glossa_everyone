// Service Worker Glossa — СГЕНЕРИРОВАН tools/build-sw.mjs, не редактируйте вручную.
// Стратегия: cache-first для всего приложения; новые версии — по сообщению SKIP_WAITING из приложения.
const VERSION = '80d2de752d18';
const CACHE = `srpski-${VERSION}`;
const PRECACHE = [
  "./",
  "./css/app.css",
  "./css/dev.css",
  "./css/style-b.css",
  "./css/style-c.css",
  "./css/tokens.css",
  "./data/courses.js",
  "./data/pedagogy.js",
  "./data/sr/index.js",
  "./data/sr/reference.js",
  "./data/sr/u01.ex.js",
  "./data/sr/u01.js",
  "./data/sr/u02.ex.js",
  "./data/sr/u02.js",
  "./data/sr/u03.ex.js",
  "./data/sr/u03.js",
  "./data/sr/u04.ex.js",
  "./data/sr/u04.js",
  "./data/sr/u05.ex.js",
  "./data/sr/u05.js",
  "./data/sr/u06.ex.js",
  "./data/sr/u06.js",
  "./data/sr/u07.ex.js",
  "./data/sr/u07.js",
  "./data/sr/u08.ex.js",
  "./data/sr/u08.js",
  "./data/sr/u09.ex.js",
  "./data/sr/u09.js",
  "./data/sr/u10.ex.js",
  "./data/sr/u10.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/icon-maskable.svg",
  "./icons/icon.svg",
  "./index.html",
  "./js/answer.js",
  "./js/app.js",
  "./js/config.js",
  "./js/courses.js",
  "./js/dom.js",
  "./js/exercises/autogen.js",
  "./js/exercises/choice.js",
  "./js/exercises/classify.js",
  "./js/exercises/cloze.js",
  "./js/exercises/common.js",
  "./js/exercises/fix.js",
  "./js/exercises/flashcard.js",
  "./js/exercises/index.js",
  "./js/exercises/match.js",
  "./js/exercises/order.js",
  "./js/exercises/paradigm.js",
  "./js/exercises/transform.js",
  "./js/exercises/translate.js",
  "./js/filelist.js",
  "./js/gamify.js",
  "./js/markup.js",
  "./js/mastery.js",
  "./js/progress.js",
  "./js/router.js",
  "./js/script.js",
  "./js/session.js",
  "./js/srs.js",
  "./js/store.js",
  "./js/tts.js",
  "./js/ui.js",
  "./js/util.js",
  "./js/views/common.js",
  "./js/views/course.js",
  "./js/views/home.js",
  "./js/views/lesson-intro.js",
  "./js/views/profile.js",
  "./js/views/reference.js",
  "./js/views/review.js",
  "./js/views/session.js",
  "./js/views/theory.js",
  "./js/views/vocab.js",
  "./js/views/words.js",
  "./js/words.js",
  "./manifest.webmanifest"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // по одному: отсутствие одного файла не должно ломать установку
    await Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: 'reload' })).catch((err) => console.warn('[sw] не закэширован', url, err))));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('srpski-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // навигация : всегда оболочка index.html из кэша
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      return (await cache.match('./index.html')) || (await cache.match('./')) || fetch(req);
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      // докэшируем то, что появилось после сборки (например, новый файл курса)
      if (res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    } catch (err) {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
