import test from 'node:test';
import assert from 'node:assert/strict';
import { handle, MAX_BYTES, TTL_SECONDS } from '../sync-worker/worker.js';

function mockKV() {
  const m = new Map();
  return {
    m, puts: [],
    async getWithMetadata(k) { const e = m.get(k); return e ? { value: e.value.slice().buffer, metadata: e.metadata } : { value: null, metadata: null }; },
    async put(k, v, o) { this.puts.push({ k, o }); m.set(k, { value: new Uint8Array(v), metadata: o?.metadata }); },
    async delete(k) { m.delete(k); },
  };
}
const ID = `glossa.${'ab'.repeat(16)}`;
const URL_ = (id = ID) => `https://w.example/v1/blob/${id}`;
const blob = (n = 64, first = 1) => { const b = new Uint8Array(n).fill(7); b[0] = first; return b; };
const put = (env, body, headers = {}, id) => handle(new Request(URL_(id), { method: 'PUT', body, headers: { 'Content-Length': String(body.length), ...headers } }), env);
const get = (env, headers = {}) => handle(new Request(URL_(), { headers }), env);

test('создание: If-None-Match: *, затем GET отдаёт те же байты и ETag', async () => {
  const env = { BLOBS: mockKV() };
  const r = await put(env, blob(), { 'If-None-Match': '*' });
  assert.equal(r.status, 200);
  const etag = r.headers.get('ETag');
  assert.match(etag, /^"[0-9a-f]{32}"$/);
  assert.equal(env.BLOBS.puts[0].o.expirationTtl, TTL_SECONDS);
  const g = await get(env);
  assert.equal(g.status, 200);
  assert.equal(g.headers.get('ETag'), etag);
  assert.deepEqual(new Uint8Array(await g.arrayBuffer()), blob());
  assert.equal((await get(env, { 'If-None-Match': etag })).status, 304);
});

test('защита от затирания: нужен If-Match; устаревший ETag → 412', async () => {
  const env = { BLOBS: mockKV() };
  const first = await put(env, blob(), { 'If-None-Match': '*' });
  assert.equal((await put(env, blob(), { 'If-None-Match': '*' })).status, 412);   // уже существует
  assert.equal((await put(env, blob(), {})).status, 428);                          // без предусловия
  assert.equal((await put(env, blob(80), { 'If-Match': '"stale"' })).status, 412);
  const ok = await put(env, blob(80), { 'If-Match': first.headers.get('ETag') });
  assert.equal(ok.status, 200);
  assert.notEqual(ok.headers.get('ETag'), first.headers.get('ETag'));
  assert.equal((await put(env, blob(), { 'If-Match': '"x"' }, `glossa.${'cd'.repeat(16)}`)).status, 412);  // записи нет
});

test('валидация id, размера и формата', async () => {
  const env = { BLOBS: mockKV() };
  for (const bad of ['x', 'other.' + 'ab'.repeat(16), 'glossa.' + 'AB'.repeat(16), 'glossa.abc', 'srpski.' + 'ab'.repeat(17)]) {
    assert.equal((await handle(new Request(URL_(bad)), env)).status, 400, bad);
  }
  assert.equal((await handle(new Request(URL_(`srpski.${'0f'.repeat(16)}`)), env)).status, 404);   // srpski допустим
  assert.equal((await put(env, blob(MAX_BYTES + 1), { 'If-None-Match': '*' })).status, 413);
  assert.equal((await put(env, blob(MAX_BYTES), { 'If-None-Match': '*' })).status, 200);
  assert.equal((await put(env, blob(10), { 'If-None-Match': '*' }, `glossa.${'11'.repeat(16)}`)).status, 400);
  assert.equal((await put(env, blob(64, 9), { 'If-None-Match': '*' }, `glossa.${'22'.repeat(16)}`)).status, 400);
  assert.equal((await handle(new Request('https://w.example/other'), env)).status, 404);
});

test('DELETE идемпотентен; после него GET → 404', async () => {
  const env = { BLOBS: mockKV() };
  await put(env, blob(), { 'If-None-Match': '*' });
  assert.equal((await handle(new Request(URL_(), { method: 'DELETE' }), env)).status, 204);
  assert.equal((await handle(new Request(URL_(), { method: 'DELETE' }), env)).status, 204);
  assert.equal((await get(env)).status, 404);
  assert.equal((await handle(new Request(URL_(), { method: 'POST', body: 'x' }), env)).status, 405);
});

test('CORS, заголовки безопасности, лимит запросов', async () => {
  const env = { BLOBS: mockKV() };
  const pre = await handle(new Request(URL_(), { method: 'OPTIONS', headers: { Origin: 'https://a.example' } }), env);
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get('Access-Control-Allow-Origin'), '*');
  assert.match(pre.headers.get('Access-Control-Allow-Headers'), /If-Match/);
  const g = await get(env);
  assert.equal(g.headers.get('Cache-Control'), 'no-store');
  assert.equal(g.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(g.headers.get('Referrer-Policy'), 'no-referrer');
  assert.match(g.headers.get('Access-Control-Expose-Headers'), /ETag/);

  const limited = { BLOBS: mockKV(), ALLOWED_ORIGINS: 'https://ok.example', RL: { limit: async () => ({ success: false }) } };
  const r = await handle(new Request(URL_(), { headers: { Origin: 'https://evil.example' } }), limited);
  assert.equal(r.status, 429);
  assert.equal(r.headers.get('Access-Control-Allow-Origin'), null);
  const ok = await handle(new Request(URL_(), { headers: { Origin: 'https://ok.example' } }), { ...limited, RL: undefined });
  assert.equal(ok.headers.get('Access-Control-Allow-Origin'), 'https://ok.example');
});
