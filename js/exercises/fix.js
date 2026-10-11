// fix — найти ошибочное слово (tokens[wrong]) и ввести исправление. 1–9 — выбрать слово N.
import { h } from '../dom.js';
import { checkAnswer } from '../answer.js';
import { root, textInput, mark, joinTokens, gloss, digit } from './common.js';

export function render(ex, ctx) {
  const el = root('fix', ex, 'Найдите ошибку и исправьте её', ctx);
  const g = gloss(ex.gloss || ex.q);
  if (g) { g.style.marginTop = '0'; el.append(g); }
  const sentence = h('div', { class: 'tokens', lang: ctx.lang });
  const input = textInput(ctx, { label: 'Исправление', placeholder: 'Правильная форма' });
  input.hidden = true;
  el.append(sentence, input);

  let selected = null;
  const words = ex.tokens.map((t, i) => {
    const b = h('button', { class: 'token', type: 'button', 'aria-pressed': 'false', title: i < 9 ? `Клавиша ${i + 1}` : null }, t);
    b.addEventListener('click', () => select(i));
    sentence.append(b);
    return b;
  });

  function select(i) {
    selected = i;
    words.forEach((b, k) => { b.classList.toggle('is-selected', k === i); b.setAttribute('aria-pressed', String(k === i)); });
    input.hidden = false;
    input.setAttribute('aria-label', `Исправление для «${ex.tokens[i]}»`);
    input.focus({ preventScroll: true });
    ctx.changed();
  }

  return {
    el,
    usesInput: true,
    ready: () => selected !== null && !!input.value.trim(),
    check() {
      const r = checkAnswer(input.value, ex.answers, ctx.policy, { wrongForms: [ex.tokens[ex.wrong]] });
      const correct = selected === ex.wrong && r.correct;
      words.forEach((b, k) => {
        b.classList.remove('is-selected');
        if (k === ex.wrong) b.classList.add(selected === ex.wrong ? 'is-correct' : 'is-wrong');
        else if (k === selected) b.classList.add('is-wrong');
        b.disabled = true;
      });
      mark(input, correct, correct && r.almost);
      input.readOnly = true;
      const fixed = ex.tokens.map((t, k) => (k === ex.wrong ? r.expected || ex.answers[0] : t));
      const mine = ex.tokens.map((t, k) => (k === selected ? input.value.trim() : t));
      return { correct, almost: correct && r.almost, expected: joinTokens(fixed), given: joinTokens(mine) };
    },
    key(e) {
      const n = digit(e);
      if (n && n <= words.length) { select(n - 1); return true; }
      return false;
    },
  };
}
