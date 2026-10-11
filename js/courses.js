// Реестр курсов и их загрузка: динамический import data/<lang>/index.js,
// подтягивание упражнений из uNN.ex.js (если индекс их не импортировал) и построение индексов.

import registry from '../data/courses.js';
import { getScript } from './script.js';

const DATA_BASE = new URL('../data/', import.meta.url);
const cache = new Map();   // id → Promise<course>

const DEFAULT_ANSWER = { ignoreCase: true, optionalMarks: [], equivalents: [], script: null };

/** Записи реестра, видимые пользователю. */
export function listCourses() {
  return registry.filter((c) => !c.hidden);
}

export function registryEntry(id) { return registry.find((c) => c.id === id) || null; }

/** Загружает курс (с кэшем). Возвращает null, если курса нет или он не загрузился. */
export function loadCourse(id) {
  if (!cache.has(id)) {
    cache.set(id, doLoad(id).catch((err) => {
      console.warn(`[glossa] курс «${id}» недоступен:`, err?.message || err);
      cache.delete(id);
      return null;
    }));
  }
  return cache.get(id);
}

/** Пытается загрузить все видимые курсы (для главного экрана). */
export async function loadAll() {
  const list = listCourses();
  const loaded = await Promise.all(list.map((c) => loadCourse(c.id)));
  return list.map((entry, i) => ({ entry, course: loaded[i] }));
}

async function doLoad(id) {
  const entry = registryEntry(id);
  if (!entry) throw new Error('нет в реестре');
  const indexUrl = new URL(entry.path, DATA_BASE);
  const mod = await import(indexUrl.href);
  if (!mod.default || !Array.isArray(mod.default.units)) throw new Error('index.js не экспортирует { units: [...] }');
  // копия: модуль данных общий и неизменяемый для движка
  const raw = { ...mod.default, units: mod.default.units.map((u) => ({ ...u })) };
  await attachMissingExercises(raw, indexUrl);
  return buildCourse(raw, entry);
}

/** Список файлов data/ из сборки (tools/build-sw.mjs); null — список не собран, пробуем наугад. */
let fileList;
async function knownFiles() {
  if (fileList === undefined) {
    try { fileList = new Set((await import('./filelist.js')).default); } catch { fileList = null; }
  }
  return fileList;
}

/** Если юнит пришёл без exercises — подтягиваем data/<lang>/uNN.ex.js рядом с индексом (если он есть). */
async function attachMissingExercises(raw, indexUrl) {
  const files = await knownFiles();
  await Promise.all(raw.units.map(async (unit) => {
    if (unit.exercises || !unit.id) return;
    const m = /u(\d+)$/i.exec(unit.id);
    if (!m) return;
    const url = new URL(`u${m[1]}.ex.js`, indexUrl);
    const rel = decodeURIComponent(url.pathname).replace(/^.*?\/data\//, 'data/');
    if (files && !files.has(rel)) { unit.exercises = {}; return; }
    try {
      unit.exercises = (await import(url.href)).default || {};
    } catch {
      unit.exercises = {}; // упражнений пока нет — будут сгенерированы из лексики
    }
  }));
}

/** Нормализует курс и строит индексы lessonsById / vocabById. */
export function buildCourse(raw, entry = {}) {
  const course = {
    ...raw,
    id: raw.id || entry.id,
    name: raw.name || entry.name || raw.id,
    nameRu: raw.nameRu || entry.nameRu || raw.name,
    mode: raw.mode || entry.mode || 'review',
    keyboard: raw.keyboard || [],
    answer: withDisplay({ ...DEFAULT_ANSWER, ...raw.answer }),
    skills: raw.skills || {},
    tts: raw.tts ?? entry.tts ?? null,
    lessonsById: new Map(),
    vocabById: new Map(),
    allVocab: [],
    allLessons: [],
  };
  course.units = raw.units.map((u, unitIndex) => {
    const unit = { ...u, unitIndex, lessons: [] };
    unit.lessons = (u.lessons || []).map((l, lessonIndex) => {
      const authored = u.exercises?.[l.id] || l.exercises || [];
      const lesson = { ...l, unitId: u.id, unitIndex, lessonIndex, vocab: l.vocab || [], theory: l.theory || [], exercises: authored };
      course.lessonsById.set(l.id, lesson);
      course.allLessons.push(lesson);
      for (const v of lesson.vocab) {
        if (!course.vocabById.has(v.id)) {
          const item = { ...v, lessonId: l.id, unitId: u.id };
          course.vocabById.set(v.id, item);
          course.allVocab.push(item);
        }
      }
      return lesson;
    });
    return unit;
  });
  return course;
}

/** Политика ответов: алфавит показа эталона (policy.display) — живое свойство, следует настройке «латиница / кириллица». */
function withDisplay(policy) {
  if (policy.script === 'sr') Object.defineProperty(policy, 'display', { get: getScript, enumerable: false });
  return policy;
}

/** Метки и пути для UI. */
export function lessonTitle(lesson) { return lesson.title || lesson.id; }
