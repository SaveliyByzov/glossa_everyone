// Общие компоненты экранов (разметка — по design/gallery.html).
import { h, icon } from '../dom.js';
import { renderInline } from '../markup.js';

export function view(name, ...children) {
  return h('main', { class: `view view--${name}`, id: 'view', tabindex: '-1' }, ...children);
}

export function head(title, sub) {
  return h('div', { class: 'view__head' },
    h('h2', { class: 'view__title' }, title),
    sub ? h('p', { class: 'view__sub' }, sub) : null);
}

export function section(title, extra, ...children) {
  return h('section', { class: 'section' },
    h('h3', { class: 'section__title' }, title, extra ? h('small', null, extra) : null),
    ...children);
}

export function progress(ratio, mods = '', label = '') {
  const v = Math.max(0, Math.min(1, ratio || 0));
  const bar = h('div', { class: 'progress__bar' });
  bar.style.setProperty('--value', String(v));
  return h('div', { class: `progress ${mods}`.trim(), role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(v * 100)), 'aria-label': label || null }, bar);
}

export function setProgress(el, ratio) {
  const v = Math.max(0, Math.min(1, ratio || 0));
  el.firstElementChild.style.setProperty('--value', String(v));
  el.setAttribute('aria-valuenow', String(Math.round(v * 100)));
}

/** Мастерство 0–5: пять ромбов. newFrom — с какого уровня анимировать «новые» (экран результата). */
export function mastery(level, { lg = false, newFrom = null, levels = 5, label } = {}) {
  const el = h('span', { class: lg ? 'mastery mastery--lg' : 'mastery', dataset: { level }, role: 'img', 'aria-label': label || `Мастерство ${level} из ${levels}` });
  for (let i = 1; i <= levels; i++) {
    const dot = h('i');
    if (newFrom != null && i > newFrom && i <= level) { dot.className = 'is-on is-new'; dot.style.setProperty('--i', String(i - newFrom - 1)); }
    el.append(dot);
  }
  return el;
}

export function empty({ title, text, action }) {
  return h('div', { class: 'empty' },
    h('span', { class: 'empty__orn', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')),
    h('h2', { class: 'empty__title' }, title),
    text ? h('p', { class: 'empty__text' }, renderInline(text)) : null,
    action ? h('a', { class: `btn ${action.primary ? 'btn--primary' : 'btn--outline'}`, href: action.href }, action.label) : null);
}

/** Буквица курса — «образец» языка. */
const GLYPHS = { sr: 'Ђ' };
export function glyph(id, course) {
  return h('span', { class: 'course-card__glyph', 'aria-hidden': 'true' }, course?.glyph || GLYPHS[id] || (course?.name || id || '?')[0]);
}

export const KIND_LABEL = { grammar: 'Грамматика', vocab: 'Слова', reading: 'Чтение', review: 'Повтор' };
export const KIND_ICON = { grammar: 'pilcrow', vocab: 'dict', reading: 'read', review: 'repeat' };

export function ledgerRow(label, value, mod = '', i = 0) {
  const row = h('p', { class: 'ledger__row' },
    h('span', { class: 'ledger__label' }, label),
    h('span', { class: 'ledger__dots', 'aria-hidden': 'true' }),
    h('span', { class: ['ledger__value', mod && `ledger__value--${mod}`] }, value));
  row.style.setProperty('--i', String(i));
  return row;
}

export function fmtDuration(ms) {
  const hh = Math.floor(ms / 3_600_000), m = Math.ceil((ms % 3_600_000) / 60_000);
  return hh ? `${hh} ч ${m} мин` : `${m} мин`;
}

export const fmtNum = (n) => new Intl.NumberFormat('ru-RU').format(n);

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV'];
export const roman = (n) => ROMAN[n - 1] || String(n);

export { icon };
