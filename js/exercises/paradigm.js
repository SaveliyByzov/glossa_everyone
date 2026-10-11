// paradigm — заполнить клетки таблицы склонения/спряжения. Колонка 0 — метки.
// blanks: [[row, col], …] | 'all'. В клетке допустимы варианты через «/».
import { h } from '../dom.js';
import { renderInline, stripMarkup } from '../markup.js';
import { checkAnswer } from '../answer.js';
import { root, textInput, mark } from './common.js';

export function blankCells(ex) {
  if (ex.blanks === 'all') return ex.rows.flatMap((row, r) => row.map((_, c) => [r, c]).filter(([, c]) => c > 0));
  return ex.blanks || [];
}

const variants = (cell) => [...new Set([cell, ...String(cell).split('/').map((s) => s.trim())])].filter(Boolean);

export function render(ex, ctx) {
  const el = root('paradigm', ex, 'Заполните парадигму', ctx);
  const blanks = new Set(blankCells(ex).map(([r, c]) => `${r}:${c}`));
  const inputs = [];

  const table = h('table', { class: 'paradigm', lang: ctx.lang });
  if (ex.lemma) table.append(h('caption', null, renderInline(ex.lemma), ex.lemmaRu ? h('small', null, renderInline(ex.lemmaRu)) : null));
  if (ex.head?.length) table.append(h('thead', null, h('tr', null, ex.head.map((t, i) => h('th', { scope: i ? 'col' : null }, renderInline(t))))));
  const tbody = h('tbody');
  ex.rows.forEach((row, r) => {
    const tr = h('tr');
    row.forEach((cell, c) => {
      if (c === 0) { tr.append(h('th', { scope: 'row' }, renderInline(cell))); return; }
      if (!blanks.has(`${r}:${c}`)) { tr.append(h('td', { class: 'is-given' }, renderInline(cell))); return; }
      const label = [stripMarkup(row[0]), ex.head?.[c] ? stripMarkup(ex.head[c]) : ''].filter(Boolean).join(' ');
      const input = textInput(ctx, { label });
      input.classList.add('input--cell');
      inputs.push({ input, cell, label });
      tr.append(h('td', null, input));
    });
    tbody.append(tr);
  });
  table.append(tbody);
  el.append(h('div', { class: 'paradigm-wrap' }, table));

  return {
    el,
    usesInput: true,
    ready: () => inputs.every(({ input }) => input.value.trim()),
    check() {
      const wrong = [];
      let almost = false;
      for (const item of inputs) {
        const others = ex.rows.flatMap((row) => row.slice(1)).filter((c) => c !== item.cell).flatMap(variants);
        const res = checkAnswer(item.input.value, variants(item.cell), ctx.policy, { wrongForms: others });
        mark(item.input, res.correct, res.almost);
        item.input.readOnly = true;
        if (res.almost) almost = true;
        if (!res.correct) {
          wrong.push(`${item.label}: ${stripMarkup(item.cell)}`);
          item.input.title = `Правильно: ${stripMarkup(item.cell)}`;
        }
      }
      return {
        correct: wrong.length === 0,
        almost,
        expected: wrong.join('; '),
        given: inputs.filter(({ input }) => input.classList.contains('is-wrong')).map(({ label, input }) => `${label}: ${input.value.trim()}`).join('; '),
      };
    },
    focus() { inputs[0]?.input.focus({ preventScroll: true }); },
  };
}
