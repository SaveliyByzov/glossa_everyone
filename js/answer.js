// Нормализация и проверка ответов. Чистые функции — без DOM, тестируются в node.
//
// Политика курса (course.answer):
//   ignoreCase     — сравнивать без учёта регистра (по умолчанию true)
//   optionalMarks  — символы, которые можно вводить без диакритики (ā → a)
//   equivalents    — пары взаимозаменяемых символов ([['ð','þ'], ['ƿ','w']])
//   script: 'sr'   — сербская кириллица и латиница эквивалентны

import { stripMarkup } from './markup.js';

const DEFAULT_POLICY = { ignoreCase: true, optionalMarks: [], equivalents: [], script: null, apostropheAccent: false };
const GRAVE = { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù' };

// --- сербская транслитерация -------------------------------------------------

const SR_CYR2LAT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j', к: 'k',
  л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u',
  ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š',
};
const SR_LAT2CYR_DIGRAPHS = { lj: 'љ', nj: 'њ', dž: 'џ' };
const SR_LAT2CYR = Object.fromEntries(
  Object.entries(SR_CYR2LAT).filter(([, l]) => l.length === 1).map(([c, l]) => [l, c]),
);

function matchCase(src, out) {
  if (src === src.toLowerCase()) return out;
  // Љ → Lj (в начале слова), ЉУБАВ → LJUBAV: если следующий символ тоже прописной — всё в верхний
  return out.length > 1 ? out[0].toUpperCase() + out.slice(1) : out.toUpperCase();
}

/** Кириллица → латиница (Љ→Lj, Њ→Nj, Џ→Dž). */
export function srCyrToLat(text) {
  let out = '';
  const chars = [...String(text)];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const low = ch.toLowerCase();
    const lat = SR_CYR2LAT[low];
    if (!lat) { out += ch; continue; }
    if (ch !== low) {
      const next = chars[i + 1];
      const nextUpper = next && next !== next.toLowerCase();
      out += nextUpper ? lat.toUpperCase() : matchCase(ch, lat);
    } else out += lat;
  }
  return out;
}

/** Латиница → кириллица (диграфы lj, nj, dž — одной буквой). */
export function srLatToCyr(text) {
  const s = String(text);
  let out = '';
  for (let i = 0; i < s.length; ) {
    const two = s.slice(i, i + 2);
    const di = SR_LAT2CYR_DIGRAPHS[two.toLowerCase()];
    if (di) { out += two[0] !== two[0].toLowerCase() ? di.toUpperCase() : di; i += 2; continue; }
    const ch = s[i];
    const cyr = SR_LAT2CYR[ch.toLowerCase()];
    out += cyr ? (ch !== ch.toLowerCase() ? cyr.toUpperCase() : cyr) : ch;
    i++;
  }
  return out;
}

/** Латиница без сербской диакритики: č ć → c, š → s, ž → z, đ → d. */
export function srStripDiacritics(text) {
  return String(text).replace(/[čć]/g, 'c').replace(/[ČĆ]/g, 'C').replace(/š/g, 's').replace(/Š/g, 'S')
    .replace(/ž/g, 'z').replace(/Ž/g, 'Z').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function hasCyrillic(text) { return /[Ѐ-ӿ]/.test(text); }

// --- нормализация -----------------------------------------------------------

/** Убирает диакритику у символа (ā → a, ȳ → y), сохраняя регистр. */
function baseChar(ch) {
  return ch.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC') || ch;
}

/** Строит таблицу замен символов по политике курса (кэшируется на объекте политики). */
const charMapCache = new WeakMap();
function charMap(policy) {
  if (charMapCache.has(policy)) return charMapCache.get(policy);
  // 1) эквиваленты: каждый символ группы → первый (канонический), без учёта регистра
  const equiv = new Map();
  for (const group of policy.equivalents || []) {
    const [canon, ...rest] = group.map((c) => c.normalize('NFC').toLowerCase());
    for (const c of rest) equiv.set(c, canon);
  }
  const canon = (c) => equiv.get(c) ?? c;
  // 2) необязательные знаки: ā → a (явная база через NFD: ǣ → æ, ċ → c), затем эквивалент базы
  const map = new Map();
  const put = (from, to) => {
    map.set(from, to);
    map.set(from.toUpperCase(), to.toUpperCase());
  };
  for (const [c, to] of equiv) put(c, to);
  for (const m of policy.optionalMarks || []) {
    const ch = m.normalize('NFC').toLowerCase();
    put(ch, canon(baseChar(ch)));
  }
  charMapCache.set(policy, map);
  return map;
}

/**
 * Приводит строку к каноническому виду для сравнения:
 * NFC, типографские кавычки/тире, пробелы, конечная пунктуация, регистр, политика курса.
 */
export function normalize(text, policy = DEFAULT_POLICY) {
  const p = { ...DEFAULT_POLICY, ...policy };
  let s = stripMarkup(String(text ?? '')).normalize('NFC');
  s = s
    .replace(/[‘’ʼʹ`´]/g, "'")
    .replace(/[“”„«»]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/ /g, ' ');
  // it: «e'» → «è» и т. п. (ввод без итальянской раскладки); одинаково для ввода и эталона
  // apostropheAccent: true (стандартная таблица) или объект { "e'": 'è', … }; только в конце слова
  if (p.apostropheAccent) {
    const table = typeof p.apostropheAccent === 'object' ? p.apostropheAccent : null;
    s = s.replace(/([aeiouAEIOU])'(?=$|[^\p{L}])/gu, (m, v) => {
      const low = table?.[`${v.toLowerCase()}'`] ?? GRAVE[v.toLowerCase()];
      return v === v.toLowerCase() ? low : low.toUpperCase();
    });
  }
  if (p.script === 'sr') s = srCyrToLat(s).replace(/dj/gi, (m) => (m[0] === 'D' ? 'Đ' : 'đ')); // ASCII «dj» = đ
  if (p.ignoreCase !== false) s = s.toLowerCase();
  const map = charMap(policy && typeof policy === 'object' ? policy : DEFAULT_POLICY);
  if (map.size) s = [...s].map((c) => map.get(c) ?? c).join('');
  s = s
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?…»)])/g, '$1')      // «Hei , du» → «Hei, du»
    .replace(/([(«])\s+/g, '$1')
    .trim()
    .replace(/[.!?…;:,]+$/u, '')             // конечная пунктуация не важна
    .replace(/^[¿¡]+/u, '')
    .trim();
  return s;
}

// --- сравнение ---------------------------------------------------------------

/** Расстояние Левенштейна (с ранним выходом, если превышен max). */
export function levenshtein(a, b, max = Infinity) {
  const A = [...a], B = [...b];
  if (Math.abs(A.length - B.length) > max) return max + 1;
  let prev = Array.from({ length: B.length + 1 }, (_, i) => i);
  for (let i = 1; i <= A.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= B.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[B.length];
}

/** Порог «почти верно»: одна опечатка в слове длиной ≥ 5, и не в окончании (последние endZone символов). */
export const ALMOST = { maxDistance: 1, minLength: 5, endZone: 3 };

/**
 * Опечатка ли это, а не грамматическая ошибка: ровно одно слово отличается на одну правку,
 * слово достаточно длинное, и правка стоит в основе, а не в зоне окончания.
 * Иначе stānes вместо stānas или rosam вместо rosā прошли бы как «почти верно».
 */
function isStemTypo(expected, given) {
  const E = expected.split(' '), G = given.split(' ');
  if (E.length !== G.length) return false;
  const diff = E.map((w, i) => [w, G[i]]).filter(([e, g]) => e !== g);
  if (diff.length !== 1) return false;
  const [e, g] = diff[0].map((w) => [...w]);
  if (e.length < ALMOST.minLength || levenshtein(e.join(''), g.join(''), 1) > 1) return false;
  // сначала максимальный общий суффикс, затем префикс — так правка «сдвигается» как можно левее
  // (snakkker: лишняя k относится к основе, а не к окончанию)
  let s = 0;
  while (s < e.length && s < g.length && e[e.length - 1 - s] === g[g.length - 1 - s]) s++;
  let p = 0;
  while (p < e.length - s && p < g.length - s && e[p] === g[p]) p++;
  // правка начинается в позиции p — она должна лежать до зоны окончания
  return p < e.length - ALMOST.endZone;
}

/**
 * Проверяет ввод против списка допустимых ответов.
 * opts.wrongForms — заведомо неверные реальные формы (не считаются опечаткой).
 * @returns {{ correct: boolean, almost: boolean, expected: string, given: string }}
 *   correct — засчитано (включая «почти»), almost — засчитано с пометкой об опечатке,
 *   expected — ответ для показа (ближайший допустимый, исходная запись).
 */
export function checkAnswer(input, answers, policy = DEFAULT_POLICY, { wrongForms = [] } = {}) {
  const list = (Array.isArray(answers) ? answers : [answers]).flat().filter((a) => a != null).map(String);
  const given = normalize(input, policy);
  const display = (a) => {
    const plain = stripMarkup(a);
    // для сербского показываем ответ в том алфавите, которым пишет пользователь
    if (policy?.script === 'sr' && policy.display) return policy.display === 'cyr' ? srLatToCyr(plain) : srCyrToLat(plain);
    if (policy?.script === 'sr' && input) return hasCyrillic(input) ? srLatToCyr(plain) : srCyrToLat(plain);
    return plain;
  };
  if (!list.length) return { correct: false, almost: false, expected: '', given };
  if (!given) return { correct: false, almost: false, expected: display(list[0]), given };

  // ввод совпал с другой реальной формой (соседняя клетка парадигмы, исходное ошибочное слово) —
  // это грамматическая ошибка, а не опечатка: «почти верно» не засчитываем
  const isOtherForm = wrongForms.some((w) => normalize(w, policy) === given);
  let best = null;
  for (const a of list) {
    const norm = normalize(a, policy);
    if (norm === given) return { correct: true, almost: false, expected: display(a), given };
    if (!best && isStemTypo(norm, given)) best = { a };
  }
  if (best && !isOtherForm) return { correct: true, almost: true, expected: display(best.a), given };
  // sr: без диакритики (c/s/z вместо č/ć/š/ž) — «почти верно»
  if (policy?.script === 'sr') {
    const bare = (x) => srStripDiacritics(normalize(x, policy));
    const g = bare(input);
    const hit = list.find((a) => bare(a) === g);
    if (hit && !isOtherForm) return { correct: true, almost: true, expected: display(hit), given };
  }
  return { correct: false, almost: false, expected: display(list[0]), given };
}

/** Точное сравнение двух строк по политике (для плиток, выбора и т. п.). */
export function sameText(a, b, policy = DEFAULT_POLICY) {
  return normalize(a, policy) === normalize(b, policy);
}
