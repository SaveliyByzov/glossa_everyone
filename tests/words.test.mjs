// Лексика: статистика, выбор слов, трудные слова, дистракторы форм, сборка сессии, XP/SRS через progress.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setConfig, config } from '../js/config.js';
import pedagogy from '../data/pedagogy.js';
import { emptyState, courseState, migrate } from '../js/store.js';
import { buildCourse } from '../js/courses.js';
import { newCard, review, DAY } from '../js/srs.js';
import { startRun, recordAnswer, finishRun } from '../js/progress.js';
import {
  wordStatus, wordStats, hardScore, noteWordResult, parseSource, selectWords, sourceOptions,
  stemOf, swapStem, formsDistractors, formsExercise, buildWords, mixMode, ALL_CAP,
} from '../js/words.js';
import { gradeResult } from '../js/exercises/flashcard.js';
import sr from '../data/sr/index.js';

setConfig(pedagogy);
const NOW = Date.UTC(2026, 0, 10, 12);
const seeded = (seed = 1) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const mk = (id, extra = {}) => ({ id, w: id, ru: id, pos: 'n', g: 'm', ...extra });
const course = buildCourse({
  id: 'x', name: 'X', answer: {},
  units: [
    { id: 'x-u1', lessons: [{ id: 'x-u1-l1', vocab: [mk('bil', { forms: 'bilen, biler, bilene' }), mk('hus', { g: 'n', forms: 'huset, hus, husene' }), mk('mann', { forms: 'mannen, menn, mennene' }), mk('bok', { g: 'f', forms: 'boka, bøker, bøkene' })] }] },
    { id: 'x-u2', lessons: [{ id: 'x-u2-l1', vocab: [mk('spise', { pos: 'v', g: null, forms: 'spiser, spiste, har spist' }), mk('og', { pos: 'conj', g: null })] }] },
  ],
});
const dueCard = (days = -1, extra = {}) => ({ ...newCard(NOW), step: -1, interval: 3, due: NOW + days * DAY, ...extra });

test('статус слова: new / learning / known', () => {
  assert.equal(wordStatus(undefined), 'new');
  assert.equal(wordStatus(newCard(NOW)), 'learning');
  assert.equal(wordStatus({ ...newCard(NOW), step: -1, interval: 10 }), 'learning');
  assert.equal(wordStatus({ ...newCard(NOW), step: -1, interval: 21 }), 'known');
});

test('статистика: новые / учу / выучено / к повтору / трудные', () => {
  const cs = courseState();
  cs.srs['v:bil'] = dueCard(-1);                                   // учу, созрело
  cs.srs['v:hus'] = dueCard(5, { interval: 30 });                  // выучено
  cs.wordErrors = { mann: { n: 2, streak: 0 } };
  const s = wordStats(course, cs, NOW);
  assert.deepEqual(s, { total: 6, new: 4, learning: 1, known: 1, due: 1, hard: 1 });
});

test('счётчик трудных слов: ошибка +1, две верных подряд снимают «трудность», новая ошибка возвращает', () => {
  const cs = courseState();
  assert.equal(hardScore(cs, 'bil'), 0);
  noteWordResult(cs, 'bil', false);
  noteWordResult(cs, 'bil', false);
  assert.equal(hardScore(cs, 'bil'), 2);
  noteWordResult(cs, 'bil', true);
  assert.equal(hardScore(cs, 'bil'), 2, 'одного верного ответа мало');
  noteWordResult(cs, 'bil', true);
  assert.equal(hardScore(cs, 'bil'), 0);
  assert.equal(cs.wordErrors.bil.n, 2, 'общий счётчик ошибок сохраняется');
  noteWordResult(cs, 'bil', false);
  assert.equal(hardScore(cs, 'bil'), 3);
  noteWordResult(cs, 'hus', true);
  assert.equal(cs.wordErrors.hus, undefined, 'верный ответ без ошибок записи не создаёт');
});

test('трудные слова: старые ошибки из банка ошибок учитываются, пока нет собственного счётчика', () => {
  const cs = courseState();
  cs.mistakes.push({ key: 'k', vocab: 'hus', count: 3, due: 0, correctDays: [] });
  assert.equal(hardScore(cs, 'hus'), 3);
  noteWordResult(cs, 'hus', true);          // верный ответ без записи счётчик не создаёт — банк продолжает считаться
  assert.equal(hardScore(cs, 'hus'), 3);
  noteWordResult(cs, 'hus', false);
  assert.equal(hardScore(cs, 'hus'), 1, 'после появления счётчика — только он');
});

test('обратная совместимость: старое состояние без wordErrors мигрирует', () => {
  const old = emptyState();
  old.courses.nb = { ...courseState(), mistakes: [] };
  delete old.courses.nb.wordErrors;
  assert.deepEqual(migrate(old).courses.nb.wordErrors, {});
});

test('parseSource', () => {
  assert.deepEqual(parseSource('due'), { kind: 'due', value: null });
  assert.deepEqual(parseSource('lesson:nb-u01-l01'), { kind: 'lesson', value: 'nb-u01-l01' });
});

test('выбор слов: к повтору — самые просроченные первыми; новые — в порядке курса', () => {
  const cs = courseState();
  cs.srs['v:hus'] = dueCard(-1);
  cs.srs['v:mann'] = dueCard(-3);
  cs.srs['v:bok'] = dueCard(2);
  assert.deepEqual(selectWords(course, cs, 'due', { now: NOW }).map((v) => v.id), ['mann', 'hus']);
  assert.deepEqual(selectWords(course, cs, 'new', { now: NOW }).map((v) => v.id), ['bil', 'spise', 'og']);
  assert.deepEqual(selectWords(course, cs, 'new', { now: NOW, limit: 2 }).map((v) => v.id), ['bil', 'spise']);
});

test('выбор слов: трудные — по убыванию счётчика', () => {
  const cs = courseState();
  cs.wordErrors = { bil: { n: 1, streak: 0 }, bok: { n: 4, streak: 0 }, hus: { n: 9, streak: 2 } };
  assert.deepEqual(selectWords(course, cs, 'hard', { now: NOW }).map((v) => v.id), ['bok', 'bil']);
});

test('фильтры: урок, юнит, часть речи, род; новое и созревшее — первыми', () => {
  const cs = courseState();
  const ids = (src, o) => selectWords(course, cs, src, { now: NOW, rnd: seeded(3), ...o }).map((v) => v.id).sort();
  assert.deepEqual(ids('lesson:x-u2-l1'), ['og', 'spise']);
  assert.deepEqual(ids('unit:x-u1'), ['bil', 'bok', 'hus', 'mann']);
  assert.deepEqual(ids('pos:v'), ['spise']);
  assert.deepEqual(ids('gender:m'), ['bil', 'mann']);
  assert.deepEqual(ids('gender:c'), []);
  cs.srs['v:bil'] = dueCard(5);                                   // «учу», не созрело → в конец
  cs.srs['v:hus'] = dueCard(-1);                                  // созрело → после новых
  const order = selectWords(course, cs, 'unit:x-u1', { now: NOW, rnd: seeded(5) }).map((v) => v.id);
  assert.deepEqual(order.slice(-2), ['hus', 'bil']);
  assert.equal(selectWords(course, cs, 'unit:x-u1', { now: NOW, limit: 2 }).length, 2);
  assert.deepEqual(selectWords(course, cs, 'nonsense', { now: NOW }), []);
});

test('«все» ограничено ALL_CAP', () => {
  const big = buildCourse({ id: 'b', units: [{ id: 'b-u', lessons: [{ id: 'b-l', vocab: Array.from({ length: ALL_CAP + 50 }, (_, i) => mk(`w${i}`)) }] }] });
  assert.equal(selectWords(big, courseState(), 'new', { limit: 0 }).length, ALL_CAP);
});

test('опции источников: только реально встречающиеся pos и роды', () => {
  const o = sourceOptions(course);
  assert.deepEqual(o.pos.map((p) => p.id).sort(), ['conj', 'n', 'v']);
  assert.deepEqual(o.genders.map((g) => g.id).sort(), ['f', 'm', 'n']);
  assert.equal(o.units.length, 2);
  assert.equal(o.lessons[0].n, 4);
});

test('дистракторы форм: корень слова подставляется в парадигму донора', () => {
  assert.equal(stemOf('rosa'), 'ros');
  assert.equal(stemOf('å spise'), 'spis');
  assert.equal(stemOf('bil'), 'bil');
  assert.equal(swapStem(course.vocabById.get('bil'), course.vocabById.get('mann')), 'mannen, manner, mannene');
  assert.equal(swapStem(mk('x', { forms: 'abc' }), mk('y')), null, 'без корня донора в формах подставлять нечего');
  const item = course.vocabById.get('mann');
  const wrong = formsDistractors(item, course.allVocab, 3, seeded(2));
  assert.ok(wrong.length >= 2);
  assert.ok(!wrong.includes(item.forms));
  assert.equal(new Set(wrong).size, wrong.length);
  assert.ok(wrong.every((f) => f.startsWith('mann') || f.startsWith('menn') || f.includes('mann')), 'дистракторы строятся от слова: ' + wrong);
  const ex = formsExercise(item, course.allVocab, seeded(2));
  assert.equal(ex.options[ex.answer], item.forms);
  assert.equal(ex.type, 'choice');
});

test('формы: слово без форм или без достаточного числа доноров — упражнения нет', () => {
  assert.equal(formsExercise(course.vocabById.get('og'), course.allVocab), null);
  assert.equal(formsExercise(course.vocabById.get('spise'), course.allVocab), null, 'единственный глагол: доноров нет');
});

test('на реальных курсах дистракторы формируются для большинства слов с формами', () => {
  for (const raw of [sr]) {
    const c = buildCourse(raw);
    const withForms = c.allVocab.filter((v) => v.forms);
    const ok = withForms.filter((v) => formsExercise(v, c.allVocab, seeded(7)));
    assert.ok(ok.length / withForms.length > 0.8, `${c.id}: ${ok.length}/${withForms.length}`);
    for (const v of ok.slice(0, 80)) {
      const ex = formsExercise(v, c.allVocab, seeded(11));
      assert.equal(new Set(ex.options).size, ex.options.length, `${v.id}: варианты различны`);
      assert.equal(ex.options[ex.answer], v.forms);
    }
  }
});

test('сборка сессии: режимы и ключи SRS', () => {
  const cs = courseState();
  const rnd = seeded(4);
  const cards = buildWords(course, cs, { source: 'new', mode: 'cards', now: NOW, rnd });
  assert.equal(cards.length, 6);
  assert.ok(cards.every((it) => it.ex.type === 'flashcard' && it.ref.vocab && it.ref.skill === null && it.ref.lessonId === null));
  const type = buildWords(course, cs, { source: 'new', mode: 'type', now: NOW, rnd });
  assert.ok(type.every((it) => it.ex.type === 'translate' && it.ex.dir === 'toTarget' && it.ex.answers[0] === it.ref.vocab));
  const rev = buildWords(course, cs, { source: 'new', mode: 'reverse', length: 3, now: NOW, rnd });
  assert.equal(rev.length, 3);
  assert.ok(rev.every((it) => it.ex.dir === 'toRu'));
  const forms = buildWords(course, cs, { source: 'unit:x-u1', mode: 'forms', now: NOW, rnd });
  assert.ok(forms.length > 0 && forms.every((it) => it.ex.type === 'choice' && it.course.vocabById.get(it.ref.vocab).forms));
  const mix = buildWords(course, cs, { source: 'new', mode: 'mix', now: NOW, rnd });
  assert.ok(mix.every((it) => it.ex.type === 'flashcard'), 'слова без карточек в миксе — сперва карточки');
  assert.deepEqual([0, 1, 2, 3].map((i) => mixMode(i, true)), ['reverse', 'type', 'forms', 'cards']);
});

test('ввод ru→слово принимает основную форму; обратный — любой синоним из ru', async () => {
  const { checkAnswer } = await import('../js/answer.js');
  const syn = buildCourse({ id: 's', units: [{ id: 's-u', lessons: [{ id: 's-l', vocab: [mk('bil', { ru: 'машина, автомобиль; тачка (разг.)' })] }] }] });
  const [to, back] = ['type', 'reverse'].map((mode) => buildWords(syn, courseState(), { source: 'new', mode, rnd: seeded(1) })[0].ex);
  assert.ok(checkAnswer('Bil', to.answers, syn.answer).correct);
  for (const w of ['машина', 'автомобиль', 'тачка']) assert.ok(checkAnswer(w, back.answers, { ignoreCase: true }).correct, w);
});

test('карточка: оценка → SRS (again/hard/good/easy) и XP как в повторении', () => {
  const state = emptyState();
  const items = buildWords(course, courseState(), { source: 'new', mode: 'cards', length: 4, now: NOW, rnd: seeded(9) });
  const run = startRun(state, 'words', items, { course });
  const grades = ['again', 'hard', 'good', 'easy'];
  const results = items.map((it, i) => ({ it, grade: grades[i] }));
  for (const { it, grade } of results) recordAnswer(state, run, it, gradeResult(grade, course.vocabById.get(it.ref.vocab)), NOW);
  const cs = state.courses.x;
  const card = (g) => cs.srs[`v:${results.find((r) => r.grade === g).it.ref.vocab}`];
  assert.equal(card('again').step, 0);
  assert.equal(card('easy').step, -1, 'easy сразу выпускает карточку из заучивания');
  assert.equal(card('easy').interval, review(undefined, 'easy', NOW, config.srs).interval);
  assert.ok(card('good').due > NOW && card('hard').due > NOW);
  assert.ok(card('easy').interval > card('good').interval || card('easy').step === -1);
  // XP: 3 верных × review (5); ошибка — 0
  assert.equal(run.xp, 3 * (config.xp.review ?? 5));
  assert.equal(state.stats.reviews, 4);
  // ошибка — в трудные и в очередь повтора в конце сессии
  const forgot = results.find((r) => r.grade === 'again').it.ref.vocab;
  assert.equal(cs.wordErrors[forgot].n, 1);
  assert.equal(run.queue.length, 5);
  const summary = finishRun(state, run, [course], NOW);
  assert.equal(summary.total, 4);
  assert.equal(summary.mistakes.length, 1);
  assert.equal(summary.accuracy, 0.75);
  assert.ok(state.stats.xpTotal >= run.xp);
});

test('результат карточки: hard засчитывается как «почти», again — ошибка', () => {
  const w = course.vocabById.get('bil');
  assert.deepEqual([gradeResult('again', w).correct, gradeResult('hard', w).almost, gradeResult('good', w).correct], [false, true, true]);
  assert.match(gradeResult('again', w).expected, /bil — bil/);
});

test('ввод: ошибка в режиме «Ввод» попадает в трудные, повторный верный ответ — нет', () => {
  const state = emptyState();
  const [it] = buildWords(course, courseState(), { source: 'unit:x-u1', mode: 'type', length: 1, now: NOW, rnd: seeded(2) });
  const run = startRun(state, 'words', [it], { course });
  recordAnswer(state, run, it, { correct: false, almost: false, expected: it.ex.answers[0], given: 'zzz' }, NOW);
  assert.equal(hardScore(state.courses.x, it.ref.vocab), 1);
  const retry = run.queue[1];
  recordAnswer(state, run, retry, { correct: true, almost: false }, NOW);       // повтор в той же сессии не меняет SRS и счётчик
  assert.equal(state.courses.x.wordErrors[it.ref.vocab].streak, 0);
});
