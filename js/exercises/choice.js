// choice — выбор одного варианта. Варианты перемешиваются; 1–9 выбирают вариант.
import { h, icon } from '../dom.js';
import { renderInline, stripMarkup } from '../markup.js';
import { shuffle } from '../util.js';
import { root, question, gloss, digit } from './common.js';

export function render(ex, ctx) {
  const el = root('choice', ex, 'Выберите правильный вариант', ctx);
  // q по умолчанию на изучаемом языке; автогенератор помечает русский вопрос qLang: 'ru'
  if (ex.q) el.append(question(ex.q, ctx, { ru: ex.qLang === 'ru' }));
  const g = gloss(ex.gloss);
  if (g) el.append(g);
  const order = shuffle(ex.options.map((_, i) => i));
  const optLang = ex.optionsLang === 'ru' ? null : ctx.lang;
  let selected = null;
  const short = ex.options.every((o) => stripMarkup(o).length <= 14) && ex.options.length >= 4;
  const list = h('div', { class: short ? 'options options--grid' : 'options', role: 'radiogroup', 'aria-label': 'Варианты' });
  const buttons = order.map((orig, pos) => {
    const btn = h('button', { class: 'option', type: 'button', role: 'radio', 'aria-checked': 'false', dataset: { index: orig } },
      pos < 9 ? h('kbd', { class: 'option__key' }, String(pos + 1)) : null,
      h('span', { class: 'option__text', lang: optLang }, renderInline(ex.options[orig])),
      icon(orig === ex.answer ? 'check' : 'x', 'option__state'));
    btn.addEventListener('click', () => select(orig));
    list.append(btn);
    return btn;
  });
  el.append(list);

  function select(orig) {
    selected = orig;
    for (const b of buttons) {
      const on = Number(b.dataset.index) === orig;
      b.classList.toggle('is-selected', on);
      b.setAttribute('aria-checked', String(on));
    }
    ctx.changed();
  }

  return {
    el,
    ready: () => selected !== null,
    check() {
      const correct = selected === ex.answer;
      list.classList.add('is-locked');
      for (const b of buttons) {
        const i = Number(b.dataset.index);
        b.classList.remove('is-selected');
        if (i === ex.answer) b.classList.add('is-correct');
        else if (i === selected) b.classList.add('is-wrong');
        b.disabled = true;
      }
      return { correct, almost: false, expected: stripMarkup(ex.options[ex.answer]), given: selected != null ? stripMarkup(ex.options[selected]) : '' };
    },
    key(e) {
      const n = digit(e);
      if (n && n <= order.length) { select(order[n - 1]); return true; }
      return false;
    },
  };
}
