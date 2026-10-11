// Озвучка через speechSynthesis — только если в системе есть голос нужного языка.
import { stripMarkup } from './markup.js';
import { store } from './store.js';

const synth = globalThis.speechSynthesis;
let voices = [];

function refresh() { voices = synth?.getVoices?.() || []; }
if (synth) {
  refresh();
  synth.addEventListener?.('voiceschanged', refresh);
}

// Сербские голоса помечены sr (hr/bs — близко, но не то — не берём).
const ALIASES = { sr: ['sr'] };

export function voiceFor(lang) {
  if (!lang || !voices.length) return null;
  const base = lang.toLowerCase().split('-')[0];
  const prefixes = ALIASES[base] || [base];
  const exact = voices.find((v) => v.lang?.toLowerCase().replace('_', '-') === lang.toLowerCase());
  return exact || voices.find((v) => prefixes.some((p) => v.lang?.toLowerCase().startsWith(p))) || null;
}

/** Функция озвучки для курса (или null, если голоса нет / озвучка выключена). */
export function speakerFor(course) {
  const fn = (text) => speak(text, course?.tts);
  Object.defineProperty(fn, 'available', { get: () => !!(course?.tts && store.state.settings.tts && voiceFor(course.tts)) });
  return fn;
}

export function speak(text, lang) {
  const voice = voiceFor(lang);
  if (!voice || !store.state.settings.tts) return false;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(stripMarkup(text).replace(/___/g, '…'));
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 0.92;
  synth.speak(u);
  return true;
}

export const ttsSupported = () => !!synth;
