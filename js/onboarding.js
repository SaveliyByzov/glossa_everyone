// Знакомство при первом запуске: состояние шагов, входной тест, проверка фразы, выбор стартового юнита. Без DOM.
// Состояние живёт отдельно от прогресса (ключ 'srpski:onboarding:v1'), на сервер не уходит: это свойство устройства.
// Что выбрано в шагах (алфавит, цель) пишется сразу в настройки прогресса; юниты открываются при согласии на старт.

import { lessonExercises } from './session.js';
import { grantMastery } from './mastery.js';
import { shuffle } from './util.js';

export const ONB_KEY = 'srpski:onboarding:v1';
export const STEPS = ['welcome', 'level', 'quiz', 'result', 'script', 'goal', 'profile', 'done'];
/** Точки прогресса: шесть экранов; тест и итог теста — часть шага «Уровень». */
export const DOTS = ['welcome', 'level', 'script', 'goal', 'profile', 'done'];
export const GOALS = [[20, 'Спокойно', '≈ 5 минут'], [50, 'Обычно', '≈ 10 минут'], [100, 'Серьёзно', '≈ 20 минут'], [200, 'Интенсив', '≈ 40 минут']];
export const REMINDERS = [['none', 'Не нужно'], ['morning', 'Утром'], ['day', 'Днём'], ['evening', 'Вечером']];
export const QUIZ_LENGTH = 10;

export function emptyOnb() {
  return { v: 1, step: 'welcome', done: false, level: null, startUnit: null, script: 'lat', goal: 50, remind: 'none', cloud: null, phraseOk: false };
}

export function loadOnb(storage = globalThis.localStorage) {
  try {
    const o = { ...emptyOnb(), ...JSON.parse(storage?.getItem(ONB_KEY)) };
    if (!STEPS.includes(o.step)) o.step = 'welcome';
    if (o.step === 'quiz') o.step = 'level';        // тест не продолжается с середины: начнётся заново
    return o;
  } catch { return emptyOnb(); }
}

export function saveOnb(o, storage = globalThis.localStorage) {
  try { storage?.setItem(ONB_KEY, JSON.stringify(o)); } catch { /* приватный режим: пройдёт без сохранения */ }
}

/** Есть ли у человека уже прогресс (старый пользователь не должен видеть знакомство). */
export function hasProgress(state) {
  if (!state) return false;
  if ((state.stats?.xpTotal || 0) > 0 || (state.stats?.answers || 0) > 0) return true;
  return Object.values(state.courses || {}).some((c) => Object.keys(c.lessons || {}).length > 0);
}

export function shouldShowOnboarding({ onb, state, hasProfile = false, storageHasOnb = true }) {
  if (onb.done) return false;
  if (hasProfile && onb.cloud !== 'created') return false;      // вошёл по фразе; созданный здесь профиль ещё ждёт подтверждения фразы
  if (!storageHasOnb && hasProgress(state)) return false;      // первый запуск новой версии у давнего пользователя
  return true;
}

/** Куда ведёт «Назад» / «Дальше» (цепочка зависит от выбора уровня). */
export function prevStep(o) {
  switch (o.step) {
    case 'level': return 'welcome';
    case 'quiz': return 'level';
    case 'result': return 'level';
    case 'script': return o.level === 'known' && o.startUnit != null ? 'result' : 'level';
    case 'goal': return 'script';
    case 'profile': return 'goal';
    case 'done': return 'profile';
    default: return null;
  }
}

export function nextStep(o) {
  switch (o.step) {
    case 'welcome': return 'level';
    case 'level': return o.level === 'known' ? 'quiz' : 'script';
    case 'quiz': return 'result';
    case 'result': return 'script';
    case 'script': return 'goal';
    case 'goal': return 'profile';
    case 'profile': return 'done';
    default: return null;
  }
}

export const dotIndex = (step) => DOTS.indexOf(step === 'quiz' || step === 'result' ? 'level' : step);

// --- входной тест ---------------------------------------------------------------------------

const QUIZ_TYPES = ['cloze', 'translate', 'order', 'transform', 'fix'];

/** По одному заданию на юнит (до QUIZ_LENGTH), по возрастанию трудности юнитов. Первые два юнита — допускается choice. */
export function buildQuiz(course, { rnd = Math.random, length = QUIZ_LENGTH } = {}) {
  const out = [];
  course.units.slice(0, length).forEach((unit, unitIndex) => {
    const all = unit.lessons.flatMap((l) => lessonExercises(course, l, rnd).map(({ ex }) => ex));
    const ok = (ex) => QUIZ_TYPES.includes(ex.type) || (unitIndex < 2 && ex.type === 'choice');
    let pool = all.filter((ex) => ok(ex) && (ex.level || 1) <= 2);
    if (!pool.length) pool = all.filter(ok);
    if (!pool.length) pool = all.filter((ex) => ex.type !== 'flashcard' && ex.type !== 'match');
    if (pool.length) out.push({ ex: shuffle(pool, rnd)[0], unitIndex, unit });
  });
  return out;
}

/**
 * results[i] — верно ли задание i (по порядку юнитов). Старт — первый юнит, где ошибка не случайная
 * (две подряд либо ошибка в последнем); одиночная осечка терпится. Всё верно или сплошные осечки → граничные значения.
 */
export function placementUnit(results) {
  const n = results.length;
  if (!n) return 0;
  for (let i = 0; i < n; i++) if (!results[i] && (i === n - 1 || !results[i + 1])) return i;
  return n - 1;
}

/** Применяет выбор стартового юнита: юниты 1..N открыты, уроки до N засчитаны (мастерство 2, со временем «потрескаются» и придут в повторение). */
export function applyStart(cs, course, unitIndex, now = Date.now()) {
  const n = Math.max(0, Math.min(unitIndex, course.units.length - 1));
  for (let i = 1; i <= n; i++) {
    const u = course.units[i];
    cs.units[u.id] = { ...cs.units[u.id], placement: cs.units[u.id]?.placement || { at: now, acc: 1, passed: true, onboarding: true } };
  }
  for (let i = 0; i < n; i++) for (const l of course.units[i].lessons) grantMastery(cs, l.id, 2, now);
  return n;
}

// --- фраза ---------------------------------------------------------------------------------------

/** Две разные группы по 5 символов (индексы 0–4) для мини-проверки, по возрастанию. */
export function pickCheckGroups(rnd = Math.random) {
  const a = Math.floor(rnd() * 5);
  let b = Math.floor(rnd() * 4);
  if (b >= a) b++;
  return [a, b].sort((x, y) => x - y);
}

/** answers — тексты полей в порядке indices; регистр и пробелы не важны. */
export function checkGroups(phrase, indices, answers) {
  const groups = String(phrase || '').match(/.{1,5}/g) || [];
  return indices.length === answers.length && indices.every((g, k) => {
    const given = String(answers[k] ?? '').toUpperCase().replace(/[\s\-–—_.]/g, '');
    return given.length === 5 && given === groups[g];
  });
}

/** Извлекает фразу из введённого текста или ссылки «…#/join/<фраза>». */
export function phraseFromInput(text) {
  const s = String(text ?? '');
  const m = /#\/join\/([^\s?#]+)/.exec(s);
  return m ? decodeURIComponent(m[1]) : s;
}
