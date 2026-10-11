// Хранилище прогресса: localStorage['glossa:v1'], миграции схемы, экспорт/импорт JSON.

export const STORAGE_KEY = 'glossa:v1';
export const SCHEMA_VERSION = 1;

export function emptyState() {
  return {
    app: 'glossa',
    version: SCHEMA_VERSION,
    createdAt: Date.now(),
    settings: { theme: 'auto', dailyGoal: null, haptics: true, tts: true, crossLanguage: null, script: 'lat' },
    stats: {
      xpTotal: 0,
      xpByDay: {},             // 'YYYY-MM-DD' → XP
      coursesByDay: {},        // 'YYYY-MM-DD' → [courseId] (для «Полиглота»)
      streak: { count: 0, best: 0, lastDay: null, freezes: null, vacations: [] },
      goalDays: 0,             // дней с выполненной дневной целью
      lessonsCompleted: 0,
      perfectLessons: 0,
      reviews: 0,              // заданий, решённых в повторении
      mistakesFixed: 0,
      bossPassed: 0,
      bossPerfect: 0,
      placementPassed: 0,
      answers: 0,
      correct: 0,
    },
    achievements: {},          // id → timestamp
    lastCourse: null,
    courses: {},               // id → courseState()
  };
}

export function courseState() {
  return {
    lessons: {},               // lessonId → запись мастерства (см. js/mastery.js)
    units: {},                 // unitId → { placement?: {at, acc}, boss?: {passed, perfect, at} }
    srs: {},                   // 'v:<vocabId>' | 's:<skillId>' → карточка SRS
    mistakes: [],              // банк ошибок (см. js/srs.js)
    wordErrors: {},            // vocabId → { n: ошибок всего, streak: верных подряд после последней } (js/words.js)
    seen: {},                  // ключ упражнения → время последнего показа
    skillLevels: {},           // кэш мастерства навыков (для достижений)
    startedAt: Date.now(),
  };
}

/** Миграции: MIGRATIONS[n] переводит схему из версии n в n+1. */
const MIGRATIONS = {
  // 1: (s) => { ...; s.version = 2; return s; },
};

/** Приводит произвольный (возможно, старый или неполный) объект к актуальной схеме. */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object' || raw.app !== 'glossa') throw new Error('Это не файл прогресса Glossa');
  let s = structuredClone(raw);
  let v = Number(s.version) || 1;
  if (v > SCHEMA_VERSION) throw new Error(`Файл создан более новой версией приложения (схема ${v})`);
  while (v < SCHEMA_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) throw new Error(`Нет миграции со схемы ${v}`);
    s = step(s);
    v = s.version;
  }
  // заполняем отсутствующие поля значениями по умолчанию
  const base = emptyState();
  s.settings = { ...base.settings, ...s.settings };
  s.stats = { ...base.stats, ...s.stats, streak: { ...base.stats.streak, ...s.stats?.streak } };
  s.achievements ||= {};
  s.courses ||= {};
  for (const [id, c] of Object.entries(s.courses)) s.courses[id] = { ...courseState(), ...c };
  return s;
}

export function createStore(storage = globalThis.localStorage) {
  let state;
  const listeners = new Set();

  function load() {
    try {
      const raw = storage?.getItem(STORAGE_KEY);
      state = raw ? migrate(JSON.parse(raw)) : emptyState();
    } catch (err) {
      console.warn('[glossa] не удалось прочитать прогресс, начинаем заново', err);
      // не затираем испорченные данные молча — сохраняем копию
      try { storage?.setItem(`${STORAGE_KEY}:broken:${Date.now()}`, storage.getItem(STORAGE_KEY)); } catch {}
      state = emptyState();
    }
    return state;
  }

  function save() {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (err) { console.error('[glossa] не удалось сохранить прогресс', err); }
    for (const fn of listeners) fn(state);
  }

  return {
    get state() { return state ?? load(); },
    load,
    save,
    /** Изменить состояние и сохранить: store.update(s => { s.x = 1 }) */
    update(fn) { fn(this.state); save(); },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    course(id) {
      const s = this.state;
      s.courses[id] ||= courseState();
      return s.courses[id];
    },
    exportJSON() { return JSON.stringify({ ...this.state, exportedAt: new Date().toISOString() }, null, 2); },
    importJSON(text) { state = migrate(JSON.parse(text)); save(); return state; },
    reset() { state = emptyState(); save(); },
  };
}

export const store = createStore();

/** Скачивает прогресс файлом. */
export function downloadBackup() {
  const blob = new Blob([store.exportJSON()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `glossa-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
