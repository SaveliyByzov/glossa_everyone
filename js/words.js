// Раздел «Лексика»: статистика слов, выбор слов по источнику, «трудные слова», дистракторы для форм
// и сборка сессии (карточки / ввод / формы / микс). Логика без DOM; SRS и XP — через progress.js (ключи 'v:<id>').

import { isMature } from './srs.js';
import { shuffle } from './util.js';
import { stripMarkup } from './markup.js';
import { makeItem } from './session.js';
import { translate, explainFor } from './exercises/autogen.js';

export const MODES = [
  { id: 'cards', label: 'Карточки', hint: 'вспомнить значение, оценить себя' },
  { id: 'type', label: 'Ввод', hint: 'перевод → слово на языке курса' },
  { id: 'reverse', label: 'Слово → перевод', hint: 'ввести значение по-русски' },
  { id: 'forms', label: 'Формы', hint: 'выбрать верные основные формы' },
  { id: 'mix', label: 'Микс', hint: 'чередование режимов' },
];

export const LENGTHS = [10, 20, 0];            // 0 = все слова источника
export const ALL_CAP = 300;                     // «все» — не больше (чтобы сессия не была бесконечной)

const MATURE = 21;

// --- статус слова и статистика ---------------------------------------------------------------

/** 'new' — карточки SRS ещё нет; 'known' — зрелая (интервал ≥ matureInterval); иначе 'learning'. */
export function wordStatus(card, matureInterval = MATURE) {
  if (!card) return 'new';
  return isMature(card, matureInterval) ? 'known' : 'learning';
}

/** Сколько раз слово «не далось» (ошибки в любых режимах) — для «трудных слов». 0, если ошибки уже вытеснены. */
export function hardScore(cs, id) {
  const w = cs?.wordErrors?.[id];
  let score = w && (w.streak || 0) < 2 ? w.n || 0 : 0;
  // старые данные: ошибки по лексеме в банке ошибок (до появления счётчика)
  for (const m of cs?.mistakes || []) if (m.vocab === id && !w) score += m.count || 1;
  return score;
}

/** Учёт ответа по слову: ошибка → n+1 и сброс серии; верный ответ после ошибок → серия +1 (2 подряд — слово «не трудное»). */
export function noteWordResult(cs, id, ok) {
  const bag = (cs.wordErrors ||= {});
  const rec = bag[id];
  if (!ok) { bag[id] = { n: (rec?.n || 0) + 1, streak: 0 }; return bag[id]; }
  if (rec) rec.streak = (rec.streak || 0) + 1;
  return rec || null;
}

const cardOf = (cs, id) => cs?.srs?.[`v:${id}`];
const isDueCard = (card, now) => !!card && card.due <= now;

export function wordStats(course, cs, now = Date.now(), matureInterval = MATURE) {
  const out = { total: course.allVocab.length, new: 0, learning: 0, known: 0, due: 0, hard: 0 };
  for (const v of course.allVocab) {
    const card = cardOf(cs, v.id);
    out[wordStatus(card, matureInterval)]++;
    if (isDueCard(card, now)) out.due++;
    if (hardScore(cs, v.id) > 0) out.hard++;
  }
  return out;
}

// --- источники -------------------------------------------------------------------------------

/** 'due' | 'new' | 'hard' | 'lesson:<id>' | 'unit:<id>' | 'pos:<pos>' | 'gender:<g>' → { kind, value } */
export function parseSource(src = 'due') {
  const i = String(src).indexOf(':');
  return i < 0 ? { kind: src, value: null } : { kind: src.slice(0, i), value: src.slice(i + 1) };
}

export const POS_LABEL = { n: 'Существительные', v: 'Глаголы', adj: 'Прилагательные', adv: 'Наречия', pron: 'Местоимения', prep: 'Предлоги', conj: 'Союзы', num: 'Числительные', part: 'Частицы', phr: 'Выражения' };
export const GENDER_LABEL = { m: 'Мужской род (m)', f: 'Женский род (f)', n: 'Средний род (n)', c: 'Общий род (c)' };

/** Что можно выбрать в выпадающих списках: юниты, уроки с лексикой, части речи и роды, реально встречающиеся в курсе. */
export function sourceOptions(course) {
  const count = (fn) => course.allVocab.filter(fn).length;
  const pos = [...new Set(course.allVocab.map((v) => v.pos).filter(Boolean))];
  const genders = [...new Set(course.allVocab.map((v) => v.g).filter(Boolean))];
  return {
    units: course.units.filter((u) => count((v) => v.unitId === u.id)).map((u) => ({ id: u.id, title: u.titleRu || u.title || u.id, n: count((v) => v.unitId === u.id), index: u.unitIndex })),
    lessons: course.allLessons.filter((l) => l.vocab.length).map((l) => ({ id: l.id, title: l.title || l.id, n: l.vocab.length, unitIndex: l.unitIndex, index: l.lessonIndex })),
    pos: pos.map((p) => ({ id: p, title: POS_LABEL[p] || p, n: count((v) => v.pos === p) })),
    genders: genders.map((g) => ({ id: g, title: GENDER_LABEL[g] || g, n: count((v) => v.g === g) })),
  };
}

/**
 * Слова источника.
 *   due — карточка созрела (самые просроченные первыми); new — карточки нет (в порядке курса);
 *   hard — по убыванию hardScore; lesson/unit/pos/gender — набор, где «новое» и «созревшее» идут первыми.
 * limit — максимум слов (0/Infinity — все, но не больше ALL_CAP).
 */
export function selectWords(course, cs, source, { now = Date.now(), limit = 0, rnd = Math.random } = {}) {
  const { kind, value } = parseSource(source);
  const all = course.allVocab;
  let list;
  switch (kind) {
    case 'due':
      list = all.filter((v) => isDueCard(cardOf(cs, v.id), now)).sort((a, b) => cardOf(cs, a.id).due - cardOf(cs, b.id).due);
      break;
    case 'new':
      list = all.filter((v) => !cardOf(cs, v.id));
      break;
    case 'hard':
      list = all.map((v) => ({ v, s: hardScore(cs, v.id) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.v);
      break;
    default: {
      const match = kind === 'lesson' ? (v) => v.lessonId === value
        : kind === 'unit' ? (v) => v.unitId === value
        : kind === 'pos' ? (v) => v.pos === value
        : kind === 'gender' ? (v) => v.g === value
        : () => false;
      const prio = (v) => { const c = cardOf(cs, v.id); return !c ? 0 : isDueCard(c, now) ? 1 : 2; };
      list = shuffle(all.filter(match), rnd).sort((a, b) => prio(a) - prio(b));
    }
  }
  const max = limit > 0 ? limit : ALL_CAP;
  return list.slice(0, Math.min(max, ALL_CAP));
}

// --- формы: дистракторы ------------------------------------------------------------------------

const VOWEL_END = /[aeiouyæøåāēīōūȳ]$/i;
/** Корень для подмены: без конечной гласной, если слово не слишком короткое (rosa → ros, bil → bil). */
export function stemOf(w) {
  const s = stripMarkup(w || '').replace(/^(å|et|en|ei|to)\s+/i, '').trim();
  return s.length > 3 && VOWEL_END.test(s) ? s.slice(0, -1) : s;
}

/**
 * Правдоподобная «чужая» парадигма: берём формы донора (того же pos/рода) и подставляем в них корень нашего слова.
 * bil: 'bilen, biler, bilene' + mann → 'mannen, manner, mannene' — отличается от верного 'mannen, menn, mennene' только по форме.
 * Если у донора нет своего корня в формах — подставлять нечего, дистрактор не строится.
 */
export function swapStem(donor, item) {
  const from = stemOf(donor.w), to = stemOf(item.w);
  if (from.length < 2 || to.length < 1 || !donor.forms || !donor.forms.includes(from)) return null;
  return donor.forms.split(from).join(to);
}

/** До n дистракторов к формам слова: сперва донор с тем же pos и родом и тем же числом частей, потом — просто тот же pos. */
export function formsDistractors(item, pool, n = 3, rnd = Math.random) {
  const parts = (s) => s.split(',').length;
  const correct = item.forms;
  const donors = pool.filter((v) => v.id !== item.id && v.forms && v.pos === item.pos);
  // «чистая» подмена — корень есть в каждой форме донора; частичная (брат → brødre) оставляет чужие формы, потому ниже
  const full = (v) => { const st = stemOf(v.w); return v.forms.split(',').every((p) => p.includes(st)); };
  const rank = (v) => (v.g === item.g ? 0 : 2) + (parts(v.forms) === parts(correct) ? 0 : 1) + (full(v) ? 0 : 4);
  const sorted = shuffle(donors, rnd).sort((a, b) => rank(a) - rank(b));
  const seen = new Set([correct.toLowerCase()]);
  const out = [];
  for (const d of sorted) {
    const f = swapStem(d, item);
    if (!f || seen.has(f.toLowerCase())) continue;
    seen.add(f.toLowerCase());
    out.push(f);
    if (out.length >= n) break;
  }
  return out;
}

/** choice-упражнение «основные формы» (или null, если формы не заданы или дистракторов меньше двух). */
export function formsExercise(item, pool, rnd = Math.random) {
  if (!item.forms) return null;
  const wrong = formsDistractors(item, pool, 3, rnd);
  if (wrong.length < 2) return null;
  const options = shuffle([item.forms, ...wrong], rnd);
  return {
    type: 'choice', level: 2, auto: true, _vocab: item.id,
    prompt: 'Выберите верные основные формы', q: item.w, gloss: item.ru, options, answer: options.indexOf(item.forms),
    explain: explainFor(item),
  };
}

/** Карточка слова — отдельный тип упражнения `flashcard` (js/exercises/flashcard.js). */
export function cardExercise(item) {
  return { type: 'flashcard', level: 1, auto: true, _vocab: item.id, word: item, explain: explainFor(item) };
}

// --- сборка сессии ---------------------------------------------------------------------------

/** Режим для слова №i в миксе: новое слово — карточка; дальше по кругу ввод/обратный/формы/карточка. */
export function mixMode(i, hasCard) {
  if (!hasCard) return 'cards';
  return ['reverse', 'type', 'forms', 'cards'][i % 4];
}

export function wordExercise(item, mode, pool, rnd) {
  switch (mode) {
    case 'cards': return cardExercise(item);
    case 'type': return translate(item, 'toTarget');
    case 'reverse': return translate(item, 'toRu');
    case 'forms': return formsExercise(item, pool, rnd) || translate(item, 'toTarget');
    default: return cardExercise(item);
  }
}

/** Слова, к которым применим режим «Формы» (есть формы и хватает дистракторов). */
export function formsReady(words, pool, rnd = Math.random) {
  return words.filter((v) => formsExercise(v, pool, rnd));
}

/**
 * Элементы сессии для раннера: { ex, ref, kind, course }.
 * Лексемы привязаны без урока (lesson = null), чтобы ответы не попадали в SRS грамматических навыков.
 */
export function buildWords(course, cs, { source = 'due', mode = 'cards', length = 0, now = Date.now(), rnd = Math.random } = {}) {
  let words = selectWords(course, cs, source, { now, limit: length, rnd });
  if (mode === 'forms') {
    // режим «Формы» — только слова с формами; остальные не показываем (иначе это был бы другой режим)
    const ok = new Set(formsReady(words, course.allVocab, rnd).map((v) => v.id));
    words = words.filter((v) => ok.has(v.id));
  }
  const items = words.map((v, i) => {
    const m = mode === 'mix' ? mixMode(i, !!cardOf(cs, v.id)) : mode;
    const ex = wordExercise(v, m, course.allVocab, rnd);
    return makeItem(course, null, ex, -1, 'vocab');
  });
  return items;
}

/** Ближайшее время созревания следующего слова (для подсказки «Всё повторено»), мс; null — нечего ждать. */
export function nextDueIn(course, cs, now = Date.now()) {
  let min = Infinity;
  for (const v of course.allVocab) { const c = cardOf(cs, v.id); if (c && c.due > now) min = Math.min(min, c.due); }
  return Number.isFinite(min) ? min - now : null;
}

