// Карта курса: юниты, уроки, мастерство, входной тест («тест-переход») и испытание юнита.
import { h, icon } from '../dom.js';
import { store } from '../store.js';
import { loadCourse } from '../courses.js';
import { renderInline } from '../markup.js';
import { effective, lessonOpen, unitOpen, unitPassed, nextLesson, courseProgress, bossState, placementAllowed, lessonDone } from '../mastery.js';
import { dueCount } from './review.js';
import { view, progress, mastery, glyph, empty, KIND_LABEL, KIND_ICON, fmtDuration, roman } from './common.js';
import { plural } from '../util.js';

export async function render({ cid }) {
  const course = await loadCourse(cid);
  if (!course) {
    const el = view('course', empty({ title: 'Курс недоступен', text: `Курс «${cid}» ещё не готов или не загрузился.`, action: { href: '#/', label: 'На главную' } }));
    return { el, title: 'Курс', tab: 'home', back: '#/' };
  }
  store.update((s) => { s.lastCourse = cid; });
  const cs = store.state.courses[cid];
  const now = Date.now();
  const next = nextLesson(course, cs, now);
  const prog = courseProgress(course, cs);
  const due = dueCount(course, cs, now);

  const el = view('course');
  el.append(h('div', { class: 'course-head' },
    glyph(cid, course),
    h('div', null,
      h('h2', { class: 'course-head__title', lang: cid }, course.name),
      h('p', { class: 'course-head__meta' }, `${course.nameRu} · ${prog.done} из ${prog.total} ${plural(prog.total, ['урока', 'уроков', 'уроков'])}${course.level ? ` · ${course.level}` : ''}`)),
    progress(prog.ratio, '', 'Прогресс курса'),
    h('div', { class: 'btn-row' },
      next ? h('a', { class: 'btn btn--primary', href: `#/c/${cid}/l/${next.id}` }, prog.done ? 'Продолжить' : 'Начать') : null,
      h('a', { class: 'btn btn--outline', href: `#/c/${cid}/review` }, icon('repeat'), due ? `Повторить · ${due}` : 'Повторение'))));

  if (!course.units.length) {
    el.append(empty({ title: 'Юниты ещё не добавлены', text: 'Лингвисты работают над курсом.' }));
  } else {
    const units = h('div', { class: 'units' });
    course.units.forEach((unit, ui) => units.append(unitCard(course, cs, unit, ui, next, now)));
    el.append(units);
  }
  return { el, title: course.name, titleLang: cid, tab: 'home', lang: cid };
}

function unitCard(course, cs, unit, ui, next, now) {
  const open = unitOpen(course, cs, ui);
  const isCurrent = !!next && next.unitId === unit.id;
  const boss = bossState(course, cs, unit, now);
  const done = unit.lessons.filter((l) => lessonDone(cs, l.id)).length;
  const hasTarget = unit.title && unit.titleRu;
  const status = boss.passed ? h('span', { class: 'badge badge--gold', title: 'Испытание юнита пройдено' }, '★')
    : !open ? (() => { const s = icon('lock'); s.style.color = 'var(--ink-3)'; s.setAttribute('aria-label', 'Закрыт'); s.removeAttribute('aria-hidden'); return s; })()
      : h('span', { class: unitPassed(course, cs, unit) ? 'badge badge--ok' : 'badge' }, `${done}/${unit.lessons.length}`);
  const card = h('section', { class: ['unit', !open && 'is-locked', isCurrent && 'is-current'] },
    h('header', { class: 'unit__head' },
      h('span', { class: 'unit__num' }, roman(ui + 1)),
      h('div', null,
        h('h2', { class: 'unit__title', lang: hasTarget ? course.id : null }, renderInline(hasTarget ? unit.title : unit.titleRu || unit.title || unit.id)),
        hasTarget ? h('p', { class: 'unit__sub' }, renderInline(unit.titleRu)) : null),
      status));

  if (!open) {
    card.append(h('p', { class: 'unit__summary' }, placementAllowed(course) ? 'Знаете тему? Сдайте короткий тест и откройте юнит сразу.' : 'Откроется после предыдущего юнита.'));
  } else if (unit.summary) {
    card.append(h('p', { class: 'unit__summary' }, renderInline(unit.summary)));
  }

  if (open) {
    const lessons = h('ol', { class: 'unit__lessons' });
    for (const lesson of unit.lessons) lessons.append(h('li', null, lessonNode(course, cs, lesson, next, now)));
    card.append(lessons);
  }

  // входной тест (только review-режим) и испытание юнита
  const placementTaken = cs?.units?.[unit.id]?.placement;
  if (placementAllowed(course) && !placementTaken && !unitPassed(course, cs, unit)) {
    card.append(h('a', { class: 'btn btn--outline btn--sm unit__skip', href: `#/c/${course.id}/u/${unit.id}/placement` }, icon('skip'), open ? 'Входной тест' : 'Тест-переход'));
  }
  if (boss.available && !boss.passed) {
    card.append(boss.waitMs > 0
      ? h('p', { class: 'unit__summary' }, `Испытание юнита — снова через ${fmtDuration(boss.waitMs)}`)
      : h('a', { class: 'btn btn--outline btn--sm unit__skip', href: `#/c/${course.id}/u/${unit.id}/boss` }, icon('medal'), 'Испытание юнита'));
  }
  return card;
}

function lessonNode(course, cs, lesson, next, now) {
  const open = lessonOpen(course, cs, lesson);
  const rec = cs?.lessons?.[lesson.id];
  const eff = effective(rec, now);
  const done = !!rec?.done;
  const current = next?.id === lesson.id;
  const kindLabel = KIND_LABEL[lesson.kind] || 'Урок';
  const kind = current ? `Продолжить · ${kindLabel.toLowerCase()}` : eff.cracked ? `${kindLabel} · пора повторить` : kindLabel;
  const mark = h('span', { class: 'lesson-node__mark' }, icon(done && !eff.cracked ? 'check' : KIND_ICON[lesson.kind] || 'pilcrow'));
  const body = h('span', { class: 'lesson-node__body' },
    h('span', { class: 'lesson-node__title' }, renderInline(lesson.title || lesson.id)),
    h('span', { class: 'lesson-node__kind' }, kind));
  const cls = ['lesson-node', done && 'is-done', !open && 'is-locked', current && 'is-current'];
  if (!open) return h('a', { class: cls, 'aria-disabled': 'true' }, mark, body);
  return h('a', { class: cls, href: `#/c/${course.id}/l/${lesson.id}`, 'aria-current': current ? 'step' : null }, mark, body, mastery(eff.mastery));
}
