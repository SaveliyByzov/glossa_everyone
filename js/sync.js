// Анонимный профиль и E2E-синхронизация между устройствами. Без регистрации, e-mail и паролей.
//
//  Профиль = случайная фраза-ключ (25 символов base32 без похожих, ~125 бит), создаётся на устройстве.
//  Из фразы через HKDF-SHA256 выводятся две независимые ветви: идентификатор записи (128 бит, необратимо)
//  и ключ AES-256-GCM. На сервер уходит только id и непрозрачный шифртекст. Фраза и никнейм лежат
//  ТОЛЬКО в localStorage этого устройства (ключ 'glossa:sync:v1') и в экспорт прогресса не попадают.
//  Конфликты: ETag + If-Match; при 412 — скачать, слить (js/merge.js, без потерь), повторить.

import { mergeStates, sameState } from './merge.js';
import { migrate, store } from './store.js';
import config from '../data/sync.js';

export const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // 32 символа: нет I, O, 0, 1
export const PHRASE_LEN = 25;                                  // 25 × 5 бит = 125 бит
export const FORMAT_VERSION = 1;
export const IDENT_KEY = 'glossa:sync:v1';
export const STALE_MS = 30 * 86_400_000;                       // «подновить» запись, чтобы TTL на сервере продлился
export const LOCAL_ONLY = ['haptics', 'tts'];                  // настройки конкретного устройства — не синхронизируются

const enc = new TextEncoder();
const dec = new TextDecoder();

// --- фраза ----------------------------------------------------------------------------------
export function generatePhrase(rng = globalThis.crypto) {
  const bytes = rng.getRandomValues(new Uint8Array(PHRASE_LEN));
  return Array.from(bytes, (b) => ALPHABET[b & 31]).join('');       // 256 кратно 32 → без смещения
}

/** 'abcde fghjk…' / с тире / строчные → 25 символов канонического вида, иначе null. */
export function normalizePhrase(text) {
  const s = String(text ?? '').toUpperCase().replace(/[\s\-–—_.]/g, '');
  if (s.length !== PHRASE_LEN) return null;
  for (const ch of s) if (!ALPHABET.includes(ch)) return null;
  return s;
}

export const formatPhrase = (p) => p.match(/.{1,5}/g).join('-');

// --- вывод ключей ---------------------------------------------------------------------------
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

/** → { id: 'glossa.<32 hex>', key: CryptoKey(AES-GCM) }. Разные приложения → разные id и ключи. */
export async function deriveIdentity(phrase, app, subtle = globalThis.crypto.subtle) {
  const canonical = normalizePhrase(phrase);
  if (!canonical) throw new Error('Неверная фраза');
  const base = await subtle.importKey('raw', enc.encode(canonical), 'HKDF', false, ['deriveBits', 'deriveKey']);
  const salt = enc.encode('glossa-sync/v1');
  const idBits = await subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: enc.encode(`id|${app}`) }, base, 128);
  const key = await subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt, info: enc.encode(`key|${app}`) }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return { id: `${app}.${hex(idBits)}`, key };
}

// --- сжатие и кодирование -------------------------------------------------------------------
const hasCompression = () => typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';

async function pipe(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}
export const gzip = (bytes) => pipe(bytes, new CompressionStream('gzip'));
export const gunzip = (bytes) => pipe(bytes, new DecompressionStream('gzip'));

export function toB64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function fromB64url(text) {
  const s = atob(String(text).replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

/** Состояние без настроек конкретного устройства — то, что уходит на сервер. */
export function forUpload(state) {
  const s = structuredClone(state);
  delete s.exportedAt;
  for (const k of LOCAL_ONLY) delete s.settings?.[k];
  return s;
}

/** Слияние с чужим состоянием; настройки конкретного устройства остаются локальными. */
export function mergeKeepLocal(local, remote) {
  const merged = structuredClone(mergeStates(local, remote));
  for (const k of LOCAL_ONLY) if (k in (local.settings || {})) merged.settings[k] = local.settings[k];
  return merged;
}

/** [версия формата][флаги: 1 = gzip][iv 12][AES-GCM(данные + тег)]. AAD = id, чтобы блоб нельзя было подменить другим id. */
export async function seal(obj, key, id, rng = globalThis.crypto) {
  let data = enc.encode(JSON.stringify(obj));
  let flags = 0;
  if (hasCompression()) { data = await gzip(data); flags = 1; }
  const iv = rng.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await rng.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(id) }, key, data));
  const out = new Uint8Array(2 + 12 + ct.length);
  out[0] = FORMAT_VERSION; out[1] = flags; out.set(iv, 2); out.set(ct, 14);
  return out;
}

export async function open(bytes, key, id, subtle = globalThis.crypto.subtle) {
  if (bytes.length < 14 + 16 || bytes[0] !== FORMAT_VERSION) throw new SyncError('format', 'Неизвестный формат данных профиля');
  let data;
  try {
    data = new Uint8Array(await subtle.decrypt({ name: 'AES-GCM', iv: bytes.subarray(2, 14), additionalData: enc.encode(id) }, key, bytes.subarray(14)));
  } catch { throw new SyncError('decrypt', 'Не удалось расшифровать данные профиля'); }
  if (bytes[1] & 1) data = await gunzip(data);
  return JSON.parse(dec.decode(data));
}

// --- код переноса (без сервера) -------------------------------------------------------------
/** Текст «GT1.…» (gzip) или «GT0.…»: прогресс одной строкой для копирования/вставки. */
export async function encodeTransfer(state) {
  const raw = enc.encode(JSON.stringify(forUpload(state)));
  return hasCompression() ? `GT1.${toB64url(await gzip(raw))}` : `GT0.${toB64url(raw)}`;
}

export async function decodeTransfer(text) {
  const m = /^\s*GT([01])\.([A-Za-z0-9_\-\s]+)\s*$/.exec(String(text));
  if (!m) throw new Error('Это не код переноса Glossa');
  let bytes = fromB64url(m[2]);
  if (m[1] === '1') {
    if (!hasCompression()) throw new Error('Браузер не умеет распаковывать код — используйте файл');
    bytes = await gunzip(bytes);
  }
  return migrate(JSON.parse(dec.decode(bytes)));
}

// --- клиент -------------------------------------------------------------------------------
export class SyncError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

/** Допустимый адрес: https://… или http://localhost для отладки. Иначе '' (синхронизация выключена). */
export function normalizeEndpoint(s) {
  const v = String(s ?? '').trim().replace(/\/+$/, '');
  return /^https:\/\/[^\s/]+(\/\S*)?$/.test(v) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/\S*)?$/.test(v) ? v : '';
}

export function createSync({
  store: st, endpoint = '', app = 'glossa', storage = globalThis.localStorage, fetchFn = (...a) => globalThis.fetch(...a),
  rng = globalThis.crypto, now = () => Date.now(), busy = () => false, onApplied = () => {},
  timers = { set: (f, ms) => setTimeout(f, ms), clear: (t) => clearTimeout(t) }, online = () => globalThis.navigator?.onLine !== false,
} = {}) {
  const base = normalizeEndpoint(endpoint);
  let status = { state: base ? 'off' : 'disabled', at: 0, message: '' };
  const listeners = new Set();
  const hooks = { busy, onApplied };
  let running = null, timer = null, applying = false, cached = null;

  const setStatus = (state, message = '') => { status = { state, at: now(), message }; for (const f of listeners) f(status); };
  const readIdent = () => { try { return JSON.parse(storage?.getItem(IDENT_KEY)) || null; } catch { return null; } };
  const writeIdent = (v) => { try { v ? storage?.setItem(IDENT_KEY, JSON.stringify(v)) : storage?.removeItem(IDENT_KEY); } catch {} cached = null; };

  async function identity() {
    const i = readIdent();
    if (!i?.phrase) return null;
    if (!cached || cached.phrase !== i.phrase) cached = { phrase: i.phrase, ...(await deriveIdentity(i.phrase, app, rng.subtle)) };
    return cached;
  }

  async function request(method, id, { body, headers } = {}) {
    const ctl = new AbortController();
    const t = timers.set(() => ctl.abort(), 20_000);
    try {
      return await fetchFn(`${base}/v1/blob/${id}`, { method, body, headers, signal: ctl.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', mode: 'cors' });
    } catch (err) {
      throw new SyncError('offline', 'Нет связи с сервером');
    } finally { timers.clear(t); }
  }

  async function runOnce({ mustExist }) {
    const idn = await identity();
    if (!idn) return;
    for (let attempt = 0; attempt < 4; attempt++) {
      const res = await request('GET', idn.id);
      let remote = null, etag = null, updated = 0;
      if (res.status === 404) {
        if (mustExist) throw new SyncError('notfound', 'Профиль с такой фразой не найден — проверьте ввод');
      } else if (res.ok) {
        remote = migrate(await open(new Uint8Array(await res.arrayBuffer()), idn.key, idn.id, rng.subtle));
        etag = res.headers.get('ETag');
        updated = Number(res.headers.get('X-Updated')) || 0;
      } else throw httpError(res.status);

      if (hooks.busy()) { setStatus('waiting', 'Синхронизация начнётся после упражнения'); schedule(5000); return; }

      const local = st.state;
      if (remote) {
        const merged = mergeKeepLocal(local, remote);
        if (!sameState(merged, local)) {
          applying = true;
          try { st.replaceState(merged); } finally { applying = false; }
          hooks.onApplied();
        }
      }
      const upload = forUpload(st.state);
      const fresh = remote && sameState(forUpload(remote), upload) && updated && now() - updated < STALE_MS;
      if (fresh) { done(etag, false); return; }

      const put = await request('PUT', idn.id, {
        body: await seal(upload, idn.key, idn.id, rng),
        headers: { 'Content-Type': 'application/octet-stream', ...(etag ? { 'If-Match': etag } : { 'If-None-Match': '*' }) },
      });
      if (put.status === 412) continue;                 // кто-то записал раньше — скачать, слить, повторить
      if (!put.ok) throw httpError(put.status);
      done(put.headers.get('ETag'), true);
      return;
    }
    throw new SyncError('conflict', 'Не удалось согласовать изменения, попробуйте ещё раз');
  }

  function done(etag, wrote) {
    const i = readIdent();
    if (i) writeIdent({ ...i, etag, lastSyncAt: now(), lastPutAt: wrote ? now() : i.lastPutAt || 0 });
    setStatus('synced');
  }

  function httpError(code) {
    if (code === 413) return new SyncError('toolarge', 'Прогресс слишком большой для сервера');
    if (code === 429) return new SyncError('ratelimit', 'Слишком часто — попробуйте через минуту');
    return new SyncError('http', `Сервер ответил ${code}`);
  }

  /** Полная синхронизация. Параллельные вызовы объединяются. */
  function sync({ mustExist = false } = {}) {
    if (!base || !readIdent()) return Promise.resolve(false);
    if (running) return running;
    if (!online()) { setStatus('waiting', 'Ждёт сети'); return Promise.resolve(false); }
    setStatus('syncing');
    running = runOnce({ mustExist })
      .then(() => true)
      .catch((err) => {
        if (err.code === 'notfound') { setStatus('error', err.message); throw err; }
        if (err.code === 'offline') setStatus('waiting', 'Ждёт сети');
        else setStatus('error', err instanceof SyncError ? err.message : 'Ошибка синхронизации');
        return false;
      })
      .finally(() => { running = null; });
    return running;
  }

  function schedule(ms = 15_000) {
    if (!base || !readIdent()) return;
    timers.clear(timer);
    timer = timers.set(() => { timer = null; sync(); }, ms);
  }

  return {
    hooks,
    get enabled() { return !!base; },
    get status() { return status; },
    get hasProfile() { return !!readIdent()?.phrase; },
    get phrase() { return readIdent()?.phrase ?? null; },
    get nickname() { return readIdent()?.nickname ?? ''; },
    get lastSyncAt() { return readIdent()?.lastSyncAt ?? 0; },
    onStatus(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    setNickname(name) { const i = readIdent(); if (i) writeIdent({ ...i, nickname: String(name).trim().slice(0, 40) }); },
    sync, schedule,

    /** Создать новый профиль: фраза рождается здесь, текущий прогресс уходит (зашифрованным) на сервер. */
    async createProfile() {
      if (!base) throw new SyncError('disabled', 'Облачная синхронизация не подключена');
      writeIdent({ phrase: generatePhrase(rng), nickname: '', createdAt: now() });
      setStatus('syncing');
      await sync();
      if (status.state !== 'synced') {                  // профиль без записи на сервере бесполезен — откатываем
        const msg = status.state === 'waiting' ? 'Нет связи с сервером — профиль не создан' : status.message;
        writeIdent(null); setStatus('off');
        throw new SyncError('http', msg);
      }
      return this.phrase;
    },

    /** Войти по фразе на этом устройстве; прогресс сольётся с облачным, ничего не теряется. */
    async joinProfile(text) {
      if (!base) throw new SyncError('disabled', 'Облачная синхронизация не подключена');
      const phrase = normalizePhrase(text);
      if (!phrase) throw new SyncError('phrase', 'Фраза должна состоять из 25 символов: латинские буквы и цифры 2–9');
      const prev = readIdent();
      writeIdent({ phrase, nickname: prev?.nickname || '', createdAt: now() });
      try {
        const ok = await sync({ mustExist: true });
        if (!ok) throw new SyncError(status.state === 'waiting' ? 'offline' : 'http', status.message || 'Не удалось войти');
      } catch (err) { writeIdent(prev); setStatus(prev ? 'idle' : 'off'); throw err; }
    },

    /** Выйти: стереть ключ с устройства. Данные на сервере и прогресс на устройстве остаются. */
    signOut() { timers.clear(timer); writeIdent(null); setStatus('off'); },

    /** Удалить зашифрованную копию на сервере и выйти. */
    async deleteRemote() {
      const idn = await identity();
      if (!idn) return;
      const res = await request('DELETE', idn.id);
      if (!res.ok && res.status !== 404) throw httpError(res.status);
      this.signOut();
    },

    /** Подписки: автосинхронизация при запуске, после изменений (debounce), при возврате сети и уходе со вкладки. */
    start() {
      if (!base) return;
      st.subscribe(() => { if (!applying) schedule(15_000); });
      globalThis.addEventListener?.('online', () => sync());
      globalThis.document?.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && timer) { timers.clear(timer); timer = null; sync(); } });
      if (readIdent()) setStatus('idle');
      schedule(1500);
    },
  };
}

export const sync = createSync({ store, endpoint: config.endpoint, app: config.app });
