// Алфавит показа сербского: латиница (по умолчанию) или кириллица.
// Весь контент курса написан латиницей; в режиме «кириллица» латинские слова транслитерируются на лету
// (srLatToCyr из answer.js), русский текст и кириллица в данных не трогаются. Ввод принимается в любом алфавите.
// srText — чистая функция (тестируется в node); observe() — DOM-часть, только в браузере.

import { srLatToCyr } from './answer.js';

export const SCRIPTS = ['lat', 'cyr'];
export const SR_KEYBOARD = { lat: ['č', 'ć', 'š', 'ž', 'đ'], cyr: ['ђ', 'ј', 'љ', 'њ', 'ћ', 'џ'] };

let mode = 'lat';
let keep = 0;                 // >0 — не транслитерировать (уроки об алфавитах)

export function getScript() { return mode; }
export function setScript(m) { mode = m === 'cyr' ? 'cyr' : 'lat'; }

/** Выполнить fn без транслитерации (контент о самих алфавитах: «Lat.» рядом с «Ћир.»). */
export function withoutScript(fn) { keep++; try { return fn(); } finally { keep--; } }

const SERBIAN_CYR = /[ђјљњћџЂЈЉЊЋЏ]/;          // строка явно показывает кириллицу — оставляем как есть
const LATIN_RUN = /[A-Za-zČčĆćŠšŽžĐđ]+/g;
const FOREIGN = /[qwxyQWXY]/;                  // в сербской латинице нет q w x y: это не сербское слово (XP, ASCII)

/** Транслитерирует латинские слова строки в кириллицу (если выбрана кириллица). */
export function srText(s, force = false) {
  if (!s || (!force && (mode !== 'cyr' || keep))) return s;
  if (SERBIAN_CYR.test(s)) return s;
  return s.replace(LATIN_RUN, (w) => (FOREIGN.test(w) ? w : srLatToCyr(w)));
}

/** Клавиатура спецсимволов для текущего алфавита. */
export function srKeyboard() { return SR_KEYBOARD[mode]; }

/** Наблюдатель: тексты внутри [lang^="sr"] (плитки, ответы, таблицы) переводятся в выбранный алфавит. */
export function observe(root = document.body) {
  const skip = (el) => !el || !el.closest('[lang^="sr"]') || el.closest('[data-keep-script]');
  const fixText = (t) => {
    if (skip(t.parentElement)) return;
    const s = srText(t.data);
    if (s !== t.data) t.data = s;
  };
  const fix = (node) => {
    if (mode !== 'cyr' || keep) return;
    if (node.nodeType === 3) return fixText(node);
    if (node.nodeType !== 1) return;
    const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    for (let t = w.nextNode(); t; t = w.nextNode()) fixText(t);
  };
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'characterData') fix(m.target);
      else m.addedNodes.forEach(fix);
    }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  fix(root);
}
