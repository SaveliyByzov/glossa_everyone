// Применение результатов сессии к прогрессу: XP, SRS лексем и навыков, банк ошибок,
// мастерство урока, босс/входной тест, достижения. Логика без DOM; состояние — store.state.

import { config } from './config.js';
import { courseState as emptyCourseState } from './store.js';
import { dayKey } from './util.js';
import { review as srsReview, newCard, gradeFromResult, gradeFromAccuracy, addMistake, resolveMistake } from './srs.js';
import { addXp, checkAchievements } from './gamify.js';
import { noteWordResult } from './words.js';
import { effective, recordLessonSession, grantMastery, lessonSkills, skillLevels } from './mastery.js';

/**
 * @param mode 'lesson' | 'review' | 'words' | 'boss' | 'placement' | 'skill' | 'retry'
 * @param opts { lesson?, unit?, course }
 */
export function startRun(state, mode, items, opts = {}) {
  const { course, lesson } = opts;
  let xpFactor = 1;
  if (mode === 'lesson' && lesson) {
    // анти-гринд: урок на мастерстве 5 без decay даёт уменьшенный XP
    const rec = state.courses[course.id]?.lessons?.[lesson.id];
    const eff = effective(rec);
    if (eff.mastery >= (config.mastery.levels || 5) && !eff.cracked) xpFactor = config.xp.masteredReplayFactor ?? 1;
  }
  return {
    mode, ...opts, xpFactor,
    queue: items.map((it) => ({ ...it })),
    pos: 0,
    first: [],                  // результаты первых попыток: { item, result }
    xp: 0,
    skillTally: {},             // courseId|skill → { n, ok }
    fixed: 0,
    startedAt: Date.now(),
  };
}

const testMode = (mode) => mode === 'boss' || mode === 'placement';

function courseState(state, id) {
  return state.courses[id] ||= emptyCourseState();
}

/** Фиксирует ответ на текущий элемент. Возвращает { xp, fixed }. */
export function recordAnswer(state, run, item, result, now = Date.now()) {
  const today = dayKey(new Date(now));
  const cs = courseState(state, item.course.id);
  const firstTry = !item.retry;
  const ok = !!result.correct;
  let xp = 0;
  let fixed = false;

  if (firstTry) {
    run.first.push({ item, result });
    state.stats.answers += 1;
    if (ok) state.stats.correct += 1;
    cs.seen[item.ref.key] = now;

    // SRS лексем
    const applyTo = config.srs.applyTo || ['vocab', 'skills'];
    if (applyTo.includes('vocab')) {
      const grade = result.grade || gradeFromResult(result);   // карточки слов сами задают again/hard/good/easy
      for (const id of [item.ref.vocab, ...(item.ref.vocabList || [])].filter(Boolean)) {
        const key = `v:${id}`;
        const g = item.ref.vocabList && !item.ref.vocab ? (ok ? 'good' : 'hard') : grade;
        cs.srs[key] = srsReview(cs.srs[key], g, now, config.srs);
      }
    }
    if (item.ref.vocab) noteWordResult(cs, item.ref.vocab, ok);
    // навыки — оцениваются по точности за сессию (см. finishRun)
    if (item.ref.skill) {
      const k = `${item.course.id}|${item.ref.skill}`;
      const t = run.skillTally[k] ||= { n: 0, ok: 0 };
      t.n += 1;
      if (ok) t.ok += 1;
    }
    // банк ошибок
    const isError = !ok || (result.almost && config.mistakes?.countAlmostAsError);
    if (isError) addMistake(cs.mistakes, { ...item.ref, given: String(result.given ?? '').slice(0, 200) }, now, config.mistakes);
    else if (item.kind === 'mistake') {
      fixed = resolveMistake(cs.mistakes, item.ref.key, today, now, config.mistakes);
      if (fixed) { state.stats.mistakesFixed = (state.stats.mistakesFixed || 0) + 1; run.fixed += 1; xp += config.xp.mistakeFixed ?? 0; }
    }
    if (run.mode === 'review' || run.mode === 'words') state.stats.reviews += 1;
  }

  if (ok) {
    if (run.mode === 'review' || run.mode === 'skill' || run.mode === 'words') xp += config.xp.review ?? 5;
    else xp += (config.xp.correct ?? 10) + (firstTry && !result.almost && !testMode(run.mode) ? config.xp.firstTry ?? 0 : 0);
  }
  xp = Math.round(xp * run.xpFactor);
  run.xp += xp;
  addXp(state, xp, { today, courseId: item.course.id });

  // ошибка повторяется в конце сессии (один раз); в тестах — нет
  if (!ok && firstTry && !testMode(run.mode) && config.session.retryWrongInLesson !== false) {
    run.queue.push({ ...item, retry: true });
  }
  return { xp, fixed };
}

/** Итог сессии. Возвращает сводку для экрана результата. */
export function finishRun(state, run, courses, now = Date.now()) {
  const today = dayKey(new Date(now));
  const total = run.first.length;
  const correct = run.first.filter((r) => r.result.correct).length;
  const accuracy = total ? correct / total : 0;
  const perfect = total > 0 && correct === total;           // «почти верно» не ломает безошибочность
  const summary = { mode: run.mode, total, correct, accuracy, perfect, xpAnswers: run.xp, bonus: 0, fixed: run.fixed, mistakes: run.first.filter((r) => !r.result.correct) };
  const bonus = (n) => { const v = Math.round(n * run.xpFactor); summary.bonus += v; return v; };
  const course = run.course;
  const cs = course ? courseState(state, course.id) : null;

  // SRS навыков: оценка по точности навыка в этой сессии
  if ((config.srs.applyTo || ['skills']).includes('skills')) {
    for (const [k, t] of Object.entries(run.skillTally)) {
      const [cid, skill] = k.split('|');
      const c = courseState(state, cid);
      c.srs[`s:${skill}`] = srsReview(c.srs[`s:${skill}`], gradeFromAccuracy(t.ok / t.n), now, config.srs);
    }
  }

  let bonusXp = 0;
  if (run.mode === 'lesson' && run.lesson && total) {
    summary.mastery = recordLessonSession(cs, run.lesson.id, accuracy, { today, now });
    if (summary.mastery.firstDone) state.stats.lessonsCompleted += 1;
    if (summary.mastery.after >= 1) bonusXp += bonus(config.xp.lessonComplete ?? 0);
    if (perfect) { state.stats.perfectLessons += 1; bonusXp += bonus(config.xp.perfectLesson ?? 0); }
    // лексика урока попадает в SRS, даже если не все слова встретились в упражнениях
    for (const v of run.lesson.vocab || []) {
      const key = `v:${v.id}`;
      if (!cs.srs[key]) cs.srs[key] = srsReview(newCard(now, config.srs), 'good', now, config.srs);
    }
  }

  if (run.mode === 'boss' && run.unit && total) {
    const B = config.session.boss || {};
    const passed = accuracy >= (B.pass ?? 0.8);
    const prev = cs.units[run.unit.id]?.boss;
    cs.units[run.unit.id] = { ...cs.units[run.unit.id], boss: { passed: passed || !!prev?.passed, perfect: (perfect && passed) || !!prev?.perfect, at: now, acc: accuracy } };
    summary.boss = { passed, pass: B.pass ?? 0.8 };
    if (passed) {
      if (!prev?.passed) { state.stats.bossPassed = (state.stats.bossPassed || 0) + 1; bonusXp += bonus(config.xp.bossPassed ?? 0); }
      if (perfect && !prev?.perfect) state.stats.bossPerfect = (state.stats.bossPerfect || 0) + 1;
      for (const l of run.unit.lessons) if (grantMastery(cs, l.id, B.grantMastery ?? 4, now).firstDone) state.stats.lessonsCompleted += 1;
    }
  }

  if (run.mode === 'placement' && run.unit && total) {
    const P = config.session.placement || {};
    const pass = P.passSkill ?? 0.85;
    const bySkill = {};
    for (const { item, result } of run.first) {
      const s = item.ref.skill;
      const t = bySkill[s] ||= { n: 0, ok: 0 };
      t.n += 1; if (result.correct) t.ok += 1;
    }
    const passedSkills = new Set(Object.entries(bySkill).filter(([, t]) => t.ok / t.n >= pass).map(([s]) => s));
    const granted = [];
    for (const l of run.unit.lessons) {
      const skills = lessonSkills(l);
      const keys = skills.length ? skills : [`lesson:${l.id}`];
      const tested = keys.filter((s) => bySkill[s]);
      if (tested.length && tested.every((s) => passedSkills.has(s)) && keys.every((s) => !bySkill[s] || passedSkills.has(s))) {
        if (grantMastery(cs, l.id, P.grantMastery ?? 3, now).firstDone) state.stats.lessonsCompleted += 1;
        granted.push(l);
      }
    }
    const overall = accuracy >= pass;
    const first = !cs.units[run.unit.id]?.placement?.passed;
    cs.units[run.unit.id] = { ...cs.units[run.unit.id], placement: { at: now, acc: accuracy, passed: overall || !first } };
    if (overall && first) { state.stats.placementPassed = (state.stats.placementPassed || 0) + 1; bonusXp += bonus(config.xp.placementPassed ?? 0); }
    summary.placement = { passed: overall, granted, bySkill };
  }

  if (bonusXp) addXp(state, bonusXp, { today, courseId: course?.id });
  summary.xp = run.xp + bonusXp;

  // кэш мастерства навыков (для достижений) — по всем затронутым курсам
  for (const c of courses || (course ? [course] : [])) courseState(state, c.id).skillLevels = skillLevels(c, courseState(state, c.id), now);
  summary.achievements = checkAchievements(state);
  return summary;
}
