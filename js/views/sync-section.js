// Раздел «Профиль и синхронизация»: анонимный профиль-фраза, статус, перенос без сервера.
import { h, icon, clear } from '../dom.js';
import { store } from '../store.js';
import { toast, confirmDialog } from '../ui.js';
import { section } from './common.js';
import { sync, formatPhrase, encodeTransfer, decodeTransfer, mergeKeepLocal } from '../sync.js';
import { qrPath } from '../qr.js';

const SVG = 'http://www.w3.org/2000/svg';

async function copy(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg, { kind: 'ok', icon: 'check' }); return true; }
  catch {
    const ta = h('textarea', { 'aria-hidden': 'true', style: { position: 'fixed', opacity: '0', top: '0' } });
    ta.value = text; document.body.append(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch {}
    ta.remove();
    toast(ok ? okMsg : 'Не удалось скопировать — выделите текст вручную', { kind: ok ? 'ok' : 'bad', icon: ok ? 'check' : 'x' });
    return ok;
  }
}

function ago(ts) {
  if (!ts) return '';
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 1) return 'только что';
  if (min < 60) return `${min} мин назад`;
  if (min < 1440) return `${Math.round(min / 60)} ч назад`;
  return new Date(ts).toLocaleDateString('ru-RU');
}

const STATUS = {
  disabled: ['off', 'Облако не подключено'],
  off: ['off', 'Профиля нет'],
  idle: ['idle', 'Готово к синхронизации'],
  syncing: ['busy', 'Синхронизация…'],
  synced: ['ok', 'Синхронизировано'],
  waiting: ['wait', 'Ждёт сети'],
  error: ['bad', 'Ошибка'],
};

function statusLine() {
  const st = sync.status;
  const [kind, label] = STATUS[st.state] || STATUS.idle;
  const extra = st.state === 'synced' ? ` · ${ago(sync.lastSyncAt)}` : st.state === 'error' && st.message ? `: ${st.message}` : '';
  return h('p', { class: ['sync-status', `sync-status--${kind}`], role: 'status', 'aria-live': 'polite' },
    h('i', { class: 'sync-status__dot', 'aria-hidden': 'true' }), `${label}${extra}`);
}

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

const joinLink = (phrase) => `${location.origin}${location.pathname}#/join/${phrase}`;

function privacy() {
  return h('details', { class: 'sync-privacy' },
    h('summary', null, 'Что хранится, а что нет'),
    h('ul', null,
      h('li', null, 'Профиль — это случайная фраза из 25 символов, придуманная на вашем устройстве. Ни e-mail, ни имени, ни пароля, ни регистрации.'),
      h('li', null, 'На сервер уходит только непрозрачный шифртекст и безымянный номер записи. Ключ шифрования выводится из фразы и с устройства не уходит: прочитать ваш прогресс не можем ни мы, ни владелец сервера.'),
      h('li', null, 'Фразу мы не храним и восстановить не можем. Потеряете фразу на всех устройствах — облачную копию не открыть (локальный прогресс на устройствах останется).'),
      h('li', null, 'Никнейм хранится только на этом устройстве и на сервер не отправляется.'),
      h('li', null, 'Как у любого сайта, хостинг теоретически видит IP-адрес и время запроса. Запись без обращений удаляется через 400 дней.'),
      h('li', null, 'Фраза и ссылка с фразой — как пароль: не публикуйте их.')));
}

export function syncSection(shell) {
  const body = h('div', { class: 'sync' });
  let showPhrase = false;
  let joinOpen = false;
  let busy = false;

  const rerender = () => { clear(body); body.append(...draw()); };
  let seen = false;
  const off = sync.onStatus(() => {                              // обновляем только строку статуса: набранный текст не пропадает
    if (!body.isConnected) { if (seen) off(); return; }
    seen = true;
    body.querySelector('.sync-status')?.replaceWith(statusLine());
  });

  async function run(fn, okMsg) {
    if (busy) return;
    busy = true; rerender();
    try { await fn(); if (okMsg) toast(okMsg, { kind: 'ok', icon: 'check' }); }
    catch (err) { toast(err.message || 'Не получилось', { kind: 'bad', icon: 'x', timeout: 6000 }); }
    finally { busy = false; if (body.isConnected) rerender(); }
  }

  const btn = (label, onclick, mods = 'btn--outline', attrs = {}) => h('button', { class: ['btn', 'btn--sm', mods], type: 'button', disabled: busy || null, onclick, ...attrs }, label);

  function cloudPart() {
    if (!sync.enabled) {
      return [statusLine(), h('p', { class: 'sync-note' }, 'Облачная синхронизация пока не подключена, поэтому прогресс хранится только на этом устройстве. Перенести его на другое устройство можно без сервера — файлом или кодом ниже.')];
    }
    if (!sync.hasProfile) {
      const phraseInput = h('input', { class: 'input sync-input', id: 'sync-phrase', type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', maxlength: '40' });
      const join = h('form', { class: 'sync-join', onsubmit: (e) => { e.preventDefault(); run(async () => { await sync.joinProfile(phraseInput.value); joinOpen = false; shell.reload(); }, 'Вы вошли в профиль'); } },
        h('label', { class: 'sync-label', for: 'sync-phrase' }, 'Фраза профиля'),
        phraseInput,
        h('div', { class: 'btn-row' }, h('button', { class: 'btn btn--primary btn--sm', type: 'submit', disabled: busy || null }, 'Войти'), btn('Отмена', () => { joinOpen = false; rerender(); }, 'btn--ghost')));
      return [
        h('p', { class: 'sync-note' }, 'Создайте профиль, чтобы прогресс сам синхронизировался между устройствами. Без регистрации: профиль — случайная фраза, а данные на сервере зашифрованы.'),
        h('div', { class: 'btn-row' },
          h('button', { class: 'btn btn--primary btn--sm', type: 'button', disabled: busy || null, onclick: () => run(async () => { await sync.createProfile(); showPhrase = true; }) }, 'Создать профиль'),
          btn('У меня уже есть профиль', () => { joinOpen = true; rerender(); body.querySelector('#sync-phrase')?.focus(); })),
        joinOpen ? join : null,
      ];
    }
    const nick = h('input', { class: 'input sync-input', id: 'sync-nick', type: 'text', maxlength: '40', autocomplete: 'off', value: sync.nickname, placeholder: 'Например, «Телефон»' });
    nick.addEventListener('change', () => sync.setNickname(nick.value));
    const phrase = sync.phrase;
    const panel = showPhrase ? h('div', { class: 'sync-phrase-box' },
      h('p', { class: 'sync-warn' }, icon('almost'), h('span', null, 'Запишите фразу и храните в надёжном месте. Потеряете её на всех устройствах — облачный профиль не восстановить: мы её не храним.')),
      h('p', { class: 'sync-phrase', 'aria-label': `Фраза профиля: ${formatPhrase(phrase).split('-').join(', ')}` }, formatPhrase(phrase)),
      h('div', { class: 'btn-row' },
        btn('Копировать фразу', () => copy(formatPhrase(phrase), 'Фраза скопирована')),
        btn('Копировать ссылку', () => copy(joinLink(phrase), 'Ссылка скопирована'))),
      h('p', { class: 'sync-hint' }, 'Ссылка и QR-код открывают вход в профиль на другом устройстве. Фраза в ссылке стоит после «#» и на сервер не отправляется.'),
      qrSvg(joinLink(phrase))) : null;
    return [
      statusLine(),
      h('div', { class: 'btn-row' },
        btn('Синхронизировать', () => run(async () => { await sync.sync(); if (sync.status.state === 'error') throw new Error(sync.status.message); shell.reload(); }), 'btn--primary'),
        btn(showPhrase ? 'Скрыть фразу' : 'Показать фразу', () => { showPhrase = !showPhrase; rerender(); }, 'btn--outline', { 'aria-expanded': String(showPhrase) })),
      panel,
      h('label', { class: 'sync-label', for: 'sync-nick' }, 'Никнейм (необязательно, виден только вам на этом устройстве)'),
      nick,
      h('div', { class: 'btn-row sync-danger' },
        btn('Выйти с этого устройства', async () => {
          if (!await confirmDialog({ title: 'Выйти из профиля?', text: 'Ключ будет стёрт с этого устройства, прогресс здесь останется. Чтобы войти снова, понадобится фраза.', ok: 'Выйти', danger: true })) return;
          sync.signOut(); showPhrase = false; rerender(); toast('Вы вышли из профиля');
        }),
        btn('Удалить данные на сервере', async () => {
          if (!await confirmDialog({ title: 'Удалить облачную копию?', text: 'Зашифрованная копия будет удалена с сервера, а вы выйдете из профиля. Прогресс на устройствах останется.', ok: 'Удалить', danger: true })) return;
          run(async () => { await sync.deleteRemote(); showPhrase = false; }, 'Данные на сервере удалены');
        }, 'btn--danger')),
    ];
  }

  function transferPart() {
    const area = h('textarea', { class: 'input input--area sync-code', id: 'sync-code', rows: '3', spellcheck: 'false', autocomplete: 'off', placeholder: 'Вставьте код переноса (GT1.…)' });
    return h('div', { class: 'sync-transfer' },
      h('p', { class: 'sync-label' }, 'Перенос без сервера'),
      h('p', { class: 'sync-hint' }, 'Код — это ваш прогресс одной строкой. Скопируйте на одном устройстве, вставьте на другом: данные объединятся, ничего не пропадёт. Файл (экспорт/импорт) — в «Настройках» ниже.'),
      h('div', { class: 'btn-row' },
        btn('Скопировать код', () => run(async () => { await copy(await encodeTransfer(store.state), 'Код скопирован'); }))),
      h('label', { class: 'sync-label', for: 'sync-code' }, 'Загрузить код'),
      area,
      h('div', { class: 'btn-row' }, btn('Объединить с кодом', () => run(async () => {
        const remote = await decodeTransfer(area.value);
        store.replaceState(mergeKeepLocal(store.state, remote));
        sync.hooks.onApplied();                       // тема/алфавит и перерисовка экрана
        area.value = '';
      }, 'Прогресс объединён'))));
  }

  function draw() {
    return [...cloudPart(), transferPart(), privacy()];
  }

  rerender();
  return section('Профиль и синхронизация', null, body);
}

/** Вход по ссылке «#/join/<фраза>»: фраза сразу убирается из адресной строки и истории. */
export async function joinFromLink(phrase, shell) {
  if (!sync.enabled) { toast('Облачная синхронизация не подключена', { icon: 'x' }); return; }
  if (!await confirmDialog({ title: 'Войти в профиль по ссылке?', text: 'Прогресс на этом устройстве объединится с облачным профилем — ничего не потеряется.', ok: 'Войти' })) return;
  try { await sync.joinProfile(phrase); toast('Вы вошли в профиль', { kind: 'ok', icon: 'check' }); shell.reload(); }
  catch (err) { toast(err.message || 'Не удалось войти', { kind: 'bad', icon: 'x', timeout: 6000 }); }
}
