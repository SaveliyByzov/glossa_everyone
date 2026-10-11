// Общие UI-сервисы: тосты, вибрация, объявления для скринридеров, подтверждение, тема.
import { h, icon } from './dom.js';
import { store } from './store.js';

// --- тосты -----------------------------------------------------------------------------
let toastTimer = null;

/** toast('Текст', { kind: 'ok'|'bad'|'achievement', icon, action: { label, run }, timeout }) */
export function toast(text, { kind = '', icon: ic = null, action = null, timeout = 3000 } = {}) {
  document.querySelector('.toast')?.remove();
  clearTimeout(toastTimer);
  const el = h('div', { class: ['toast', kind && `toast--${kind}`], role: 'status', 'aria-live': 'polite' },
    ic ? icon(ic) : null,
    h('span', null, text),
    action ? h('button', { class: 'toast__action', type: 'button', onclick: () => { action.run(); hide(); } }, action.label) : null);
  document.body.append(el);
  function hide() {
    clearTimeout(toastTimer);
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 160);
  }
  if (timeout) {
    toastTimer = setTimeout(hide, timeout);
    // на hover/focus таймер на паузе
    const pause = () => clearTimeout(toastTimer);
    const resume = () => { toastTimer = setTimeout(hide, 1500); };
    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
  }
  return hide;
}

// --- вибрация ---------------------------------------------------------------------------
const PATTERNS = { tick: 8, ok: 15, error: [30, 40, 30], done: [20, 60, 40] };

export function vibrate(kind = 'tick') {
  if (!store.state.settings.haptics || !('vibrate' in navigator)) return;
  try { navigator.vibrate(PATTERNS[kind] ?? 10); } catch {}
}

// --- aria-live ---------------------------------------------------------------------------
let liveEl = null;
export function announce(text) {
  liveEl ||= document.getElementById('live');
  if (!liveEl) return;
  liveEl.textContent = '';
  // повторное объявление того же текста: сброс + следующая задача
  setTimeout(() => { liveEl.textContent = text; }, 30);
}

// --- подтверждение (нативный диалог) ----------------------------------------------------
export function confirmDialog({ title, text = '', ok = 'Да', cancel = 'Отмена', danger = false }) {
  return new Promise((resolve) => {
    const dlg = h('dialog', { class: 'dialog card', 'aria-label': title },
      h('form', { method: 'dialog', class: 'dialog__body' },
        h('p', { class: 'card__title' }, title),
        text ? h('p', { class: 'card__text' }, text) : null,
        h('div', { class: 'card__actions btn-row' },
          h('button', { class: 'btn btn--ghost', value: 'cancel' }, cancel),
          h('button', { class: ['btn', danger ? 'btn--danger' : 'btn--primary'], value: 'ok' }, ok))));
    dlg.addEventListener('close', () => { resolve(dlg.returnValue === 'ok'); dlg.remove(); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

// --- тема ----------------------------------------------------------------------------------
export const STYLES = ['b', 'c', 'scriptorium'];

/** Оформление: data-style на <html> (b — игровое, c — типографичное, scriptorium — прежнее). */
export function applyStyle(style = store.state.settings.style) {
  document.documentElement.dataset.style = STYLES.includes(style) ? style : 'b';
}

export function applyTheme(theme = store.state.settings.theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  else delete root.dataset.theme;
  // data-mode — всегда «light» или «dark» (разрешённая тема): на него опираются css/style-*.css
  root.dataset.mode = theme === 'light' || theme === 'dark' ? theme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyStyle();
  // theme-color: при ручной теме обе meta (light/dark) получают цвет фона выбранной темы
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    const own = meta.media?.includes('dark') ? '#15171d' : '#f6f3ee';
    meta.content = theme === 'dark' ? '#15171d' : theme === 'light' ? '#f6f3ee' : own;
  }
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Оформление B: буквы языка разлетаются над экраном итога (WAAPI; без движения при reduced-motion). */
export function celebrate(host, letters) {
  if (document.documentElement.dataset.style !== 'b' || reducedMotion() || !host?.animate || !letters?.length) return;
  const colors = ['var(--accent)', 'var(--gold)', 'var(--streak)', 'var(--ok)'];
  for (let i = 0; i < 16; i++) {
    const s = h('span', { class: 'confetti-letter tl', 'aria-hidden': 'true' }, letters[i % letters.length]);
    s.style.color = colors[i % colors.length];
    s.style.fontSize = `${26 + Math.random() * 30}px`;
    host.append(s);
    const a = Math.random() * Math.PI * 2, r = 90 + Math.random() * 130;
    s.animate([
      { transform: 'translate(-50%,-50%) scale(.4)', opacity: 0 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * r * 0.6}px), calc(-50% + ${Math.sin(a) * r * 0.6}px)) scale(1) rotate(${Math.random() * 90 - 45}deg)`, opacity: 1, offset: 0.35 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r + 90}px)) scale(.9) rotate(${Math.random() * 180 - 90}deg)`, opacity: 0 },
    ], { duration: 1400 + Math.random() * 600, delay: 150 + i * 22, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'both' }).onfinish = () => s.remove();
  }
}
