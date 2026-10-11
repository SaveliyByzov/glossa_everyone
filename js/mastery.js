// Мастерство уроков 0–5: взвешенная точность последних сессий, «желательная трудность»
// (уровни 4–5 только в разные дни), decay («треснувший» урок), пол для пройденных,
// открытие уроков/юнитов, босс и входной тест. Без DOM.
//
// Запись урока в courseState.lessons[id]:
//   { mastery, peak, done, best, history: [{ acc, day }], freshAt, decayMult, lastAt }

import { config } from './config.js';
import { DAY } from './srs.js';

export function lessonRecord(cs, lessonId) {
  return cs.lessons[lessonId] ||= { mastery: 0, peak: 0, done: false, best: 0, history: [], freshAt: null, decayMult: 1, lastAt: null };
}

/** Уровень по истории: взвешенная точность последних window сессий + ограничение по числу разных дней. */
export function levelFromHistory(history, cfg = config.mastery) {
  if (!history.length) return 0;
  const recent = history.slice(-(cfg.window || 3)).reverse();          // свежая — первая
  const weights = cfg.weights?.length ? cfg.weights : [1];
  let sum = 0, wsum = 0;
  recent.forEach((s, i) => { const w = weights[i] ?? weights.at(-1); sum += s.acc * w; wsum += w; });
  const acc = sum / wsum;
  let level = 0;
  (cfg.thresholds || []).forEach((t, i) => { if (acc >= t - 1e-9) level = i + 1; });
  level = Math.min(level, cfg.levels || 5);
  const days = new Set(history.map((s) => s.day)).size;
  const spaced = cfg.spacedForLevel || {};
  while (level > 0 && spaced[level] && days < spaced[level]) level--;
  return level;
}

/** Срок свежести уровня в днях. */
function freshDays(level, rec, cfg) {
  const d = cfg.decayDays?.[level - 1];
  return d ? d * (rec.decayMult || 1) : Infinity;
}

/**
 * Эффективное мастерство с учётом decay (без мутации записи).
 * @returns {{ mastery, cracked, preDecay }}
 */
export function effective(rec, now = Date.now(), cfg = config.mastery) {
  if (!rec || !rec.mastery) return { mastery: rec?.mastery || 0, cracked: false, preDecay: null };
  const floor = rec.done ? (cfg.floor ?? 1) : 0;
  let level = rec.mastery;
  let t = rec.freshAt ?? rec.lastAt ?? now;
  while (level > floor) {
    const period = freshDays(level, rec, cfg) * DAY;
    if (now - t <= period) break;
    t += period;
    level--;
  }
  return { mastery: level, cracked: level < rec.mastery, preDecay: level < rec.mastery ? rec.mastery : null };
}

/**
 * Записывает сессию урока. Возвращает { before, after, firstDone, restored }.
 * Уровень за сессию падает не больше чем на 1; восстановление после decay удваивает срок свежести.
 */
export function recordLessonSession(cs, lessonId, acc, { today, now = Date.now(), cfg = config.mastery } = {}) {
  const rec = lessonRecord(cs, lessonId);
  const eff = effective(rec, now, cfg);
  const before = eff.mastery;
  rec.history = [...rec.history, { acc: Math.round(acc * 1000) / 1000, day: today }].slice(-12);
  let level = levelFromHistory(rec.history, cfg);
  if (level < before) level = Math.max(level, before - 1);
  let restored = false;
  if (eff.cracked && acc >= (cfg.thresholds?.[eff.preDecay - 1] ?? 1)) {
    level = Math.max(level, eff.preDecay);
    rec.decayMult = (rec.decayMult || 1) * (cfg.decayGrowth || 2);
    restored = true;
  }
  const firstDone = !rec.done && level >= 1;
  if (level >= 1) rec.done = true;
  if (rec.done) level = Math.max(level, cfg.floor ?? 1);
  rec.mastery = level;
  rec.peak = Math.max(rec.peak || 0, level);
  rec.best = Math.max(rec.best || 0, acc);
  rec.freshAt = now;
  rec.lastAt = now;
  return { before, after: level, firstDone, restored };
}

/** Повышает мастерство до level (входной тест, босс). */
export function grantMastery(cs, lessonId, level, now = Date.now()) {
  const rec = lessonRecord(cs, lessonId);
  const firstDone = !rec.done;
  if (rec.mastery < level) { rec.mastery = level; rec.freshAt = now; }
  rec.peak = Math.max(rec.peak || 0, rec.mastery);
  rec.done = true;
  rec.lastAt ||= now;
  return { firstDone };
}

// --- открытие уроков и юнитов -------------------------------------------------------

const peak = (cs, id) => cs?.lessons?.[id]?.peak ?? cs?.lessons?.[id]?.mastery ?? 0;
export const lessonDone = (cs, id) => !!cs?.lessons?.[id]?.done;

export function unlockThreshold(mode, scfg = config.session) {
  return scfg.unlockNextLesson?.[mode] ?? (mode === 'learn' ? 3 : 1);
}

export function unitPassed(course, cs, unit) {
  const t = unlockThreshold(course.mode);
  return cs?.units?.[unit.id]?.boss?.passed || (unit.lessons.length > 0 && unit.lessons.every((l) => peak(cs, l.id) >= t));
}

/** Юнит открыт: первый; предыдущий пройден; уже начат; пройден входной тест (перепрыгивание, review). */
export function unitOpen(course, cs, unitIndex) {
  if (unitIndex === 0) return true;
  const unit = course.units[unitIndex];
  if (cs?.units?.[unit.id]?.placement) return true;
  if (unit.lessons.some((l) => lessonDone(cs, l.id))) return true;
  return unitPassed(course, cs, course.units[unitIndex - 1]);
}

/** Урок открыт: юнит открыт и предыдущий урок юнита достиг порога unlockNextLesson. */
export function lessonOpen(course, cs, lesson) {
  if (!unitOpen(course, cs, lesson.unitIndex)) return false;
  if (lesson.lessonIndex === 0 || lessonDone(cs, lesson.id)) return true;
  const prev = course.units[lesson.unitIndex].lessons[lesson.lessonIndex - 1];
  return peak(cs, prev.id) >= unlockThreshold(course.mode);
}

/** «Продолжить»: первый открытый непройденный урок, иначе первый треснувший. */
export function nextLesson(course, cs, now = Date.now()) {
  for (const l of course.allLessons) if (lessonOpen(course, cs, l) && !lessonDone(cs, l.id)) return l;
  for (const l of course.allLessons) if (effective(cs?.lessons?.[l.id], now).cracked) return l;
  return null;
}

export function courseProgress(course, cs) {
  const total = course.allLessons.length;
  const done = course.allLessons.filter((l) => lessonDone(cs, l.id)).length;
  return { total, done, ratio: total ? done / total : 0 };
}

/** Навыки урока: lesson.skills + skill из его упражнений. */
export function lessonSkills(lesson) {
  const set = new Set(lesson.skills || []);
  for (const ex of lesson.exercises || []) if (ex.skill) set.add(ex.skill);
  return [...set];
}

/** Мастерство навыка = минимум по урокам, где он тренируется. */
export function skillLevels(course, cs, now = Date.now()) {
  const out = {};
  for (const l of course.allLessons) {
    const m = effective(cs?.lessons?.[l.id], now).mastery;
    for (const s of lessonSkills(l)) out[s] = Math.min(out[s] ?? Infinity, m);
  }
  return out;
}

// --- босс и входной тест -----------------------------------------------------------

export function bossState(course, cs, unit, now = Date.now(), scfg = config.session) {
  const rec = cs?.units?.[unit.id]?.boss || null;
  const open = unitOpen(course, cs, unit.unitIndex);
  const need = scfg.boss?.unlockMastery?.[course.mode] ?? 3;
  let available = open && unit.lessons.length > 0 && unit.lessons.every((l) => peak(cs, l.id) >= need);
  if (course.mode === 'review') available = open && (!!cs?.units?.[unit.id]?.placement || unit.lessons.every((l) => lessonDone(cs, l.id)));
  const waitMs = rec && !rec.passed && rec.at ? rec.at + (scfg.boss?.retryAfterHours ?? 20) * 3_600_000 - now : 0;
  return { passed: !!rec?.passed, perfect: !!rec?.perfect, available, waitMs: Math.max(0, waitMs) };
}

export function placementAllowed(course) { return course.mode === 'review'; }
