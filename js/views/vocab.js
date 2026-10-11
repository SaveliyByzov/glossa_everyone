// Словарь курса: поиск (слово, формы, перевод), фильтры (к повтору, по уроку), озвучка, «зрелость» слова.
import { h, icon, clear } from '../dom.js';
import { store } from '../store.js';
import { loadCourse } from '../courses.js';
import { renderInline, stripMarkup } from '../markup.js';
import { normalize } from '../answer.js';
import { speakerFor } from '../tts.js';
import { view, empty, mastery } from './common.js';
import { speakBtn } from './theory.js';

const POS = { n: 'сущ.', v: 'гл.', adj: 'прил.', adv: 'нареч.', pron: 'мест.', prep: 'предл.', conj: 'союз', num: 'числ.', part: 'част.', phr: 'выраж.' };
const GEN = { m: 'm.', f: 'f.', n: 'n.', c: 'c.' };

/** Уровень 0–5 по SRS-карточке слова: учу → 1, далее по интервалу. */
function wordLevel(card) {
  if (!card) return null;
  if (card.step !== -1) return 1;
  return card.interval < 3 ? 2 : card.interval < 7 ? 3 : card.interval < 21 ? 4 : 5;
}

export async function render({ cid }) {
  const course = await loadCourse(cid);
  if (!course) return { el: view('vocab', empty({ title: 'Курс недоступен', action: { href: '#/', label: 'К курсам' } })), title: 'Словарь', tab: 'words', back: `#/c/${cid}/words` };
  store.update((s) => { s.lastCourse = cid; });
  const cs = store.state.courses[cid];
  const ctx = { lang: course.tts || cid, speak: speakerFor(course) };
  const el = view('vocab');
  const meta = { el, title: 'Словарь', tab: 'words', lang: cid, back: `#/c/${cid}/words`, stats: h('span', { class: 'badge' }, `${course.allVocab.length} слов`) };

  if (!course.allVocab.length) {
    el.append(empty({ title: 'Словарь пуст', text: 'Лексика появится вместе с уроками.' }));
    return meta;
  }

  const now = Date.now();
  const isDue = (v) => (cs?.srs?.[`v:${v.id}`]?.due ?? Infinity) <= now;
  const dueN = course.allVocab.filter(isDue).length;

  const search = h('input', { class: 'input input--search', type: 'search', placeholder: 'Слово или перевод', 'aria-label': 'Поиск по словарю', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
  let filter = '';
  const chips = h('div', { class: 'chip-row chip-row--scroll', role: 'group', 'aria-label': 'Фильтр' });
  const chip = (id, label) => {
    const b = h('button', { class: 'chip', type: 'button', 'aria-pressed': String(id === filter) }, label);
    b.addEventListener('click', () => { filter = id; for (const c of chips.children) c.setAttribute('aria-pressed', String(c === b)); draw(); });
    return b;
  };
  chips.append(chip('', 'Все'));
  if (dueN) chips.append(chip(':due', `К повтору ${dueN}`));
  for (const l of course.allLessons.filter((x) => x.vocab.length)) chips.append(chip(l.id, `${l.unitIndex + 1}.${l.lessonIndex + 1} ${stripMarkup(l.title || '')}`));
  el.append(h('div', { class: 'vocab-tools' }, h('label', { class: 'search' }, icon('search'), search), chips));

  const list = h('div', { class: 'dict' });
  el.append(list);

  // поисковый индекс: по политике курса (кириллица = латиница) + русский перевод
  const index = course.allVocab.map((v) => ({
    v,
    key: `${normalize(`${v.w} ${v.forms || ''}`, course.answer)} ${normalize(v.ru, { ignoreCase: true })}`,
  }));
  let collator;
  try { collator = new Intl.Collator(cid, { sensitivity: 'base' }); } catch { collator = new Intl.Collator(); }
  const sortKey = (v) => stripMarkup(v.w);

  // буква-рубрика: первая буква слова (пропуская «-» у энклитик), без макрона/бревиса (ā → A),
  // но č, å, æ и т.п. остаются отдельными буквами алфавита
  const headLetter = (w) => (w.match(/\p{L}/u)?.[0] || '#').normalize('NFD').replace(/[\u0304\u0306]/g, '').normalize('NFC').toLocaleUpperCase();

  function draw() {
    const q = normalize(search.value, course.answer);
    const q2 = normalize(search.value, { ignoreCase: true });
    const found = index
      .filter(({ v, key }) => (filter === ':due' ? isDue(v) : !filter || v.lessonId === filter) && (!q || key.includes(q) || key.includes(q2)))
      .map((x) => x.v)
      .sort((a, b) => collator.compare(sortKey(a), sortKey(b)));
    clear(list);
    if (!found.length) { list.append(empty({ title: 'Ничего не найдено' })); return; }
    let letter = null;
    for (const v of found.slice(0, 500)) {
      const first = headLetter(sortKey(v));
      if (first !== letter && !q) { letter = first; list.append(h('h3', { class: 'dict__letter', lang: ctx.lang }, letter)); }
      list.append(entry(v));
    }
  }

  function entry(v) {
    const lvl = wordLevel(cs?.srs?.[`v:${v.id}`]);
    const pos = [POS[v.pos], GEN[v.g]].filter(Boolean).join(' ');
    return h('article', { class: ['entry', isDue(v) && 'is-due'] },
      h('p', { class: 'entry__head', lang: ctx.lang },
        h('span', { class: 'entry__word' }, renderInline(v.w)), ' ',
        pos ? h('span', { class: 'entry__pos' }, pos) : null, ' ',
        v.forms ? h('span', { class: 'entry__forms' }, renderInline(v.forms)) : null),
      h('p', { class: 'entry__gloss' }, renderInline(v.ru)),
      v.ex ? h('p', { class: 'entry__ex' }, h('span', { class: 'tl', lang: ctx.lang }, renderInline(v.ex)), v.exRu ? ` — ${stripMarkup(v.exRu)}` : '') : null,
      v.note ? h('p', { class: 'entry__ex' }, renderInline(v.note)) : null,
      h('div', { class: 'entry__side' }, speakBtn(v.w, ctx, `Озвучить ${stripMarkup(v.w)}`), lvl != null ? mastery(lvl) : null));
  }

  search.addEventListener('input', draw);
  draw();
  return meta;
}
