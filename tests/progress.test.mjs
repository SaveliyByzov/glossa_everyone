// Мастерство, серия, XP, достижения, сборка сессий — на демо-курсе.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setConfig, config } from '../js/config.js';
import pedagogy from '../data/pedagogy.js';
import { emptyState, courseState, migrate, createStore } from '../js/store.js';
import { levelFromHistory, effective, recordLessonSession, lessonOpen, unitOpen } from '../js/mastery.js';
import { touchStreak, currentStreak, addXp, checkAchievements, rankFor, startVacation } from '../js/gamify.js';
import { buildCourse } from '../js/courses.js';
import { buildLesson, buildReview, buildBoss, interleave } from '../js/session.js';
import { generateForLesson, ruMeanings } from '../js/exercises/autogen.js';
import { startRun, recordAnswer, finishRun } from '../js/progress.js';
import demoRaw from './fixtures/demo/index.js';

setConfig(pedagogy);
const DAY = 86_400_000;
const M = config.mastery;

test('мастерство: взвешенная точность и уровни 4–5 только в разные дни', () => {
  assert.equal(levelFromHistory([{ acc: 1, day: 'd1' }], M), 3, 'за один день максимум 3');
  assert.equal(levelFromHistory([{ acc: 1, day: 'd1' }, { acc: 1, day: 'd2' }], M), 4);
  assert.equal(levelFromHistory([{ acc: 1, day: 'd1' }, { acc: 1, day: 'd2' }, { acc: 1, day: 'd3' }], M), 5);
  assert.equal(levelFromHistory([{ acc: 0.5, day: 'd1' }], M), 0);
});

test('мастерство: decay снижает уровень, но не ниже пола у пройденного урока', () => {
  const now = Date.UTC(2026, 0, 1);
  const rec = { mastery: 3, done: true, freshAt: now, decayMult: 1 };
  assert.equal(effective(rec, now + 13 * DAY, M).mastery, 3);
  const e = effective(rec, now + 15 * DAY, M);
  assert.equal(e.mastery, 2);
  assert.ok(e.cracked);
  assert.equal(effective(rec, now + 400 * DAY, M).mastery, 1, 'пол = 1');
});

test('восстановление после decay удваивает срок свежести', () => {
  const now = Date.UTC(2026, 0, 1);
  const cs = courseState();
  cs.lessons.l = { mastery: 3, peak: 3, done: true, history: [{ acc: 1, day: 'a' }], freshAt: now, decayMult: 1 };
  const r = recordLessonSession(cs, 'l', 0.9, { today: 'b', now: now + 20 * DAY });
  assert.ok(r.restored);
  assert.equal(cs.lessons.l.decayMult, 2);
  assert.ok(cs.lessons.l.mastery >= 3);
});

test('серия: только дни с выполненной целью, заморозки и отпуск', () => {
  const s = emptyState();
  touchStreak(s, '2026-01-01');
  touchStreak(s, '2026-01-02');
  assert.equal(s.stats.streak.count, 2);
  touchStreak(s, '2026-01-04');          // пропуск 1 дня — заморозка
  assert.equal(s.stats.streak.count, 3);
  assert.equal(s.stats.streak.freezes, 1);
  assert.equal(currentStreak(s, '2026-01-05'), 3);
  assert.equal(currentStreak(s, '2026-01-08'), 0, 'три пропуска при одной заморозке — серия сгорела');
  startVacation(s, 7, '2026-01-04');
  assert.equal(currentStreak(s, '2026-01-08'), 3, 'в отпуске пропуски не считаются');
});

test('XP: серия продлевается только при выполнении дневной цели', () => {
  const s = emptyState();
  addXp(s, 30, { today: '2026-01-01' });
  assert.equal(s.stats.streak.count, 0);
  const r = addXp(s, 30, { today: '2026-01-01', courseId: 'sr' });
  assert.ok(r.goalReached);
  assert.equal(s.stats.streak.count, 1);
  assert.equal(s.stats.goalDays, 1);
});

test('достижения и звания из pedagogy.js', () => {
  const s = emptyState();
  s.stats.lessonsCompleted = 1;
  const got = checkAchievements(s).map((a) => a.id);
  assert.ok(got.includes('first-lesson'));
  assert.equal(rankFor(0).current.title, pedagogy.ranks[0].title);
  assert.equal(rankFor(1000).next.xp, 1800);
});

test('миграция и импорт: чужой файл отклоняется, недостающие поля заполняются', () => {
  assert.throws(() => migrate({ foo: 1 }));
  const m = migrate({ app: 'glossa', version: 1, stats: { xpTotal: 5 } });
  assert.equal(m.stats.xpTotal, 5);
  assert.equal(m.stats.streak.count, 0);
  const mem = new Map();
  const store = createStore({ getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) });
  store.update((st) => { st.stats.xpTotal = 42; });
  const backup = store.exportJSON();
  store.reset();
  store.importJSON(backup);
  assert.equal(store.state.stats.xpTotal, 42);
});

test('автогенерация из лексики', () => {
  assert.deepEqual(ruMeanings('машина, автомобиль; тачка (разг.)'), ['машина', 'автомобиль', 'тачка']);
  const course = buildCourse(demoRaw, { id: 'demo' });
  const lesson = course.lessonsById.get('demo-u01-l02');
  const ex = generateForLesson(lesson, course.allVocab, 12, () => 0.42);
  assert.ok(ex.length > 0 && ex.length <= 12);
  assert.ok(new Set(ex.map((e) => e.type)).size >= 3);
  for (const e of ex.filter((x) => x.type === 'choice')) assert.ok(e.options[e.answer] != null);
});

test('сессия урока, ответы, итог: мастерство, XP, банк ошибок, открытие следующего урока', () => {
  const course = buildCourse(demoRaw, { id: 'demo' });
  const state = emptyState();
  const cs = state.courses.demo = courseState();
  const l1 = course.lessonsById.get('demo-u01-l01');
  const l2 = course.lessonsById.get('demo-u01-l02');
  assert.ok(!lessonOpen(course, cs, l2), 'learn: следующий урок закрыт');
  const items = buildLesson(course, cs, l1, { rnd: () => 0.3 });
  assert.equal(items.length, l1.exercises.length);
  const run = startRun(state, 'lesson', items, { course, lesson: l1 });
  run.queue.forEach((it, i) => recordAnswer(state, run, it, { correct: i !== 0, almost: false, given: 'x', expected: 'y' }));
  assert.equal(run.queue.length, items.length + 1, 'ошибка повторяется в конце сессии');
  recordAnswer(state, run, run.queue.at(-1), { correct: true });
  const sum = finishRun(state, run, [course]);
  assert.equal(sum.total, items.length);
  assert.ok(sum.accuracy > 0.85);
  assert.equal(sum.mastery.after, 3);
  assert.equal(cs.mistakes.length, 1);
  assert.ok(state.stats.xpTotal > 100);
  assert.ok(lessonOpen(course, cs, l2), 'мастерство 3 открывает следующий урок');
  assert.ok(cs.srs['v:demo-bil'], 'лексика урока попала в SRS');
  assert.ok(Object.keys(cs.srs).some((k) => k.startsWith('s:')), 'навыки урока попали в SRS');

  // повторение «на опережение» собирается из ближайших карточек
  const rev = buildReview(course, cs, { now: Date.now(), rnd: () => 0.5 });
  assert.ok(rev.length > 0);
  // босс — без choice/match
  const boss = buildBoss(course, cs, course.units[0], { rnd: () => 0.5 });
  assert.ok(boss.length > 0 && boss.every((it) => !['choice', 'match'].includes(it.ex.type)));
  assert.ok(unitOpen(course, cs, 0));
});

test('interleave: не больше N одного типа подряд', () => {
  const mk = (type, n) => Array.from({ length: n }, (_, i) => ({ ex: { type }, ref: { key: `${type}${i}` } }));
  const out = interleave([...mk('choice', 5), ...mk('cloze', 3)], { maxType: 2 });
  let run = 1;
  for (let i = 1; i < out.length - 2; i++) { run = out[i].ex.type === out[i - 1].ex.type ? run + 1 : 1; assert.ok(run <= 2); }
});
