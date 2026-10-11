// Повторение: сколько ждёт сегодня, прогноз на неделю, «трудные места» из банка ошибок.
import { h, icon } from '../dom.js';
import { store } from '../store.js';
import { config } from '../config.js';
import { loadCourse } from '../courses.js';
import { dayKey, plural } from '../util.js';
import { view, head, section, empty } from './common.js';

/** Что ждёт повторения сейчас: лексемы, навыки, банк ошибок. */
export function dueBreakdown(cs, now = Date.now()) {
  const out = { vocab: 0, skills: 0, mistakes: 0, total: 0 };
  if (!cs) return out;
  for (const [k, c] of Object.entries(cs.srs || {})) {
    if (c.due > now) continue;
    if (k.startsWith('v:')) out.vocab++; else out.skills++;
  }
  out.mistakes = (cs.mistakes || []).filter((m) => (m.due ?? 0) <= now).length;
  out.total = out.vocab + out.skills + out.mistakes;
  return out;
}

export const dueCount = (course, cs, now) => dueBreakdown(cs, now).total;

/** Прогноз на 7 дней: число элементов со сроком в каждый день (просроченное — в сегодня). */
function forecast(cs, now = Date.now()) {
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() + i); return d; });
  const keys = days.map((d) => dayKey(d));
  const counts = days.map(() => 0);
  const add = (t) => { const i = keys.indexOf(dayKey(new Date(Math.max(t, now)))); if (i >= 0) counts[i]++; };
  for (const c of Object.values(cs?.srs || {})) add(c.due);
  for (const m of cs?.mistakes || []) add(m.due ?? now);
  return days.map((d, i) => ({ d, n: counts[i] }));
}

const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

export async function render({ cid }) {
  const course = await loadCourse(cid);
  if (!course) return { el: view('review', empty({ title: 'Курс недоступен', action: { href: '#/', label: 'К курсам' } })), title: 'Повторение', tab: 'review' };
  store.update((s) => { s.lastCourse = cid; });
  const cs = store.state.courses[cid];
  const n = config.session.reviewLength;
  const d = dueBreakdown(cs);
  const el = view('review');

  if (!cs || (!Object.keys(cs.srs || {}).length && !cs.mistakes?.length)) {
    el.append(empty({ title: 'Пока нечего повторять', text: 'Пройдите пару уроков — слова, навыки и ошибки появятся здесь в нужный момент.', action: { href: `#/c/${cid}`, label: 'К урокам', primary: true } }));
    return { el, title: 'Повторение', tab: 'review', lang: cid, back: `#/c/${cid}` };
  }

  // «долг» больше overdueCap × reviewLength не показываем пугающей цифрой
  const heavy = d.total > (config.srs.overdueCap ?? 3) * n;
  const shown = heavy ? n : Math.min(d.total, n);
  const hero = h('div', { class: 'review-hero' },
    h('p', { class: 'review-hero__count' }, String(shown),
      h('small', null, heavy ? 'заданий в сессии — сделайте одну-две' : d.total ? plural(shown, ['карточка к повтору', 'карточки к повтору', 'карточек к повтору']) : 'на сегодня всё')));
  if (d.total) {
    hero.append(h('div', { class: 'chip-row' },
      d.vocab ? h('span', { class: 'chip' }, `Лексика ${d.vocab}`) : null,
      d.skills ? h('span', { class: 'chip' }, `Грамматика ${d.skills}`) : null,
      d.mistakes ? h('span', { class: 'chip' }, `Банк ошибок ${d.mistakes}`) : null));
  }
  hero.append(h('a', { class: 'btn btn--primary btn--block', href: `#/c/${cid}/review/play` },
    d.total ? `Повторить · ≈ ${Math.max(1, Math.round(shown * 0.4))} мин` : 'Повторить на опережение'));
  el.append(head('Повторение', course.nameRu), hero);

  const fc = forecast(cs);
  const max = Math.max(1, ...fc.map((x) => x.n));
  const fcEl = h('div', { class: 'forecast', role: 'img', 'aria-label': `Прогноз повторений по дням: ${fc.map((x) => x.n).join(', ')}` },
    fc.map((x, i) => {
      const bar = h('span', { class: 'forecast__bar' });
      bar.style.setProperty('--v', String(x.n / max));
      return h('div', { class: ['forecast__day', i === 0 && 'is-today'], title: String(x.n) }, bar, i === 0 ? 'сег' : WD[x.d.getDay()]);
    }));
  el.append(section('Ближайшие 7 дней', null, fcEl));

  // трудные места — банк ошибок по навыкам
  const bySkill = new Map();
  for (const m of cs.mistakes || []) bySkill.set(m.skill || '', (bySkill.get(m.skill || '') || 0) + 1);
  if (bySkill.size) {
    const rows = [...bySkill.entries()].sort((a, b) => b[1] - a[1]).map(([skill, cnt]) => h('li', { class: 'list__item' },
      h('div', null,
        h('p', { class: 'list__title' }, skill ? course.skills[skill]?.name || skill : 'Лексика'),
        h('p', { class: 'list__sub' }, `${cnt} ${plural(cnt, ['ошибка', 'ошибки', 'ошибок'])} в банке`)),
      skill ? h('a', { class: 'btn btn--sm btn--outline', href: `#/c/${cid}/skill/${encodeURIComponent(skill)}` }, 'Тренировать') : h('span', { class: 'badge badge--bad' }, String(cnt))));
    el.append(section('Трудные места', `${cs.mistakes.length} в банке ошибок`, h('ul', { class: 'list' }, rows)));
  }
  return { el, title: 'Повторение', tab: 'review', lang: cid, back: `#/c/${cid}` };
}
