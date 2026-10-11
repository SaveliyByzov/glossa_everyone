# sync-worker

Cloudflare Worker + KV: хранит зашифрованные профили Glossa и Srpski. Подробная инструкция — `docs/SYNC.md`.

```bash
npx wrangler login
npx wrangler kv namespace create BLOBS     # id → wrangler.toml
npx wrangler deploy
```

API (всё бинарное, `application/octet-stream`):

| Метод | Путь | Ответ |
|---|---|---|
| GET | `/v1/blob/<app>.<32 hex>` | 200 + `ETag`, `X-Updated` · 404 · 304 (`If-None-Match`) |
| PUT | `/v1/blob/<id>` | требует `If-Match: "<etag>"` или `If-None-Match: *` → 200 + новый `ETag` · 412 · 428 · 413 (>512 КБ) · 400 |
| DELETE | `/v1/blob/<id>` | 204, идемпотентно |
| GET | `/v1/health` | `{"ok":true}` |

Тест логики: `node --test tests/sync-worker.test.mjs` (KV подменён мок-объектом). Локальный запуск (`wrangler dev`) не обязателен.
