// Справочник: алфавит (обе графики), падежи, спряжение, ложные друзья, ссылки на внешние ресурсы.
import { h } from '../dom.js';
import { renderInline } from '../markup.js';
import { withoutScript } from '../script.js';
import { view, head } from './common.js';
import { reducedMotion } from '../ui.js';
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

const SPECIAL = new Set(['Ђ ђ', 'Ј ј', 'Љ љ', 'Њ њ', 'Ћ ћ', 'Џ џ']);

/** Алфавит плитками: Ћир. крупно, Lat. под ней; по нажатию — звук и подсказка в панели над сеткой. */
function alphabetGrid() {
  const info = h('p', { class: 'abc__info', role: 'status' }, 'Нажмите на букву — звук и подсказка.');
  const tiles = R.ALPHABET.map(([c, l, snd, hint]) => {
    const t = h('button', { type: 'button', class: ['abc__tile', SPECIAL.has(c) && 'is-special'], 'aria-label': `${c}, ${l}, ${snd} — ${hint}` },
      h('b', null, c.split(' ')[0]), h('i', null, l.split(' ')[0]), h('small', null, snd));
    t.onclick = () => {
      grid.querySelectorAll('.is-on').forEach((x) => x.classList.remove('is-on'));
      t.classList.add('is-on');
      info.textContent = `${c} · ${l} — ${snd} ${hint}`;
      if (!reducedMotion() && info.animate) info.animate([{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'none' }], { duration: 160, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    };
    return t;
  });
  const grid = h('div', { class: 'abc__grid' }, tiles);
  const wrap = h('div', { class: 'abc' }, info, grid);
  wrap.dataset.keepScript = '';
  return wrap;
}

const CASE_HUE = [258, 28, 150, 80, 330, 200, 300];   // N G D A V I L — свой цвет окончаний (css/sr.css)
const STEMS = ['grad', 'žen', 'sel'];

/** Падежи карточками (без широкой таблицы): название, вопрос, где используется, примеры с цветным окончанием. */
function caseCards() {
  return h('div', { class: 'cases' }, R.CASES.map(([c, q, use, ends], i) => {
    const forms = ends.split(' · ').map((f, k) => {
      const stem = STEMS[k];
      const cut = f.startsWith(stem) ? stem.length : f.length;
      return h('span', { class: 'case__form' }, f.slice(0, cut), h('em', { class: 'case__end' }, f.slice(cut) || '∅'));
    });
    const card = h('details', { class: 'case' },
      h('summary', null,
        h('span', { class: 'case__no', 'aria-hidden': 'true' }, String(i + 1)),
        h('span', { class: 'case__name' }, h('b', { lang: 'sr' }, c), q === '—' ? null : h('small', { lang: 'sr' }, q)),
        h('span', { class: 'case__forms', lang: 'sr' }, forms)),
      h('p', { class: 'case__use' }, renderInline(use)));
    card.style.setProperty('--hue', String(CASE_HUE[i]));
    return card;
  }));
}

export async function render() {
  const el = view('reference', head('Справочник', 'Шпаргалка по сербскому — всё доступно офлайн.'));
  el.append(
    group('Алфавит: кириллица и латиница', true,
      alphabetGrid(),
      notes(R.ALPHABET_NOTES)),
    group('Падежи', false,
      h('p', { class: 'muted case__legend', lang: 'ru' }, 'Примеры: grad · žena · selo. Цветом выделено окончание, «∅» — нулевое. Нажмите на падеж, чтобы увидеть, где он нужен.'),
      caseCards(),
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
