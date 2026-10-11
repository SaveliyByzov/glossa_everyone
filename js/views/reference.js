// Справочник: алфавит (обе графики), падежи, спряжение, ложные друзья, ссылки на внешние ресурсы.
import { h } from '../dom.js';
import { renderInline } from '../markup.js';
import { withoutScript } from '../script.js';
import { view, head } from './common.js';
import * as R from '../../data/sr/reference.js';

const table = (cap, headRow, rows, { keep = false } = {}) => keep ? withoutScript(() => buildTable(cap, headRow, rows, true)) : buildTable(cap, headRow, rows, false);
const buildTable = (cap, headRow, rows, keep) => {
  const t = h('table', null,
    cap ? h('caption', null, cap) : null,
    headRow ? h('thead', null, h('tr', null, headRow.map((c) => h('th', { scope: 'col' }, c)))) : null,
    h('tbody', { lang: 'sr' }, rows.map((r) => h('tr', null, r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, renderInline(c)) : h('td', null, renderInline(c))))))));
  const wrap = h('div', { class: 'theory__table ref__table' }, t);
  if (keep) wrap.dataset.keepScript = '';
  return wrap;
};

const notes = (list) => h('ul', { class: 'ref__notes' }, list.map((s) => h('li', null, renderInline(s))));

function group(title, open, ...children) {
  const d = h('details', { class: 'ref__group' }, h('summary', null, title), h('div', { class: 'ref__body' }, ...children));
  if (open) d.open = true;
  return d;
}

export async function render() {
  const el = view('reference', head('Справочник', 'Шпаргалка по сербскому — всё доступно офлайн.'));
  el.append(
    group('Алфавит: кириллица и латиница', true,
      table(null, ['Ћир.', 'Lat.', 'Звук — как в русском'], R.ALPHABET.map(([c, l, snd, hint]) => [c, l, `${snd} — ${hint}`]), { keep: true }),
      notes(R.ALPHABET_NOTES)),
    group('Падежи', false,
      table('Семь падежей', ['Падеж (вопрос)', 'Где используется', 'grad · žena · selo'], R.CASES.map(([c, q, use, ends]) => [q === '—' ? c : `${c} (${q})`, use, ends])),
      h('p', { class: 'theory__note' }, renderInline(R.CASES_NOTE))),
    group('Спряжение: презенс и biti', false,
      table(null, R.VERBS.head, R.VERBS.rows),
      notes(R.VERB_NOTES)),
    group('Ложные друзья русскоязычных', false,
      table(null, ['Сербский', 'Значение', 'Не путать с'], R.FALSE_FRIENDS)),
    group('Где читать и слушать', false,
      h('p', { class: 'muted' }, 'Внешние ресурсы открываются в браузере и требуют интернета; само приложение работает офлайн. Подробнее и с оговорками — docs/RESOURCES.md.'),
      h('ul', { class: 'ref__links' }, R.LINKS.map(([name, url]) => h('li', null, h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, name), h('code', null, url))))));
  return { el, title: 'Справочник', tab: 'ref', lang: 'sr' };
}
