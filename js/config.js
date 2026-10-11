// Параметры геймификации/сессий/SRS: data/pedagogy.js (методолог) поверх значений по умолчанию.
// Значения по умолчанию повторяют docs/PEDAGOGY.md, чтобы движок работал и без pedagogy.js.

export const DEFAULTS = {
  xp: {
    correct: 10, firstTry: 5, lessonComplete: 20, perfectLesson: 30, review: 5,
    mistakeFixed: 5, bossPassed: 50, placementPassed: 30, masteredReplayFactor: 0.3,
  },
  dailyGoals: [20, 50, 100, 200],
  defaultDailyGoal: 50,
  streak: { freezes: 2, maxFreezes: 2, earnFreezeEvery: 7, vacationDays: 14 },
  session: {
    lessonLength: 12,
    reviewLength: 15,
    mixOldRatio: 0.2,
    mixOldRatioByMode: { learn: 0.2, review: 0.3 },
    maxSameTypeInRow: 3,
    maxSameSkillInRow: 2,
    retryWrongInLesson: true,
    reviewMix: { mistakes: 0.3, skills: 0.4, vocab: 0.3 },
    crossLanguage: false,
    crossLanguageBlock: [3, 5],
    placement: { length: [8, 12], perSkill: [2, 3], levels: [2, 3], excludeTypes: ['choice', 'match'], passSkill: 0.85, grantMastery: 3 },
    boss: { length: [15, 20], levels: [2, 3], excludeTypes: ['choice', 'match'], pass: 0.8, unlockMastery: { learn: 3, review: 0 }, grantMastery: 4, retryAfterHours: 20 },
    unlockNextLesson: { learn: 3, review: 1 },
  },
  mastery: {
    levels: 5,
    thresholds: [0.6, 0.75, 0.85, 0.9, 0.95],
    window: 3,
    weights: [0.5, 0.3, 0.2],
    spacedForLevel: { 4: 2, 5: 3 },
    decayDays: [3, 7, 14, 30, 60],
    decayGrowth: 2,
    floor: 1,
  },
  srs: {
    algorithm: 'sm2-lite', learningSteps: [10, 1440], graduatingInterval: 3, easyBonus: 1.3,
    startEase: 2.5, minEase: 1.3, lapseEasePenalty: 0.2, almostCorrectFactor: 1.0,
    maxInterval: 180, matureInterval: 21, applyTo: ['vocab', 'skills'], overdueCap: 3,
  },
  mistakes: { clearAfterCorrect: 2, dueSteps: [1, 3], countAlmostAsError: false },
  achievements: [
    { id: 'first-lesson', title: 'Первый шаг', desc: 'Пройти первый урок', icon: '🎓', rule: { type: 'lessons', value: 1 } },
    { id: 'streak-3', title: 'Три дня подряд', desc: 'Серия 3 дня', icon: '🔥', rule: { type: 'streak', value: 3 } },
    { id: 'perfect-1', title: 'Без ошибок', desc: 'Урок без единой ошибки', icon: '✨', rule: { type: 'perfect', value: 1 } },
  ],
  ranks: [
    { xp: 0, title: 'Новичок' },
    { xp: 400, title: 'Ученик' },
    { xp: 2000, title: 'Грамматист' },
  ],
};

function isPlainObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }

/** Глубокое слияние: объекты сливаются, массивы и примитивы заменяются. */
export function deepMerge(base, over) {
  if (!isPlainObject(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = isPlainObject(v) && isPlainObject(base?.[k]) ? deepMerge(base[k], v) : v;
  return out;
}

/** Текущая конфигурация (живая ссылка: модули читают config.xp и т. п.). */
export const config = structuredClone(DEFAULTS);

export function setConfig(over) {
  const merged = deepMerge(DEFAULTS, over || {});
  for (const k of Object.keys(config)) delete config[k];
  Object.assign(config, merged);
  // совместимость: streak.freezes из контракта = maxFreezes, если тот не задан
  if (over?.streak?.freezes != null && over?.streak?.maxFreezes == null) config.streak.maxFreezes = over.streak.freezes;
  return config;
}

export async function loadConfig() {
  try {
    const mod = await import('../data/pedagogy.js');
    setConfig(mod.default);
  } catch (err) {
    console.info('[glossa] data/pedagogy.js недоступен — используются значения по умолчанию.', err?.message);
  }
  return config;
}

/** [min, max] или число → число из диапазона (берём середину ближе к максимуму). */
export function rangeValue(v, fallback) {
  if (Array.isArray(v)) return v[1] ?? v[0] ?? fallback;
  return v ?? fallback;
}
