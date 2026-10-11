// SM2-lite: интервальное повторение по лексемам ('v:<id>') и грамматическим навыкам ('s:<id>'),
// плюс банк ошибок. Чистые функции без DOM.
// Время — миллисекунды; interval — дни; learningSteps — минуты.

export const MIN = 60_000;
export const DAY = 86_400_000;

export const SRS_DEFAULTS = {
  learningSteps: [10, 1440], graduatingInterval: 3, easyBonus: 1.3, startEase: 2.5, minEase: 1.3,
  lapseEasePenalty: 0.2, almostCorrectFactor: 1.0, maxInterval: 180, matureInterval: 21,
};

export function newCard(now = Date.now(), cfg = SRS_DEFAULTS) {
  return { ease: cfg.startEase ?? 2.5, interval: 0, step: 0, due: now, reps: 0, lapses: 0, last: null };
}

/**
 * Пересчитывает карточку после ответа.
 *   again — ошибка: шаг обучения 0, ease − lapseEasePenalty
 *   hard  — «почти верно»: интервал × almostCorrectFactor, ease не меняется
 *   good  — верно: интервал × ease
 *   easy  — уверенно: интервал × ease × easyBonus
 */
export function review(card, grade, now = Date.now(), cfg = SRS_DEFAULTS) {
  const c = { ...SRS_DEFAULTS, ...cfg };
  const steps = c.learningSteps?.length ? c.learningSteps : [10];
  const next = { ...(card || newCard(now, c)) };
  next.reps += 1;
  next.last = now;
  const cap = (d) => Math.min(c.maxInterval, Math.round(d * 10) / 10);

  if (grade === 'again') {
    if (next.step === -1) next.lapses += 1;
    next.step = 0;
    next.interval = 0;
    next.ease = Math.max(c.minEase, next.ease - c.lapseEasePenalty);
    next.due = now + steps[0] * MIN;
    return next;
  }

  if (next.step >= 0) {                       // фаза заучивания
    if (grade === 'hard') { next.due = now + steps[Math.min(next.step, steps.length - 1)] * MIN; return next; }
    next.step += grade === 'easy' ? steps.length : 1;
    if (next.step >= steps.length) {
      next.step = -1;
      next.interval = cap(c.graduatingInterval * (grade === 'easy' ? c.easyBonus : 1));
      next.due = now + next.interval * DAY;
    } else {
      next.due = now + steps[next.step] * MIN;
    }
    return next;
  }

  // фаза повторения
  if (grade === 'hard') next.interval = cap(Math.max(1, next.interval * c.almostCorrectFactor));
  else if (grade === 'easy') next.interval = cap(Math.max(1, next.interval * next.ease * c.easyBonus));
  else next.interval = cap(Math.max(1, next.interval * next.ease));
  next.due = now + next.interval * DAY;
  return next;
}

/** Оценка по одному ответу (лексема). */
export function gradeFromResult({ correct, almost }) {
  if (!correct) return 'again';
  return almost ? 'hard' : 'good';
}

/** Оценка навыка по точности за сессию. */
export function gradeFromAccuracy(acc) {
  if (acc >= 0.9) return 'good';
  if (acc >= 0.6) return 'hard';
  return 'again';
}

/** Ключи карточек со сроком ≤ now — сначала самые просроченные. */
export function dueKeys(srs, now = Date.now(), prefix = '') {
  return Object.entries(srs || {})
    .filter(([k, card]) => k.startsWith(prefix) && card.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([key]) => key);
}

/** Ближайшие «скоро созреют» (ещё не наступили), по возрастанию срока. */
export function upcomingKeys(srs, now = Date.now(), prefix = '') {
  return Object.entries(srs || {})
    .filter(([k, card]) => k.startsWith(prefix) && card.due > now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([key]) => key);
}

export function isMature(card, matureInterval = 21) {
  return !!card && card.step === -1 && card.interval >= matureInterval;
}

/**
 * Load balancing: если просроченного больше cap, «лишние» карточки молча
 * откладываются на 1–3 дня (самые просроченные остаются в очереди).
 */
export function spreadOverdue(srs, now, cap, rnd = Math.random) {
  const due = dueKeys(srs, now);
  if (due.length <= cap) return 0;
  for (const key of due.slice(cap)) srs[key].due = now + (1 + Math.floor(rnd() * 3)) * DAY;
  return due.length - cap;
}

// --- банк ошибок ------------------------------------------------------------------
// Запись: { key, lessonId, index, skill?, vocab?, given?, at, due, count, correctDays: [] }

export const MISTAKE_DEFAULTS = { clearAfterCorrect: 2, dueSteps: [1, 3] };

/** Добавляет ошибку (или обновляет существующую): срок — через dueSteps[0] дней. */
export function addMistake(bank, ref, now = Date.now(), cfg = MISTAKE_DEFAULTS, limit = 300) {
  const steps = cfg.dueSteps?.length ? cfg.dueSteps : [1];
  const found = bank.find((m) => m.key === ref.key);
  if (found) {
    Object.assign(found, ref, { at: now, due: now + steps[0] * DAY, count: found.count + 1, correctDays: [] });
    return found;
  }
  const rec = { ...ref, at: now, due: now + steps[0] * DAY, count: 1, correctDays: [] };
  bank.push(rec);
  if (bank.length > limit) bank.splice(0, bank.length - limit);
  return rec;
}

/**
 * Верный ответ на задание из банка: засчитывается не чаще раза в день;
 * после clearAfterCorrect верных дней запись удаляется. Возвращает true, если ошибка «исправлена».
 */
export function resolveMistake(bank, key, today, now = Date.now(), cfg = MISTAKE_DEFAULTS) {
  const i = bank.findIndex((m) => m.key === key);
  if (i < 0) return false;
  const m = bank[i];
  if (!m.correctDays.includes(today)) m.correctDays.push(today);
  if (m.correctDays.length >= (cfg.clearAfterCorrect ?? 2)) { bank.splice(i, 1); return true; }
  const steps = cfg.dueSteps?.length ? cfg.dueSteps : [1];
  m.due = now + steps[Math.min(m.correctDays.length, steps.length - 1)] * DAY;
  return false;
}
