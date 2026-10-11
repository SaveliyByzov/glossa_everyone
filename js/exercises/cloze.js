// cloze — текст с ___ и полями ввода на месте пропусков.
import { h } from '../dom.js';
import { renderInline, stripMarkup } from '../markup.js';
import { checkAnswer } from '../answer.js';
import { root, textInput, mark, gloss, appendSpeak } from './common.js';

const alts = (a) => (Array.isArray(a) ? a : [a]);

export function render(ex, ctx) {
  const el = root('cloze', ex, 'Заполните пропуски', ctx);
  const parts = String(ex.text).split('___');
  // один пропуск и несколько строк в answers — это альтернативы (частая запись вместо [[...]])
  const answers = parts.length === 2 && Array.isArray(ex.answers) && ex.answers.length > 1 && ex.answers.every((a) => typeof a === 'string')
    ? [ex.answers] : ex.answers || [];
  const q = h('p', { class: 'ex__q', lang: ctx.lang });
  const inputs = [];
  parts.forEach((part, i) => {
    q.append(renderInline(part));
    if (i < parts.length - 1) {
      const longest = Math.max(3, ...alts(answers[i] ?? '').map((a) => stripMarkup(a).length));
      const input = textInput(ctx, { label: `Пропуск ${i + 1}${ex.hint && parts.length === 2 ? `: ${stripMarkup(ex.hint)}` : ''}` });
      input.classList.add('input--inline');
      input.style.setProperty('--chars', String(Math.min(24, longest)));
      inputs.push(input);
      q.append(input);
    }
  });
  appendSpeak(q, parts.join('…'), ctx);
  el.append(q);
  const g = gloss(ex.gloss);
  if (g) el.append(g);
  if (ex.hint) el.append(h('p', { class: 'ex__hint' }, 'Подсказка: ', h('b', { lang: ctx.lang }, renderInline(ex.hint))));

  return {
    el,
    usesInput: true,
    ready: () => inputs.every((i) => i.value.trim()),
    check() {
      const results = inputs.map((input, i) => {
        const others = answers.filter((_, k) => k !== i).flatMap(alts);
        const r = checkAnswer(input.value, alts(answers[i]), ctx.policy, { wrongForms: [...others, ...alts(ex.wrongForms || [])] });
        mark(input, r.correct, r.almost);
        input.readOnly = true;
        return r;
      });
      const fill = (vals) => parts.map((p, i) => stripMarkup(p) + (i < parts.length - 1 ? vals[i] : '')).join('').trim();
      return {
        correct: results.every((r) => r.correct),
        almost: results.some((r) => r.almost),
        expected: fill(results.map((r) => r.expected)),
        given: fill(inputs.map((i) => i.value.trim())),
      };
    },
    focus() { inputs[0]?.focus({ preventScroll: true }); },
  };
}
