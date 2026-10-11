// classify — разложить элементы по корзинам (тап-тап): выбрать плитку, затем корзину.
// Разложенная плитка остаётся в банке пустым местом (.is-used), в корзине — её копия.
// Клавиатура: первая свободная плитка выбрана автоматически, 1–9 — в корзину N, Backspace — отменить последнее.
import { h } from '../dom.js';
import { renderInline, stripMarkup } from '../markup.js';
import { shuffle } from '../util.js';
import { root, digit } from './common.js';

export function render(ex, ctx) {
  const el = root('classify', ex, 'Разложите по группам: выберите слово, затем корзину', ctx);
  const pool = h('div', { class: 'tiles' });
  const buckets = ex.buckets.map((title, b) => {
    const items = h('span', { class: 'bucket__items' });
    const count = h('span', { class: 'badge' }, '0');
    const box = h('button', { class: 'bucket', type: 'button', title: b < 9 ? `Клавиша ${b + 1}` : null },
      h('span', { class: 'bucket__title' }, h('b', null, renderInline(title)), count), items);
    box.addEventListener('click', () => put(b));
    return { box, items, count };
  });
  el.append(pool, h('div', { class: 'buckets' }, buckets.map((b) => b.box)));

  const items = shuffle(ex.items.map(([text, bucket]) => ({ text, bucket, placed: null })));
  const history = [];
  let selected = null;

  for (const it of items) {
    it.el = h('button', { class: 'tile', type: 'button', lang: ctx.lang, 'aria-pressed': 'false' }, renderInline(it.text));
    it.el.addEventListener('click', () => { selected = selected === it ? null : it; sync(); });
    pool.append(it.el);
  }

  const current = () => selected || items.find((x) => x.placed === null) || null;

  function put(b) {
    const it = current();
    if (!it) return;
    it.placed = b;
    history.push(it);
    selected = null;
    sync();
  }
  function undo() {
    const it = history.pop();
    if (!it) return;
    it.placed = null;
    selected = it;
    sync();
  }
  function sync() {
    const cur = current();
    for (const x of items) {
      const used = x.placed !== null;
      x.el.classList.toggle('is-used', used);
      x.el.classList.toggle('is-selected', x === cur);
      x.el.setAttribute('aria-pressed', String(x === cur));
      x.el.tabIndex = used ? -1 : 0;
      if (used) x.el.setAttribute('aria-hidden', 'true'); else x.el.removeAttribute('aria-hidden');
    }
    buckets.forEach((b, k) => {
      const inside = items.filter((x) => x.placed === k);
      b.items.replaceChildren(...inside.map((x) => (x.copy = h('span', { class: 'tile', lang: ctx.lang }, renderInline(x.text)))));
      b.count.textContent = String(inside.length);
      b.box.classList.toggle('is-target', !!cur);
    });
    ctx.changed();
  }
  sync();

  return {
    el,
    ready: () => items.every((x) => x.placed !== null),
    undo,
    check() {
      let ok = true;
      const bad = new Set();
      for (const x of items) {
        const good = x.placed === x.bucket;
        x.copy?.classList.add(good ? 'is-correct' : 'is-wrong');
        if (!good) { ok = false; bad.add(x.placed); }
      }
      buckets.forEach((b, k) => {
        b.box.classList.remove('is-target');
        b.box.classList.add(bad.has(k) ? 'is-wrong' : 'is-correct');
      });
      for (const b of el.querySelectorAll('button')) b.disabled = true;
      const expected = ex.buckets.map((t, k) => `${stripMarkup(t)}: ${ex.items.filter(([, b]) => b === k).map(([s]) => stripMarkup(s)).join(', ')}`).join('; ');
      const given = items.filter((x) => x.placed !== x.bucket).map((x) => `${stripMarkup(x.text)} → ${stripMarkup(ex.buckets[x.placed])}`).join('; ');
      return { correct: ok, almost: false, expected, given };
    },
    key(e) {
      const n = digit(e);
      if (n && n <= ex.buckets.length) { put(n - 1); return true; }
      if (e.key === 'Backspace' && history.length) { undo(); return true; }
      return false;
    },
  };
}
