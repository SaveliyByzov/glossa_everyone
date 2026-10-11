#!/usr/bin/env node
// Генерирует sw.js: список precache (все файлы приложения) + версия кэша = хэш содержимого.
// Любая правка CSS/JS/данных меняет версию → браузер ставит новый SW → toast «Доступна новая версия».
// Запуск: node tools/build-sw.mjs   (без зависимостей)

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INCLUDE_DIRS = ['css', 'js', 'data', 'icons'];
const INCLUDE_FILES = ['index.html', 'manifest.webmanifest'];
const EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.webmanifest', '.svg', '.png', '.ico', '.woff2']);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (EXT.has(entry.name.slice(entry.name.lastIndexOf('.')))) out.push(full);
  }
  return out;
}

export async function collect(root = ROOT) {
  const files = [];
  for (const f of INCLUDE_FILES) {
    try { await stat(join(root, f)); files.push(join(root, f)); } catch { /* нет файла — пропускаем */ }
  }
  for (const d of INCLUDE_DIRS) {
    try { files.push(...await walk(join(root, d))); } catch { /* нет папки */ }
  }
  return files.map((f) => relative(root, f).split(sep).join('/')).sort();
}

export async function build(root = ROOT) {
  // список файлов данных для движка: курсы подгружают uNN.ex.js, только если файл существует (без 404)
  const dataFiles = (await collect(root)).filter((f) => f.startsWith('data/'));
  await writeFile(join(root, 'js', 'filelist.js'),
    `// СГЕНЕРИРОВАН tools/build-sw.mjs: файлы data/ на момент сборки.
export default ${JSON.stringify(dataFiles, null, 1)};
`, 'utf8');
  const files = await collect(root);
  const hash = createHash('sha256');
  for (const f of files) {
    hash.update(f);
    hash.update(await readFile(join(root, f)));
  }
  const version = hash.digest('hex').slice(0, 12);
  const precache = ['./', ...files.map((f) => `./${f}`)];
  const sw = template(version, precache);
  await writeFile(join(root, 'sw.js'), sw, 'utf8');
  return { version, count: precache.length };
}

function template(version, precache) {
  return `// Service Worker Glossa — СГЕНЕРИРОВАН tools/build-sw.mjs, не редактируйте вручную.
// Стратегия: cache-first для всего приложения; новые версии — по сообщению SKIP_WAITING из приложения.
const VERSION = '${version}';
const CACHE = \`srpski-\${VERSION}\`;
const PRECACHE = ${JSON.stringify(precache, null, 2)};

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
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { version, count } = await build();
  console.log(`sw.js: версия ${version}, файлов в precache: ${count}`);
}
