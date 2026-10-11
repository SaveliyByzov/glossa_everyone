// Инлайн-разметка контента: **жирный**, *курсив*, {{морфема}}.
// Разбор — чистая функция (тестируется в node), рендер — только через DOM API (никакого innerHTML).
// Незакрытые маркеры остаются литеральным текстом; «\*» и «\{» экранируют маркер.

import { srText } from './script.js';

const TAGS = { '**': 'b', '*': 'i', '{{': 'morph' };   // по docs/DESIGN.md: **x** → <b>, *x* → <i>
const CLOSERS = { '**': '**', '*': '*', '{{': '}}' };

/** Разбирает строку в дерево: { type: 'root'|'b'|'i'|'morph', children: (string|node)[] }. */
export function parseInline(src) {
  const s = String(src ?? '');
  return { type: 'root', children: parseSeq(s, 0, null).children };
}

function parseSeq(s, pos, closer) {
  const children = [];
  let buf = '';
  const flush = () => { if (buf) { children.push(buf); buf = ''; } };

  while (pos < s.length) {
    // экранирование
    if (s[pos] === '\\' && (s[pos + 1] === '*' || s[pos + 1] === '{' || s[pos + 1] === '}' || s[pos + 1] === '\\')) {
      buf += s[pos + 1]; pos += 2; continue;
    }
    const opener = s.startsWith('{{', pos) ? '{{' : s.startsWith('**', pos) ? '**' : s[pos] === '*' ? '*' : null;

    // закрывающий маркер текущего уровня (внутри *курсива* «**» трактуем как вложенный жирный, если он закрывается)
    if (closer && s.startsWith(closer, pos)) {
      const nestedBold = closer === '*' && opener === '**' && parseSeq(s, pos + 2, '**');
      if (!nestedBold) { flush(); return { children, pos: pos + closer.length }; }
    }

    if (opener) {
      const inner = parseSeq(s, pos + opener.length, CLOSERS[opener]);
      if (inner && inner.children.length) {
        flush();
        children.push({ type: TAGS[opener], children: inner.children });
        pos = inner.pos;
        continue;
      }
      buf += opener; pos += opener.length; continue;
    }
    buf += s[pos++];
  }
  if (closer) return null; // не нашли закрывающий маркер
  flush();
  return { children, pos };
}

/** Текст без разметки (для сравнения ответов, поиска, озвучки). */
export function stripMarkup(src) {
  const walk = (node) => node.children.map((c) => (typeof c === 'string' ? c : walk(c))).join('');
  return walk(parseInline(src));
}

/** DocumentFragment с безопасно отрисованной разметкой. */
export function renderInline(src) {
  const frag = document.createDocumentFragment();
  const build = (parent, node) => {
    for (const c of node.children) {
      if (typeof c === 'string') { parent.append(document.createTextNode(srText(c))); continue; }
      const el = c.type === 'morph' ? document.createElement('span') : document.createElement(c.type);
      if (c.type === 'morph') el.className = 'morph';
      build(el, c);
      parent.append(el);
    }
  };
  build(frag, parseInline(src));
  return frag;
}

/** Хелпер: элемент tag с разметкой внутри. */
export function md(tag, cls, src) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  el.append(renderInline(src));
  return el;
}
