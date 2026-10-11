import { test } from 'node:test';
import assert from 'node:assert/strict';
import { srText, setScript, getScript, withoutScript, srKeyboard, SR_KEYBOARD } from '../js/script.js';
import { checkAnswer } from '../js/answer.js';

test('алфавит показа: по умолчанию латиница, текст не меняется', () => {
  setScript('lat');
  assert.equal(getScript(), 'lat');
  assert.equal(srText('Ja sam student.'), 'Ja sam student.');
});

test('кириллица: латинские слова транслитерируются, русский и чужие аббревиатуры — нет', () => {
  setScript('cyr');
  assert.equal(srText('Ljubav je lepa, noć, džep, đak'), 'Љубав је лепа, ноћ, џеп, ђак');
  assert.equal(srText('Ja sam *student*: это «Njujork»'), 'Ја сам *студент*: это «Њујорк»');
  assert.equal(srText('Набрано 50 XP'), 'Набрано 50 XP');
  assert.equal(srText('кир. љ = lj'), 'кир. љ = lj', 'строка с сербской кириллицей показывается как есть');
  assert.equal(withoutScript(() => srText('hvala')), 'hvala');
  setScript('lat');
});

test('клавиатура: кириллица — ђ ј љ њ ћ џ, латиница — č ć š ž đ', () => {
  setScript('lat');
  assert.deepEqual(srKeyboard(), ['č', 'ć', 'š', 'ž', 'đ']);
  setScript('cyr');
  assert.deepEqual(srKeyboard(), SR_KEYBOARD.cyr);
  assert.deepEqual([...srKeyboard()].sort(), ['ђ', 'ј', 'љ', 'њ', 'ћ', 'џ'].sort());
  setScript('lat');
});

test('ответ принимается в любом алфавите; эталон показывается в выбранном (policy.display)', () => {
  const policy = { script: 'sr', ignoreCase: true };
  assert.ok(checkAnswer('Ја сам студент', ['Ja sam student'], policy).correct);
  assert.ok(checkAnswer('ja sam student', ['Ја сам студент'], policy).correct);
  const wrong = (display) => checkAnswer('pogrešno', ['Ja sam student'], { ...policy, display }).expected;
  assert.equal(wrong('cyr'), 'Ја сам студент');
  assert.equal(wrong('lat'), 'Ja sam student');
});
