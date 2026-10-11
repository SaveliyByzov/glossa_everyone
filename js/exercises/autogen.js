// Автогенерация упражнений из лексики (если у урока нет авторских упражнений,
// а также для SRS-повторения слов). Чистые функции — без DOM.

import { shuffle, pick } from '../util.js';
import { stripMarkup } from '../markup.js';

/** Значения перевода: 'машина, автомобиль; тачка (разг.)' → ['машина', 'автомобиль', 'тачка']. */
export function ruMeanings(ru) {
  return stripMarkup(ru || '')
    .split(/[,;]/)
    .map((s) => s.replace(/\([^)]*\)/g, '').trim())
    .filter(Boolean);
}

const firstMeaning = (v) => ruMeanings(v.ru)[0] || v.ru;

/** Дистракторы: сперва та же часть речи из урока, потом из курса; без совпадающего текста. */
function distractors(item, pool, field, n, rnd) {
  const seen = new Set([stripMarkup(item[field]).toLowerCase()]);
  const ranked = [
    ...shuffle(pool.filter((v) => v.pos === item.pos), rnd),
    ...shuffle(pool.filter((v) => v.pos !== item.pos), rnd),
  ];
  const out = [];
  for (const v of ranked) {
    const val = field === 'ru' ? firstMeaning(v) : v[field];
    const key = stripMarkup(val).toLowerCase();
    if (v.id === item.id || seen.has(key)) continue;
    seen.add(key);
    out.push(val);
    if (out.length >= n) break;
  }
  return out;
}

function choice(item, pool, dir, rnd) {
  const toTarget = dir === 'toTarget';
  const correct = toTarget ? item.w : firstMeaning(item);
  const wrong = distractors(item, pool, toTarget ? 'w' : 'ru', 3, rnd);
  if (wrong.length < 1) return null;
  const options = shuffle([correct, ...wrong], rnd);
  return {
    type: 'choice', level: 1, auto: true, _vocab: item.id,
    prompt: toTarget ? 'Как это будет на изучаемом языке?' : 'Что это значит?',
    q: toTarget ? `«${item.ru}»` : item.w,
    qLang: toTarget ? 'ru' : null,
    optionsLang: toTarget ? null : 'ru',
    options, answer: options.indexOf(correct),
    explain: explainFor(item),
  };
}

export function translate(item, dir) {
  const toTarget = dir === 'toTarget';
  return {
    type: 'translate', level: 2, auto: true, _vocab: item.id, dir,
    q: toTarget ? item.ru : item.w,
    answers: toTarget ? [item.w] : [...ruMeanings(item.ru), item.ru],
    explain: explainFor(item),
  };
}

function match(items, rnd) {
  const pairs = shuffle(items, rnd).slice(0, 6).map((v) => [v.w, firstMeaning(v)]);
  // в паре правые стороны должны быть различимы
  if (new Set(pairs.map((p) => p[1].toLowerCase())).size !== pairs.length) return null;
  return { type: 'match', level: 1, auto: true, _vocabList: items.map((v) => v.id), pairs };
}

export function explainFor(v) {
  const parts = [`**${v.w}** — ${v.ru}`];
  if (v.forms) parts.push(`Формы: *${v.forms}*`);
  if (v.ex) parts.push(`${v.ex}${v.exRu ? ` — ${v.exRu}` : ''}`);
  return parts.map((p) => (/[.!?…]$/.test(p) ? p : `${p}.`)).join(' ');
}

/**
 * Упражнения для урока из его лексики.
 * @param lesson   урок с vocab
 * @param pool     вся лексика курса (для дистракторов)
 * @param length   желаемое число упражнений
 */
export function generateForLesson(lesson, pool, length = 12, rnd = Math.random) {
  const vocab = lesson.vocab || [];
  if (!vocab.length) return [];
  const all = pool.length >= 4 ? pool : vocab;
  const out = [];
  // сначала узнавание (target → ru), затем вспоминание (ru → target), затем ввод
  for (const v of vocab) { const e = choice(v, all, 'toRu', rnd); if (e) out.push(e); }
  if (vocab.length >= 4) { const m = match(vocab, rnd); if (m) out.push(m); }
  for (const v of vocab) { const e = choice(v, all, 'toTarget', rnd); if (e) out.push(e); }
  for (const v of vocab) out.push(translate(v, 'toTarget'));
  for (const v of vocab) out.push(translate(v, 'toRu'));
  if (out.length <= length) return out;
  // равномерно прореживаем, сохраняя прогрессию сложности
  const step = out.length / length;
  return Array.from({ length }, (_, i) => out[Math.floor(i * step)]);
}

/** Одно упражнение на слово (для SRS): тип выбирается по «зрелости» карточки. */
export function generateForVocab(item, pool, card, rnd = Math.random) {
  const reps = card?.reps || 0;
  if (reps < 2) return choice(item, pool, pick(['toRu', 'toTarget'], rnd), rnd) || translate(item, 'toRu');
  return translate(item, rnd() < 0.6 ? 'toTarget' : 'toRu');
}
