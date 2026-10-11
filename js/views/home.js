// Главная: приветствие, повторение на сегодня / дневная цель, список курсов.
import { h, icon } from '../dom.js';
import { store } from '../store.js';
import { config } from '../config.js';
import { loadCourse } from '../courses.js';
import * as courseView from './course.js';
import { todayXp, dailyGoal, currentStreak, streakBroken, activeVacation } from '../gamify.js';
import { dueBreakdown } from './review.js';
import { view, head, progress } from './common.js';
import { plural } from '../util.js';
import { PROVERBS } from '../../data/sr/proverbs.js';
import { withoutScript } from '../script.js';

function greeting() {
  const hr = new Date().getHours();
  return hr < 5 ? 'Доброй ночи' : hr < 12 ? 'Доброе утро' : hr < 18 ? 'Добрый день' : 'Добрый вечер';
}

const CID = 'sr';

/** Главная — сразу курс сербского: приветствие, повторение на сегодня и карта юнитов. */
export async function render() {
  const state = store.state;
  const course = await loadCourse(CID);
  const meta = await courseView.render({ cid: CID });
  const goal = dailyGoal(state);
  const xp = todayXp(state);
  const due = { vocab: 0, skills: 0, mistakes: 0, total: 0, courses: [] };
  const cs = course && state.courses[CID];
  if (cs) {
    const d = dueBreakdown(cs);
    due.vocab = d.vocab; due.skills = d.skills; due.mistakes = d.mistakes; due.total = d.total;
    if (d.total) due.courses.push(CID);
  }
  const subParts = [];
  if (due.total) subParts.push(`${due.total} ${plural(due.total, ['карточка ждёт', 'карточки ждут', 'карточек ждут'])} повторения.`);
  if (activeVacation(state)) subParts.push('Серия на паузе.');
  else if (streakBroken(state)) subParts.push(`Серия прервалась — бывает. Рекорд: ${state.stats.streak.best} ${plural(state.stats.streak.best, ['день', 'дня', 'дней'])}.`);
  subParts.push(xp >= goal ? 'Дневная цель выполнена.' : `До дневной цели — ${goal - xp} XP.`);
  meta.el.prepend(head(greeting(), subParts.join(' ')), daily(state, due, goal, xp));
  meta.el.querySelector('.course-head')?.after(proverb(), alphabetStrip());   // под кнопкой «Начать», перед картой юнитов
  return { ...meta, back: null, tab: 'home' };
}

function daily(state, due, goal, xp) {
  if (due.total) {
    const cross = (state.settings.crossLanguage ?? config.session.crossLanguage) && due.courses.length > 1;
    const href = cross ? '#/review/all' : `#/c/${state.lastCourse && due.courses.includes(state.lastCourse) ? state.lastCourse : due.courses[0]}/review/play`;
    const n = Math.min(due.total, config.session.reviewLength);
    const parts = [due.vocab && `лексика ${due.vocab}`, due.skills && `грамматика ${due.skills}`, due.mistakes && `ошибки ${due.mistakes}`].filter(Boolean);
    return h('div', { class: 'daily' },
      h('div', null,
        h('p', { class: 'daily__title' }, 'Повторение на сегодня'),
        h('p', { class: 'daily__sub' }, `${parts.join(' · ')} · ≈ ${Math.max(1, Math.round(n * 0.4))} мин`)),
      h('a', { class: 'btn btn--primary btn--sm', href }, 'Начать'));
  }
  const streak = currentStreak(state);
  return h('div', { class: 'daily' },
    h('div', null,
      h('p', { class: 'daily__title' }, `Цель на день: ${Math.min(xp, goal)} / ${goal} XP`),
      h('p', { class: 'daily__sub' }, streak ? `Серия: ${streak} ${plural(streak, ['день', 'дня', 'дней'])}` : 'Серия начнётся, когда вы выполните цель')),
    xp >= goal ? h('span', { class: 'badge badge--ok' }, 'Готово') : h('span'),
    progress(xp / goal, 'progress--ok progress--thin', 'Цель на день'));
}

/** «Poslovica dana»: пословица по дню года (без состояния, офлайн). */
function proverb() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86_400_000);
  const [sr, ru] = PROVERBS[day % PROVERBS.length];
  return h('figure', { class: 'proverb' },
    h('figcaption', { class: 'proverb__label' }, 'Poslovica dana'),
    h('blockquote', { class: 'proverb__text', lang: 'sr' }, sr),
    h('p', { class: 'proverb__ru' }, ru));
}

/** Особые буквы сербской кириллицы — «герои» алфавита; ведут в справочник. */
const HEROES = [['Ђ', 'đ'], ['Ј', 'j'], ['Љ', 'lj'], ['Њ', 'nj'], ['Ћ', 'ć'], ['Џ', 'dž']];
function alphabetStrip() {
  return withoutScript(() => h('a', { class: 'heroes', href: '#/ref', 'aria-label': 'Особые буквы сербского: Ђ Ј Љ Њ Ћ Џ. Открыть алфавит в справочнике' },
    h('span', { class: 'heroes__row', 'data-keep-script': '' }, HEROES.map(([c, l], i) => {
      const t = h('span', { class: 'heroes__tile', 'aria-hidden': 'true' }, h('b', null, c), h('i', null, l));
      t.style.setProperty('--i', String(i));
      return t;
    })),
    h('span', { class: 'heroes__cap' }, 'Шесть особых букв', icon('chevron'))));
}
