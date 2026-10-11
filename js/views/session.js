// Экран сессии: упражнения → обратная связь → (повтор ошибок в конце) → результат.
// Один раннер для урока, повторения, испытания юнита, входного теста, тренировки навыка и разбора ошибок.
// Разметка — по design/gallery.html; лист обратной связи всегда в DOM, переключается .is-open.

import { h, icon } from '../dom.js';
import { md, renderInline } from '../markup.js';
import { store } from '../store.js';
import { config } from '../config.js';
import { loadCourse, listCourses } from '../courses.js';
import { renderExercise } from '../exercises/index.js';
import { speakerFor } from '../tts.js';
import { celebrate, toast, vibrate, announce, confirmDialog } from '../ui.js';
import { go } from '../router.js';
import { startRun, recordAnswer, finishRun } from '../progress.js';
import { buildLesson, buildReview, buildBoss, buildPlacement, buildSkillTraining, buildRetry, crossLanguageBlocks } from '../session.js';
import { nextLesson, lessonOpen } from '../mastery.js';
import { buildWords } from '../words.js';
import { todayXp, dailyGoal, currentStreak } from '../gamify.js';
import { view, empty, progress, setProgress, mastery, ledgerRow } from './common.js';
import { theory } from './theory.js';
import { withoutScript, srKeyboard } from '../script.js';
import { plural } from '../util.js';
import { sync } from '../sync.js';

// --- точки входа (маршруты) ----------------------------------------------------------

export async function lessonSession({ cid, lid }, shell) {
  const course = await loadCourse(cid);
  const lesson = course?.lessonsById.get(lid);
  if (!lesson) return missing(cid);
  const cs = store.course(cid);
  if (!lessonOpen(course, cs, lesson)) return missing(cid, 'Урок пока закрыт');
  return run(shell, { mode: 'lesson', items: buildLesson(course, cs, lesson), course, lesson, exit: `#/c/${cid}/l/${lid}`, title: lesson.title });
}

export async function reviewSession({ cid }, shell) {
  const course = await loadCourse(cid);
  if (!course) return missing(cid);
  return run(shell, { mode: 'review', items: buildReview(course, store.course(cid)), course, exit: `#/c/${cid}/review`, title: 'Повторение' });
}

export async function skillSession({ cid, skill }, shell) {
  const course = await loadCourse(cid);
  if (!course) return missing(cid);
  return run(shell, { mode: 'skill', items: buildSkillTraining(course, store.course(cid), skill), course, exit: `#/c/${cid}/review`, title: course.skills[skill]?.name || 'Навык' });
}

export async function bossSession({ cid, uid }, shell) {
  const course = await loadCourse(cid);
  const unit = course?.units.find((u) => u.id === uid);
  if (!unit) return missing(cid);
  return run(shell, { mode: 'boss', items: buildBoss(course, store.course(cid), unit), course, unit, exit: `#/c/${cid}`, title: 'Испытание юнита' });
}

export async function placementSession({ cid, uid }, shell) {
  const course = await loadCourse(cid);
  const unit = course?.units.find((u) => u.id === uid);
  if (!unit) return missing(cid);
  return run(shell, { mode: 'placement', items: buildPlacement(course, unit), course, unit, exit: `#/c/${cid}`, title: 'Входной тест' });
}

/** Межъязыковое повторение: блоки по 3–5 заданий одного курса. */
export async function crossSession(_, shell) {
  const state = store.state;
  const courses = (await Promise.all(listCourses().filter((c) => state.courses[c.id]).map((c) => loadCourse(c.id)))).filter(Boolean);
  const per = courses.map((c) => buildReview(c, store.course(c.id), { length: Math.ceil(config.session.reviewLength / Math.max(1, courses.length)) + 2 }));
  const items = crossLanguageBlocks(per).slice(0, config.session.reviewLength);
  return run(shell, { mode: 'review', items, course: null, courses, exit: '#/', title: 'Повторение' });
}

/** Тренировка лексики: /c/:cid/words/play/:mode/:src/:n — режим, источник слов, длина (0 — все). */
export async function wordsSession({ cid, mode, src, n }, shell) {
  const course = await loadCourse(cid);
  if (!course) return missing(cid);
  const items = buildWords(course, store.course(cid), { source: src, mode, length: Number(n) || 0 });
  return run(shell, { mode: 'words', items, course, exit: `#/c/${cid}/words`, title: 'Лексика' });
}

function missing(cid, title = 'Нечего показать') {
  const back = cid ? `#/c/${cid}` : '#/';
  return { el: view('review', empty({ title, action: { href: back, label: 'Назад' } })), title: 'Сессия', back, lang: cid };
}

// --- раннер ---------------------------------------------------------------------------------

// в этих типах given — перечень ошибок, а не ответ: не зачёркиваем
const LIST_GIVEN = new Set(['match', 'classify', 'paradigm']);
const PRAISE = ['Верно', 'Точно', 'Отлично', 'Так и есть'];
const isTouch = () => matchMedia('(pointer: coarse)').matches;

/** Подсвечивает отличие ввода от эталона (общий префикс/суффикс без учёта регистра и конечной точки). */
function diffNode(given, expected) {
  const g = given.toLowerCase();
  const e = expected.toLowerCase().replace(/[.!?…]+$/, '');
  let a = 0;
  while (a < g.length && a < e.length && g[a] === e[a]) a++;
  let b = 0;
  while (b < g.length - a && b < e.length - a && g[g.length - 1 - b] === e[e.length - 1 - b]) b++;
  const mid = given.slice(a, given.length - b);
  // пустая середина = пропущенный символ: рисуем «вставочный» штрих
  return [given.slice(0, a), mid ? h('span', { class: 'feedback__diff' }, mid) : h('span', { class: 'feedback__diff feedback__diff--gap', 'aria-label': 'пропущено' }), given.slice(given.length - b)];
}

function run(shell, opts) {
  const { items, course, exit } = opts;
  if (!items.length) {
    const review = opts.mode === 'review';
    const words = opts.mode === 'words';
    const text = review ? 'Всё свежо в памяти. Загляните позже или пройдите новый урок.' : words ? 'В выбранном наборе нет подходящих слов. Выберите другой источник или режим.' : 'Для этого раздела пока нет упражнений.';
    return { el: view('review', empty({ title: review ? 'На сегодня всё повторено' : words ? 'Нет слов для тренировки' : 'Пока пусто', text, action: { href: exit, label: 'Назад' } })), title: opts.title, back: exit, lang: course?.id, tab: review ? 'review' : undefined };
  }

  const state = store.state;
  const r = startRun(state, opts.mode, items, opts);
  let ctrl = null;          // контроллер текущего упражнения
  let item = null;
  let phase = 'answer';     // 'answer' | 'feedback' | 'done'
  let lastInput = null;

  // каркас
  const bar = progress(0, 'progress--ticks', opts.mode === 'lesson' ? 'Прогресс урока' : 'Прогресс');
  const count = h('span', { class: 'session__count' });
  const closeBtn = h('button', { class: 'btn btn--icon btn--ghost', type: 'button', 'aria-label': 'Завершить (Esc)', onclick: () => exitSession() }, icon('x'));
  const body = h('div', { class: 'session__body' });
  const undoBtn = h('button', { class: 'btn btn--icon btn--outline', type: 'button', 'aria-label': 'Очистить последнее', onclick: () => ctrl?.undo?.() }, icon('backspace'));
  const ruleBtn = h('button', { class: 'btn btn--icon btn--ghost', type: 'button', 'aria-label': 'Правило', title: 'Правило', onclick: () => openRule() }, icon('book'));
  const tools = h('div', { style: { display: 'flex', gap: 'var(--s-2)' } }, ruleBtn, undoBtn);
  const checkBtn = h('button', { class: 'btn btn--primary btn--block', type: 'button', disabled: true, onclick: () => check() }, 'Проверить ', h('span', { class: 'btn__hint' }, 'Enter'));
  const footer = h('footer', { class: 'session__footer' }, tools, checkBtn);
  const sheet = h('div', { class: 'sheet feedback' });
  const ruleSheet = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Правило' });
  const el = view('session',
    h('header', { class: 'session__bar' }, closeBtn, bar, count),
    body, footer, sheet, ruleSheet);
  if (course) el.dataset.lang = course.id;

  body.addEventListener('focusin', (e) => { if (e.target.matches('input, textarea')) lastInput = e.target; });

  function ctxFor(it) {
    const c = it.course;
    return {
      course: c,
      lang: c.tts || c.id,
      policy: c.answer,
      speak: speakerFor(c),
      changed: () => { checkBtn.disabled = !ctrl?.ready(); },
      submit: () => check(),
      answer: (res) => commit(res),     // упражнения без «Проверить» (карточки слов)
      autoCheck: () => setTimeout(check, 250),
      vibrate,
    };
  }

  function updateBar() {
    const total = r.queue.length;
    bar.style.setProperty('--steps', String(total));
    setProgress(bar, r.pos / total);
    count.textContent = `${Math.min(r.pos + 1, total)}/${total}`;
  }

  function show() {
    phase = 'answer';
    item = r.queue[r.pos];
    lastInput = null;
    closeSheet(sheet);
    closeSheet(ruleSheet);
    updateBar();
    if (item.course) { el.dataset.lang = item.course.id; shell.setLang(item.course.id); }
    try {
      el.toggleAttribute('data-keep-script', !!item.ex.keepScript);   // упражнения об алфавитах — без транслитерации
      ctrl = item.ex.keepScript ? withoutScript(() => renderExercise(item.ex, ctxFor(item))) : renderExercise(item.ex, ctxFor(item));
    } catch (err) {
      console.error('[glossa] упражнение пропущено из-за ошибки данных', item.ref.key, err);
      r.queue.splice(r.pos, 1);
      if (r.pos >= r.queue.length) return finish();
      return show();
    }
    if (item.retry) ctrl.el.querySelector('.ex__prompt')?.prepend(h('span', { class: 'chip chip--quiet' }, 'Ещё раз'), ' ');
    body.replaceChildren(ctrl.el);
    const kb = item.course.id === 'sr' ? srKeyboard() : (item.course.keyboard || []);   // сербский: символы выбранного алфавита
    if (ctrl.usesInput && kb.length) ctrl.el.append(specialKeys(kb));
    const lesson = item.ref.lessonId && item.course.lessonsById.get(item.ref.lessonId);
    ruleBtn.hidden = !(lesson?.theory?.length) || opts.mode === 'placement' || opts.mode === 'boss';
    undoBtn.hidden = !ctrl.undo;
    tools.hidden = ruleBtn.hidden && undoBtn.hidden;
    checkBtn.disabled = !ctrl.ready();
    footer.hidden = !!ctrl.instant;
    if (!isTouch() || ctrl.usesInput) ctrl.focus?.();
  }

  function specialKeys(chars) {
    const kb = h('div', { class: 'keyboard', role: 'group', 'aria-label': 'Особые символы' });
    for (const ch of chars) {
      const key = h('button', { class: 'keyboard__key', type: 'button', tabindex: '-1', lang: item.course.id, title: 'Shift — заглавная' }, ch);
      key.addEventListener('pointerdown', (e) => e.preventDefault()); // поле не теряет фокус
      key.addEventListener('click', (e) => insertChar(e.shiftKey ? ch.toLocaleUpperCase() : ch));
      kb.append(key);
    }
    return kb;
  }

  function insertChar(ch) {
    const input = (lastInput?.isConnected && !lastInput.hidden ? lastInput : null) || body.querySelector('input:not([readonly]):not([hidden]), textarea:not([readonly])');
    if (!input || input.readOnly) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.setRangeText(ch, start, end, 'end');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus({ preventScroll: true });
    vibrate('tick');
  }

  function check() {
    if (phase !== 'answer' || !ctrl?.ready()) return;
    phase = 'feedback';
    const result = ctrl.check();
    const { xp, fixed } = recordAnswer(state, r, item, result);
    store.save();
    if (isTouch()) document.activeElement?.blur?.();
    showFeedback(result, xp, fixed);
    vibrate(result.correct ? 'ok' : 'error');
  }

  /** Оценка без листа обратной связи: записать и сразу к следующему. */
  function commit(result) {
    if (phase !== 'answer') return;
    phase = 'feedback';
    recordAnswer(state, r, item, result);
    store.save();
    vibrate(result.correct ? 'ok' : 'error');
    advance();
  }

  function showFeedback(res, xp, fixed) {
    const kind = !res.correct ? 'wrong' : res.almost ? 'almost' : 'correct';
    const title = kind === 'wrong' ? 'Неверно' : kind === 'almost' ? 'Почти верно' : PRAISE[Math.floor(Math.random() * PRAISE.length)];
    const lang = ctrl.answerLang === 'ru' ? null : (item.course.tts || item.course.id);
    sheet.className = `sheet feedback feedback--${kind}`;
    if (kind === 'wrong') { sheet.setAttribute('role', 'alert'); sheet.removeAttribute('aria-live'); }
    else { sheet.setAttribute('role', 'status'); sheet.setAttribute('aria-live', 'polite'); }
    const next = h('button', { class: 'btn btn--primary btn--block feedback__next', type: 'button', onclick: () => advance() },
      kind === 'wrong' ? 'Понятно ' : 'Дальше ', h('span', { class: 'btn__hint' }, 'Enter'));
    const showAnswer = kind !== 'correct' && res.expected;
    sheet.replaceChildren(h('div', { class: 'sheet__inner' },
      h('div', { class: 'feedback__head' },
        h('span', { class: 'feedback__icon', 'aria-hidden': 'true' }, icon(kind === 'wrong' ? 'x' : kind === 'almost' ? 'almost' : 'check')),
        h('h2', { class: 'feedback__title' }, title),
        xp ? h('span', { class: 'feedback__xp' }, `+${xp} XP`) : null),
      showAnswer ? h('p', { class: 'feedback__answer' },
        h('span', { class: 'label' }, kind === 'almost' ? 'Правильно' : 'Правильный ответ'),
        h('span', { class: 'tl', lang }, res.expected)) : null,
      kind === 'wrong' && res.given && LIST_GIVEN.has(item.ex.type) ? h('p', { class: 'feedback__mine' },
        item.ex.type === 'match' ? res.given[0].toUpperCase() + res.given.slice(1) : ['Ошибки: ', h('span', { lang }, res.given)]) : null,
      kind === 'wrong' && res.given && !LIST_GIVEN.has(item.ex.type) ? h('p', { class: 'feedback__mine' }, 'Ваш ответ: ', h('s', { lang }, res.given)) : null,
      kind === 'almost' && res.given ? h('p', { class: 'feedback__mine' }, 'Ваш ответ: ', h('span', { lang }, diffNode(res.given, res.expected))) : null,
      fixed ? h('p', { class: 'feedback__mine' }, 'Ошибка ушла из банка ошибок.') : null,
      item.ex.explain ? md('p', 'feedback__explain', item.ex.explain) : null,
      h('div', { class: 'feedback__actions' }, next)));
    body.inert = true;
    footer.inert = true;
    openSheet(sheet);
    if (kind !== 'wrong') announce(title);
    next.focus({ preventScroll: true });
  }

  function advance() {
    if (phase !== 'feedback') return;
    body.inert = false;
    footer.inert = false;
    r.pos += 1;
    if (r.pos >= r.queue.length) finish();
    else show();
  }

  // лист всегда в DOM: класс ставим синхронно (rAF в фоновой вкладке может «опоздать» и открыть лист после закрытия)
  function openSheet(s) { void s.offsetWidth; s.classList.add('is-open'); }
  function closeSheet(s) { s.classList.remove('is-open'); }

  function openRule() {
    const lesson = item.course.lessonsById.get(item.ref.lessonId);
    if (!lesson?.theory?.length) return;
    const close = h('button', { class: 'btn btn--icon btn--ghost', type: 'button', 'aria-label': 'Закрыть', style: { marginLeft: 'auto' }, onclick: () => { closeSheet(ruleSheet); ctrl?.focus?.(); } }, icon('x'));
    ruleSheet.replaceChildren(h('div', { class: 'sheet__inner' },
      h('div', { class: 'sheet__grip', 'aria-hidden': 'true' }),
      h('div', { class: 'feedback__head' }, h('h2', { class: 'feedback__title' }, renderInline(lesson.title || 'Правило')), close),
      theory(lesson.theory, ctxFor(item), { keep: !!lesson.keepScript })));
    openSheet(ruleSheet);
    setTimeout(() => close.focus({ preventScroll: true }), 50);
  }

  async function exitSession() {
    if (phase === 'done' || r.first.length === 0 || await confirmDialog({ title: 'Выйти из сессии?', text: 'Ответы и опыт сохранятся, но урок не будет засчитан.', ok: 'Выйти', cancel: 'Остаться' })) {
      go(exit.replace(/^#/, ''));
    }
  }

  // клавиатура: 1–9 / Backspace — упражнению, Enter — проверить/дальше, Esc — выход
  function keys(e) {
    if (phase === 'done' || document.querySelector('dialog[open]')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ruleSheet.classList.contains('is-open')) closeSheet(ruleSheet); else exitSession();
      return;
    }
    if (ruleSheet.classList.contains('is-open')) return;
    if (ctrl?.instant) {      // карточки: пробел/Enter — перевернуть, 1–4 — оценка
      if (phase === 'answer' && !e.target.matches?.('input, textarea') && ctrl.key?.(e)) e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      if (e.defaultPrevented || e.isComposing || e.shiftKey) return;
      e.preventDefault();   // и отменяет «клик» по сфокусированной кнопке — без двойного срабатывания
      if (phase === 'feedback') advance(); else check();
      return;
    }
    if (phase !== 'answer' || e.target.matches?.('input, textarea')) return;
    if (ctrl?.key?.(e)) e.preventDefault();
  }

  function finish() {
    phase = 'done';
    const summary = finishRun(state, r, opts.courses || [course]);
    store.save();
    sync.flush();                                  // после каждой законченной сессии — сразу в облако (если есть профиль)
    vibrate('done');
    shell.replace(resultView(summary));
  }

  // --- экран результата ---
  function resultView(s) {
    const pct = Math.round(s.accuracy * 100);
    const t = resultTexts(s, opts);
    const res = view('result');
    const sealIcon = icon('check');
    sealIcon.style.cssText = 'width:40px;height:40px;stroke-width:2';
    const retryIcon = icon('repeat');
    retryIcon.style.cssText = 'width:36px;height:36px';
    const box = h('div', { class: 'result' },
      h('div', { class: ['result__seal', s.perfect && 'result__seal--perfect', !t.ok && 'result__seal--retry'], 'aria-hidden': 'true' }, t.ok ? sealIcon : retryIcon),
      h('h2', { class: 'result__title' }, t.title),
      h('p', { class: 'result__sub' }, t.sub),
      s.mastery ? mastery(s.mastery.after, { lg: true, newFrom: s.mastery.before, label: `Мастерство ${s.mastery.after} из 5` }) : null);
    const goal = dailyGoal(state);
    const streak = currentStreak(state);
    const rows = [
      ['Опыт', `+${s.xp} XP`, 'xp'],
      ['Точность', `${s.correct} из ${s.total} · ${pct} %`, ''],
      r.xpFactor < 1 ? ['Урок уже освоен', `XP ×${r.xpFactor}`, ''] : null,
      s.fixed ? ['Исправлено ошибок', String(s.fixed), 'ok'] : null,
      s.placement?.granted?.length ? ['Зачтено уроков', String(s.placement.granted.length), 'ok'] : null,
      ['Цель на день', `${Math.min(todayXp(state), goal)} / ${goal} XP`, todayXp(state) >= goal ? 'ok' : ''],
      streak ? ['Серия', `${streak} ${plural(streak, ['день', 'дня', 'дней'])}`, 'ok'] : null,
    ].filter(Boolean);
    box.append(h('div', { class: 'ledger' }, rows.map(([l, v, m], i) => ledgerRow(l, v, m, i))));

    if (s.mistakes.length) {
      box.append(h('div', { class: 'mistakes' },
        h('h3', { class: 'section__title' }, 'В банк ошибок', h('small', null, 'вернутся в повторении')),
        h('ul', null, s.mistakes.map(({ item: it, result }) => {
          const skill = it.ref.skill && it.course.skills?.[it.ref.skill]?.name;
          return h('li', null,
            h('span', { class: 'tl', lang: it.ex.type === 'translate' && it.ex.dir === 'toRu' ? null : (it.course.tts || it.course.id) }, result.expected || '—'),
            skill ? h('span', { class: 'badge badge--bad' }, skill) : h('span'),
            it.ex.explain ? md('span', 'ru', it.ex.explain) : result.given ? h('span', { class: 'ru' }, `ваш ответ: ${result.given}`) : null);
        }))));
    }
    res.append(box);
    if (t.ok) setTimeout(() => celebrate(box, course?.keyboard?.filter?.((k) => typeof k === 'string' && k.length <= 2)), 120);

    const primary = nextAction(s);
    const actions = h('div', { class: 'view__actions' },
      h('a', { class: 'btn btn--primary btn--block', href: primary.href, id: 'result-next' }, primary.label, ' ', h('span', { class: 'btn__hint' }, 'Enter')));
    if (s.mistakes.length && opts.mode !== 'placement' && opts.mode !== 'boss') {
      actions.append(h('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: () => {
        shell.replace(run(shell, { ...opts, mode: opts.mode === 'words' ? 'words' : 'retry', items: buildRetry(s.mistakes.map((m) => m.item)), title: opts.mode === 'words' ? 'Лексика' : 'Разбор ошибок' }));
      } }, opts.mode === 'words' ? 'Повторить ошибки' : 'Разобрать ошибки'));
    }
    res.append(actions);

    s.achievements?.forEach((a, i) => setTimeout(() => toast(`Новое достижение: «${a.title}»`, { kind: 'achievement', icon: 'medal', timeout: 4000 }), 600 + i * 4200));
    announce(`${t.title}. Точность ${pct} %, плюс ${s.xp} XP.`);
    const onEnter = (e) => { if (e.key === 'Enter' && !e.target.closest?.('button, a, input')) { e.preventDefault(); document.getElementById('result-next')?.click(); } };
    return { el: res, title: t.title, back: exit, lang: course?.id, keys: onEnter };
  }

  function nextAction(s) {
    if (!course) return { href: '#/', label: 'Готово' };
    if (opts.mode === 'lesson') {
      const next = nextLesson(course, state.courses[course.id]);
      if (s.mastery?.after >= 1 && next && next.id !== opts.lesson.id) return { href: `#/c/${course.id}/l/${next.id}`, label: 'Следующий урок' };
    }
    if (opts.mode === 'review' || opts.mode === 'skill' || opts.mode === 'retry' || opts.mode === 'words') return { href: exit, label: 'Готово' };
    return { href: `#/c/${course.id}`, label: 'К карте курса' };
  }

  queueMicrotask(show);
  return { el, title: opts.title, back: exit, lang: course?.id, focus: true, keys };
}

function resultTexts(s, opts) {
  const pct = Math.round(s.accuracy * 100);
  switch (opts.mode) {
    case 'boss': return s.boss?.passed
      ? { ok: true, title: 'Испытание пройдено', sub: `Юнит освоен: все уроки — не ниже уровня ${config.session.boss?.grantMastery ?? 4}.` }
      : { ok: false, title: 'Пока не получилось', sub: `Нужно ${Math.round((s.boss?.pass ?? 0.8) * 100)} %. Ошибки ушли в банк — вернитесь завтра.` };
    case 'placement': return s.placement?.granted?.length
      ? { ok: true, title: 'Входной тест пройден', sub: `Зачтено ${s.placement.granted.length} ${plural(s.placement.granted.length, ['урок', 'урока', 'уроков'])}. Остальное — по порядку.` }
      : { ok: false, title: 'Тест завершён', sub: 'Юнит открыт; ошибки теста — в банке ошибок для повторения.' };
    case 'review': return { ok: true, title: 'Повторение завершено', sub: s.fixed ? `Исправлено ошибок: ${s.fixed}.` : `Точность ${pct} %.` };
    case 'words': return { ok: s.accuracy >= 0.6, title: s.perfect ? 'Все слова на месте' : 'Слова потренированы', sub: s.mistakes.length ? `Слов с ошибками: ${s.mistakes.length}. Они вернутся в «трудных».` : `Точность ${pct} %.` };
    case 'retry': return { ok: true, title: 'Ошибки разобраны', sub: `Точность ${pct} %.` };
    case 'skill': return { ok: true, title: 'Тренировка завершена', sub: opts.title };
    default:
      if (s.perfect) return { ok: true, title: 'Без единой ошибки', sub: opts.lesson?.title || '' };
      if (s.mastery?.after >= 1) return { ok: true, title: 'Урок пройден', sub: s.mastery.restored ? 'Уровень восстановлен — следующий срок свежести вдвое дольше.' : opts.lesson?.title || '' };
      return { ok: false, title: 'Почти получилось', sub: `Для зачёта нужно ${Math.round((config.mastery.thresholds?.[0] ?? 0.6) * 100)} %. Разберите ошибки и попробуйте снова.` };
  }
}
