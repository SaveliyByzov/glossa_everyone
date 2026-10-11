// Геймификация: XP, дневная цель, серия (дни с выполненной целью) с заморозками и «отпуском»,
// достижения и звания. Функции мутируют объект состояния store.state; сохраняет вызывающий.
// Принципы (docs/PEDAGOGY.md §7): никаких штрафов, таймеров и «жизней».

import { config } from './config.js';
import { dayKey, daysBetween } from './util.js';
import { isMature } from './srs.js';

export function todayXp(state, today = dayKey()) { return state.stats.xpByDay[today] || 0; }

export function dailyGoal(state, cfg = config) {
  return state.settings.dailyGoal || cfg.defaultDailyGoal || cfg.defaultGoal || cfg.dailyGoals?.[1] || 50;
}

const maxFreezes = (cfg) => cfg.streak?.maxFreezes ?? cfg.streak?.freezes ?? 2;

function ensureStreak(state, cfg) {
  const st = state.stats.streak;
  if (st.freezes == null) st.freezes = maxFreezes(cfg);
  st.vacations ||= [];
  return st;
}

/** Дни между lastDay и today (не включая концы), не покрытые «отпуском». */
function missedDays(st, today) {
  const gap = daysBetween(st.lastDay, today) - 1;
  if (gap <= 0) return 0;
  let missed = 0;
  for (let i = 1; i <= gap; i++) {
    const d = shiftDay(st.lastDay, i);
    if (!st.vacations.some((v) => d >= v.from && d <= v.to)) missed++;
  }
  return missed;
}

export function shiftDay(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

/** День с выполненной целью: продлевает серию, тратит заморозки за пропуски, начисляет новые. */
export function touchStreak(state, today = dayKey(), cfg = config) {
  const st = ensureStreak(state, cfg);
  if (st.lastDay === today) return { changed: false, usedFreezes: 0 };
  let usedFreezes = 0;
  if (!st.lastDay) st.count = 1;
  else {
    const missed = missedDays(st, today);
    if (missed === 0) st.count += 1;
    else if (missed <= st.freezes) { st.freezes -= missed; usedFreezes = missed; st.count += 1; }
    else st.count = 1;
  }
  st.lastDay = today;
  st.best = Math.max(st.best || 0, st.count);
  const every = cfg.streak?.earnFreezeEvery ?? 7;
  if (every && st.count % every === 0 && st.freezes < maxFreezes(cfg)) st.freezes += 1;
  return { changed: true, usedFreezes };
}

/** Серия «на сегодня»: жива, если пропусков не больше, чем заморозок. */
export function currentStreak(state, today = dayKey(), cfg = config) {
  const st = ensureStreak(state, cfg);
  if (!st.lastDay) return 0;
  // сегодняшний день ещё не закончился — он не считается пропущенным (missedDays не включает today)
  return missedDays(st, today) <= st.freezes ? st.count : 0;
}

/** Серия оборвалась (для нейтрального сообщения с рекордом). */
export function streakBroken(state, today = dayKey(), cfg = config) {
  const st = ensureStreak(state, cfg);
  return !!st.lastDay && st.count > 0 && currentStreak(state, today, cfg) === 0;
}

// --- отпуск ------------------------------------------------------------------------

export function vacationLeft(state, year = new Date().getFullYear(), cfg = config) {
  const st = ensureStreak(state, cfg);
  const used = st.vacations
    .filter((v) => v.from.startsWith(String(year)))
    .reduce((n, v) => n + daysBetween(v.from, v.to) + 1, 0);
  return Math.max(0, (cfg.streak?.vacationDays ?? 14) - used);
}

export function activeVacation(state, today = dayKey()) {
  return (state.stats.streak.vacations || []).find((v) => today >= v.from && today <= v.to) || null;
}

/** Пауза серии на days дней начиная с завтрашнего дня. */
export function startVacation(state, days, today = dayKey(), cfg = config) {
  const n = Math.min(days, vacationLeft(state, undefined, cfg));
  if (n <= 0) return null;
  const v = { from: shiftDay(today, 1), to: shiftDay(today, n) };
  ensureStreak(state, cfg).vacations.push(v);
  return v;
}

export function endVacation(state, today = dayKey()) {
  const v = activeVacation(state, today) || (state.stats.streak.vacations || []).find((x) => x.from > today);
  if (!v) return;
  if (v.from > today) state.stats.streak.vacations = state.stats.streak.vacations.filter((x) => x !== v);
  else v.to = shiftDay(today, -1) < v.from ? v.from : shiftDay(today, -1);
}

// --- XP ------------------------------------------------------------------------------

/**
 * Начисляет XP; отмечает курс дня; если дневная цель выполнена впервые за день — продлевает серию.
 * @returns {{ goalReached: boolean }}
 */
export function addXp(state, amount, { today = dayKey(), courseId = null, cfg = config } = {}) {
  const s = state.stats;
  if (courseId) {
    s.coursesByDay ||= {};
    const list = s.coursesByDay[today] ||= [];
    if (!list.includes(courseId)) list.push(courseId);
    // храним только последние ~60 дней
    const keys = Object.keys(s.coursesByDay);
    if (keys.length > 60) for (const k of keys.sort().slice(0, keys.length - 60)) delete s.coursesByDay[k];
  }
  if (!amount) return { goalReached: false };
  const before = todayXp(state, today);
  s.xpTotal += amount;
  s.xpByDay[today] = before + amount;
  return checkGoal(state, today, cfg);
}

/** Проверка цели (также после смены цели в настройках). */
export function checkGoal(state, today = dayKey(), cfg = config) {
  const st = ensureStreak(state, cfg);
  if (st.lastDay === today) return { goalReached: false };
  if (todayXp(state, today) < dailyGoal(state, cfg)) return { goalReached: false };
  state.stats.goalDays = (state.stats.goalDays || 0) + 1;
  touchStreak(state, today, cfg);
  return { goalReached: true };
}

// --- достижения и звания ----------------------------------------------------------

/** Значение метрики для правила достижения; null — неизвестный тип (игнорируется). */
export function metric(state, rule, cfg = config) {
  const s = state.stats;
  const courses = Object.values(state.courses);
  const skillLevelsAll = () => Object.assign({}, ...courses.map((c) => c.skillLevels || {}));
  switch (rule?.type) {
    case 'xpTotal': return s.xpTotal;
    case 'streak': return Math.max(s.streak.best || 0, s.streak.count || 0);
    case 'goalDays': return s.goalDays || 0;
    case 'lessons': return s.lessonsCompleted;
    case 'perfect': return s.perfectLessons;
    case 'reviews': return s.reviews;
    case 'mistakesFixed': return s.mistakesFixed || 0;
    case 'bossPassed': return s.bossPassed || 0;
    case 'bossPerfect': return s.bossPerfect || 0;
    case 'placementPassed': return s.placementPassed || 0;
    case 'courses': return courses.filter((c) => Object.values(c.lessons).some((l) => l.done)).length;
    case 'coursesInDay': return Math.max(0, ...Object.values(s.coursesByDay || {}).map((l) => l.length));
    case 'wordsMature': {
      const mi = cfg.srs?.matureInterval ?? 21;
      return courses.reduce((n, c) => n + Object.entries(c.srs).filter(([k, card]) => k.startsWith('v:') && isMature(card, mi)).length, 0);
    }
    case 'skillMastery': {
      const lvl = rule.level ?? 4;
      return Object.values(skillLevelsAll()).filter((m) => m >= lvl).length;
    }
    case 'skillSet': {
      const lvl = rule.level ?? 4;
      const levels = skillLevelsAll();
      const ids = Array.isArray(rule.value) ? rule.value : [];
      return ids.filter((id) => (levels[id] ?? 0) >= lvl).length;
    }
    default: return null;
  }
}

function target(rule) { return Array.isArray(rule.value) ? rule.value.length : rule.value; }

export function achievementProgress(state, ach, cfg = config) {
  const v = metric(state, ach.rule, cfg);
  if (v == null) return null;
  const t = target(ach.rule) || 1;
  return { value: Math.min(v, t), target: t, ratio: Math.min(1, v / t) };
}

/** Отмечает новые достижения; возвращает список только что полученных. */
export function checkAchievements(state, cfg = config) {
  const earned = [];
  for (const ach of cfg.achievements || []) {
    if (state.achievements[ach.id]) continue;
    const p = achievementProgress(state, ach, cfg);
    if (p && p.value >= p.target) { state.achievements[ach.id] = Date.now(); earned.push(ach); }
  }
  return earned;
}

export function rankFor(xp, cfg = config) {
  const ranks = [...(cfg.ranks || [])].sort((a, b) => a.xp - b.xp);
  let current = ranks[0] || { xp: 0, title: '—' };
  let next = null;
  for (const r of ranks) { if (xp >= r.xp) current = r; else { next = r; break; } }
  return { current, next };
}
