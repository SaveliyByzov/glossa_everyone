import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newCard, review, dueKeys, upcomingKeys, spreadOverdue, isMature, gradeFromResult, gradeFromAccuracy, addMistake, resolveMistake, MIN, DAY } from '../js/srs.js';

const T0 = Date.UTC(2026, 0, 1, 12);
const cfg = { learningSteps: [10, 1440], graduatingInterval: 3, easyBonus: 1.3, startEase: 2.5, minEase: 1.3, lapseEasePenalty: 0.2, almostCorrectFactor: 1, maxInterval: 180 };

test('заучивание: шаги 10 мин → 1 день → выпуск с интервалом 3 дня', () => {
  let c = newCard(T0, cfg);
  c = review(c, 'good', T0, cfg);
  assert.equal(c.step, 1);
  assert.equal(c.due, T0 + 1440 * MIN);
  c = review(c, 'good', c.due, cfg);
  assert.equal(c.step, -1);
  assert.equal(c.interval, 3);
});

test('повторение: интервал × ease, «почти» — ×1 без роста ease, ошибка — сброс и −0.2 ease', () => {
  let c = { ...newCard(T0, cfg), step: -1, interval: 4, ease: 2.5 };
  const good = review(c, 'good', T0, cfg);
  assert.equal(good.interval, 10);
  const hard = review(c, 'hard', T0, cfg);
  assert.equal(hard.interval, 4);
  assert.equal(hard.ease, 2.5);
  const again = review(c, 'again', T0, cfg);
  assert.equal(again.step, 0);
  assert.equal(again.lapses, 1);
  assert.equal(again.ease, 2.3);
  assert.equal(again.due, T0 + 10 * MIN);
});

test('ease не ниже minEase, интервал не больше maxInterval', () => {
  let c = { ...newCard(T0, cfg), step: -1, interval: 150, ease: 1.35 };
  c = review(c, 'again', T0, cfg);
  assert.equal(c.ease, 1.3);
  const big = review({ ...newCard(T0, cfg), step: -1, interval: 150, ease: 2.5 }, 'good', T0, cfg);
  assert.equal(big.interval, 180);
});

test('оценки', () => {
  assert.equal(gradeFromResult({ correct: false }), 'again');
  assert.equal(gradeFromResult({ correct: true, almost: true }), 'hard');
  assert.equal(gradeFromResult({ correct: true }), 'good');
  assert.equal(gradeFromAccuracy(1), 'good');
  assert.equal(gradeFromAccuracy(0.7), 'hard');
  assert.equal(gradeFromAccuracy(0.3), 'again');
});

test('очереди: просроченное по возрастанию срока, «скоро созреет», зрелость', () => {
  const srs = {
    'v:a': { due: T0 - 2 * DAY }, 'v:b': { due: T0 - DAY }, 's:x': { due: T0 + DAY }, 'v:c': { due: T0 + 2 * DAY },
  };
  assert.deepEqual(dueKeys(srs, T0), ['v:a', 'v:b']);
  assert.deepEqual(dueKeys(srs, T0, 's:'), []);
  assert.deepEqual(upcomingKeys(srs, T0, 'v:'), ['v:c']);
  assert.ok(isMature({ step: -1, interval: 30 }, 21));
  assert.ok(!isMature({ step: 0, interval: 30 }, 21));
});

test('load balancing: просроченное сверх лимита откладывается', () => {
  const srs = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`v:${i}`, { due: T0 - (10 - i) * DAY }]));
  const moved = spreadOverdue(srs, T0, 4, () => 0);
  assert.equal(moved, 6);
  assert.equal(dueKeys(srs, T0).length, 4);
});

test('банк ошибок: возврат через 1 день, удаление после 2 верных в РАЗНЫЕ дни', () => {
  const bank = [];
  const m = addMistake(bank, { key: 'l1#3', lessonId: 'l1', index: 3 }, T0, { clearAfterCorrect: 2, dueSteps: [1, 3] });
  assert.equal(m.due, T0 + DAY);
  assert.equal(resolveMistake(bank, 'l1#3', '2026-01-02', T0 + DAY), false);
  assert.equal(bank[0].due, T0 + DAY + 3 * DAY);
  assert.equal(resolveMistake(bank, 'l1#3', '2026-01-02', T0 + DAY), false, 'второй раз в тот же день не считается');
  assert.equal(resolveMistake(bank, 'l1#3', '2026-01-05', T0 + 4 * DAY), true);
  assert.equal(bank.length, 0);
});

test('повторная ошибка сбрасывает прогресс исправления', () => {
  const bank = [];
  addMistake(bank, { key: 'k' }, T0);
  resolveMistake(bank, 'k', '2026-01-02', T0 + DAY);
  addMistake(bank, { key: 'k' }, T0 + 2 * DAY);
  assert.equal(bank[0].count, 2);
  assert.deepEqual(bank[0].correctDays, []);
});
