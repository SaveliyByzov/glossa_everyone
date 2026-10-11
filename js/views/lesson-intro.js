// Вступление к уроку: цели, теория, текст для чтения, лексика урока, кнопка «Начать упражнения».
import { h, icon } from '../dom.js';
import { store } from '../store.js';
import { loadCourse } from '../courses.js';
import { renderInline, stripMarkup } from '../markup.js';
import { speakerFor } from '../tts.js';
import { effective, lessonOpen } from '../mastery.js';
import { lessonExercises } from '../session.js';
import { view, empty, mastery, KIND_LABEL, section, roman } from './common.js';
import { theory, reading, speakBtn } from './theory.js';

/** Оценка времени чтения теории (минуты): ~170 слов/мин. */
function readingMinutes(lesson) {
  const text = JSON.stringify([lesson.theory || [], lesson.text || '']);
  return Math.max(1, Math.round(stripMarkup(text).split(/\s+/).length / 170));
}

export async function render({ cid, lid }) {
  const course = await loadCourse(cid);
  const lesson = course?.lessonsById.get(lid);
  if (!lesson) {
    return { el: view('lesson-intro', empty({ title: 'Урок не найден', action: { href: `#/c/${cid}`, label: 'К карте курса' } })), title: 'Урок', back: `#/c/${cid}`, tab: 'home', lang: cid };
  }
  const cs = store.state.courses[cid];
  const ctx = { lang: course.tts || cid, speak: speakerFor(course), course };
  const rec = cs?.lessons?.[lid];
  const eff = effective(rec);
  const title = `Юнит ${roman(lesson.unitIndex + 1)} · урок ${lesson.lessonIndex + 1}`;
  const el = view('lesson-intro');

  el.append(h('header', { class: 'lesson-head' },
    h('span', { class: 'chip chip--accent' }, `${KIND_LABEL[lesson.kind] || 'Урок'} · ${readingMinutes(lesson)} мин`),
    h('h2', { class: 'lesson-head__title' }, renderInline(lesson.title || lesson.id)),
    eff.mastery ? h('p', { class: 'muted' }, mastery(eff.mastery), eff.cracked ? ' Урок «треснул» — самое время повторить.' : '') : null,
    lesson.goals?.length ? h('ul', { class: 'goals' }, lesson.goals.map((g) => h('li', null, icon('check'), h('span', null, renderInline(g))))) : null));

  if (!lessonOpen(course, cs, lesson)) {
    el.append(empty({ title: 'Урок пока закрыт', text: 'Пройдите предыдущие уроки юнита.', action: { href: `#/c/${cid}`, label: 'К карте курса' } }));
    return { el, title, back: `#/c/${cid}`, tab: 'home', lang: cid };
  }

  if (lesson.theory?.length) el.append(theory(lesson.theory, ctx, { compact: course.mode === 'review' && !!rec?.done, keep: !!lesson.keepScript }));
  const text = reading(lesson.text, ctx);
  if (text) el.append(text);
  if (lesson.vocab?.length && (lesson.kind === 'vocab' || !lesson.theory?.length)) el.append(vocabPreview(lesson, ctx));

  const playable = lessonExercises(course, lesson).length > 0;
  el.append(h('div', { class: 'view__actions' },
    playable
      ? h('a', { class: 'btn btn--primary btn--block', href: `#/c/${cid}/l/${lid}/play`, id: 'start' }, rec?.done ? 'Повторить урок' : 'Начать упражнения', h('span', { class: 'btn__hint' }, 'Enter'))
      : h('p', { class: 'muted' }, 'Упражнения к этому уроку ещё готовятся.')));

  const keys = (e) => {
    if (e.key === 'Enter' && !e.target.closest?.('input, textarea, button, a')) { e.preventDefault(); document.getElementById('start')?.click(); }
  };
  return { el, title, back: `#/c/${cid}`, tab: 'home', lang: cid, keys };
}

function vocabPreview(lesson, ctx) {
  return section('Слова урока', String(lesson.vocab.length),
    h('div', { class: 'dict' }, lesson.vocab.map((v) => h('article', { class: 'entry' },
      h('p', { class: 'entry__head', lang: ctx.lang },
        h('span', { class: 'entry__word' }, renderInline(v.w)), ' ',
        v.forms ? h('span', { class: 'entry__forms' }, renderInline(v.forms)) : null),
      h('p', { class: 'entry__gloss' }, renderInline(v.ru)),
      h('div', { class: 'entry__side' }, speakBtn(v.w, ctx, `Озвучить ${stripMarkup(v.w)}`))))));
}
