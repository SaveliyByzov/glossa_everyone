// «Лексика»: хаб тренировки слов — статистика, источник слов, режим, длина сессии. Справочник — views/vocab.js.
import { h, icon, clear } from '../dom.js';
import { store } from '../store.js';
import { config } from '../config.js';
import { loadCourse } from '../courses.js';
import { plural } from '../util.js';
import { stripMarkup } from '../markup.js';
import { view, head, section, empty, progress } from './common.js';
import { MODES, LENGTHS, wordStats, selectWords, sourceOptions, parseSource, formsReady } from '../words.js';

const SOURCES = [
  { id: 'due', label: 'К повтору' },
  { id: 'new', label: 'Новые' },
  { id: 'hard', label: 'Трудные' },
  { id: 'lesson', label: 'По уроку / юниту' },
  { id: 'pos', label: 'По части речи / роду' },
];
const DEFAULT_PREFS = { source: 'due', mode: 'cards', n: 10 };

/** Выбор запоминается между заходами (settings.words — обратно совместимо). */
const loadPrefs = () => ({ ...DEFAULT_PREFS, ...store.state.settings.words });
const savePrefs = (p) => store.update((s) => { s.settings.words = { source: p.source, mode: p.mode, n: p.n }; });
const groupOf = (kind) => (kind === 'unit' ? 'lesson' : kind === 'gender' ? 'pos' : kind);

export async function render({ cid }) {
  const course = await loadCourse(cid);
  const tab = 'words';
  if (!course) return { el: view('words', empty({ title: 'Курс недоступен', action: { href: '#/', label: 'К курсам' } })), title: 'Лексика', tab };
  store.update((s) => { s.lastCourse = cid; });
  const cs = store.course(cid);
  const el = view('words');
  const meta = { el, title: 'Лексика', tab, lang: cid, back: `#/c/${cid}` };
  if (!course.allVocab.length) {
    el.append(head('Лексика', course.nameRu), empty({ title: 'Слов пока нет', text: 'Лексика появится вместе с уроками.' }));
    return meta;
  }

  const now = Date.now();
  const stats = wordStats(course, cs, now, config.srs.matureInterval);
  const opts = sourceOptions(course);
  const prefs = loadPrefs();
  if (!store.state.settings.words && !stats.due && stats.new) prefs.source = 'new';   // первый заход: нечего повторять — предлагаем новые
  if (!SOURCES.some((s) => s.id === groupOf(parseSource(prefs.source).kind))) prefs.source = 'due';
  if (!MODES.some((m) => m.id === prefs.mode)) prefs.mode = 'cards';
  if (!LENGTHS.includes(prefs.n)) prefs.n = 10;

  // --- статистика ---
  const tile = (n, label, mod = '') => h('div', { class: ['words-stat', mod && `words-stat--${mod}`] },
    h('span', { class: 'words-stat__n' }, String(n)), h('span', { class: 'words-stat__label' }, label));
  el.append(head('Лексика', course.nameRu),
    h('div', { class: 'words-hub' },
      h('div', { class: 'words-stats', role: 'group', 'aria-label': 'Статистика слов' },
        tile(stats.new, 'новых'), tile(stats.learning, 'учу'), tile(stats.known, 'выучено', 'ok'), tile(stats.due, 'к повтору', stats.due ? 'due' : '')),
      progress(stats.total ? stats.known / stats.total : 0, '', `Выучено ${stats.known} из ${stats.total}`)));

  // --- источник ---
  const srcRow = h('div', { class: 'chip-row', role: 'radiogroup', 'aria-label': 'Источник слов' });
  const pick = h('div', { class: 'words-pick' });
  const counts = { due: stats.due, new: stats.new, hard: stats.hard };
  const defaultSource = (id) => (id === 'lesson' ? `lesson:${opts.lessons[0]?.id}` : id === 'pos' ? `pos:${opts.pos[0]?.id}` : id);
  const srcButtons = SOURCES.map((s) => {
    const b = h('button', { class: 'chip', type: 'button', role: 'radio', dataset: { src: s.id } },
      s.label, counts[s.id] != null ? h('span', { class: 'chip__n' }, String(counts[s.id])) : null);
    b.addEventListener('click', () => { prefs.source = defaultSource(s.id); sync(); });
    srcRow.append(b);
    return b;
  });

  /** Выпадающий список для «По уроку / юниту» и «По части речи / роду». */
  function select(group) {
    const sel = h('select', { class: 'select', 'aria-label': group === 'lesson' ? 'Урок или юнит' : 'Часть речи или род' });
    const add = (label, items) => {
      if (!items.length) return;
      sel.append(h('optgroup', { label }, items.map(([value, text]) => h('option', { value }, text))));
    };
    if (group === 'lesson') {
      add('Юниты', opts.units.map((u) => [`unit:${u.id}`, `${u.index + 1}. ${stripMarkup(u.title)} · ${u.n}`]));
      add('Уроки', opts.lessons.map((l) => [`lesson:${l.id}`, `${l.unitIndex + 1}.${l.index + 1} ${stripMarkup(l.title)} · ${l.n}`]));
    } else {
      add('Часть речи', opts.pos.map((p) => [`pos:${p.id}`, `${p.title} · ${p.n}`]));
      add('Род', opts.genders.map((g) => [`gender:${g.id}`, `${g.title} · ${g.n}`]));
    }
    sel.value = prefs.source;
    sel.addEventListener('change', () => { prefs.source = sel.value; sync(); });
    return sel;
  }

  // --- режим и длина ---
  const modeRow = h('div', { class: 'words-modes', role: 'radiogroup', 'aria-label': 'Режим' });
  const modeButtons = MODES.map((m) => {
    const b = h('button', { class: 'words-mode', type: 'button', role: 'radio', dataset: { mode: m.id } },
      h('span', { class: 'words-mode__t' }, m.label), h('span', { class: 'words-mode__h' }, m.hint));
    b.addEventListener('click', () => { prefs.mode = m.id; sync(); });
    modeRow.append(b);
    return b;
  });
  const lenRow = h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': 'Длина сессии' });
  const lenButtons = LENGTHS.map((n) => {
    const b = h('button', { class: 'segmented__item', type: 'button', role: 'radio', dataset: { n } }, n ? String(n) : 'Все');
    b.addEventListener('click', () => { prefs.n = n; sync(); });
    lenRow.append(b);
    return b;
  });

  const startBtn = h('a', { class: 'btn btn--primary btn--block', id: 'words-start', href: '#' });
  const note = h('p', { class: 'words-note' });
  el.append(
    section('Что тренировать', null, srcRow, pick),
    section('Режим', null, modeRow),
    section('Сколько слов', null, lenRow),
    h('div', { class: 'view__actions' }, startBtn, note,
      h('a', { class: 'btn btn--outline btn--block', href: `#/c/${cid}/vocab` }, icon('dict'), 'Словарь курса')));

  function emptyReason(kind, mode) {
    if (mode === 'forms') return 'В режиме «Формы» нужны слова с основными формами — выберите другой набор или режим.';
    if (kind === 'due') return 'На сегодня всё повторено. Возьмите «Новые» или тренируйте по уроку.';
    if (kind === 'new') return 'Все слова курса уже в обучении.';
    if (kind === 'hard') return 'Трудных слов пока нет — они появятся после ошибок.';
    return 'В выбранном наборе нет слов.';
  }

  function sync() {
    const kind = parseSource(prefs.source).kind;
    for (const b of srcButtons) b.setAttribute('aria-checked', String(b.dataset.src === groupOf(kind)));
    for (const b of modeButtons) b.setAttribute('aria-checked', String(b.dataset.mode === prefs.mode));
    for (const b of lenButtons) b.setAttribute('aria-checked', String(Number(b.dataset.n) === prefs.n));
    clear(pick);
    if (groupOf(kind) === 'lesson' || groupOf(kind) === 'pos') pick.append(select(groupOf(kind)));

    let words = selectWords(course, cs, prefs.source, { now, limit: prefs.n });
    if (prefs.mode === 'forms') words = formsReady(words, course.allVocab);
    const n = words.length;
    startBtn.textContent = n ? `Начать · ${n} ${plural(n, ['слово', 'слова', 'слов'])}` : 'Нет слов в этом наборе';
    startBtn.classList.toggle('is-disabled', !n);
    startBtn.setAttribute('aria-disabled', String(!n));
    startBtn.setAttribute('href', n ? `#/c/${cid}/words/play/${prefs.mode}/${encodeURIComponent(prefs.source)}/${prefs.n}` : '#');
    note.textContent = n ? '' : emptyReason(kind, prefs.mode);
    savePrefs(prefs);
  }

  startBtn.addEventListener('click', (e) => { if (startBtn.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
  sync();
  return meta;
}
