// Сборка сессий: урок, повторение, «босс» юнита, входной тест, тренировка навыка, разбор ошибок.
// Элемент сессии: { ex, ref, kind, course }
//   ref  = { key, courseId, lessonId, index, skill?, vocab?, vocabList? } — ссылка для SRS и банка ошибок
//   kind = 'new' | 'old' | 'mistake' | 'skill' | 'vocab' | 'test'

import { config, rangeValue } from './config.js';
import { generateForLesson, generateForVocab } from './exercises/autogen.js';
import { shuffle, sampleOrdered } from './util.js';
import { dueKeys, upcomingKeys, spreadOverdue } from './srs.js';
import { effective, lessonSkills, lessonDone, skillLevels } from './mastery.js';

// --- элементы и ссылки --------------------------------------------------------------

/** Упражнения урока: авторские или (если их нет) сгенерированные из лексики. */
export function lessonExercises(course, lesson, rnd = Math.random) {
  if (lesson.exercises?.length) return lesson.exercises.map((ex, index) => ({ ex, index }));
  if (!lesson._auto) lesson._auto = generateForLesson(lesson, course.allVocab, config.session.lessonLength + 4, rnd);
  return lesson._auto.map((ex) => ({ ex, index: -1 }));
}

export function makeItem(course, lesson, ex, index, kind) {
  const skill = ex.skill || lesson?.skills?.[0] || null;
  const key = index >= 0 ? `${lesson.id}#${index}` : `auto:${ex._vocab || (ex._vocabList || []).join(',')}:${ex.type}:${ex.dir || ''}`;
  return {
    ex, kind, course,
    ref: { key, courseId: course.id, lessonId: lesson?.id || null, index, skill, vocab: ex._vocab || null, vocabList: ex._vocabList || null },
  };
}

/** Восстанавливает упражнение по ссылке из банка ошибок. */
export function itemFromRef(course, ref, kind = 'mistake', rnd = Math.random) {
  const lesson = ref.lessonId ? course.lessonsById.get(ref.lessonId) : null;
  if (ref.index >= 0 && lesson?.exercises?.[ref.index]) return makeItem(course, lesson, lesson.exercises[ref.index], ref.index, kind);
  if (ref.vocab && course.vocabById.has(ref.vocab)) {
    const v = course.vocabById.get(ref.vocab);
    const ex = generateForVocab(v, course.allVocab, { reps: 2 }, rnd);
    return ex ? { ...makeItem(course, course.lessonsById.get(v.lessonId), ex, -1, kind), ref: { ...ref } } : null;
  }
  return null;
}

// --- порядок: не больше N одного типа/навыка подряд ---------------------------------

/** Жадная перестановка с ограничениями на серии; при невозможности ставит как есть. */
export function interleave(items, { maxType = 3, maxSkill = Infinity, keepFirst = 0 } = {}) {
  const out = items.slice(0, keepFirst);
  const rest = items.slice(keepFirst);
  const run = (fn, val) => { let n = 0; for (let i = out.length - 1; i >= 0 && fn(out[i]) === val; i--) n++; return n; };
  const typeOf = (it) => it.ex.type;
  const skillOf = (it) => it.ref.skill || it.ref.key;
  while (rest.length) {
    let k = rest.findIndex((it) => run(typeOf, typeOf(it)) < maxType && run(skillOf, skillOf(it)) < maxSkill);
    if (k < 0) k = 0;
    out.push(rest.splice(k, 1)[0]);
  }
  return out;
}

// --- урок ------------------------------------------------------------------------------

export function buildLesson(course, cs, lesson, { rnd = Math.random, now = Date.now() } = {}) {
  const S = config.session;
  const own = lessonExercises(course, lesson, rnd);
  const main = sampleOrdered(own, S.lessonLength, rnd).map(({ ex, index }) => makeItem(course, lesson, ex, index, 'new'));
  if (!main.length) return [];

  // подмешиваем «старое» из пройденных уроков в фазы 3–4 (вторая половина)
  const ratio = S.mixOldRatioByMode?.[course.mode] ?? S.mixOldRatio ?? 0;
  const oldCount = Math.round(S.lessonLength * ratio);
  const old = oldPool(course, cs, lesson, now, rnd).slice(0, oldCount);
  const items = [...main];
  for (const it of old) {
    const from = Math.ceil(items.length * 0.4);
    items.splice(from + Math.floor(rnd() * (items.length - from + 1)), 0, it);
  }
  return interleave(items, { maxType: S.maxSameTypeInRow ?? 3 });
}

/** Упражнения пройденных уроков: сначала «треснувшие» и слабые, исключая choice/match. */
function oldPool(course, cs, current, now, rnd) {
  const lessons = course.allLessons.filter((l) => l.id !== current.id && lessonDone(cs, l.id));
  const scored = shuffle(lessons, rnd).map((l) => ({ l, m: effective(cs.lessons[l.id], now).mastery }))
    .sort((a, b) => a.m - b.m);
  const out = [];
  for (const { l } of scored) {
    const pool = lessonExercises(course, l, rnd).filter(({ ex }) => ex.type !== 'match');
    const pick = pool[Math.floor(rnd() * pool.length)];
    if (pick) out.push(makeItem(course, l, pick.ex, pick.index, 'old'));
  }
  return out;
}

// --- повторение ---------------------------------------------------------------------------

/**
 * Ежедневное повторение (docs/PEDAGOGY.md §8): квоты банк ошибок / навыки / лексика,
 * добор из «скоро созреет», разогрев в начале, трудное в середине, уверенное в конце.
 */
export function buildReview(course, cs, { rnd = Math.random, now = Date.now(), length } = {}) {
  const S = config.session;
  const n = length || S.reviewLength;
  spreadOverdue(cs.srs, now, (config.srs.overdueCap ?? 3) * n, rnd);
  const levels = skillLevels(course, cs, now);
  const used = new Set();
  const take = (it) => { if (!it || used.has(it.ref.key)) return null; used.add(it.ref.key); return it; };

  // A — банк ошибок
  const mistakesDue = cs.mistakes.filter((m) => (m.due ?? 0) <= now).sort((a, b) => b.count - a.count);
  const mistakesLater = cs.mistakes.filter((m) => m.due > now).sort((a, b) => a.due - b.due);
  const A = (list) => list.map((m) => take(itemFromRef(course, m, 'mistake', rnd))).filter(Boolean);

  // B — навыки: срок SRS наступил + навыки «треснувших» уроков
  const crackedSkills = course.allLessons
    .filter((l) => effective(cs.lessons[l.id], now).cracked)
    .flatMap((l) => lessonSkills(l));
  const skillKeysDue = [...new Set([...dueKeys(cs.srs, now, 's:').map((k) => k.slice(2)), ...crackedSkills])];
  const skillKeysLater = upcomingKeys(cs.srs, now, 's:').map((k) => k.slice(2));
  const B = (skills) => skills.map((s) => take(skillItem(course, cs, s, levels[s] ?? 0, rnd))).filter(Boolean);

  // C — лексика
  const vocabDue = dueKeys(cs.srs, now, 'v:').map((k) => k.slice(2));
  const vocabLater = upcomingKeys(cs.srs, now, 'v:').map((k) => k.slice(2));
  const C = (ids) => ids.map((id) => {
    const v = course.vocabById.get(id);
    if (!v) return null;
    const ex = generateForVocab(v, course.allVocab, cs.srs[`v:${id}`], rnd);
    return ex ? take(makeItem(course, course.lessonsById.get(v.lessonId), ex, -1, 'vocab')) : null;
  }).filter(Boolean);

  const mix = S.reviewMix || { mistakes: 0.3, skills: 0.4, vocab: 0.3 };
  const quota = { a: Math.round(n * mix.mistakes), b: Math.round(n * mix.skills) };
  quota.c = n - quota.a - quota.b;

  const a = A(mistakesDue).slice(0, quota.a);
  const b = B(skillKeysDue).slice(0, quota.b + (quota.a - a.length));
  const c = C(vocabDue).slice(0, n - a.length - b.length);
  let items = [...a, ...b, ...c];
  // добор «скоро созреет»
  if (items.length < n) items.push(...A(mistakesLater).slice(0, n - items.length));
  if (items.length < n) items.push(...B(skillKeysLater).slice(0, n - items.length));
  if (items.length < n) items.push(...C(vocabLater).slice(0, n - items.length));
  items = items.slice(0, n);
  return arrangeReview(items, cs, rnd);
}

/** Упражнение на навык из пройденных уроков: давно не виденное; choice/match — только для слабых навыков. */
function skillItem(course, cs, skill, level, rnd) {
  const cands = [];
  for (const l of course.allLessons) {
    if (!lessonDone(cs, l.id) && !(cs.lessons[l.id]?.history?.length)) continue;
    const lessonHasSkill = (l.skills || []).includes(skill);
    for (const { ex, index } of lessonExercises(course, l, rnd)) {
      if (ex.skill ? ex.skill !== skill : !lessonHasSkill) continue;
      if (level >= 3 && (ex.type === 'choice' || ex.type === 'match')) continue;
      cands.push({ l, ex, index, seen: cs.seen?.[`${l.id}#${index}`] || 0 });
    }
  }
  if (!cands.length) return null;
  cands.sort((x, y) => x.seen - y.seen || (y.ex.level || 1) - (x.ex.level || 1));
  const top = cands.slice(0, 3);
  const p = top[Math.floor(rnd() * top.length)];
  const it = makeItem(course, p.l, p.ex, p.index, 'skill');
  it.ref.skill = skill;
  return it;
}

function arrangeReview(items, cs, rnd) {
  if (items.length <= 4) return interleave(shuffle(items, rnd), { maxType: 3, maxSkill: 2 });
  const ease = (it) => (it.kind === 'vocab' ? (cs.srs[`v:${it.ref.vocab}`]?.reps || 0) + 2 : 0) + (it.kind === 'mistake' ? -5 : 0) - (it.ex.level || 1);
  const sorted = [...items].sort((x, y) => ease(y) - ease(x));
  const warm = sorted.slice(0, 2);
  const finish = sorted.slice(2, 4);
  const middle = shuffle(sorted.slice(4), rnd).sort((x, y) => (x.kind === 'mistake') - (y.kind === 'mistake'));
  // трудное (банк ошибок) — в середину
  const mid = middle.filter((x) => x.kind !== 'mistake');
  const hard = middle.filter((x) => x.kind === 'mistake');
  mid.splice(Math.floor(mid.length / 2), 0, ...hard);
  return interleave([...warm, ...mid, ...finish], { maxType: 3, maxSkill: config.session.maxSameSkillInRow ?? 2, keepFirst: 0 });
}

/** Межъязыковое повторение: блоки по 3–5 заданий одного курса. */
export function crossLanguageBlocks(perCourse, rnd = Math.random) {
  const [lo, hi] = config.session.crossLanguageBlock || [3, 5];
  const queues = perCourse.filter((q) => q.length).map((q) => [...q]);
  const out = [];
  let last = -1;
  while (queues.some((q) => q.length)) {
    let k = queues.findIndex((q, i) => q.length && i !== last);
    if (k < 0) k = queues.findIndex((q) => q.length);
    const size = lo + Math.floor(rnd() * (hi - lo + 1));
    out.push(...queues[k].splice(0, size));
    last = k;
  }
  return out;
}

// --- юнит: «босс» и входной тест -----------------------------------------------------------

function unitPool(course, unit, { levels, exclude }, rnd) {
  const out = [];
  for (const l of unit.lessons) {
    for (const { ex, index } of lessonExercises(course, l, rnd)) {
      if (exclude.includes(ex.type)) continue;
      out.push({ l, ex, index, okLevel: levels.includes(ex.level || 1) });
    }
  }
  return out;
}

/** «Босс»: 15–20 заданий уровня 2–3 без choice/match по всем навыкам юнита; давно не виденные — первыми. */
export function buildBoss(course, cs, unit, { rnd = Math.random } = {}) {
  const B = config.session.boss || {};
  const max = rangeValue(B.length, 20);
  const pool = unitPool(course, unit, { levels: B.levels || [2, 3], exclude: B.excludeTypes || ['choice', 'match'] }, rnd);
  const preferred = pool.filter((p) => p.okLevel);
  const chosen = (preferred.length >= 5 ? preferred : pool)
    .map((p) => ({ ...p, seen: cs.seen?.[`${p.l.id}#${p.index}`] || 0, r: rnd() }))
    .sort((a, b) => a.seen - b.seen || a.r - b.r)
    .slice(0, max);
  return interleave(shuffle(chosen.map((p) => makeItem(course, p.l, p.ex, p.index, 'test')), rnd), { maxType: 3, maxSkill: 2 });
}

/** Входной тест (review-режим): по 2–3 задания на навык, 8–12 всего, без choice/match. */
export function buildPlacement(course, unit, { rnd = Math.random } = {}) {
  const P = config.session.placement || {};
  const max = rangeValue(P.length, 12);
  const perSkill = rangeValue(P.perSkill, 3);
  const pool = unitPool(course, unit, { levels: P.levels || [2, 3], exclude: P.excludeTypes || ['choice', 'match'] }, rnd);
  const bySkill = new Map();
  for (const p of shuffle(pool, rnd).sort((a, b) => b.okLevel - a.okLevel)) {
    const s = p.ex.skill || p.l.skills?.[0] || `lesson:${p.l.id}`;
    if (!bySkill.has(s)) bySkill.set(s, []);
    if (bySkill.get(s).length < perSkill) bySkill.get(s).push(p);
  }
  // берём по кругу, чтобы каждый навык был представлен даже при обрезке
  const groups = [...bySkill.entries()];
  const items = [];
  for (let round = 0; items.length < max && groups.some(([, g]) => g.length > round); round++) {
    for (const [skill, g] of groups) {
      if (g[round] && items.length < max) {
        const it = makeItem(course, g[round].l, g[round].ex, g[round].index, 'test');
        it.ref.skill = skill;
        items.push(it);
      }
    }
  }
  return shuffle(items, rnd);
}

/** Тренировка одного навыка (из экрана «Трудные места»). */
export function buildSkillTraining(course, cs, skill, { rnd = Math.random } = {}) {
  const items = [];
  for (const l of course.allLessons) {
    for (const { ex, index } of lessonExercises(course, l, rnd)) {
      if ((ex.skill || l.skills?.[0]) === skill) items.push(makeItem(course, l, ex, index, 'skill'));
    }
  }
  return interleave(shuffle(items, rnd).slice(0, config.session.reviewLength), { maxType: 3 });
}

/** «Разобрать ошибки»: те же задания в новом порядке. */
export function buildRetry(items, rnd = Math.random) {
  return shuffle(items.map((it) => ({ ...it, kind: it.kind === 'mistake' ? 'mistake' : 'retry' })), rnd);
}
