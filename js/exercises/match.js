// match — сопоставить пары (тап-тап). Колонки перемешиваются независимо.
// Верная пара гаснет (.is-matched), неверная мигает (.is-wrong) и считается ошибкой.
// Клавиши: 1–9 — элементы по порядку (сначала левая колонка, затем правая).
import { h } from '../dom.js';
import { renderInline, stripMarkup } from '../markup.js';
import { shuffle } from '../util.js';
import { root, digit } from './common.js';

export function render(ex, ctx) {
  const el = root('match', ex, 'Сопоставьте пары', ctx);
  const n = ex.pairs.length;
  const colL = h('div', { class: 'pairs__col' });
  const colR = h('div', { class: 'pairs__col' });
  el.append(h('div', { class: 'pairs' }, colL, colR));

  let mistakes = 0;
  let matched = 0;
  let sel = null; // { side, i, btn }
  const all = [];
  const text = (i, col) => stripMarkup(ex.pairs[i][col]);

  const make = (side, i, pos) => {
    const lang = side === 'L' ? (ex.leftLang === 'ru' ? null : ctx.lang) : (ex.rightLang && ex.rightLang !== 'ru' ? ctx.lang : null);
    const btn = h('button', { class: 'pair', type: 'button', lang, 'aria-pressed': 'false', title: pos < 9 ? `Клавиша ${pos + 1}` : null },
      renderInline(ex.pairs[i][side === 'L' ? 0 : 1]));
    btn.addEventListener('click', () => tap(side, i, btn));
    all.push(btn);
    return btn;
  };
  shuffle([...Array(n).keys()]).forEach((i, pos) => colL.append(make('L', i, pos)));
  shuffle([...Array(n).keys()]).forEach((i, pos) => colR.append(make('R', i, n + pos)));

  function setSel(next) {
    sel?.btn.classList.remove('is-selected');
    sel?.btn.setAttribute('aria-pressed', 'false');
    sel = next;
    sel?.btn.classList.add('is-selected');
    sel?.btn.setAttribute('aria-pressed', 'true');
  }

  function tap(side, i, btn) {
    if (btn.classList.contains('is-matched')) return;
    if (!sel || sel.side === side) { setSel(sel?.btn === btn ? null : { side, i, btn }); return; }
    const other = sel;
    setSel(null);
    // одинаковый текст (омонимы) считаем взаимозаменяемым
    const ok = other.i === i || text(other.i, 0) === text(i, 0) || text(other.i, 1) === text(i, 1);
    if (ok) {
      for (const b of [other.btn, btn]) { b.classList.add('is-matched'); b.disabled = true; }
      matched++;
      ctx.vibrate?.('tick');
      if (matched === n) ctx.autoCheck();
    } else {
      mistakes++;
      ctx.vibrate?.('error');
      for (const b of [other.btn, btn]) {
        b.classList.add('is-wrong');
        setTimeout(() => b.classList.remove('is-wrong'), 600);
      }
    }
  }

  return {
    el,
    ready: () => matched === n,
    check() {
      for (const b of all) b.disabled = true;
      return {
        correct: mistakes === 0,
        almost: false,
        expected: ex.pairs.map((_, i) => `${text(i, 0)} — ${text(i, 1)}`).join('; '),
        given: mistakes ? `ошибочных пар: ${mistakes}` : '',
      };
    },
    key(e) {
      const k = digit(e);
      if (!k) return false;
      const btn = all[k - 1];
      if (btn && !btn.disabled) btn.click();
      return !!btn;
    },
  };
}
