// flashcard — карточка слова: лицевая сторона → переворот → самооценка «Забыл / Трудно / Хорошо / Легко».
// Не требует «Проверить» (ctrl.instant): оценка сразу уходит в раннер через ctx.answer(result).
// Управление: тап/пробел — перевернуть, 1–4 или свайп (влево — «Забыл», вправо — «Хорошо») — оценить.
import { h } from '../dom.js';
import { renderInline, stripMarkup } from '../markup.js';
import { root, appendSpeak, digit } from './common.js';

export const GRADES = [
  { id: 'again', label: 'Забыл', mod: 'bad' },
  { id: 'hard', label: 'Трудно', mod: 'almost' },
  { id: 'good', label: 'Хорошо', mod: 'ok' },
  { id: 'easy', label: 'Легко', mod: 'primary' },
];
const POS = { n: 'сущ.', v: 'гл.', adj: 'прил.', adv: 'нареч.', pron: 'мест.', prep: 'предл.', conj: 'союз', num: 'числ.', part: 'част.', phr: 'выраж.' };
const GEN = { m: 'm', f: 'f', n: 'n', c: 'c' };
const SWIPE = 70;      // px до срабатывания свайпа
const TAP = 8;         // сдвиг меньше — это тап

/** Результат для раннера/прогресса: again — ошибка; hard — «почти» (SRS hard); good/easy — верно. */
export function gradeResult(grade, word) {
  const expected = `${stripMarkup(word.w)} — ${stripMarkup(word.ru)}`;
  return { correct: grade !== 'again', almost: grade === 'hard', expected, given: '', grade };
}

export function render(ex, ctx) {
  const w = ex.word;
  const el = root('flashcard', ex, ex.prompt || 'Вспомните значение слова', ctx);
  const tags = [POS[w.pos], GEN[w.g]].filter(Boolean).join(' · ');

  const front = h('div', { class: 'flashcard__face flashcard__face--front' },
    tags ? h('span', { class: 'flashcard__tags' }, tags) : null,
    h('p', { class: 'flashcard__word', lang: ctx.lang }, renderInline(w.w)),
    h('span', { class: 'flashcard__hint' }, 'Тап — перевернуть'));
  const back = h('div', { class: 'flashcard__face flashcard__face--back', 'aria-hidden': 'true', inert: true },
    h('p', { class: 'flashcard__small', lang: ctx.lang }, renderInline(w.w), tags ? h('span', { class: 'flashcard__tags' }, ` ${tags}`) : null),
    h('p', { class: 'flashcard__ru' }, renderInline(w.ru)),
    w.forms ? h('p', { class: 'flashcard__forms', lang: ctx.lang }, renderInline(w.forms)) : null,
    w.ex ? h('p', { class: 'flashcard__ex' }, h('span', { class: 'tl', lang: ctx.lang }, renderInline(w.ex)), w.exRu ? h('span', { class: 'ru' }, renderInline(w.exRu)) : null) : null,
    w.note ? h('p', { class: 'flashcard__note' }, renderInline(w.note)) : null);
  const inner = h('div', { class: 'flashcard__inner' }, front, back);
  const card = h('div', { class: 'flashcard', role: 'button', tabindex: '0', 'aria-pressed': 'false', 'aria-label': 'Карточка слова. Перевернуть: пробел или тап' }, inner);
  const wrap = h('div', { class: 'flashcard-wrap' }, card);
  appendSpeak(wrap, w.w, ctx);
  const speak = wrap.querySelector('.ex__speak');
  speak?.classList.add('flashcard__speak');

  const grades = h('div', { class: 'flashcard__grades', role: 'group', 'aria-label': 'Как хорошо вы помните слово' },
    GRADES.map((g, i) => h('button', { class: `btn btn--${g.mod}`, type: 'button', disabled: true, dataset: { grade: g.id }, onclick: () => grade(g.id) },
      h('span', null, g.label), h('kbd', { class: 'flashcard__key' }, String(i + 1)))));
  el.append(wrap, grades);

  let flipped = false;
  let done = false;

  function flip(to = !flipped) {
    if (done) return;
    flipped = to;
    card.classList.toggle('is-flipped', flipped);
    card.setAttribute('aria-pressed', String(flipped));
    front.inert = flipped; front.setAttribute('aria-hidden', String(flipped));
    back.inert = !flipped; back.setAttribute('aria-hidden', String(!flipped));
    for (const b of grades.children) b.disabled = !flipped;
    ctx.vibrate?.('tick');
  }

  function grade(id) {
    if (done || !flipped) return;
    done = true;
    ctx.answer(gradeResult(id, w));
  }

  // --- тап (click) и свайп (pointer) ---
  let start = null;
  let moved = false;
  card.addEventListener('click', () => { if (moved) { moved = false; return; } flip(); });
  card.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    moved = false;
  });
  card.addEventListener('pointermove', (e) => {
    if (!start || e.pointerId !== start.id) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) < TAP) return;
    moved = true;
    if (!flipped) return;                       // свайпом оценивают только перевёрнутую карточку
    card.classList.add('is-dragging');
    card.style.setProperty('--dx', `${dx}px`);
    card.dataset.swipe = Math.abs(dx) < SWIPE ? '' : dx < 0 ? 'left' : 'right';
  });
  const end = (e) => {
    if (!start || e.pointerId !== start.id) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    start = null;
    card.classList.remove('is-dragging');
    card.style.removeProperty('--dx');
    delete card.dataset.swipe;
    if (e.type !== 'pointercancel' && flipped && Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) grade(dx < 0 ? 'again' : 'good');
  };
  card.addEventListener('pointerup', end);
  card.addEventListener('pointercancel', end);

  return {
    el,
    instant: true,
    ready: () => false,
    check: () => gradeResult('again', w),
    focus() { card.focus({ preventScroll: true }); },
    key(e) {
      const onGrade = e.target?.closest?.('.flashcard__grades button');
      if (e.key === ' ' || e.key === 'Enter') {
        if (onGrade) return false;           // у сфокусированной кнопки оценки — родное срабатывание
        flip();
        return true;
      }
      const n = digit(e);
      if (n && n <= GRADES.length && flipped) { grade(GRADES[n - 1].id); return true; }
      if (e.key === 'ArrowLeft' && flipped) { grade('again'); return true; }
      if (e.key === 'ArrowRight' && flipped) { grade('good'); return true; }
      return false;
    },
  };
}
