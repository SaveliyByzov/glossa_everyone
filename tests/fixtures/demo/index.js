// Демо-курс (отладка движка). Виден только при ?demo=1.
import u01 from './u01.js';
import u01ex from './u01.ex.js';

export default {
  id: 'demo',
  name: 'Demo (bokmål)',
  nameRu: 'Демо-курс',
  mode: 'learn',
  level: 'demo',
  keyboard: ['æ', 'ø', 'å'],
  tts: 'nb-NO',
  answer: { ignoreCase: true, optionalMarks: [], equivalents: [], script: null },
  skills: {
    'demo.noun.gender': { name: 'Род существительных', unit: 'demo-u01' },
    'demo.noun.definite': { name: 'Определённая форма', unit: 'demo-u01' },
  },
  units: [{ ...u01, exercises: u01ex }],
};
