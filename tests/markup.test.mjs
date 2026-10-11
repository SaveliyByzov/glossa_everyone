import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInline, stripMarkup } from '../js/markup.js';

const tree = (s) => parseInline(s).children;

test('жирный, курсив, морфема', () => {
  assert.deepEqual(tree('**a** *b* {{c}}'), [
    { type: 'b', children: ['a'] }, ' ', { type: 'i', children: ['b'] }, ' ', { type: 'morph', children: ['c'] },
  ]);
});

test('морфема внутри слова и внутри жирного', () => {
  assert.deepEqual(tree('bil{{en}}'), ['bil', { type: 'morph', children: ['en'] }]);
  assert.deepEqual(tree('**ros{{ae}}**'), [{ type: 'b', children: ['ros', { type: 'morph', children: ['ae'] }] }]);
});

test('жирный внутри курсива', () => {
  assert.deepEqual(tree('*a **b** c*'), [{ type: 'i', children: ['a ', { type: 'b', children: ['b'] }, ' c'] }]);
});

test('незакрытые маркеры остаются текстом', () => {
  assert.deepEqual(tree('5 * 3'), ['5 * 3']);
  assert.deepEqual(tree('**без конца'), ['**без конца']);
  assert.deepEqual(tree('{{открыто'), ['{{открыто']);
});

test('экранирование \\*', () => {
  assert.deepEqual(tree('не \\*en bilen'), ['не *en bilen']);
  assert.equal(stripMarkup('*\\*han gådde*'), '*han gådde');
});

test('HTML не интерпретируется — остаётся текстом', () => {
  assert.deepEqual(tree('<b>x</b> & <script>'), ['<b>x</b> & <script>']);
  assert.equal(stripMarkup('<img onerror=alert(1)>'), '<img onerror=alert(1)>');
});

test('stripMarkup', () => {
  assert.equal(stripMarkup('**Bil{{en}}** er *ny*.'), 'Bilen er ny.');
  assert.equal(stripMarkup(null), '');
});
