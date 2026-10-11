// Точка входа: оболочка (.app = .topbar + .view + .tabbar), маршруты, Service Worker.
import { h, icon, append, clear } from './dom.js';
import { store } from './store.js';
import { loadConfig } from './config.js';
import { route, start, currentPath, match } from './router.js';
import { applyTheme, toast, flipView } from './ui.js';
import { sync } from './sync.js';
import { joinFromLink } from './views/sync-section.js';
import { todayXp, dailyGoal, currentStreak } from './gamify.js';
import { dueBreakdown } from './views/review.js';
import { empty, fmtNum } from './views/common.js';
import * as home from './views/home.js';
import * as courseView from './views/course.js';
import * as intro from './views/lesson-intro.js';
import * as reviewView from './views/review.js';
import * as vocabView from './views/vocab.js';
import * as wordsView from './views/words.js';
import * as profileView from './views/profile.js';
import * as sessionView from './views/session.js';
import * as referenceView from './views/reference.js';
import { setScript, getScript, observe } from './script.js';

const app = document.getElementById('app');
const topbar = h('header', { class: 'topbar' });
const tabbar = h('nav', { class: 'tabbar', 'aria-label': 'Разделы' });
let current = null;      // метаданные текущего экрана
let routeToken = 0;

// --- маршруты ---------------------------------------------------------------------------
route('/', home.render);
route('/profile', profileView.render);
route('/join/:phrase', async ({ phrase }, sh) => {
  // фраза из ссылки сразу уходит из адресной строки и истории; хэш на сервер не отправляется
  history.replaceState(null, '', `${location.pathname}${location.search}#/profile`);
  const meta = await profileView.render({}, sh);
  setTimeout(() => joinFromLink(phrase, sh), 0);
  return meta;
});
route('/ref', referenceView.render);
route('/review/all', sessionView.crossSession);
route('/c/:cid', courseView.render);
route('/c/:cid/l/:lid', intro.render);
route('/c/:cid/l/:lid/play', sessionView.lessonSession);
route('/c/:cid/review', reviewView.render);
route('/c/:cid/review/play', sessionView.reviewSession);
route('/c/:cid/skill/:skill', sessionView.skillSession);
route('/c/:cid/u/:uid/boss', sessionView.bossSession);
route('/c/:cid/u/:uid/placement', sessionView.placementSession);
route('/c/:cid/vocab', vocabView.render);
route('/c/:cid/words', wordsView.render);
route('/c/:cid/words/play/:mode/:src/:n', sessionView.wordsSession);

// --- оболочка ----------------------------------------------------------------------------
const shell = {
  /** Показать экран: { el, title, back, tab, lang, focus, keys, onLeave, stats } */
  replace(meta) {
    if (current) {
      current.onLeave?.();
      if (current.keys) removeEventListener('keydown', current.keys);
    }
    current = meta;
    if (meta.keys) addEventListener('keydown', meta.keys);
    const old = app.querySelector(':scope > .view');
    if (old) old.replaceWith(meta.el); else app.insertBefore(meta.el, tabbar);
    app.classList.toggle('is-focus', !!meta.focus);
    shell.setLang(meta.lang);
    drawTopbar();
    drawTabbar();
    document.title = meta.title && meta.title !== BRAND ? `${stripTags(meta.title)} — ${BRAND}` : 'Srpski · Glossa';
    if (!meta.focus) {
      scrollTo({ top: 0 });
      meta.el.focus({ preventScroll: true });
    }
  },
  reload() { onRoute(currentPath(), match(currentPath())); },
  setLang(id) { if (id) app.dataset.lang = id; else delete app.dataset.lang; },
};

const BRAND = 'Srpski';
const stripTags = (s) => String(s).replace(/[*{}]/g, '');

function drawTopbar() {
  const m = current || {};
  const state = store.state;
  const streak = currentStreak(state);
  const goal = dailyGoal(state);
  const xp = todayXp(state);
  const extendedToday = state.stats.streak.lastDay && xp >= goal;
  const meter = h('i');
  meter.style.setProperty('--value', String(Math.min(1, xp / goal)));
  clear(topbar);
  append(topbar, [
    m.back ? h('a', { class: 'btn btn--icon btn--ghost topbar__back', href: m.back, 'aria-label': 'Назад' }, icon('back')) : null,
    h('h1', { class: 'topbar__title', lang: m.titleLang || null }, stripTags(m.title || BRAND)),
    h('div', { class: 'topbar__stats' },
      scriptToggle(),
      m.stats || null,
      m.stats ? null : h('span', { class: ['stat stat--streak', !extendedToday && 'is-inactive'], 'aria-label': `Серия ${streak} дн.${extendedToday ? '' : ', сегодня ещё не продлена'}` }, icon('flame'), String(streak)),
      m.stats ? null : h('span', { class: 'stat stat--xp', 'aria-label': `Опыт ${state.stats.xpTotal}` }, icon('xp'), fmtNum(state.stats.xpTotal)),
      m.stats ? null : h('span', { class: ['stat stat--goal', xp >= goal && 'is-done'], 'aria-label': `Цель на день: ${Math.min(xp, goal)} из ${goal} XP` }, icon('goal'), h('span', { class: 'stat__meter' }, meter), String(Math.min(xp, goal))))]);
}

/** Лёгкий переключатель алфавита в шапке: показывает текущий, по нажатию — другой. */
function scriptToggle() {
  const cyr = getScript() === 'cyr';
  return h('button', {
    class: 'topbar__script', type: 'button',
    'aria-label': `Показывать сербский: ${cyr ? 'кириллица' : 'латиница'}. Переключить`,
    title: 'Алфавит: латиница / кириллица',
    onclick: () => flipView(() => { store.update((s) => { s.settings.script = cyr ? 'lat' : 'cyr'; }); setScript(cyr ? 'lat' : 'cyr'); shell.reload(); }),
  }, cyr ? 'Ћир' : 'Lat');
}

function drawTabbar() {
  const state = store.state;
  const last = state.lastCourse || 'sr';
  const tab = current?.tab;
  const due = last ? dueBreakdown(state.courses[last]).total : 0;
  const item = (id, href, ic, label, badge) => h('a', { class: ['tabbar__item', tab === id && 'is-active'], href, 'aria-current': tab === id ? 'page' : null },
    icon(ic), label, badge ? h('span', { class: 'tabbar__badge' }, badge > 99 ? '99+' : String(badge)) : null);
  tabbar.replaceChildren(
    item('home', '#/', 'book', 'Курс'),
    item('review', last ? `#/c/${last}/review` : '#/', 'repeat', 'Повторение', due),
    item('words', last ? `#/c/${last}/words` : '#/', 'cards', 'Лексика'),
    item('ref', '#/ref', 'dict', 'Справочник'),
    item('profile', '#/profile', 'user', 'Профиль'));
}

async function onRoute(path, found) {
  const token = ++routeToken;
  let meta;
  try {
    meta = found
      ? await found.handler(found.params, shell)
      : { el: h('main', { class: 'view view--home', id: 'view' }, empty({ title: 'Страница не найдена', action: { href: '#/', label: 'На главную' } })), title: BRAND };
  } catch (err) {
    console.error('[glossa] ошибка экрана', path, err);
    meta = { el: h('main', { class: 'view view--home', id: 'view' }, empty({ title: 'Что-то пошло не так', text: String(err?.message || err), action: { href: '#/', label: 'На главную' } })), title: 'Ошибка' };
  }
  if (token !== routeToken) { meta.onLeave?.(); return; } // пользователь уже ушёл на другой экран
  shell.replace(meta);
}

// --- Service Worker: офлайн и обновления --------------------------------------------------
function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    const offer = (worker) => toast('Доступна новая версия', {
      timeout: 0,
      icon: 'repeat',
      action: { label: 'Обновить', run: () => worker.postMessage({ type: 'SKIP_WAITING' }) },
    });
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
      });
    });
    // проверяем обновления при возвращении в приложение
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
  }).catch((err) => console.warn('[glossa] SW не зарегистрирован', err));
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
}

// --- запуск -------------------------------------------------------------------------------
async function boot() {
  store.load();
  setScript(store.state.settings.script);
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme());
  await loadConfig();
  app.replaceChildren(topbar, tabbar);
  observe(document.body);
  store.subscribe(() => { drawTopbar(); drawTabbar(); });
  // прогресс мог измениться в другой вкладке
  addEventListener('storage', (e) => { if (e.key === 'glossa:v1') { store.load(); shell.reload(); } });
  // облачная синхронизация (если в data/sync.js задан endpoint и создан профиль)
  sync.hooks.busy = () => !!current?.focus;                       // не трогаем состояние посреди упражнения
  sync.hooks.onApplied = () => { applyTheme(); setScript(store.state.settings.script); if (!current?.focus) shell.reload(); };
  sync.start();
  start(onRoute);
  registerSW();
}

boot();
