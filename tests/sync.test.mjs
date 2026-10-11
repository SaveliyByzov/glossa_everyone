import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeStates, sameState, canon } from '../js/merge.js';
import { emptyState, courseState, createStore } from '../js/store.js';
import {
  generatePhrase, normalizePhrase, formatPhrase, deriveIdentity, seal, open, encodeTransfer, decodeTransfer,
  normalizeEndpoint, createSync, ALPHABET, PHRASE_LEN, forUpload,
} from '../js/sync.js';
import { handle } from '../sync-worker/worker.js';

// --- фраза и ключи -----------------------------------------------------------------------------
test('фраза: длина, алфавит, нормализация, уникальность', () => {
  const p = generatePhrase();
  assert.equal(p.length, PHRASE_LEN);
  assert.ok([...p].every((c) => ALPHABET.includes(c)));
  assert.ok(!/[IO01]/.test(ALPHABET));
  assert.equal(new Set(Array.from({ length: 200 }, () => generatePhrase())).size, 200);
  const shown = formatPhrase(p);
  assert.match(shown, /^([A-Z2-9]{5}-){4}[A-Z2-9]{5}$/);
  assert.equal(normalizePhrase(shown.toLowerCase().replace(/-/g, '  ')), p);
  assert.equal(normalizePhrase(p.slice(1)), null);
  assert.equal(normalizePhrase(`${p.slice(1)}0`), null);          // 0 и 1, I, O не входят в алфавит
});

test('вывод id/ключа: детерминирован, зависит от приложения, id не содержит фразы', async () => {
  const p = generatePhrase();
  const a = await deriveIdentity(p, 'glossa');
  const b = await deriveIdentity(formatPhrase(p), 'glossa');
  const c = await deriveIdentity(p, 'srpski');
  assert.match(a.id, /^glossa\.[0-9a-f]{32}$/);
  assert.equal(a.id, b.id);
  assert.notEqual(a.id.split('.')[1], c.id.split('.')[1]);
  assert.ok(!a.id.toUpperCase().includes(p.slice(0, 8)));
  await assert.rejects(() => deriveIdentity('short', 'glossa'));
});

test('шифрование: круг, случайный IV, подмена и чужой id отвергаются', async () => {
  const { id, key } = await deriveIdentity(generatePhrase(), 'glossa');
  const state = { app: 'glossa', stats: { xpTotal: 5 }, secret: 'Привет' };
  const s1 = await seal(state, key, id), s2 = await seal(state, key, id);
  assert.notDeepEqual(s1, s2);
  assert.equal(s1[0], 1);
  assert.ok(!new TextDecoder().decode(s1).includes('xpTotal'));
  assert.deepEqual(await open(s1, key, id), state);
  const tampered = s1.slice(); tampered[tampered.length - 1] ^= 1;
  await assert.rejects(() => open(tampered, key, id), { code: 'decrypt' });
  await assert.rejects(() => open(s1, key, 'glossa.' + '0'.repeat(32)), { code: 'decrypt' });
  const other = await deriveIdentity(generatePhrase(), 'glossa');
  await assert.rejects(() => open(s1, other.key, id), { code: 'decrypt' });
  await assert.rejects(() => open(new Uint8Array(40), key, id), { code: 'format' });
});

test('код переноса: круг, мусор отвергается', async () => {
  const s = emptyState();
  s.stats.xpTotal = 321; s.settings.haptics = false;
  const code = await encodeTransfer(s);
  assert.match(code, /^GT1\.[A-Za-z0-9_-]+$/);
  const back = await decodeTransfer(`  ${code}\n`);
  assert.equal(back.stats.xpTotal, 321);
  await assert.rejects(() => decodeTransfer('hello'));
  await assert.rejects(() => decodeTransfer('GT1.@@@'));
});

test('адрес сервера: только https (или localhost)', () => {
  assert.equal(normalizeEndpoint(''), '');
  assert.equal(normalizeEndpoint('http://example.com'), '');
  assert.equal(normalizeEndpoint('https://x.workers.dev/'), 'https://x.workers.dev');
  assert.equal(normalizeEndpoint('http://localhost:8787'), 'http://localhost:8787');
  assert.equal(normalizeEndpoint('javascript:alert(1)'), '');
});

// --- слияние ------------------------------------------------------------------------------------
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

function randomState(r, i) {
  const pick = (a) => a[Math.floor(r() * a.length)];
  const s = emptyState();
  s.createdAt = 1000 + Math.floor(r() * 100);
  s.settings.theme = pick(['auto', 'dark', 'light']);
  s.settings.dailyGoal = pick([null, 20, 50]);
  s.settingsAt = pick([0, 5, 10, 10, 20]);
  s.stats.xpTotal = Math.floor(r() * 500);
  s.stats.lessonsCompleted = Math.floor(r() * 9);
  for (const d of ['2026-01-01', '2026-01-02', '2026-01-03']) if (r() < 0.6) s.stats.xpByDay[d] = Math.floor(r() * 100);
  if (r() < 0.5) s.stats.coursesByDay['2026-01-01'] = [pick(['nb', 'la']), pick(['it', 'sr'])];
  s.stats.streak = { count: Math.floor(r() * 5), best: Math.floor(r() * 9), lastDay: pick([null, '2026-01-02', '2026-01-03']), freezes: pick([null, 1, 2]), vacations: r() < 0.4 ? [{ from: '2026-01-01', to: pick(['2026-01-02', '2026-01-04']) }] : [] };
  for (const a of ['first', 'streak-3', 'perfect']) if (r() < 0.5) s.achievements[a] = 100 + Math.floor(r() * 50);
  s.lastCourse = pick([null, 'nb', 'la']);
  for (const cid of ['nb', 'la']) {
    if (r() < 0.3) continue;
    const c = (s.courses[cid] = courseState());
    c.startedAt = 50 + Math.floor(r() * 10);
    for (const l of ['l1', 'l2', 'l3']) if (r() < 0.6) {
      const hist = Array.from({ length: Math.floor(r() * 4) }, () => ({ acc: pick([0.5, 0.8, 0.95, 1]), day: pick(['2026-01-01', '2026-01-02', '2026-01-03']) }));
      c.lessons[l] = { mastery: Math.floor(r() * 6), peak: Math.floor(r() * 6), done: r() < 0.5, best: pick([0.5, 0.9, 1]), history: hist, freshAt: pick([null, 10, 20]), decayMult: pick([1, 2]), lastAt: pick([null, 100, 200, 300]) };
    }
    for (const k of ['v:a', 'v:b', 's:x']) if (r() < 0.6) c.srs[k] = { ease: pick([2.3, 2.5]), interval: pick([0, 3, 6]), step: pick([-1, 0]), due: 1000 + Math.floor(r() * 5), reps: Math.floor(r() * 5), lapses: 0, last: pick([null, 100, 200]) };
    for (const k of ['m1', 'm2']) if (r() < 0.5) c.mistakes.push({ key: k, lessonId: 'l1', index: 1, at: pick([10, 20, 30]), due: 99, count: Math.floor(r() * 4), correctDays: [] });
    if (r() < 0.5) c.wordErrors.w1 = { n: Math.floor(r() * 5), streak: Math.floor(r() * 3) };
    if (r() < 0.5) c.seen.ex1 = Math.floor(r() * 300);
    if (r() < 0.5) c.skillLevels.sk = Math.floor(r() * 6);
    if (r() < 0.4) c.units.u1 = { boss: { passed: r() < 0.5, perfect: r() < 0.3, at: pick([1, 2]), acc: pick([0.8, 0.9]) } };
  }
  return s;
}

function same(x, y, msg) {
  if (sameState(x, y)) return;
  const dx = JSON.parse(canon(x)), dy = JSON.parse(canon(y));
  const diff = (a, b, path = '') => (canon(a) === canon(b) ? [] : a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a)
    ? [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => diff(a[k], b[k], `${path}/${k}`)) : [`${path}: ${canon(a)} != ${canon(b)}`]);
  assert.fail(`${msg} ${diff(dx, dy).join(' | ')}`);
}

test('merge: коммутативность, идемпотентность, ассоциативность (фаззинг)', () => {
  const r = rng(12345);
  for (let i = 0; i < 300; i++) {
    const a = randomState(r), b = randomState(r), c = randomState(r);
    const ab = mergeStates(a, b);
    same(ab, mergeStates(b, a), `commutative #${i}`);
    same(mergeStates(ab, ab), ab, `idempotent #${i}`);
    same(mergeStates(ab, b), ab, `absorbs b #${i}`); same(mergeStates(ab, a), ab, `absorbs a #${i}`);
    same(mergeStates(mergeStates(a, b), c), mergeStates(a, mergeStates(b, c)), `associative #${i}`);
  }
});

test('merge: ничего не теряется, конфликты решаются как описано', () => {
  const a = emptyState(), b = emptyState();
  a.courses.nb = courseState(); b.courses.nb = courseState();
  a.courses.nb.lessons.l1 = { mastery: 3, peak: 3, done: true, best: 0.9, history: [{ acc: 0.9, day: '2026-01-01' }], freshAt: 5, decayMult: 1, lastAt: 100 };
  b.courses.nb.lessons.l1 = { mastery: 2, peak: 4, done: false, best: 0.95, history: [{ acc: 0.7, day: '2026-01-02' }], freshAt: 9, decayMult: 2, lastAt: 200 };
  b.courses.la = courseState();
  a.courses.nb.srs['v:x'] = { ease: 2.5, interval: 3, step: -1, due: 9, reps: 3, lapses: 0, last: 100 };
  b.courses.nb.srs['v:x'] = { ease: 2.3, interval: 1, step: 0, due: 5, reps: 4, lapses: 1, last: 300 };
  a.stats.xpTotal = 100; b.stats.xpTotal = 80; a.stats.xpByDay['d1'] = 10; b.stats.xpByDay['d1'] = 30; b.stats.xpByDay['d2'] = 5;
  a.achievements.x = 50; b.achievements.x = 40; b.achievements.y = 70;
  a.settings.theme = 'dark'; a.settingsAt = 10; b.settings.theme = 'light'; b.settingsAt = 20;
  const m = mergeStates(a, b);
  const l = m.courses.nb.lessons.l1;
  assert.equal(l.mastery, 3); assert.equal(l.peak, 4); assert.equal(l.done, true); assert.equal(l.best, 0.95);
  assert.equal(l.history.length, 2); assert.equal(l.lastAt, 200); assert.equal(l.decayMult, 2);
  assert.equal(m.courses.nb.srs['v:x'].last, 300);                 // более свежая отметка карточки
  assert.ok(m.courses.la);
  assert.equal(m.stats.xpTotal, 100); assert.deepEqual(m.stats.xpByDay, { d1: 30, d2: 5 });
  assert.deepEqual(m.achievements, { x: 40, y: 70 });
  assert.equal(m.settings.theme, 'light');                         // позже менялось на устройстве b
});

test('merge: пустое состояние нейтрально; серия и каникулы объединяются', () => {
  const a = emptyState();
  a.stats.streak = { count: 4, best: 6, lastDay: '2026-02-02', freezes: 1, vacations: [{ from: '2026-01-01', to: '2026-01-05' }] };
  const m = mergeStates(a, emptyState());
  assert.equal(m.stats.streak.count, 4); assert.equal(m.stats.streak.best, 6); assert.equal(m.stats.streak.vacations.length, 1);
  assert.equal(mergeStates(a, null), a);
});

test('merge: банк ошибок ограничен 300', () => {
  const a = emptyState(), b = emptyState();
  a.courses.c = courseState(); b.courses.c = courseState();
  for (let i = 0; i < 250; i++) { a.courses.c.mistakes.push({ key: `a${i}`, at: i, count: 1 }); b.courses.c.mistakes.push({ key: `b${i}`, at: i, count: 1 }); }
  assert.equal(mergeStates(a, b).courses.c.mistakes.length, 300);
});

// --- клиент синхронизации: два устройства через логику Worker -----------------------------------
function memoryStorage() { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; }
function fakeServer() {
  const kv = new Map();
  const env = { BLOBS: {
    async getWithMetadata(k) { const e = kv.get(k); return e ? { value: e.v.slice().buffer, metadata: e.md } : { value: null, metadata: null }; },
    async put(k, v, o) { kv.set(k, { v: new Uint8Array(v), md: o.metadata }); },
    async delete(k) { kv.delete(k); },
  } };
  const calls = [];
  const fetchFn = (url, init = {}) => {
    calls.push({ url, method: init.method, headers: init.headers });
    const body = init.body;
    const headers = { ...(init.headers || {}), ...(body ? { 'Content-Length': String(body.length) } : {}) };
    return handle(new Request(url, { method: init.method, headers, body }), env);
  };
  return { kv, fetchFn, calls };
}
function device(server, { online = true } = {}) {
  const store = createStore(memoryStorage());
  const storage = memoryStorage();
  const s = createSync({ store, endpoint: 'https://sync.example', app: 'glossa', storage, fetchFn: server.fetchFn, online: () => online, timers: { set: () => 0, clear: () => {} } });
  return { store, s, storage };
}

test('два устройства: создать профиль, войти по фразе, прогресс сливается без потерь', async () => {
  const server = fakeServer();
  const A = device(server), B = device(server);
  A.store.update((s) => { s.stats.xpTotal = 100; s.achievements.first = 1; s.courses.nb = courseState(); s.courses.nb.lessons.l1 = { mastery: 2, peak: 2, done: true, best: 0.8, history: [], freshAt: null, decayMult: 1, lastAt: 10 }; });
  const phrase = await A.s.createProfile();
  assert.equal(normalizePhrase(phrase), phrase);
  assert.equal(A.s.status.state, 'synced');
  assert.equal(server.kv.size, 1);
  const stored = [...server.kv.values()][0].v;
  assert.ok(!new TextDecoder('latin1').decode(stored).includes('xpTotal'));      // на сервере нет читаемого содержимого
  assert.ok(![...server.kv.keys()][0].includes(phrase));

  B.store.update((s) => { s.stats.xpTotal = 40; s.courses.nb = courseState(); s.courses.nb.lessons.l2 = { mastery: 1, peak: 1, done: true, best: 0.7, history: [], freshAt: null, decayMult: 1, lastAt: 20 }; });
  await B.s.joinProfile(formatPhrase(phrase).toLowerCase());
  assert.equal(B.store.state.stats.xpTotal, 100);
  assert.ok(B.store.state.courses.nb.lessons.l1 && B.store.state.courses.nb.lessons.l2);
  await A.s.sync();
  assert.ok(A.store.state.courses.nb.lessons.l2, 'A получил урок с B');
  assert.ok(sameState(forUpload(A.store.state), forUpload(B.store.state)));
});

test('конфликт 412: параллельные записи сливаются', async () => {
  const server = fakeServer();
  const A = device(server), B = device(server);
  const phrase = await A.s.createProfile();
  await B.s.joinProfile(phrase);
  A.store.update((s) => { s.achievements.fromA = 1; });
  B.store.update((s) => { s.achievements.fromB = 2; });
  await Promise.all([A.s.sync(), B.s.sync()]);
  await A.s.sync(); await B.s.sync();
  assert.deepEqual(Object.keys(A.store.state.achievements).sort(), ['fromA', 'fromB']);
  assert.ok(sameState(forUpload(A.store.state), forUpload(B.store.state)));
});

test('вход по неверной фразе не создаёт профиль и откатывается', async () => {
  const server = fakeServer();
  const B = device(server);
  await assert.rejects(() => B.s.joinProfile(generatePhrase()), { code: 'notfound' });
  assert.equal(B.s.hasProfile, false);
  assert.equal(server.kv.size, 0);
  await assert.rejects(() => B.s.joinProfile('abc'), { code: 'phrase' });
});

test('настройки конкретного устройства не синхронизируются; выход и удаление на сервере', async () => {
  const server = fakeServer();
  const A = device(server), B = device(server);
  A.store.update((s) => { s.settings.haptics = false; s.settings.theme = 'dark'; });
  const phrase = await A.s.createProfile();
  await B.s.joinProfile(phrase);
  assert.equal(B.store.state.settings.theme, 'dark');
  assert.equal(B.store.state.settings.haptics, true);
  A.s.setNickname('  Мой телефон ');
  assert.equal(A.s.nickname, 'Мой телефон');
  await A.s.deleteRemote();
  assert.equal(server.kv.size, 0);
  assert.equal(A.s.hasProfile, false);
  B.s.signOut();
  assert.equal(B.s.phrase, null);
});

test('без сети — тихо откладывается; пустой endpoint — синхронизация выключена', async () => {
  const server = fakeServer();
  const A = device(server, { online: false });
  A.storage.setItem('glossa:sync:v1', JSON.stringify({ phrase: generatePhrase() }));
  assert.equal(await A.s.sync(), false);
  assert.equal(A.s.status.state, 'waiting');
  assert.equal(server.calls.length, 0);
  const off = createSync({ store: createStore(memoryStorage()), endpoint: '', storage: memoryStorage() });
  assert.equal(off.enabled, false);
  assert.equal(off.status.state, 'disabled');
  await assert.rejects(() => off.createProfile(), { code: 'disabled' });
  const failing = createSync({ store: createStore(memoryStorage()), endpoint: 'https://s.example', storage: memoryStorage(), fetchFn: async () => { throw new TypeError('x'); }, timers: { set: () => 0, clear: () => {} } });
  await assert.rejects(() => failing.createProfile());
  assert.equal(failing.hasProfile, false);
});
