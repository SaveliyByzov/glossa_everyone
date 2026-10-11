// transform — преобразовать исходную фразу по инструкции.
import { h, icon } from '../dom.js';
import { renderInline } from '../markup.js';
import { checkAnswer } from '../answer.js';
import { root, textInput, mark, appendSpeak } from './common.js';

export function render(ex, ctx) {
  // prompt — короткая инструкция сверху; instruction — «мостик» между исходником и ответом
  const el = root('transform', ex, ex.instruction || 'Преобразуйте фразу', ctx);
  const src = h('p', { class: 'tl', lang: ctx.lang }, renderInline(ex.source));
  appendSpeak(src, ex.source, ctx);
  el.append(h('div', { class: 'ex__source' }, h('span', { class: 'label' }, ex.sourceLabel || 'Исходная фраза'), src));
  if (ex.prompt && ex.instruction) el.append(h('p', { class: 'ex__arrow' }, icon('arrow-right'), h('span', null, renderInline(ex.instruction))));
  const input = textInput(ctx, { label: 'Ваш ответ' });
  el.append(input);
  return {
    el,
    usesInput: true,
    ready: () => !!input.value.trim(),
    check() {
      const r = checkAnswer(input.value, ex.answers, ctx.policy, { wrongForms: [ex.source, ...(ex.wrongForms || [])] });
      mark(input, r.correct, r.almost);
      input.readOnly = true;
      return { ...r, given: input.value.trim() };
    },
    focus() { input.focus({ preventScroll: true }); },
  };
}
