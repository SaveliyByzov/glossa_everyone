// Слияние двух состояний прогресса (glossa:v1) БЕЗ потери данных. Чистые функции, без DOM.
// Каждая операция — «join» (max / объединение множеств / максимум по полному порядку),
// поэтому merge коммутативна, идемпотентна и ассоциативна: порядок и число синхронизаций не важны.
//
//  настройки          — побеждает более поздний settingsAt (равенство — по каноническому JSON)
//  уроки              — max мастерства/пика/лучшей точности, done = ИЛИ, история — объединение
//  SRS-карточки       — побеждает карточка с более свежей отметкой last (затем reps, затем JSON)
//  ошибки (банк)      — по ключу побеждает более свежая запись; не более 300
//  счётчики/XP по дням— max; серия — лексикографический max (lastDay, count, freezes), best = max
//  достижения         — объединение, время получения — самое раннее
// Известное ограничение: удалённые (решённые) ошибки из банка без «надгробий» могут вернуться
// с другого устройства; суммарные счётчики (xpTotal, answers…) берутся по max, а не суммируются.

const HISTORY_CAP = 30;
const MISTAKES_CAP = 300;

/** Канонический JSON (ключи отсортированы) — для сравнения и тай-брейков. */
export function canon(v) {
  if (v === undefined) return 'null';
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
  return `{${Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`;
}

const num = (x, d = 0) => (Number.isFinite(x) ? x : d);
const maxNum = (a, b) => Math.max(num(a, -Infinity), num(b, -Infinity));
const maxOrNull = (a, b) => { const m = maxNum(a, b); return m === -Infinity ? (a ?? b ?? null) : m; };
const minOrNull = (a, b) => (Number.isFinite(a) ? (Number.isFinite(b) ? Math.min(a, b) : a) : (Number.isFinite(b) ? b : null));

/** Сравнение кортежей: числа/строки поэлементно, null меньше всего. */
function cmpTuple(a, b) {
  for (let i = 0; i < a.length; i++) {
    const x = a[i] ?? -Infinity, y = b[i] ?? -Infinity;
    if (typeof x === 'string' || typeof y === 'string') {
      const sx = String(a[i] ?? ''), sy = String(b[i] ?? '');
      if (sx !== sy) return sx < sy ? -1 : 1;
    } else if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

/** Из двух значений выбрать то, у которого больше кортеж score(v); при равенстве — по каноническому JSON. */
function pick(a, b, score) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  const c = cmpTuple(score(a), score(b));
  if (c) return c > 0 ? a : b;
  return canon(a) >= canon(b) ? a : b;
}

function mergeMap(a = {}, b = {}, fn) {
  const out = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out[k] = fn(a[k], b[k], k);
  return out;
}

const unionSorted = (a = [], b = []) => [...new Set([...a, ...b])].sort();

function mergeLesson(a, b) {
  if (!a || !b) { const x = a || b; return x && mergeLesson(x, structuredClone(x)); }   // одиночная запись тоже нормализуется (порядок истории)
  // история — мультимножество: у каждой записи берём большее из числа повторов (идемпотентно, дубликаты сессий не склеиваются)
  const count = (h) => { const m = new Map(); for (const e of h || []) { const k = `${e.day}|${e.acc}`; m.set(k, { e, n: (m.get(k)?.n || 0) + 1 }); } return m; };
  const ca = count(a.history), cb = count(b.history), all = [];
  for (const k of new Set([...ca.keys(), ...cb.keys()])) {
    const n = Math.max(ca.get(k)?.n || 0, cb.get(k)?.n || 0), e = (ca.get(k) || cb.get(k)).e;
    for (let i = 0; i < n; i++) all.push(e);
  }
  const history = all.sort((x, y) => cmpTuple([x.day, x.acc], [y.day, y.acc])).slice(-HISTORY_CAP);
  const fresh = pick({ lastAt: a.lastAt, freshAt: a.freshAt, decayMult: a.decayMult }, { lastAt: b.lastAt, freshAt: b.freshAt, decayMult: b.decayMult },
    (r) => [r.lastAt, r.freshAt, r.decayMult]);
  return {
    ...a, ...b,
    mastery: maxNum(a.mastery, b.mastery), peak: maxNum(a.peak, b.peak), best: maxNum(a.best, b.best),
    done: !!(a.done || b.done),
    history,
    freshAt: fresh.freshAt ?? null, decayMult: fresh.decayMult ?? 1, lastAt: fresh.lastAt ?? null,
  };
}

function mergeUnit(a, b) {
  if (!a) return b;
  if (!b) return a;
  const out = { ...a, ...b };
  const pl = pick(a.placement, b.placement, (p) => [p?.at, p?.acc]);
  if (pl !== undefined) out.placement = { ...pl, passed: !!(a.placement?.passed || b.placement?.passed) };
  if (a.boss || b.boss) {
    const ba = a.boss || {}, bb = b.boss || {};
    const w = pick(a.boss, b.boss, (p) => [p?.at, p?.acc]);
    out.boss = { ...w, passed: !!(ba.passed || bb.passed), perfect: !!(ba.perfect || bb.perfect) };
  }
  return out;
}

const mistakeScore = (m) => [m.at, m.count];

function mergeMistakes(a = [], b = []) {
  const by = new Map();
  for (const m of [...a, ...b]) by.set(m.key, pick(by.get(m.key), m, mistakeScore));
  return [...by.values()].sort((x, y) => cmpTuple([y.at, y.key], [x.at, x.key])).slice(0, MISTAKES_CAP);
}

const NO_COURSE = { lessons: {}, units: {}, srs: {}, mistakes: [], wordErrors: {}, seen: {}, skillLevels: {}, startedAt: null };

function mergeCourse(a = NO_COURSE, b = NO_COURSE) {
  return {
    ...a, ...b,
    lessons: mergeMap(a.lessons, b.lessons, mergeLesson),
    units: mergeMap(a.units, b.units, mergeUnit),
    srs: mergeMap(a.srs, b.srs, (x, y) => pick(x, y, (c) => [c.last, c.reps])),
    mistakes: mergeMistakes(a.mistakes, b.mistakes),
    wordErrors: mergeMap(a.wordErrors, b.wordErrors, (x, y) => pick(x, y, (w) => [w.n, w.streak])),
    seen: mergeMap(a.seen, b.seen, (x, y) => maxOrNull(x, y)),
    skillLevels: mergeMap(a.skillLevels, b.skillLevels, (x, y) => maxOrNull(x, y)),
    startedAt: minOrNull(a.startedAt, b.startedAt),
  };
}

function mergeStreak(a = {}, b = {}) {
  const w = pick(a, b, (s) => [s.lastDay, s.count, s.freezes]);
  const vac = new Map();
  for (const v of [...(a.vacations || []), ...(b.vacations || [])]) vac.set(`${v.from}|${v.to}`, v);
  return {
    ...w,
    best: maxNum(a.best, b.best) === -Infinity ? 0 : maxNum(a.best, b.best),
    vacations: [...vac.values()].sort((x, y) => cmpTuple([x.from, x.to], [y.from, y.to])),
  };
}

function mergeStats(a = {}, b = {}) {
  const out = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (k === 'streak') out.streak = mergeStreak(a.streak, b.streak);
    else if (k === 'xpByDay') out.xpByDay = mergeMap(a.xpByDay, b.xpByDay, (x, y) => maxOrNull(x, y));
    else if (k === 'coursesByDay') out.coursesByDay = mergeMap(a.coursesByDay, b.coursesByDay, (x, y) => unionSorted(x, y));
    else out[k] = maxOrNull(a[k], b[k]) ?? 0;
  }
  return out;
}

const activity = (course) => Math.max(0, ...Object.values(course?.lessons || {}).map((l) => num(l.lastAt, 0)));

/** Последний курс — тот, где недавнее всего занимались (по слитым урокам); если занятий нет — большее из двух значений. */
function lastCourseOf(a, b, courses) {
  const ranked = Object.entries(courses).map(([id, c]) => [activity(c), id]).filter(([act]) => act > 0).sort((x, y) => cmpTuple([y[0], y[1]], [x[0], x[1]]));
  if (ranked.length) return ranked[0][1];
  return [a.lastCourse, b.lastCourse].filter(Boolean).sort().pop() ?? null;
}

/** Слияние двух состояний. Результат не зависит от порядка аргументов. */
export function mergeStates(a, b) {
  if (!a) return b;
  if (!b) return a;
  const settingsSrc = pick({ at: a.settingsAt ?? 0, s: a.settings || {} }, { at: b.settingsAt ?? 0, s: b.settings || {} }, (x) => [x.at, canon(x.s)]);
  const courses = mergeMap(a.courses, b.courses, mergeCourse);
  const ach = mergeMap(a.achievements, b.achievements, (x, y) => minOrNull(x, y));
  return {
    app: a.app, version: a.version,
    createdAt: minOrNull(a.createdAt, b.createdAt),
    settings: settingsSrc.s,
    settingsAt: settingsSrc.at,
    stats: mergeStats(a.stats, b.stats),
    achievements: ach,
    lastCourse: lastCourseOf(a, b, courses),
    courses,
  };
}

/** Состояния равны по содержимому (без служебного exportedAt)? */
export function sameState(a, b) {
  const strip = (s) => { const { exportedAt, ...rest } = s || {}; return rest; };
  return canon(strip(a)) === canon(strip(b));
}
