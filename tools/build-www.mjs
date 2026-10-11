#!/usr/bin/env node
// Собирает www/ для Capacitor: копирует только файлы приложения (то же, что кэширует SW).
// Перед копированием пересобирает sw.js. Запуск: node tools/build-www.mjs
import { cp, rm, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, collect } from './build-sw.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'www');

const { version } = await build(ROOT);
const files = [...await collect(ROOT), 'sw.js'];
await rm(OUT, { recursive: true, force: true });
for (const f of files) {
  await mkdir(dirname(join(OUT, f)), { recursive: true });
  await cp(join(ROOT, f), join(OUT, f));
}
console.log(`www/: ${files.length} файлов, версия ${version}`);
