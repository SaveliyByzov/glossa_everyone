#!/usr/bin/env node
// Валидатор данных курсов по CONTRACT.md (+ расширениям из docs/PEDAGOGY.md).
// Запуск: node tools/validate.mjs [sr] [--strict]
//   без аргументов — все курсы из data/courses.js; --strict — предупреждения тоже дают код выхода 1.
// Проверяет: схему index/юнитов/уроков/теории/лексики, уникальность id, все 9 типов упражнений
// (индексы answer, ___ = answers, blanks в пределах таблицы, wrong в пределах tokens…),
// самопроверку ответов движком (эталон должен засчитываться), ссылки на навыки, разметку.

import { access } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { checkAnswer, normalize } from '../js/answer.js';
import { parseInline } from '../js/markup.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DATA = join(ROOT, 'data');

const KINDS = ['grammar', 'vocab', 'reading', 'review'];
const POS = ['n', 'v', 'adj', 'adv', 'pron', 'prep', 'conj', 'num', 'part', 'phr'];
const GENDERS = ['m', 'f', 'n', 'c'];
const BLOCKS = { h: ['text'], p: ['text'], rule: ['text'], contrast: ['text'], tip: ['text'], pitfall: ['text'], table: ['rows'], examples: ['items'] };
const TYPES = ['choice', 'cloze', 'translate', 'order', 'match', 'paradigm', 'classify', 'transform', 'fix'];
const RULES = ['xpTotal', 'streak', 'lessons', 'perfect', 'skillMastery', 'reviews', 'courses', 'goalDays', 'mistakesFixed', 'bossPassed', 'bossPerfect', 'wordsMature', 'coursesInDay', 'placementPassed', 'skillSet'];

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isArr = Array.isArray;
const exists = (p) => access(p).then(() => true, () => false);

export function createReport() {
  const items = [];
  return {
    items,
    error: (where, msg) => items.push({ level: 'error', where, msg }),
    warn: (where, msg) => items.push({ level: 'warn', where, msg }),
    get errors() { return items.filter((i) => i.level === 'error').length; },
    get warnings() { return items.filter((i) => i.level === 'warn').length; },
  };
}

/** Разметка: незакрытые маркеры и HTML-теги. */
function checkMarkup(r, where, text) {
  if (typeof text !== 'string') return;
  if (/<\/?[a-z][^>]*>/i.test(text)) r.warn(where, `похоже на HTML в тексте: «${text.slice(0, 50)}»`);
  // незакрытые ** / {{ остаются литералами — значит, автор ошибся
  const flat = JSON.stringify(parseInline(text));
  if (/\*\*|\{\{|\}\}/.test(flat.replace(/\\\\\*/g, ''))) r.warn(where, `незакрытая разметка (** или {{ }}): «${text.slice(0, 60)}»`);
}

function walkStrings(r, where, obj) {
  if (typeof obj === 'string') return checkMarkup(r, where, obj);
  if (isArr(obj)) obj.forEach((x, i) => walkStrings(r, `${where}[${i}]`, x));
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) if (k !== 'id') walkStrings(r, `${where}.${k}`, v);
}

// --- курс ---------------------------------------------------------------------------------

export function validateCourse(course, { lang, report = createReport(), exFiles = {} } = {}) {
  const r = report;
  const at = (s) => `${lang}/${s}`;
  if (!course || typeof course !== 'object') { r.error(at('index.js'), 'нет export default'); return r; }
  for (const f of ['id', 'name', 'nameRu']) if (!isStr(course[f])) r.error(at('index.js'), `нет поля ${f}`);
  if (lang && course.id && course.id !== lang) r.error(at('index.js'), `id «${course.id}» не совпадает с папкой «${lang}»`);
  if (!['review', 'learn'].includes(course.mode)) r.error(at('index.js'), `mode должен быть 'review' | 'learn', а не «${course.mode}»`);
  if (course.keyboard && !isArr(course.keyboard)) r.error(at('index.js'), 'keyboard должен быть массивом символов');
  const ans = course.answer || {};
  if (ans.optionalMarks && !isArr(ans.optionalMarks)) r.error(at('index.js'), 'answer.optionalMarks — массив');
  if (ans.equivalents && (!isArr(ans.equivalents) || ans.equivalents.some((g) => !isArr(g) || g.length < 2))) r.error(at('index.js'), 'answer.equivalents — массив пар [[a, b], …]');
  if (ans.script != null && ans.script !== 'sr') r.warn(at('index.js'), `answer.script «${ans.script}» неизвестен движку`);
  const skills = course.skills || {};
  for (const [id, s] of Object.entries(skills)) if (!isStr(s?.name)) r.error(at('index.js'), `навык ${id}: нет name`);
  if (!isArr(course.units) || !course.units.length) { r.error(at('index.js'), 'units пуст или не массив'); return r; }

  const unitIds = new Set(), lessonIds = new Set(), vocabIds = new Map();
  const usedSkills = new Set();
  course.units.forEach((unit, ui) => {
    const num = /u(\d+)$/.exec(unit?.id || '')?.[1] || String(ui + 1).padStart(2, '0');
    const uf = at(`u${num}.js`);
    if (!isStr(unit?.id)) { r.error(uf, `юнит #${ui + 1}: нет id`); return; }
    if (unitIds.has(unit.id)) r.error(uf, `повтор id юнита ${unit.id}`);
    unitIds.add(unit.id);
    if (!isStr(unit.title) && !isStr(unit.titleRu)) r.error(uf, `${unit.id}: нет title/titleRu`);
    if (!isArr(unit.lessons) || !unit.lessons.length) { r.error(uf, `${unit.id}: lessons пуст`); return; }

    const lessonsHere = new Set();
    unit.lessons.forEach((l, li) => {
      const w = `${uf} › ${l?.id || `урок #${li + 1}`}`;
      if (!isStr(l?.id)) { r.error(w, 'нет id урока'); return; }
      if (lessonIds.has(l.id)) r.error(w, `повтор id урока ${l.id}`);
      lessonIds.add(l.id); lessonsHere.add(l.id);
      if (!KINDS.includes(l.kind)) r.error(w, `kind должен быть ${KINDS.join('|')}, а не «${l.kind}»`);
      if (!isStr(l.title)) r.error(w, 'нет title');
      if (l.goals && !isArr(l.goals)) r.error(w, 'goals — массив строк');
      for (const s of l.skills || []) { usedSkills.add(s); if (!skills[s]) r.warn(w, `навык «${s}» не описан в skills курса`); }
      (l.theory || []).forEach((b, bi) => validateBlock(r, `${w} › theory[${bi}]`, b));
      if (l.kind === 'reading' && (!l.text || !isArr(l.text.lines) || !l.text.lines.length)) r.warn(w, 'урок чтения без text.lines');
      for (const [i, line] of (l.text?.lines || []).entries()) if (!isStr(line?.t)) r.error(`${w} › text.lines[${i}]`, 'нет t');
      (l.vocab || []).forEach((v, vi) => {
        const vw = `${w} › vocab[${vi}]${v?.id ? ` ${v.id}` : ''}`;
        if (!isStr(v?.id)) { r.error(vw, 'нет id лексемы'); return; }
        if (vocabIds.has(v.id)) r.error(vw, `повтор id лексемы (уже в ${vocabIds.get(v.id)})`);
        vocabIds.set(v.id, l.id);
        if (lang && !v.id.startsWith(`${lang}-`)) r.warn(vw, `id лексемы должен начинаться с «${lang}-»`);
        if (!isStr(v.w)) r.error(vw, 'нет w');
        if (!isStr(v.ru)) r.error(vw, 'нет ru');
        if (v.pos && !POS.includes(v.pos)) r.error(vw, `pos «${v.pos}» не из ${POS.join(', ')}`);
        if (v.g && !GENDERS.includes(v.g)) r.error(vw, `g «${v.g}» не из ${GENDERS.join(', ')}`);
      });
      if (!(l.theory || []).length && !(l.vocab || []).length && !l.text) r.warn(w, 'урок без теории, лексики и текста');
      walkStrings(r, w, { title: l.title, goals: l.goals, theory: l.theory, vocab: l.vocab, text: l.text });
    });

    // упражнения
    const ex = unit.exercises ?? exFiles[unit.id];
    const ef = at(`u${num}.ex.js`);
    if (ex == null) return;
    if (typeof ex !== 'object' || isArr(ex)) { r.error(ef, 'export default должен быть объектом { lessonId: [...] }'); return; }
    for (const [lid, list] of Object.entries(ex)) {
      if (!lessonsHere.has(lid)) r.error(ef, `ключ «${lid}» — нет такого урока в юните ${unit.id}`);
      if (!isArr(list)) { r.error(`${ef} › ${lid}`, 'упражнения — массив'); continue; }
      const lesson = unit.lessons.find((l) => l.id === lid);
      list.forEach((e, i) => validateExercise(r, `${ef} › ${lid}[${i}]${e?.type ? ` (${e.type})` : ''}`, e, { course, lesson, usedSkills }));
      if (list.length) {
        const types = new Set(list.map((e) => e?.type));
        if (list.length >= 8 && types.size < 4) r.warn(`${ef} › ${lid}`, `всего ${types.size} типа упражнений (рекомендуется ≥ 4)`);
        let run = 1;
        for (let k = 1; k < list.length; k++) { run = list[k]?.type === list[k - 1]?.type ? run + 1 : 1; if (run === 4) r.warn(`${ef} › ${lid}[${k}]`, 'больше 3 упражнений одного типа подряд'); }
      }
    }
  });
  for (const id of Object.keys(skills)) if (!usedSkills.has(id)) r.warn(at('index.js'), `навык «${id}» нигде не используется`);
  return r;
}

function validateBlock(r, w, b) {
  if (!b || !BLOCKS[b.type]) { r.error(w, `неизвестный тип блока «${b?.type}» (есть: ${Object.keys(BLOCKS).join(', ')})`); return; }
  for (const f of BLOCKS[b.type]) if (b[f] == null) r.error(w, `${b.type}: нет поля ${f}`);
  if (b.type === 'table') {
    if (!isArr(b.rows) || !b.rows.every(isArr)) { r.error(w, 'table.rows — массив массивов'); return; }
    const width = b.head?.length || b.rows[0]?.length;
    b.rows.forEach((row, i) => { if (row.length !== width) r.warn(`${w}.rows[${i}]`, `в строке ${row.length} ячеек, ожидается ${width}`); });
  }
  if (b.type === 'examples') (b.items || []).forEach((it, i) => { if (!isStr(it?.t)) r.error(`${w}.items[${i}]`, 'нет t'); });
}

// --- упражнения ---------------------------------------------------------------------------

const RU_POLICY = { ignoreCase: true, equivalents: [['е', 'ё']] };
const alts = (a) => (isArr(a) ? a : [a]);

/** Эталон должен засчитываться самим движком (ловит опечатки в answers и конфликт с политикой). */
function selfCheck(r, w, answers, policy) {
  for (const a of answers) if (!checkAnswer(a, answers, policy).correct) r.error(w, `ответ «${a}» не проходит проверку движка`);
  const norms = answers.map((a) => normalize(a, policy));
  if (new Set(norms).size < norms.length) r.warn(w, 'дубликаты ответов после нормализации');
}

export function validateExercise(r, w, e, { course, lesson, usedSkills } = {}) {
  if (!e || typeof e !== 'object') { r.error(w, 'не объект'); return; }
  if (!TYPES.includes(e.type)) { r.error(w, `неизвестный type «${e.type}»`); return; }
  const policy = course?.answer || {};
  if (![1, 2, 3].includes(e.level)) r.warn(w, `level должен быть 1–3 (сейчас ${e.level})`);
  if (e.skill) { usedSkills?.add(e.skill); if (course?.skills && !course.skills[e.skill]) r.warn(w, `навык «${e.skill}» не описан в skills`); }
  if (!isStr(e.explain)) (lesson?.kind === 'grammar' || lesson?.kind === 'review' ? r.error : r.warn)(w, 'нет explain (для грамматики обязателен)');
  walkStrings(r, w, e);

  switch (e.type) {
    case 'choice':
      if (!isArr(e.options) || e.options.length < 2) { r.error(w, 'options: нужно ≥ 2 вариантов'); break; }
      if (!Number.isInteger(e.answer) || e.answer < 0 || e.answer >= e.options.length) r.error(w, `answer=${e.answer} вне диапазона 0…${e.options.length - 1}`);
      // варианты сравниваем буквально: различие может быть в алфавите, диакритике или регистре
      if (new Set(e.options.map((o) => o.trim())).size < e.options.length) r.error(w, 'одинаковые варианты в options');
      if (e.options.length > 9) r.warn(w, 'больше 9 вариантов — не хватит клавиш 1–9');
      break;
    case 'cloze': {
      if (!isStr(e.text)) { r.error(w, 'нет text'); break; }
      const blanks = e.text.split('___').length - 1;
      if (!blanks) r.error(w, 'в text нет ни одного ___');
      if (blanks === 1 && isArr(e.answers) && e.answers.length > 1 && e.answers.every(isStr)) {
        // частая форма записи альтернатив для одного пропуска: движок понимает, но по контракту — [[...]]
        r.warn(w, `один пропуск и ${e.answers.length} ответа: альтернативы пишите как answers: [[${e.answers.map((a) => `'${a}'`).join(', ')}]]`);
        selfCheck(r, w, e.answers, policy);
        break;
      }
      if (!isArr(e.answers) || e.answers.length !== blanks) r.error(w, `пропусков ___: ${blanks}, а answers: ${isArr(e.answers) ? e.answers.length : '—'}`);
      (e.answers || []).forEach((a, i) => { if (!alts(a).every(isStr)) r.error(w, `answers[${i}] пуст`); else selfCheck(r, `${w} answers[${i}]`, alts(a), policy); });
      break;
    }
    case 'translate':
      if (!['toTarget', 'toRu'].includes(e.dir)) r.error(w, `dir должен быть 'toTarget' | 'toRu'`);
      if (!isStr(e.q)) r.error(w, 'нет q');
      if (!isArr(e.answers) || !e.answers.length || !e.answers.every(isStr)) r.error(w, 'answers: нужен непустой массив строк');
      else selfCheck(r, w, e.answers, e.dir === 'toRu' ? RU_POLICY : policy);
      break;
    case 'order': {
      if (!isArr(e.tokens) || e.tokens.length < 2 || !e.tokens.every(isStr)) { r.error(w, 'tokens: нужно ≥ 2 непустых плиток'); break; }
      if (e.tokens.length + (e.distractors?.length || 0) > 9) r.warn(w, 'больше 9 плиток — не хватит клавиш 1–9 (и > 8 не рекомендуется)');
      // alt — другой допустимый порядок; может использовать не все плитки (напр., опущенное местоимение),
      // но только те, что есть в банке, и не чаще, чем они там есть
      const bank = [...e.tokens, ...(e.distractors || [])];
      (e.alt || []).forEach((a, i) => {
        if (!isArr(a)) { r.error(w, `alt[${i}] — массив токенов`); return; }
        const left = [...bank];
        for (const t of a) {
          const k = left.indexOf(t);
          if (k < 0) { r.error(w, `alt[${i}]: плитки «${t}» нет в tokens/distractors`); return; }
          left.splice(k, 1);
        }
      });
      for (const d of e.distractors || []) if (e.tokens.includes(d)) r.warn(w, `дистрактор «${d}» совпадает с плиткой ответа`);
      break;
    }
    case 'match':
      if (!isArr(e.pairs) || !e.pairs.every((p) => isArr(p) && p.length === 2 && p.every(isStr))) { r.error(w, 'pairs: массив пар [строка, строка]'); break; }
      if (e.pairs.length < 2) r.error(w, 'pairs: нужно ≥ 2 пар');
      else if (e.pairs.length < 4 || e.pairs.length > 6) r.warn(w, `pairs: ${e.pairs.length} пар (рекомендуется 4–6)`);
      for (const side of [0, 1]) {
        const vals = e.pairs.map((p) => p[side].toLowerCase());
        if (new Set(vals).size < vals.length) r.warn(w, `повторяющиеся значения в ${side ? 'правой' : 'левой'} колонке`);
      }
      break;
    case 'paradigm': {
      if (!isArr(e.rows) || !e.rows.length || !e.rows.every(isArr)) { r.error(w, 'rows — массив массивов'); break; }
      const width = e.head?.length || e.rows[0].length;
      e.rows.forEach((row, i) => { if (row.length !== width) r.error(w, `rows[${i}]: ${row.length} ячеек, ожидается ${width}`); });
      if (e.blanks === 'all') { if (e.level === 1) r.warn(w, "blanks: 'all' на level 1 не рекомендуется"); break; }
      if (!isArr(e.blanks) || !e.blanks.length) { r.error(w, "blanks: массив [row, col] или 'all'"); break; }
      const seen = new Set();
      e.blanks.forEach((b, i) => {
        if (!isArr(b) || b.length !== 2 || !b.every(Number.isInteger)) { r.error(w, `blanks[${i}] должен быть [row, col]`); return; }
        const [row, col] = b;
        if (row < 0 || row >= e.rows.length) r.error(w, `blanks[${i}]: строка ${row} вне таблицы (0…${e.rows.length - 1})`);
        else if (col < 1 || col >= e.rows[row].length) r.error(w, `blanks[${i}]: колонка ${col} вне таблицы (1…${e.rows[row].length - 1}; колонка 0 — метки)`);
        else if (!isStr(e.rows[row][col]) || /^[—–-]$/.test(e.rows[row][col].trim())) r.error(w, `blanks[${i}]: пустая клетка не может быть пропуском`);
        if (seen.has(`${row}:${col}`)) r.warn(w, `blanks[${i}] повторяется`);
        seen.add(`${row}:${col}`);
      });
      break;
    }
    case 'classify':
      if (!isArr(e.buckets) || e.buckets.length < 2) { r.error(w, 'buckets: нужно ≥ 2 корзин'); break; }
      if (e.buckets.length > 9) r.warn(w, 'больше 9 корзин — не хватит клавиш 1–9');
      if (!isArr(e.items) || !e.items.length) { r.error(w, 'items пуст'); break; }
      e.items.forEach((it, i) => {
        if (!isArr(it) || !isStr(it[0]) || !Number.isInteger(it[1])) r.error(w, `items[${i}] должен быть [строка, индекс корзины]`);
        else if (it[1] < 0 || it[1] >= e.buckets.length) r.error(w, `items[${i}]: корзина ${it[1]} вне диапазона 0…${e.buckets.length - 1}`);
      });
      e.buckets.forEach((_, b) => { if (!e.items.some((it) => it?.[1] === b)) r.warn(w, `корзина ${b} («${e.buckets[b]}») пустая`); });
      break;
    case 'transform':
      if (!isStr(e.instruction)) r.error(w, 'нет instruction');
      if (!isStr(e.source)) r.error(w, 'нет source');
      if (!isArr(e.answers) || !e.answers.length || !e.answers.every(isStr)) r.error(w, 'answers: нужен непустой массив строк');
      else {
        selfCheck(r, w, e.answers, policy);
        if (isStr(e.source) && e.answers.some((a) => normalize(a, policy) === normalize(e.source, policy))) r.warn(w, 'ответ совпадает с source');
      }
      break;
    case 'fix':
      if (!isArr(e.tokens) || e.tokens.length < 2 || !e.tokens.every(isStr)) { r.error(w, 'tokens: нужно ≥ 2 слов'); break; }
      if (!Number.isInteger(e.wrong) || e.wrong < 0 || e.wrong >= e.tokens.length) r.error(w, `wrong=${e.wrong} вне диапазона 0…${e.tokens.length - 1}`);
      if (!isArr(e.answers) || !e.answers.length || !e.answers.every(isStr)) r.error(w, 'answers: нужен непустой массив строк');
      else {
        selfCheck(r, w, e.answers, policy);
        const bad = e.tokens[e.wrong];
        if (bad && e.answers.some((a) => normalize(a, policy) === normalize(bad, policy))) r.error(w, `исправление совпадает с ошибочным словом «${bad}»`);
      }
      if (e.tokens.length > 9) r.warn(w, 'больше 9 слов — клавиши 1–9 охватят не все');
      break;
    default: break;
  }
}

// --- pedagogy ------------------------------------------------------------------------------

export function validatePedagogy(p, r = createReport()) {
  const w = 'pedagogy.js';
  if (!p) { r.warn(w, 'нет файла — будут значения по умолчанию'); return r; }
  const ids = new Set();
  for (const [i, a] of (p.achievements || []).entries()) {
    if (!isStr(a?.id)) { r.error(`${w} › achievements[${i}]`, 'нет id'); continue; }
    if (ids.has(a.id)) r.error(`${w} › achievements[${i}]`, `повтор id ${a.id}`);
    ids.add(a.id);
    if (!RULES.includes(a.rule?.type)) r.warn(`${w} › ${a.id}`, `rule.type «${a.rule?.type}» неизвестен движку`);
  }
  const ranks = p.ranks || [];
  for (let i = 1; i < ranks.length; i++) if (ranks[i].xp <= ranks[i - 1].xp) r.warn(`${w} › ranks[${i}]`, 'xp званий должен расти');
  if (p.mastery?.thresholds && p.mastery.thresholds.length !== (p.mastery.levels ?? 5)) r.error(`${w} › mastery`, 'thresholds.length ≠ levels');
  return r;
}

// --- CLI ------------------------------------------------------------------------------------

async function loadCourseFiles(lang) {
  const dir = join(DATA, lang);
  const indexPath = join(dir, 'index.js');
  if (!await exists(indexPath)) return { missing: true };
  const course = (await import(pathToFileURL(indexPath).href)).default;
  // упражнения, которые индекс не импортировал (движок подтягивает их сам)
  const exFiles = {};
  for (const u of course?.units || []) {
    const num = /u(\d+)$/.exec(u?.id || '')?.[1];
    if (u?.exercises || !num) continue;
    const p = join(dir, `u${num}.ex.js`);
    if (await exists(p)) exFiles[u.id] = (await import(pathToFileURL(p).href)).default;
  }
  return { course, exFiles };
}

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const registry = (await import(pathToFileURL(join(DATA, 'courses.js')).href)).default;
  const langs = args.filter((a) => !a.startsWith('--'));
  const targets = langs.length ? langs : registry.map((c) => c.id);
  const color = process.stdout.isTTY ? { r: '\x1b[31m', y: '\x1b[33m', g: '\x1b[32m', d: '\x1b[2m', x: '\x1b[0m' } : { r: '', y: '', g: '', d: '', x: '' };
  let totalErr = 0, totalWarn = 0;

  for (const lang of targets) {
    const report = createReport();
    let stats = '';
    try {
      const { missing, course, exFiles } = await loadCourseFiles(lang);
      if (missing) { console.log(`${color.y}■ ${lang}${color.x}: нет data/${lang}/index.js — пропуск`); continue; }
      validateCourse(course, { lang, report, exFiles });
      const lessons = (course.units || []).flatMap((u) => u.lessons || []);
      const exCount = (course.units || []).reduce((n, u) => n + Object.values(u.exercises ?? exFiles[u.id] ?? {}).flat().length, 0);
      stats = `${course.units?.length || 0} юн., ${lessons.length} ур., ${lessons.reduce((n, l) => n + (l.vocab?.length || 0), 0)} лексем, ${exCount} упражнений`;
    } catch (err) {
      report.error(`${lang}/index.js`, `не загружается: ${err.message}`);
    }
    totalErr += report.errors; totalWarn += report.warnings;
    const mark = report.errors ? `${color.r}✗` : report.warnings ? `${color.y}!` : `${color.g}✓`;
    console.log(`${mark} ${lang}${color.x} ${color.d}${stats}${color.x} — ошибок: ${report.errors}, предупреждений: ${report.warnings}`);
    for (const it of report.items) console.log(`   ${it.level === 'error' ? `${color.r}ошибка${color.x}` : `${color.y}внимание${color.x}`}  ${it.where}: ${it.msg}`);
  }

  try {
    const ped = (await import(pathToFileURL(join(DATA, 'pedagogy.js')).href)).default;
    const r = validatePedagogy(ped);
    totalErr += r.errors; totalWarn += r.warnings;
    console.log(`${r.errors ? '✗' : r.warnings ? '!' : '✓'} pedagogy.js — ошибок: ${r.errors}, предупреждений: ${r.warnings}`);
    for (const it of r.items) console.log(`   ${it.level === 'error' ? 'ошибка' : 'внимание'}  ${it.where}: ${it.msg}`);
  } catch { console.log('! pedagogy.js не найден — движок возьмёт значения по умолчанию'); }

  console.log(`\nИтого: ошибок ${totalErr}, предупреждений ${totalWarn}`);
  process.exitCode = totalErr || (strict && totalWarn) ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
