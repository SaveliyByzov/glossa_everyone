import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyOnb, loadOnb, saveOnb, nextStep, prevStep, dotIndex, DOTS, hasProgress, shouldShowOnboarding,
  placementUnit, applyStart, buildQuiz, pickCheckGroups, checkGroups, phraseFromInput, ONB_KEY,
} from '../js/onboarding.js';
import { emptyState, courseState } from '../js/store.js';
import { unitOpen, nextLesson } from '../js/mastery.js';
import { generatePhrase } from '../js/sync.js';

const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

function fakeCourse(n = 10) {
  const units = Array.from({ length: n }, (_, i) => ({
    id: `u${i}`, unitIndex: i,
    lessons: [{ id: `u${i}-l1`, unitIndex: i, lessonIndex: 0, exercises: [
      { type: 'choice', level: 1, q: 'x', options: ['a', 'b'], answer: 0 },
      { type: 'cloze', level: 2, text: 'a {{b}}', answer: 'b' },
      { type: 'flashcard', level: 1 },
    ] }],
  }));
  return { id: 'sr', mode: 'learn', units, allLessons: units.flatMap((u) => u.lessons) };
}

test('шаги: цепочка вперёд/назад зависит от уровня', () => {
  const o = emptyOnb();
  const walk = [];
  while (o.step) { walk.push(o.step); o.level = 'zero'; o.step = nextStep(o); }
  assert.deepEqual(walk, ['welcome', 'level', 'script', 'goal', 'profile', 'done']);
  const k = { ...emptyOnb(), level: 'known', step: 'level' };
  assert.equal(nextStep(k), 'quiz');
  assert.equal(nextStep({ ...k, step: 'quiz' }), 'result');
  assert.equal(prevStep({ ...k, step: 'script', startUnit: 3 }), 'result');
  assert.equal(prevStep({ ...k, step: 'script', level: 'zero', startUnit: 0 }), 'level');
  assert.equal(prevStep({ ...k, step: 'welcome' }), null);
  assert.equal(dotIndex('quiz'), dotIndex('level'));
  assert.equal(DOTS.length, 6);
});

test('состояние переживает перезагрузку; тест не продолжается с середины', () => {
  const st = mem();
  const o = { ...emptyOnb(), step: 'goal', goal: 100, remind: 'evening' };
  saveOnb(o, st);
  assert.deepEqual(loadOnb(st), o);
  saveOnb({ ...o, step: 'quiz' }, st);
  assert.equal(loadOnb(st).step, 'level');
  assert.equal(loadOnb(mem()).step, 'welcome');
  const bad = mem(); bad.setItem(ONB_KEY, '{oops');
  assert.equal(loadOnb(bad).step, 'welcome');
});

test('показ один раз: не для прошедших, вошедших и давних пользователей', () => {
  const s = emptyState();
  assert.equal(shouldShowOnboarding({ onb: emptyOnb(), state: s, storageHasOnb: false }), true);
  assert.equal(shouldShowOnboarding({ onb: { ...emptyOnb(), done: true }, state: s }), false);
  assert.equal(shouldShowOnboarding({ onb: emptyOnb(), state: s, hasProfile: true }), false);
  assert.equal(shouldShowOnboarding({ onb: { ...emptyOnb(), cloud: 'created', step: 'profile' }, state: s, hasProfile: true }), true);   // перезагрузка до подтверждения фразы
  s.stats.xpTotal = 30;
  assert.equal(hasProgress(s), true);
  assert.equal(shouldShowOnboarding({ onb: emptyOnb(), state: s, storageHasOnb: false }), false);
  assert.equal(shouldShowOnboarding({ onb: emptyOnb(), state: s, storageHasOnb: true }), true);   // начал, но не закончил знакомство
});

test('стартовый юнит: одиночная осечка терпится, две подряд — старт', () => {
  const T = true, F = false;
  assert.equal(placementUnit([F, F, F, F, F, F, F, F, F, F]), 0);
  assert.equal(placementUnit([T, T, T, F, F, F, F, F, F, F]), 3);
  assert.equal(placementUnit([T, T, F, T, T, T, F, F, F, F]), 6);
  assert.equal(placementUnit([T, T, T, T, T, T, T, T, T, F]), 9);
  assert.equal(placementUnit([T, T, T, T, T, T, T, T, T, T]), 9);
  assert.equal(placementUnit([F, T, T, T, T, T, T, T, T, T]), 9);
  assert.equal(placementUnit([]), 0);
});

test('входной тест: по заданию на юнит, без карточек и пар', () => {
  const c = fakeCourse();
  const q = buildQuiz(c);
  assert.equal(q.length, 10);
  assert.deepEqual(q.map((x) => x.unitIndex), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.ok(q.every((x) => x.ex.type !== 'flashcard' && x.ex.type !== 'match'));
  assert.ok(q.slice(2).every((x) => x.ex.type !== 'choice'));
});

test('applyStart: открывает юниты до N, засчитывает уроки, «Продолжить» ведёт в юнит N', () => {
  const c = fakeCourse();
  const cs = courseState();
  assert.equal(unitOpen(c, cs, 4), false);
  assert.equal(nextLesson(c, cs).id, 'u0-l1');
  applyStart(cs, c, 4);
  assert.equal(unitOpen(c, cs, 4), true);
  assert.equal(unitOpen(c, cs, 2), true);
  assert.equal(unitOpen(c, cs, 6), false);
  assert.equal(cs.lessons['u3-l1'].done, true);
  assert.equal(cs.lessons['u4-l1'], undefined);
  assert.equal(nextLesson(c, cs).id, 'u4-l1');
  applyStart(cs, c, 0);                       // «с начала» ничего не ломает
  assert.equal(applyStart(courseState(), c, 99), 9);
});

test('проверка фразы: две разные группы, регистр и тире не важны', () => {
  for (let i = 0; i < 100; i++) {
    const g = pickCheckGroups();
    assert.equal(g.length, 2);
    assert.ok(g[0] < g[1] && g[0] >= 0 && g[1] <= 4);
  }
  assert.deepEqual(pickCheckGroups(() => 0), [0, 1]);
  const p = generatePhrase();
  const groups = p.match(/.{5}/g);
  assert.equal(checkGroups(p, [1, 3], [groups[1].toLowerCase(), ` ${groups[3]} `]), true);
  assert.equal(checkGroups(p, [1, 3], [groups[3], groups[1]]), groups[1] === groups[3]);
  assert.equal(checkGroups(p, [0, 2], [groups[0], '']), false);
  assert.equal(checkGroups(p, [0, 2], [groups[0].slice(1), groups[2]]), false);
});

test('вход: фраза из ссылки', () => {
  const p = generatePhrase();
  assert.equal(phraseFromInput(`https://x.app/srpski/#/join/${p}`), p);
  assert.equal(phraseFromInput('ABC'), 'ABC');
});
