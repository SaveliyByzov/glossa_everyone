// Общие кусочки для модулей упражнений. Разметка — по design/gallery.html.
//
// Интерфейс модуля упражнения:
//   export function render(ex, ctx) → controller
//   controller = {
//     el,                 // корневой article.ex.ex--<type>
//     ready(): boolean,   // можно ли нажать «Проверить»
//     check(): Result,    // { correct, almost, expected, given } + разметка is-correct / is-wrong / is-almost
//     key?(e): boolean,   // клавиши 1–9 / Backspace (true — обработано)
//     undo?(),            // кнопка «Очистить» в футере (order/classify)
//     focus?(),           // фокус в первое поле
//     usesInput?: boolean // показывать ли кнопки спецсимволов
//   }
// ctx = { course, lang, policy, changed(), submit(), autoCheck(), vibrate(kind), speak(text) }

import { h, icon } from '../dom.js';
import { md, renderInline } from '../markup.js';

export const RU_POLICY = { ignoreCase: true, optionalMarks: [], equivalents: [['е', 'ё']], script: null };

/** Корень: article.ex.ex--type > .ex__meta? + .ex__prompt */
export function root(type, ex, defaultPrompt, ctx, metaExtra = null) {
  const el = h('article', { class: `ex ex--${type}`, dataset: { level: ex.level || 1 } });
  const skillName = ex.skill && ctx?.course?.skills?.[ex.skill]?.name;
  if (skillName || metaExtra) {
    el.append(h('div', { class: 'ex__meta' },
      metaExtra,
      skillName ? h('span', { class: 'chip chip--quiet ex__skill' }, skillName) : null));
  }
  el.append(md('p', 'ex__prompt', ex.prompt || defaultPrompt));
  return el;
}

/** Вопрос: на изучаемом языке — с lang и кнопкой озвучки; на русском — .ex__q--ru. */
export function question(text, ctx, { ru = false } = {}) {
  const q = h('p', { class: ru ? 'ex__q ex__q--ru' : 'ex__q', lang: ru ? null : ctx.lang });
  q.append(renderInline(text));
  if (!ru) appendSpeak(q, text, ctx);
  return q;
}

/** Перевод/подсказка под вопросом (необязательное поле упражнения gloss). */
export function gloss(text) {
  return text ? md('p', 'ex__gloss', text) : null;
}

export function appendSpeak(parent, text, ctx) {
  if (!ctx.speak?.available) return;
  parent.append(h('button', {
    class: 'btn btn--ghost btn--icon ex__speak', type: 'button', 'aria-label': 'Озвучить',
    onclick: () => ctx.speak(text),
  }, icon('speaker')));
}

/** Текстовое поле без автозамен/автокапитализации; Enter → ctx.submit(), Shift+Enter — перенос. */
export function textInput(ctx, { multiline = false, label, lang, placeholder } = {}) {
  const el = h(multiline ? 'textarea' : 'input', {
    class: multiline ? 'input input--area' : 'input',
    type: multiline ? null : 'text',
    rows: multiline ? 3 : null,
    autocomplete: 'off',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    enterkeyhint: 'done',
    lang: lang || ctx.lang || null,
    placeholder: placeholder || null,
    'aria-label': label || 'Ваш ответ',
  });
  el.addEventListener('input', () => ctx.changed());
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ctx.submit(); }
  });
  return el;
}

/** Помечает поле результатом проверки: is-correct / is-almost / is-wrong (+ aria-invalid). */
export function mark(el, ok, almost = false) {
  el.classList.toggle('is-correct', !!ok && !almost);
  el.classList.toggle('is-almost', !!ok && !!almost);
  el.classList.toggle('is-wrong', !ok);
  el.setAttribute('aria-invalid', String(!ok));
}

/** Склеивает токены во фразу, убирая пробелы перед знаками препинания. */
export function joinTokens(tokens) {
  return tokens.join(' ').replace(/\s+([,.;:!?…»)])/g, '$1').replace(/([(«])\s+/g, '$1');
}

/** Номер клавиши 1–9 из события (или null). */
export function digit(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  const n = Number(e.key);
  return Number.isInteger(n) && n >= 1 && n <= 9 ? n : null;
}
