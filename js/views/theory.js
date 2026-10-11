// Блоки теории (h, p, rule, table, examples, contrast, tip, pitfall) и текст для чтения — по gallery.html.
import { h, icon } from '../dom.js';
import { md, renderInline } from '../markup.js';
import { withoutScript } from '../script.js';

const LABELS = {
  rule: ['Правило', 'pilcrow'],
  contrast: ['Как в русском', 'swap'],
  tip: ['Запомнить', 'bulb'],
  pitfall: ['Ловушка', 'warn'],
};

export function block(b, ctx) {
  switch (b.type) {
    case 'h': return md('h3', null, b.text);
    case 'p': return md('p', null, b.text);
    case 'rule':
    case 'contrast':
    case 'tip':
    case 'pitfall': {
      const [label, ic] = LABELS[b.type];
      return h('div', { class: `theory__${b.type}` }, h('p', { class: 'theory__label' }, icon(ic), label), md('p', null, b.text));
    }
    case 'table': {
      const table = h('table');
      if (b.caption) table.append(h('caption', null, renderInline(b.caption)));
      if (b.head?.length) table.append(h('thead', null, h('tr', null, b.head.map((c, i) => h('th', { scope: i ? 'col' : null }, renderInline(c))))));
      table.append(h('tbody', { lang: ctx.lang }, (b.rows || []).map((row) => h('tr', null,
        row.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, renderInline(c)) : h('td', null, renderInline(c))))))));
      return h('div', { class: 'theory__table' }, table, b.note ? md('p', 'theory__note', b.note) : null);
    }
    case 'examples':
      return h('ul', { class: 'theory__examples' }, (b.items || []).map((it) => {
        const say = speakBtn(it.t, ctx);
        const t = h('p', { class: 'tl', lang: ctx.lang }, renderInline(it.t));
        return h('li', null,
          say ? h('div', { class: 'ex-say' }, t, say) : t,
          it.ru ? md('p', 'ru', it.ru) : null,
          it.note ? md('p', 'note', it.note) : null);
      }));
    default:
      console.warn('[glossa] неизвестный блок теории', b);
      return null;
  }
}

export function speakBtn(text, ctx, label = 'Озвучить') {
  if (!ctx.speak?.available) return null;
  return h('button', { class: 'btn btn--ghost btn--icon ex__speak', type: 'button', 'aria-label': label, onclick: () => ctx.speak(text) }, icon('speaker'));
}

/**
 * Теория урока. compact — показывать только rule и table (режим review, урок уже пройден),
 * остальное — по кнопке «Показать всю теорию».
 */
export function theory(blocks, ctx, { compact = false, keep = false } = {}) {
  // keep — урок об алфавитах: латиница и кириллица показываются как написано, без транслитерации
  if (keep) { const w = withoutScript(() => theory(blocks, ctx, { compact })); w.dataset.keepScript = ''; return w; }
  const wrap = h('div', { class: 'theory' });
  const hidden = [];
  for (const b of blocks || []) {
    const el = block(b, ctx);
    if (!el) continue;
    if (compact && b.type !== 'rule' && b.type !== 'table') { el.hidden = true; hidden.push(el); }
    wrap.append(el);
  }
  if (hidden.length) {
    const more = h('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, 'Показать всю теорию');
    more.addEventListener('click', () => { for (const el of hidden) el.hidden = false; more.remove(); });
    wrap.append(more);
  }
  return wrap;
}

/** Текст для чтения: .reading > .reading__line > .tl + .ru; перевод можно скрыть. */
export function reading(text, ctx) {
  if (!text?.lines?.length) return null;
  const box = h('div', { class: 'reading' }, text.lines.map((l) => h('div', { class: 'reading__line' },
    h('p', { class: 'tl', lang: ctx.lang }, renderInline(l.t)),
    l.ru ? md('p', 'ru', l.ru) : null)));
  const toggle = h('button', { class: 'chip', type: 'button', 'aria-pressed': 'true' }, 'Перевод');
  toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(on));
    for (const ru of box.querySelectorAll('.ru')) ru.hidden = !on;
  });
  return h('section', { class: 'section' },
    h('h3', { class: 'section__title' }, text.title ? renderInline(text.title) : 'Текст', toggle),
    box);
}
