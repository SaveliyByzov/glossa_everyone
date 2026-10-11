// Профиль: звание, статистика, календарь серии, достижения, настройки, экспорт/импорт, сброс.
import { setScript } from '../script.js';
import { h, icon } from '../dom.js';
import { store, downloadBackup } from '../store.js';
import { config } from '../config.js';
import { dayKey, plural } from '../util.js';
import { rankFor, currentStreak, dailyGoal, achievementProgress, checkGoal, vacationLeft, activeVacation, startVacation, endVacation, shiftDay } from '../gamify.js';
import { toast, confirmDialog, applyTheme } from '../ui.js';
import { ttsSupported } from '../tts.js';
import { view, section, progress, roman, fmtNum } from './common.js';

export async function render(_, shell) {
  const state = store.state;
  const el = view('profile');
  el.append(rankCard(state), statsGrid(state));
  const fr = state.stats.streak.freezes ?? config.streak.maxFreezes ?? 2;
  const frLabel = h('small', null, icon('snow'), ` ${fr} ${plural(fr, ['заморозка', 'заморозки', 'заморозок'])}`);
  el.append(h('section', { class: 'section' }, h('h3', { class: 'section__title' }, 'Серия', frLabel), streakCalendar(state)));
  el.append(achievements(state));
  el.append(appearance(state));
  el.append(settings(state, shell));
  return { el, title: 'Профиль', tab: 'profile' };
}

function rankCard(state) {
  const { current, next } = rankFor(state.stats.xpTotal);
  const ratio = next ? (state.stats.xpTotal - current.xp) / (next.xp - current.xp) : 1;
  const idx = [...(config.ranks || [])].sort((a, b) => a.xp - b.xp).indexOf(current) + 1;
  const xp = fmtNum(state.stats.xpTotal);
  return h('div', { class: 'rank' },
    h('span', { class: 'rank__seal', 'aria-hidden': 'true' }, roman(Math.max(1, idx))),
    h('div', null,
      h('p', { class: 'rank__title' }, current.title),
      h('p', { class: 'rank__sub' }, next ? `${xp} XP · до «${next.title}» ${fmtNum(next.xp - state.stats.xpTotal)}` : `${xp} XP · высшее звание`)),
    progress(ratio, '', 'Прогресс до следующего звания'));
}

function statsGrid(state) {
  const s = state.stats;
  const acc = s.answers ? Math.round((s.correct / s.answers) * 100) : 0;
  const cells = [
    ['Серия, дней', currentStreak(state)],
    ['Рекорд серии', s.streak.best || 0],
    ['Опыт', fmtNum(s.xpTotal)],
    ['Уроков', s.lessonsCompleted],
    ['Без ошибок', s.perfectLessons],
    ['Заданий в повторении', s.reviews],
    ['Исправлено ошибок', s.mistakesFixed || 0],
    ['Точность', `${acc}%`],
  ];
  return h('section', { class: 'section' }, h('dl', { class: 'stats-grid' }, cells.map(([dt, dd]) => h('div', null, h('dt', null, dt), h('dd', null, String(dd))))));
}

function streakCalendar(state) {
  const today = dayKey();
  const goal = dailyGoal(state);
  const cal = h('div', { class: 'streak-cal', role: 'img', 'aria-label': 'Дни с выполненной целью за 4 недели' });
  const vac = state.stats.streak.vacations || [];
  for (let i = 27; i >= 0; i--) {
    const d = shiftDay(today, -i);
    const on = (state.stats.xpByDay[d] || 0) >= goal;
    const frozen = !on && vac.some((v) => d >= v.from && d <= v.to);
    const cell = h('i', { class: [on && 'is-on', frozen && 'is-frozen', d === today && 'is-today'], title: `${d.split('-').reverse().join('.')}: ${state.stats.xpByDay[d] || 0} XP` });
    cal.append(cell);
  }
  return cal;
}

function achievements(state) {
  const list = config.achievements || [];
  const earned = list.filter((a) => state.achievements[a.id]).length;
  const grid = h('div', { class: 'achievements' });
  for (const a of list) {
    const got = !!state.achievements[a.id];
    const p = achievementProgress(state, a);
    grid.append(h('div', { class: ['achievement', got && 'is-earned', got && Date.now() - state.achievements[a.id] < 86_400_000 && 'is-new'], title: a.desc },
      h('span', { class: 'achievement__icon', 'aria-hidden': 'true' }, a.icon || '★'),
      h('div', null,
        h('p', { class: 'achievement__title' }, a.title),
        h('p', { class: 'achievement__desc' }, a.desc),
        !got && p && p.target > 1 ? progress(p.ratio, 'progress--thin', `${p.value} из ${p.target}`) : null)));
  }
  return section('Достижения', `${earned} из ${list.length}`, grid);
}

// --- настройки ---------------------------------------------------------------------------

function segmented(options, value, onPick, label) {
  const box = h('div', { class: 'segmented', role: 'group', 'aria-label': label });
  for (const [val, text] of options) {
    const b = h('button', { type: 'button', 'aria-pressed': String(val === value) }, text);
    b.addEventListener('click', () => {
      for (const x of box.children) x.setAttribute('aria-pressed', String(x === b));
      onPick(val);
    });
    box.append(b);
  }
  return box;
}

function goalChips(goals, value, onPick) {
  const row = h('div', { class: 'chip-row', role: 'radiogroup', 'aria-label': 'Цель на день' });
  goals.forEach((g, i) => {
    const b = h('button', { class: 'chip', type: 'button', role: 'radio', 'aria-checked': String(g === value) }, i === goals.length - 1 ? `${g} XP` : String(g));
    b.addEventListener('click', () => { for (const x of row.children) x.setAttribute('aria-checked', String(x === b)); onPick(g); });
    row.append(b);
  });
  return row;
}

function switchBtn(on, onToggle, label) {
  const b = h('button', { class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(!!on), 'aria-label': label });
  b.addEventListener('click', () => {
    const v = b.getAttribute('aria-checked') !== 'true';
    b.setAttribute('aria-checked', String(v));
    onToggle(v);
  });
  return b;
}

function setting(label, hint, control, stack = false) {
  return h('div', { class: ['setting', stack && 'setting--stack'] },
    h('p', { class: 'setting__label' }, label),
    hint ? h('p', { class: 'setting__hint' }, hint) : null,
    control);
}

/** Оформление: цветовая тема (авто / светлая / тёмная). Стиль один — игровое (B). */
function appearance(state) {
  const st = state.settings;
  const rows = [
    setting('Цвет', null,
      segmented([['auto', 'Авто'], ['light', 'Светлая'], ['dark', 'Тёмная']], st.theme || 'auto', (t) => { store.update((s) => { s.settings.theme = t; }); applyTheme(t); }, 'Цветовая тема'), true),
  ];
  return section('Оформление', null, h('div', { class: 'settings' }, rows));
}

function settings(state, shell) {
  const st = state.settings;
  const set = (k, v) => store.update((s) => { s.settings[k] = v; });
  const rows = [];

  rows.push(setting('Показывать сербский', 'Весь сербский — теория, слова, примеры, задания — в выбранном алфавите. Ответ можно вводить в любом. Тот же переключатель — в шапке.',
    segmented([['lat', 'Латиница'], ['cyr', 'Кириллица']], st.script === 'cyr' ? 'cyr' : 'lat', (v) => { set('script', v); setScript(v); shell.reload(); }, 'Алфавит сербского'), true));
  rows.push(setting('Цель на день', 'Можно менять в любой момент — прогресс не теряется.',
    goalChips(config.dailyGoals, dailyGoal(state), (g) => { store.update((s) => { s.settings.dailyGoal = g; checkGoal(s); }); }), true));
  if ('vibrate' in navigator) rows.push(setting('Вибрация', 'Короткий отклик на ответы.', switchBtn(st.haptics, (v) => set('haptics', v), 'Вибрация')));
  if (ttsSupported()) rows.push(setting('Озвучка', 'Только если в системе есть голос языка (сербский).', switchBtn(st.tts, (v) => set('tts', v), 'Озвучка')));

  // отпуск
  const vac = activeVacation(state) || (state.stats.streak.vacations || []).find((v) => v.from > dayKey());
  const left = vacationLeft(state);
  rows.push(setting('Пауза серии', vac ? `Пауза до ${vac.to.split('-').reverse().join('.')}. Пропущенные дни не обрывают серию.` : `Поставьте серию на паузу заранее (осталось ${left} ${plural(left, ['день', 'дня', 'дней'])} в этом году).`,
    vac
      ? h('button', { class: 'btn btn--outline btn--sm', type: 'button', onclick: () => { store.update((s) => endVacation(s)); shell.reload(); } }, 'Завершить')
      : h('button', { class: 'btn btn--outline btn--sm', type: 'button', disabled: left <= 0, onclick: () => { store.update((s) => startVacation(s, Math.min(7, left))); toast('Серия на паузе на неделю', { kind: 'ok', icon: 'snow' }); shell.reload(); } }, 'На 7 дней')));

  // перенос прогресса
  const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      if (!await confirmDialog({ title: 'Заменить прогресс?', text: 'Текущий прогресс на этом устройстве будет заменён данными из файла.', ok: 'Заменить', danger: true })) return;
      store.importJSON(text);
      setScript(store.state.settings.script);
      applyTheme();
      toast('Прогресс загружен', { kind: 'ok', icon: 'check' });
      shell.reload();
    } catch (err) {
      toast(`Не удалось загрузить: ${err.message}`, { kind: 'bad', icon: 'x', timeout: 6000 });
    } finally { file.value = ''; }
  });
  rows.push(setting('Резервная копия', 'Файл JSON с прогрессом — для переноса на другое устройство.',
    h('button', { class: 'btn btn--sm btn--outline', type: 'button', onclick: () => { downloadBackup(); toast('Файл с прогрессом сохранён', { kind: 'ok', icon: 'check' }); } }, 'Экспорт')));

  const actions = h('div', { class: 'btn-row', style: { marginTop: 'var(--s-4)' } },
    h('button', { class: 'btn btn--outline', type: 'button', onclick: () => file.click() }, 'Импорт'),
    file,
    h('button', { class: 'btn btn--danger', type: 'button', onclick: async () => {
      if (!await confirmDialog({ title: 'Сбросить весь прогресс?', text: 'Это действие нельзя отменить. Сначала сделайте экспорт, если сомневаетесь.', ok: 'Сбросить', danger: true })) return;
      store.reset();
      setScript('lat');
      applyTheme();
      toast('Прогресс сброшен');
      shell.reload();
    } }, 'Сбросить'));

  return section('Настройки', null, h('div', { class: 'settings' }, rows), actions);
}
