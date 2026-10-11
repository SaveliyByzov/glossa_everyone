// Безопасное создание DOM без innerHTML.
// h('button', { class: 'btn btn--primary', onclick: fn }, 'Текст', childNode)

export function h(tag, attrs = null, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      if (val == null || val === false) continue;
      if (key === 'class') el.className = Array.isArray(val) ? val.filter(Boolean).join(' ') : val;
      else if (key === 'text') el.textContent = val;
      else if (key === 'dataset') Object.assign(el.dataset, val);
      else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
      else if (key.startsWith('on') && typeof val === 'function') el.addEventListener(key.slice(2), val);
      else if (key in el && typeof val !== 'string') el[key] = val;           // value, checked, disabled…
      else el.setAttribute(key, val === true ? '' : String(val));
    }
  }
  append(el, children);
  return el;
}

/** Добавляет детей: строки → текстовые узлы, массивы раскрываются, null/false пропускаются. */
export function append(parent, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    parent.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return parent;
}

export function clear(el) {
  while (el.firstChild) el.firstChild.remove();
  return el;
}

/** Иконки — из SVG-спрайта в index.html (скопирован из design/gallery.html): #i-<name>. */
const NS = 'http://www.w3.org/2000/svg';
const XLINK = 'http://www.w3.org/1999/xlink';

export function icon(name, extra = '') {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', extra ? `icon ${extra}` : 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', `#i-${name}`);
  use.setAttributeNS(XLINK, 'xlink:href', `#i-${name}`); // старый Safari
  svg.append(use);
  return svg;
}
