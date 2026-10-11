// Glossa / Srpski — хранилище зашифрованных профилей. Cloudflare Worker + KV.
// Сервер не знает ни ключей, ни содержимого: хранит непрозрачный шифртекст по id = '<app>.<32 hex>'.
// Ничего не логирует (нет console.*, observability выключена в wrangler.toml).
//
//   GET    /v1/blob/:id   200 + ETag + X-Updated | 404 | 304 (If-None-Match)
//   PUT    /v1/blob/:id   требует If-Match: "<etag>" (обновление) или If-None-Match: * (создание)
//   DELETE /v1/blob/:id   204 (идемпотентно)
//   GET    /v1/health     200

export const APP_IDS = ['glossa', 'srpski'];
export const ID_RE = /^(glossa|srpski)\.[0-9a-f]{32}$/;
export const MAX_BYTES = 512 * 1024;
export const MIN_BYTES = 30;                 // 2 байта заголовка + iv 12 + тег 16
export const TTL_SECONDS = 400 * 24 * 3600;  // 400 дней без записи → запись исчезает; каждая запись продлевает срок
export const FORMAT_VERSION = 1;

const SECURITY = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Frame-Options': 'DENY',
};

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const list = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const h = { 'Access-Control-Expose-Headers': 'ETag, X-Updated', Vary: 'Origin' };
  if (!list.length) h['Access-Control-Allow-Origin'] = '*';      // данные зашифрованы, доступ — по секретному id, куки не используются
  else if (origin && list.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

function reply(request, env, status, body = null, extra = {}) {
  return new Response(body, { status, headers: { ...SECURITY, ...corsHeaders(request, env), ...extra } });
}
const json = (request, env, status, obj, extra = {}) => reply(request, env, status, JSON.stringify(obj), { 'Content-Type': 'application/json', ...extra });

async function etagOf(bytes) {
  const d = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return `"${Array.from(d.subarray(0, 16), (b) => b.toString(16).padStart(2, '0')).join('')}"`;
}

const stripWeak = (v) => String(v || '').replace(/^W\//, '').trim();

export async function handle(request, env) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'OPTIONS') {
    return reply(request, env, 204, null, {
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, If-Match, If-None-Match',
      'Access-Control-Max-Age': '86400',
    });
  }
  if (url.pathname === '/v1/health' && method === 'GET') return json(request, env, 200, { ok: true });

  const m = /^\/v1\/blob\/([^/]+)$/.exec(url.pathname);
  if (!m) return json(request, env, 404, { error: 'not_found' });
  const id = m[1];
  if (!ID_RE.test(id)) return json(request, env, 400, { error: 'bad_id' });
  if (!['GET', 'PUT', 'DELETE'].includes(method)) return json(request, env, 405, { error: 'method' }, { Allow: 'GET, PUT, DELETE, OPTIONS' });

  if (env.RL?.limit) {                                            // необязательный лимит запросов (привязка ratelimit)
    const { success } = await env.RL.limit({ key: request.headers.get('CF-Connecting-IP') || 'anon' });
    if (!success) return json(request, env, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
  }

  if (method === 'GET') {
    const { value, metadata } = await env.BLOBS.getWithMetadata(id, 'arrayBuffer');
    if (value === null) return json(request, env, 404, { error: 'not_found' });
    const etag = metadata?.etag || await etagOf(value);
    const extra = { ETag: etag, 'X-Updated': String(metadata?.updated || 0) };
    if (stripWeak(request.headers.get('If-None-Match')) === etag) return reply(request, env, 304, null, extra);
    return reply(request, env, 200, value, { ...extra, 'Content-Type': 'application/octet-stream' });
  }

  if (method === 'DELETE') {
    await env.BLOBS.delete(id);
    return reply(request, env, 204);
  }

  // --- PUT ---
  const ifMatch = request.headers.get('If-Match');
  const ifNone = request.headers.get('If-None-Match');
  if (!ifMatch && ifNone !== '*') return json(request, env, 428, { error: 'precondition_required' });
  if (!request.headers.has('Content-Length')) return json(request, env, 411, { error: 'length_required' });
  const declared = Number(request.headers.get('Content-Length'));
  if (!Number.isFinite(declared)) return json(request, env, 411, { error: 'length_required' });
  if (declared > MAX_BYTES) return json(request, env, 413, { error: 'too_large', max: MAX_BYTES });
  const body = new Uint8Array(await request.arrayBuffer());
  if (body.length > MAX_BYTES) return json(request, env, 413, { error: 'too_large', max: MAX_BYTES });
  if (body.length < MIN_BYTES || body[0] !== FORMAT_VERSION) return json(request, env, 400, { error: 'bad_blob' });

  const { value, metadata } = await env.BLOBS.getWithMetadata(id, 'arrayBuffer');
  const exists = value !== null;
  const current = exists ? (metadata?.etag || await etagOf(value)) : null;
  if (ifMatch ? !exists || stripWeak(ifMatch) !== current : exists) {
    return json(request, env, 412, { error: 'precondition_failed' }, current ? { ETag: current } : {});
  }
  const etag = await etagOf(body);
  const updated = Date.now();
  await env.BLOBS.put(id, body, { expirationTtl: TTL_SECONDS, metadata: { etag, updated } });
  return reply(request, env, 200, null, { ETag: etag, 'X-Updated': String(updated) });
}

export default {
  fetch(request, env) { return handle(request, env); },
};
