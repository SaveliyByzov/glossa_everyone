// Hash-роутер: '#/c/nb/l/nb-u01-l01' → { view, params }.
// Маршруты — строки с :параметрами; первый совпавший побеждает.

const routes = [];

export function route(pattern, handler) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
  routes.push({ re, keys, handler, pattern });
}

export function match(path) {
  for (const r of routes) {
    const m = r.re.exec(path);
    if (m) return { handler: r.handler, pattern: r.pattern, params: Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
  }
  return null;
}

export function currentPath() {
  const p = location.hash.replace(/^#/, '');
  return p.startsWith('/') ? p : '/';
}

export function go(path, { replace = false } = {}) {
  const url = `#${path}`;
  if (replace) { history.replaceState(null, '', url); dispatchEvent(new HashChangeEvent('hashchange')); }
  else if (location.hash === url) dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = path;
}

export function start(onRoute) {
  const run = () => onRoute(currentPath(), match(currentPath()));
  addEventListener('hashchange', run);
  run();
}
