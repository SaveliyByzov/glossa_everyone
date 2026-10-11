// Мелкие общие утилиты.

/** Перемешивание Фишера–Йетса (возвращает новый массив). */
export function shuffle(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Перемешивает, стараясь не оставить исходный порядок (для плиток/вариантов). */
export function shuffleNotIdentity(arr, rnd = Math.random) {
  if (arr.length < 2) return [...arr];
  for (let i = 0; i < 5; i++) {
    const s = shuffle(arr, rnd);
    if (s.some((x, k) => x !== arr[k])) return s;
  }
  return [...arr].reverse();
}

/** Случайная выборка n элементов с сохранением исходного порядка. */
export function sampleOrdered(arr, n, rnd = Math.random) {
  if (arr.length <= n) return [...arr];
  const idx = shuffle(arr.map((_, i) => i), rnd).slice(0, n).sort((a, b) => a - b);
  return idx.map((i) => arr[i]);
}

export function pick(arr, rnd = Math.random) { return arr[Math.floor(rnd() * arr.length)]; }

export function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }

/** Локальная дата 'YYYY-MM-DD'. */
export function dayKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Количество календарных дней между двумя ключами дат (b − a). */
export function daysBetween(a, b) {
  const t = (k) => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((t(b) - t(a)) / 86_400_000);
}

/** Склонение русских числительных: plural(5, ['урок','урока','уроков']). */
export function plural(n, [one, few, many]) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const isTouch = () => matchMedia?.('(pointer: coarse)').matches;
