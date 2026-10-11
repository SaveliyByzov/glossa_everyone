// Реестр типов упражнений.
import * as choice from './choice.js';
import * as cloze from './cloze.js';
import * as translate from './translate.js';
import * as order from './order.js';
import * as match from './match.js';
import * as paradigm from './paradigm.js';
import * as classify from './classify.js';
import * as transform from './transform.js';
import * as fix from './fix.js';
import * as flashcard from './flashcard.js';

export const TYPES = { choice, cloze, translate, order, match, paradigm, classify, transform, fix, flashcard };

export function renderExercise(ex, ctx) {
  const mod = TYPES[ex.type];
  if (!mod) throw new Error(`Неизвестный тип упражнения: ${ex.type}`);
  return mod.render(ex, ctx);
}
