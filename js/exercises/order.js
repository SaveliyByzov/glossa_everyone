// order — собрать фразу из плиток (тап-тап). Плитки вместе с дистракторами перемешиваются;
// использованная плитка остаётся в банке пустым местом (.is-used).
// Клавиши: 1–9 — взять плитку из банка, Backspace — вернуть последнюю.
import { h } from '../dom.js';
import { normalize } from '../answer.js';
import { shuffleNotIdentity } from '../util.js';
import { root, question, joinTokens, digit } from './common.js';

export function render(ex, ctx) {
  const el = root('order', ex, 'Соберите фразу', ctx);
  if (ex.q) el.append(question(ex.q, ctx, { ru: true }));
  const line = h('div', { class: 'answer-line', 'data-placeholder': 'Нажимайте на слова по порядку', 'aria-label': 'Ваш ответ' });
  const bank = h('div', { class: 'tiles', 'aria-label': 'Слова' });
  el.append(line, bank);

  const all = [...ex.tokens, ...(ex.distractors || [])];
  const order = shuffleNotIdentity(all.map((_, i) => i));
  const placed = [];   // индексы в all, в порядке выкладки

  const bankTiles = order.map((i, pos) => {
    const t = h('button', { class: 'tile', type: 'button', lang: ctx.lang, title: pos < 9 ? `Клавиша ${pos + 1}` : null, dataset: { i } }, all[i]);
    t.addEventListener('click', () => take(i));
    bank.append(t);
    return t;
  });

  function take(i) {
    if (placed.includes(i)) return;
    placed.push(i);
    sync();
  }
  function giveBack(i) {
    const k = placed.indexOf(i);
    if (k >= 0) placed.splice(k, 1);
    sync();
  }
  function sync() {
    line.replaceChildren(...placed.map((i) => {
      const t = h('button', { class: 'tile', type: 'button', lang: ctx.lang, 'aria-label': `${all[i]} — убрать` }, all[i]);
      t.addEventListener('click', () => giveBack(i));
      return t;
    }));
    for (const t of bankTiles) {
      const used = placed.includes(Number(t.dataset.i));
      t.classList.toggle('is-used', used);
      t.tabIndex = used ? -1 : 0;
      if (used) t.setAttribute('aria-hidden', 'true'); else t.removeAttribute('aria-hidden');
    }
    ctx.changed();
  }

  return {
    el,
    ready: () => placed.length > 0,
    undo() { if (placed.length) giveBack(placed.at(-1)); },
    check() {
      const given = joinTokens(placed.map((i) => all[i]));
      const variants = [ex.tokens, ...(ex.alt || [])].map(joinTokens);
      const correct = variants.some((v) => normalize(v, ctx.policy) === normalize(given, ctx.policy));
      line.classList.add(correct ? 'is-correct' : 'is-wrong');
      for (const b of el.querySelectorAll('button')) b.disabled = true;
      return { correct, almost: false, expected: variants[0], given };
    },
    key(e) {
      const n = digit(e);
      if (n && n <= order.length) { take(order[n - 1]); return true; }
      if (e.key === 'Backspace' && placed.length) { giveBack(placed.at(-1)); return true; }
      return false;
    },
  };
}
