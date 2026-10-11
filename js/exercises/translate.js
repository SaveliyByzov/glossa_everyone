// translate — перевод фразы (dir: 'toTarget' | 'toRu'); несколько допустимых ответов.
import { checkAnswer } from '../answer.js';
import { root, question, textInput, mark, RU_POLICY } from './common.js';

// «Переведите на …» (винительный падеж); курс может задать свой: course.langTo
const LANG_TO = { sr: 'сербский' };

export function render(ex, ctx) {
  const toTarget = ex.dir !== 'toRu';
  const langTo = ctx.course?.langTo || LANG_TO[ctx.course?.id] || 'изучаемый язык';
  const el = root('translate', ex, toTarget ? `Переведите на ${langTo}` : 'Переведите на русский', ctx);
  el.append(question(ex.q, ctx, { ru: toTarget }));
  const input = textInput(ctx, { multiline: true, lang: toTarget ? ctx.lang : 'ru', label: 'Ваш перевод' });
  el.append(input);
  const policy = toTarget ? ctx.policy : RU_POLICY;

  return {
    el,
    usesInput: toTarget,
    answerLang: toTarget ? null : 'ru',
    ready: () => !!input.value.trim(),
    check() {
      const r = checkAnswer(input.value, ex.answers, policy);
      mark(input, r.correct, r.almost);
      input.readOnly = true;
      return { ...r, given: input.value.trim() };
    },
    focus() { input.focus({ preventScroll: true }); },
  };
}
