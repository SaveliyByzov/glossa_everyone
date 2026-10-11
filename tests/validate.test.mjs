import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCourse, validateExercise, createReport } from '../tools/validate.mjs';
import demo from './fixtures/demo/index.js';

const check = (ex, course = { answer: {}, skills: {} }) => {
  const r = createReport();
  validateExercise(r, 'x', { level: 1, explain: 'e', ...ex }, { course, lesson: { kind: 'grammar' } });
  return r;
};

test('демо-курс проходит валидацию без ошибок', () => {
  const r = validateCourse(demo, { lang: 'demo' });
  assert.equal(r.errors, 0, JSON.stringify(r.items.filter((i) => i.level === 'error')));
});

test('choice: answer вне диапазона', () => {
  assert.equal(check({ type: 'choice', options: ['a', 'b'], answer: 2 }).errors, 1);
  assert.equal(check({ type: 'choice', options: ['a', 'b'], answer: 1 }).errors, 0);
});

test('cloze: число ___ должно совпадать с answers', () => {
  assert.equal(check({ type: 'cloze', text: '___ og ___', answers: ['a'] }).errors, 1);
  assert.equal(check({ type: 'cloze', text: '___ og ___', answers: ['a', ['b', 'c']] }).errors, 0);
});

test('paradigm: blanks в пределах таблицы и не в колонке меток', () => {
  const base = { type: 'paradigm', head: ['', 'sg', 'pl'], rows: [['nom', 'a', 'b'], ['gen', 'c', 'd']] };
  assert.equal(check({ ...base, blanks: [[1, 2]] }).errors, 0);
  assert.equal(check({ ...base, blanks: [[2, 1]] }).errors, 1);
  assert.equal(check({ ...base, blanks: [[0, 0]] }).errors, 1);
  assert.equal(check({ ...base, blanks: 'all', level: 3 }).errors, 0);
});

test('fix / classify / order / translate / match / transform', () => {
  assert.equal(check({ type: 'fix', tokens: ['a', 'b'], wrong: 5, answers: ['c'] }).errors, 1);
  assert.equal(check({ type: 'fix', tokens: ['a', 'b'], wrong: 1, answers: ['b'] }).errors, 1, 'исправление = ошибочному слову');
  assert.equal(check({ type: 'classify', buckets: ['x', 'y'], items: [['a', 0], ['b', 3]] }).errors, 1);
  assert.equal(check({ type: 'order', tokens: ['a', 'b'], alt: [['b', 'c']] }).errors, 1);
  assert.equal(check({ type: 'translate', dir: 'sideways', q: 'q', answers: ['a'] }).errors, 1);
  assert.equal(check({ type: 'match', pairs: [['a', 'b']] }).errors, 1);
  assert.equal(check({ type: 'transform', source: 's', answers: ['a'] }).errors, 1, 'нет instruction');
  assert.equal(check({ type: 'nope' }).errors, 1);
});

test('нет explain у грамматики — ошибка; повтор id — ошибка', () => {
  const r = createReport();
  validateExercise(r, 'x', { type: 'choice', level: 1, options: ['a', 'b'], answer: 0 }, { lesson: { kind: 'grammar' } });
  assert.equal(r.errors, 1);
  const dup = structuredClone({ ...demo, units: [demo.units[0], demo.units[0]] });
  assert.ok(validateCourse(dup, { lang: 'demo' }).errors > 0);
});
