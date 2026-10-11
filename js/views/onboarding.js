// Знакомство: 6 экранов (приветствие → уровень [+ тест] → алфавит → цель → профиль → готово).
// Логика шагов — js/onboarding.js; здесь только DOM. Экран «голый» (meta.bare): без шапки и вкладок.
import { h, icon } from '../dom.js';
import { store } from '../store.js';
import { loadCourse } from '../courses.js';
import { renderExercise } from '../exercises/index.js';
import { speakerFor } from '../tts.js';
import { setScript, srKeyboard } from '../script.js';
import { celebrate, toast, vibrate, announce, reducedMotion } from '../ui.js';
import { go } from '../router.js';
import { sync, formatPhrase, normalizePhrase } from '../sync.js';
import { qrPath } from '../qr.js';
import { renderInline } from '../markup.js';
import { nextLesson } from '../mastery.js';
import {
  loadOnb, saveOnb, emptyOnb, nextStep, prevStep, dotIndex, DOTS, GOALS, REMINDERS, QUIZ_LENGTH,
  buildQuiz, placementUnit, applyStart, pickCheckGroups, checkGroups, phraseFromInput,
} from '../onboarding.js';

const CID = 'sr';
const SVG = 'http://www.w3.org/2000/svg';
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

/** Перезапуск из профиля: состояние шагов сбрасывается, прогресс остаётся. */
export function restart() { saveOnb({ ...emptyOnb(), done: false }); go('/start'); }

export async function render(_, shell) {
  const course = await loadCourse(CID);
  const onb = loadOnb();
  onb.done = false;
  let dir = 1;
  let quiz = null;                      // { items, pos, results, ctrl }
  let joinOpen = false, busy = false, qrOpen = false, checking = null, scan = null;

  const el = h('main', { class: 'view view--onb', id: 'view', tabindex: '-1' });
  const stage = h('div', { class: 'onb__stage' });
  const dots = h('ol', { class: 'onb__dots' });
  const back = h('button', { class: 'btn btn--icon btn--ghost onb__back', type: 'button', 'aria-label': 'Назад', onclick: () => go_(prevStep(onb), -1) }, icon('back'));
  const skip = h('button', { class: 'btn btn--ghost btn--sm onb__skip', type: 'button' }, 'Пропустить');
  el.append(h('header', { class: 'onb__head' }, back, dots, skip), stage);

  const save = () => saveOnb(onb);
  const settings = (fn) => store.update((s) => fn(s.settings));
  function go_(step, d = 1) {
    if (!step) return;
    stopScan();
    quiz = null; dir = d; onb.step = step; save(); draw();
  }
  const next = () => go_(nextStep(onb), 1);

  // --- каркас ------------------------------------------------------------------------------------
  function drawDots() {
    const at = dotIndex(onb.step);
    dots.replaceChildren(...DOTS.map((_, i) => h('li', { class: ['onb__dot', i < at && 'is-done', i === at && 'is-now'], 'aria-current': i === at ? 'step' : null })));
    dots.setAttribute('aria-label', `Шаг ${at + 1} из ${DOTS.length}`);
  }

  function draw() {
    drawDots();
    const s = onb.step;
    back.style.visibility = s === 'welcome' ? 'hidden' : '';
    skip.style.visibility = ['level', 'script', 'goal'].includes(s) ? '' : 'hidden';
    skip.onclick = () => { if (s === 'level') { onb.level = 'zero'; onb.startUnit = 0; } next(); };
    const body = ({ welcome, level, quiz: quizStep, result, script, goal, profile, done })[s]();
    stage.replaceChildren(body);
    if (!reducedMotion() && stage.animate) stage.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'none' }], { duration: 240, easing: EASE });
    else stage.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 120 });
    if (s !== 'quiz') {
      scrollTo({ top: 0 });
      const t = body.querySelector('h2');
      t?.focus({ preventScroll: true });
      announce(t?.textContent || '');
    }
  }

  /** Каркас шага: форма (Enter = «Дальше»), заголовок, содержимое, нижняя панель действий. */
  function step({ title, lead, content, primary = 'Дальше', onSubmit = next, disabled = false, extra = null, cls = '' }) {
    const h2 = h('h2', { class: 'onb__title', tabindex: '-1' }, title);
    const arrow = primary === 'Дальше' || primary.startsWith('Начать') || primary.startsWith('Проверить');
    const btn = h('button', { class: 'btn btn--primary btn--block', type: 'submit', disabled: disabled || busy || null }, primary, arrow ? icon('arrow-right') : null);
    return h('form', { class: ['onb__step', cls], novalidate: true, onsubmit: (e) => { e.preventDefault(); if (!btn.disabled) onSubmit(); } },
      h('div', { class: 'onb__main' }, h2, lead ? h('p', { class: 'onb__lead' }, lead) : null, content),
      h('div', { class: 'onb__actions' }, btn, extra));
  }

  /** Карточки-варианты на нативных radio: стрелки, фокус и скринридеры «бесплатно». */
  function options(name, label, items, value, onPick, cls = '') {
    const box = h('div', { class: ['onb-opts', cls], role: 'radiogroup', 'aria-label': label });
    for (const o of items) {
      const input = h('input', { class: 'onb-opt__in', type: 'radio', name, value: String(o.id) });
      input.checked = String(o.id) === String(value);
      input.addEventListener('change', () => { vibrate('tick'); onPick(o.id); });
      box.append(h('label', { class: 'onb-opt' }, input, h('span', { class: 'onb-opt__box' }, o.node, h('span', { class: 'onb-opt__check', 'aria-hidden': 'true' }, icon('check')))));
    }
    return box;
  }
  const optText = (t, sub, lead) => h('span', { class: 'onb-opt__txt' }, lead || null, t ? h('b', null, t) : null, sub ? h('small', null, sub) : null);

  // --- 1. приветствие -------------------------------------------------------------------------------
  function welcome() {
    const join = sync.enabled ? (joinOpen ? joinPanel() : h('button', { class: 'btn btn--outline btn--block', type: 'button', onclick: () => { joinOpen = true; draw(); stage.querySelector('#onb-phrase')?.focus(); } }, 'У меня уже есть профиль')) : null;
    return h('form', { class: 'onb__step onb__step--welcome', onsubmit: (e) => { e.preventDefault(); next(); } },
      h('div', { class: 'onb__main onb__main--center' },
        h('span', { class: 'onb-crest', 'aria-hidden': 'true' }, h('b', { 'data-keep-script': '', lang: 'sr' }, 'Ђ')),
        h('h2', { class: 'onb__brand', tabindex: '-1' }, 'Srpski'),
        h('p', { class: 'onb__lead onb__lead--big' }, 'Сербский с нуля: грамматика и лексика в коротких заданиях. Всё работает без интернета.'),
        h('span', { class: 'onb__band', 'aria-hidden': 'true' })),
      h('div', { class: 'onb__actions' },
        joinOpen ? null : h('button', { class: 'btn btn--primary btn--block', type: 'submit' }, 'Начать', icon('arrow-right')),
        join));
  }

  function joinPanel() {
    const input = h('input', { class: 'input onb__phrase-in', id: 'onb-phrase', type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', maxlength: '160' });
    const err = h('p', { class: 'onb__err', role: 'alert', hidden: true });
    const submit = h('button', { class: 'btn btn--primary btn--block', type: 'submit' }, 'Войти');
    const video = h('video', { class: 'onb__video', playsinline: true, muted: true, 'aria-label': 'Камера для QR-кода' });
    const scanBox = h('div', { class: 'onb__scan', hidden: true }, video, h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => { stopScan(); scanBox.hidden = true; } }, 'Закрыть камеру'));
    async function login(text) {
      const phrase = normalizePhrase(phraseFromInput(text));
      if (!phrase) { err.hidden = false; err.textContent = 'Нужна фраза из 25 символов или ссылка из QR-кода.'; input.focus(); return; }
      busy = true; submit.disabled = true; submit.textContent = 'Входим…'; err.hidden = true;
      try {
        await sync.joinProfile(phrase);
        onb.done = true; onb.cloud = 'joined'; save();
        sync.hooks.onApplied();
        toast('Вы вошли в профиль, прогресс подтянут', { kind: 'ok', icon: 'check' });
        go('/', { replace: true });
      } catch (e) { busy = false; submit.disabled = false; submit.textContent = 'Войти'; err.hidden = false; err.textContent = e.message || 'Не получилось войти'; }
    }
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); login(input.value); } });
    const canScan = 'BarcodeDetector' in globalThis && navigator.mediaDevices?.getUserMedia;
    return h('div', { class: 'onb__join' },
      h('label', { class: 'onb__label', for: 'onb-phrase' }, 'Фраза профиля или ссылка из QR-кода'),
      h('div', { class: 'onb__joinform' }, input, err, h('button', { class: 'btn btn--primary btn--block', type: 'button', onclick: () => login(input.value) }, 'Войти')),
      canScan ? h('button', { class: 'btn btn--outline btn--block', type: 'button', onclick: async () => { scanBox.hidden = false; scan = await startScan(video, (t) => { scanBox.hidden = true; input.value = t; login(t); }, () => { scanBox.hidden = true; toast('Камера недоступна — введите фразу вручную', { icon: 'x' }); }); } }, 'Сканировать QR') : null,
      scanBox,
      h('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: () => { joinOpen = false; stopScan(); draw(); } }, 'Назад'));
  }
  function stopScan() { scan?.stop(); scan = null; }

  // --- 2. уровень -------------------------------------------------------------------------------------
  function level() {
    return step({
      title: 'Как вы начнёте?',
      lead: 'Это только отправная точка — потом можно идти куда угодно.',
      disabled: !onb.level,
      onSubmit: () => { if (onb.level === 'zero') onb.startUnit = 0; next(); },
      primary: onb.level === 'known' ? 'Проверить знания' : 'Дальше',
      content: options('level', 'Уровень', [
        { id: 'zero', node: optText('Начинаю с нуля', 'Алфавит, первые слова, по порядку', icon('book')) },
        { id: 'known', node: optText('Что-то знаю — проверить', `${Math.min(QUIZ_LENGTH, course?.units.length || QUIZ_LENGTH)} коротких заданий подскажут, с чего начать`, icon('goal')) },
      ], onb.level, (v) => { onb.level = v; onb.startUnit = v === 'zero' ? 0 : null; save(); draw(); }),
    });
  }

  // --- 2б. входной тест -------------------------------------------------------------------------------
  function quizStep() {
    if (!quiz) quiz = { items: course ? buildQuiz(course) : [], pos: 0, results: [], ctrl: null };
    if (!quiz.items.length) { onb.level = 'zero'; onb.startUnit = 0; queueMicrotask(() => go_('script')); return h('div'); }
    const q = quiz.items[quiz.pos];
    const total = quiz.items.length;
    const check = h('button', { class: 'btn btn--primary btn--block', type: 'submit', disabled: true }, quiz.pos + 1 === total ? 'Завершить' : 'Ответить');
    const answer = () => { if (quiz.ctrl.ready()) finishOne(!!quiz.ctrl.check().correct); };
    const ctx = {
      course, lang: course.tts || course.id, policy: course.answer, speak: speakerFor(course),
      changed: () => { check.disabled = !quiz.ctrl?.ready(); }, submit: answer,
      answer: (r) => finishOne(!!r?.correct), autoCheck: () => setTimeout(answer, 250), vibrate,
    };
    quiz.ctrl = renderExercise(q.ex, ctx);
    check.disabled = !quiz.ctrl.ready();
    const idk = h('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: () => finishOne(false) }, 'Не знаю');
    const kb = quiz.ctrl.usesInput ? h('div', { class: 'keyboard', role: 'group', 'aria-label': 'Особые символы' }, srKeyboard().map((ch) => {
      const k = h('button', { class: 'keyboard__key', type: 'button', tabindex: '-1', lang: 'sr' }, ch);
      k.addEventListener('pointerdown', (e) => e.preventDefault());
      k.addEventListener('click', () => {
        const i = stage.querySelector('input:not([readonly]), textarea');
        if (!i) return;
        i.setRangeText(ch, i.selectionStart ?? i.value.length, i.selectionEnd ?? i.value.length, 'end');
        i.dispatchEvent(new Event('input', { bubbles: true }));
        i.focus();
      });
      return k;
    })) : null;
    const bar = h('div', { class: 'onb__qbar' }, h('span', { class: 'onb__qcount' }, `Задание ${quiz.pos + 1} из ${total}`),
      h('span', { class: 'onb__qticks', 'aria-hidden': 'true' }, quiz.items.map((_, i) => h('i', { class: i < quiz.pos ? 'is-done' : i === quiz.pos ? 'is-now' : '' }))));
    queueMicrotask(() => { if (!matchMedia('(pointer: coarse)').matches || quiz?.ctrl.usesInput) quiz?.ctrl.focus?.(); });
    return h('form', { class: 'onb__step onb__step--quiz', novalidate: true, onsubmit: (e) => { e.preventDefault(); answer(); } },
      h('div', { class: 'onb__main', 'data-lang': course.id }, bar, quiz.ctrl.el, kb),
      h('div', { class: 'onb__actions' }, check, idk));
  }
  function finishOne(ok) {
    quiz.results.push(ok);
    quiz.pos += 1;
    if (quiz.pos >= quiz.items.length) {
      onb.startUnit = placementUnit(quiz.results);
      onb.quizScore = quiz.results.filter(Boolean).length;
      onb.quizTotal = quiz.results.length;
      go_('result');
    } else { dir = 1; draw(); }
  }

  // --- 2в. итог теста ---------------------------------------------------------------------------------
  function result() {
    const n = onb.startUnit ?? 0;
    const unit = course.units[n];
    const first = n === 0;
    return step({
      title: first ? 'Лучше начать с начала' : `Начнём с юнита ${n + 1}`,
      lead: `Верных ответов: ${onb.quizScore ?? 0} из ${onb.quizTotal ?? QUIZ_LENGTH}.${first ? ' Базу стоит пройти по порядку — это быстро.' : ' Юниты до него откроются сразу и попадут в повторение.'}`,
      primary: first ? 'Дальше' : `Начать с юнита ${n + 1}`,
      content: h('div', { class: 'onb-unit' },
        h('span', { class: 'onb-unit__n', 'aria-hidden': 'true' }, String(n + 1)),
        h('span', { class: 'onb-unit__t' }, h('b', null, renderInline(unit?.titleRu || unit?.title || '')), unit?.titleRu && unit?.title ? h('small', { lang: 'sr' }, renderInline(unit.title)) : null)),
      extra: first ? null : h('button', { class: 'btn btn--outline btn--block', type: 'button', onclick: () => { onb.startUnit = 0; save(); next(); } }, 'Нет, с самого начала'),
    });
  }

  // --- 3. алфавит ------------------------------------------------------------------------------------
  function script() {
    const prev = (big, small, sample) => h('span', { class: 'onb-prev', lang: 'sr', 'data-keep-script': '' }, h('span', { class: 'onb-prev__big' }, big), h('span', { class: 'onb-prev__small' }, small), h('span', { class: 'onb-prev__sample' }, sample));
    return step({
      title: 'Как показывать сербский?',
      lead: 'В Сербии пишут обоими алфавитами. Поменять можно в любой момент — в шапке или в профиле.',
      content: options('script', 'Алфавит', [
        { id: 'lat', node: optText('Латиница', 'Проще начать, как в учебниках', prev('Dj đ', 'Č ć š ž', 'Dobro došli')) },
        { id: 'cyr', node: optText('Кириллица', 'Как на вывесках в Белграде', prev('Ђ ђ', 'Ч ћ ш ж', 'Добро дошли')) },
      ], onb.script, (v) => { onb.script = v; save(); settings((s) => { s.script = v; }); setScript(v); }, 'onb-opts--2'),
    });
  }

  // --- 4. цель --------------------------------------------------------------------------------------------
  function goal() {
    const rem = h('div', { class: 'chip-row', role: 'radiogroup', 'aria-label': 'Когда вам удобно заниматься' });
    for (const [id, text] of REMINDERS) {
      const b = h('button', { class: 'chip', type: 'button', role: 'radio', 'aria-checked': String(onb.remind === id) }, text);
      b.addEventListener('click', () => { onb.remind = id; save(); for (const x of rem.children) x.setAttribute('aria-checked', String(x === b)); vibrate('tick'); });
      rem.append(b);
    }
    return step({
      title: 'Сколько в день?',
      lead: 'Цель — это XP за день. Серия продлевается, когда она выполнена.',
      content: h('div', { class: 'onb__goal' },
        options('goal', 'Цель на день', GOALS.map(([xp, name, time]) => ({ id: xp, node: h('span', { class: 'onb-opt__row' }, h('span', { class: 'onb-opt__xp' }, h('b', null, String(xp)), 'XP'), optText(name, time)) })),
          onb.goal, (v) => { onb.goal = Number(v); save(); settings((s) => { s.dailyGoal = Number(v); }); }),
        h('p', { class: 'onb__label' }, 'Когда вам удобно? ', h('small', null, 'необязательно')),
        rem,
        h('p', { class: 'onb__hint' }, 'Это просто подсказка для вас — уведомлений не будет, выбор хранится только на этом устройстве.')),
    });
  }

  // --- 5. профиль ---------------------------------------------------------------------------------------
  const existing = () => sync.hasProfile && onb.cloud !== 'created';
  function profile() {
    if (existing()) return step({ title: 'Профиль уже создан', lead: 'Прогресс синхронизируется автоматически. Фразу можно посмотреть в «Профиле».', content: h('span', { class: 'onb__tick', 'aria-hidden': 'true' }, icon('check')) });
    if (onb.cloud === 'created' && sync.hasProfile) return phraseStep();
    if (!sync.enabled) return step({ title: 'Профиль: позже', lead: 'Облачная синхронизация в этой сборке не подключена. Прогресс хранится на устройстве; перенести его можно файлом из «Профиля».', content: h('span', { class: 'onb__tick', 'aria-hidden': 'true' }, icon('lock')) });
    return step({
      title: 'Анонимный профиль',
      lead: 'Никаких e-mail и паролей: профиль — это случайная фраза. Прогресс шифруется на вашем устройстве, прочитать его на сервере нельзя.',
      content: h('div', null,
        h('ul', { class: 'onb-points' },
          h('li', null, icon('lock'), 'Данные шифруются до отправки'),
          h('li', null, icon('repeat'), 'Прогресс сам переедет на другие устройства'),
          h('li', null, icon('almost'), 'Потеряете фразу — облачную копию не открыть')),
        h('p', { class: 'onb__err', role: 'alert', hidden: true })),
      primary: busy ? 'Создаём…' : 'Создать профиль',
      disabled: busy,
      onSubmit: async () => {
        busy = true; draw();
        try {
          const r = await sync.createProfile({ allowOffline: true });
          onb.cloud = 'created'; onb.phraseOk = false; onb.pending = !!r.pending; checking = null; save(); sync.flush();
        } catch (e) {
          busy = false; draw();
          const m = stage.querySelector('.onb__err');
          if (m) { m.hidden = false; m.textContent = `${e.message || 'Не получилось создать профиль'}. Можно повторить или пропустить — профиль создаётся и позже, из «Профиля».`; }
          return;
        }
        busy = false; draw();
      },
      extra: h('button', { class: 'btn btn--ghost btn--block', type: 'button', disabled: busy || null, onclick: () => { onb.cloud = 'local'; save(); go_('done'); } }, 'Пропустить — работать без облака'),
    });
  }

  function phraseStep() {
    const phrase = sync.phrase;
    const text = formatPhrase(phrase);
    const groups = text.split('-');
    const tiles = h('ol', { class: 'onb-phrase', 'aria-label': `Фраза профиля, пять групп: ${groups.join(', ')}` },
      groups.map((g, i) => h('li', { class: 'onb-phrase__g' }, h('small', null, String(i + 1)), h('span', null, g))));
    const done = onb.phraseOk;
    return step({
      title: done ? 'Профиль готов' : 'Ваша фраза',
      lead: done ? 'Фраза подтверждена. Теперь прогресс синхронизируется сам.' : 'Это единственный ключ к профилю. Сохраните её — восстановить мы не сможем.',
      content: h('div', { class: 'onb__phrasebox' },
        tiles,
        h('div', { class: 'onb__tools' },
          h('button', { class: 'btn btn--outline btn--sm', type: 'button', onclick: () => copy(text) }, 'Копировать'),
          h('button', { class: 'btn btn--outline btn--sm', type: 'button', onclick: () => saveFile(text, phrase) }, 'Сохранить файлом'),
          h('button', { class: 'btn btn--outline btn--sm', type: 'button', 'aria-expanded': String(qrOpen), onclick: () => { qrOpen = !qrOpen; draw(); } }, qrOpen ? 'Скрыть QR' : 'Показать QR')),
        qrOpen ? qrSvg(`${location.origin}${location.pathname}#/join/${phrase}`) : null,
        onb.pending ? h('p', { class: 'onb__hint' }, 'Сейчас нет связи: ключ создан на устройстве, прогресс загрузится при первой возможности.') : null,
        done ? h('p', { class: 'onb__ok', role: 'status' }, icon('check'), 'Фраза подтверждена')
          : checking ? checkForm(phrase)
            : h('button', { class: 'btn btn--primary btn--block', type: 'button', onclick: () => { checking = pickCheckGroups(); draw(); stage.querySelector('.onb__gin')?.focus(); } }, 'Я сохранил(а) фразу')),
      primary: 'Дальше',
      disabled: !done,
    });
  }

  function checkForm(phrase) {
    const ins = checking.map((g) => h('input', { class: 'input onb__gin', type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', maxlength: '9', placeholder: 'XXXXX' }));
    const err = h('p', { class: 'onb__err', role: 'alert', hidden: true });
    const verify = () => {
      if (checkGroups(phrase, checking, ins.map((i) => i.value))) { onb.phraseOk = true; save(); vibrate('ok'); draw(); return; }
      err.hidden = false; err.textContent = 'Не совпало — сверьтесь с фразой выше.'; vibrate('error'); ins[0].focus();
    };
    ins.forEach((i, k) => i.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault(); e.stopPropagation();
      if (k < ins.length - 1) ins[k + 1].focus(); else verify();
    }));
    return h('div', { class: 'onb__chk' },
      h('p', { class: 'onb__label' }, `Проверка: введите группы ${checking.map((g) => g + 1).join(' и ')}`),
      h('div', { class: 'onb__gins' }, checking.map((g, k) => h('label', { class: 'onb__gin-l' }, h('small', null, `Группа ${g + 1}`), ins[k]))),
      err,
      h('button', { class: 'btn btn--primary btn--block', type: 'button', onclick: verify }, 'Проверить'));
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Фраза скопирована', { kind: 'ok', icon: 'check' }); }
    catch { toast('Не удалось скопировать — выделите текст вручную', { kind: 'bad', icon: 'x' }); }
  }
  function saveFile(text, phrase) {
    const body = `Srpski — фраза профиля\n\n${text}\n\nСсылка для входа на другом устройстве:\n${location.origin}${location.pathname}#/join/${phrase}\n\nХраните файл как пароль и никому не показывайте.\n`;
    const a = h('a', { href: URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' })), download: 'srpski-phrase.txt' });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Файл сохранён', { kind: 'ok', icon: 'check' });
  }

  // --- 6. готово ------------------------------------------------------------------------------------------
  function done() {
    const n = onb.startUnit || 0;
    const cloud = onb.cloud === 'created' || existing() ? (onb.pending ? 'создан, загрузится при связи' : 'создан, синхронизация включена') : onb.cloud === 'local' ? 'без облака, только на устройстве' : 'не создан';
    const rem = onb.remind && onb.remind !== 'none' ? REMINDERS.find(([id]) => id === onb.remind)?.[1].toLowerCase() : null;
    const rows = [
      ['Старт', onb.level === 'known' && n > 0 ? `с юнита ${n + 1}` : 'с самого начала'],
      ['Алфавит', onb.script === 'cyr' ? 'кириллица' : 'латиница'],
      ['Цель', `${onb.goal} XP в день`],
      rem ? ['Заниматься', rem] : null,
      ['Профиль', cloud],
    ].filter(Boolean);
    const seal = h('span', { class: 'onb-seal', 'aria-hidden': 'true' }, h('b', { lang: 'sr', 'data-keep-script': '' }, 'Ђ'));
    queueMicrotask(() => celebrate(seal, ['Ђ', 'Ћ', 'Ш', 'Ж', 'Љ', 'Џ']));
    return step({
      title: 'Всё готово!',
      lead: 'Первый урок займёт несколько минут.',
      cls: 'onb__step--done',
      content: h('div', null, seal, h('dl', { class: 'onb-sum' }, rows.map(([k, v]) => h('div', null, h('dt', null, k), h('dd', null, v))))),
      primary: 'Начать первый урок',
      onSubmit: () => finish(),
      extra: h('button', { class: 'btn btn--ghost btn--block', type: 'button', onclick: () => finish(true) }, 'На главную'),
    });
  }

  function finish(home = false) {
    if (course && (onb.startUnit || 0) > 0) { const cs = store.course(CID); store.update(() => applyStart(cs, course, onb.startUnit)); }
    onb.done = true; save();
    const lesson = course ? nextLesson(course, store.course(CID)) : null;
    go(!home && lesson ? `/c/${CID}/l/${lesson.id}` : '/', { replace: true });
  }

  draw();
  return { el, title: 'Srpski', bare: true, onLeave: stopScan };
}

// --- QR ----------------------------------------------------------------------------------------------
function qrSvg(text) {
  const { d, size } = qrPath(text);
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', 'sync-qr');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'QR-код со ссылкой для входа в профиль');
  svg.setAttribute('shape-rendering', 'crispEdges');
  const bg = document.createElementNS(SVG, 'rect');
  bg.setAttribute('width', size); bg.setAttribute('height', size); bg.setAttribute('fill', '#fff');
  const path = document.createElementNS(SVG, 'path');
  path.setAttribute('d', d); path.setAttribute('fill', '#000');
  svg.append(bg, path);
  return svg;
}

/** Сканер QR через BarcodeDetector (Chrome/Android); без него остаётся вход по фразе или ссылке. */
async function startScan(video, onText, onFail) {
  let stream, stopped = false, timer = 0;
  const stop = () => { stopped = true; clearTimeout(timer); stream?.getTracks().forEach((t) => t.stop()); };
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream; video.muted = true; await video.play();
    const det = new BarcodeDetector({ formats: ['qr_code'] });
    const tick = async () => {
      if (stopped) return;
      try { const [c] = await det.detect(video); if (c?.rawValue) { stop(); onText(c.rawValue); return; } } catch { /* кадр ещё не готов */ }
      timer = setTimeout(tick, 250);
    };
    tick();
  } catch { stop(); onFail(); }
  return { stop };
}
