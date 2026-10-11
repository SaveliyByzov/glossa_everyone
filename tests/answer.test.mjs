import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, checkAnswer, levenshtein, srCyrToLat, srLatToCyr, sameText } from '../js/answer.js';

const ok = (input, answers, policy) => checkAnswer(input, answers, policy).correct;
const exact = (input, answers, policy) => { const r = checkAnswer(input, answers, policy); return r.correct && !r.almost; };

test('нормализация: регистр, пробелы, конечная пунктуация, кавычки', () => {
  assert.equal(normalize('  Bilen   er  NY. '), 'bilen er ny');
  assert.equal(normalize('Hei , du!'), 'hei, du');
  assert.equal(normalize('Er det ditt?!'), 'er det ditt');
  assert.equal(normalize('Bilen er ny', { ignoreCase: false }), 'Bilen er ny');
  assert.equal(normalize('«Ja»'), '"ja"');
  assert.equal(normalize('**bil**{{en}}'), 'bilen', 'разметка снимается');
});

test('апострофы ’ ‘ ʼ эквивалентны во всех курсах', () => {
  assert.ok(exact("l'amico", ['l’amico']));
  assert.ok(exact('dov‘è', ["dov'è"]));
  assert.ok(exact('Dovʼè', ['dov’è']));
});

test('it: apostropheAccent (true и объект) — e\' = è в конце слова, для ввода и эталона', () => {
  const t = { apostropheAccent: true };
  const obj = { apostropheAccent: { "a'": 'à', "e'": 'è', "i'": 'ì', "o'": 'ò', "u'": 'ù' } };
  for (const p of [t, obj]) {
    assert.ok(exact("e'", ['è'], p));
    assert.ok(exact("perche' piu'", ['perchè più'], p));
    assert.ok(exact("citta'", ['città'], p));
    assert.ok(exact("po'", ["po'"], p), 'po’ в эталоне тоже превращается — совпадает');
    assert.ok(exact('po’', ["po'"], p));
    assert.ok(exact("di'", ['di’'], p));
    assert.ok(exact("l'amico", ["l'amico"], p), 'элизия перед гласной не трогается');
  }
  assert.equal(normalize("e'", t), 'è');
  assert.equal(normalize("l'acqua", t), "l'acqua");
  assert.ok(!exact("e'", ['è']), 'без флага не действует');
});

test('la: макроны необязательны, j/i и v/u взаимозаменяемы (без учёта регистра)', () => {
  const la = { optionalMarks: ['ā', 'ē', 'ī', 'ō', 'ū', 'ȳ'], equivalents: [['j', 'i'], ['v', 'u']] };
  assert.ok(exact('rosae', ['rosae'], la));
  assert.ok(exact('regi', ['rēgī'], la));
  assert.ok(exact('Rēgī', ['regi'], la));
  assert.ok(exact('Iulius', ['Jūlius'], la));
  assert.ok(exact('VENI VIDI VICI', ['uēnī, uīdī, uīcī'.replace(/,/g, '')], la));
  assert.ok(exact('iam', ['jam'], la));
  assert.ok(!exact('rega', ['rēgī'], la));
});

test('ang: þ = ð, ƿ = w, ǣ → æ (не a!), ċ → c, ġ → g', () => {
  const ang = { optionalMarks: ['ā', 'ǣ', 'ē', 'ī', 'ō', 'ū', 'ȳ', 'ċ', 'ġ'], equivalents: [['þ', 'ð'], ['ƿ', 'w']] };
  assert.ok(exact('þæt', ['ðæt'], ang));
  assert.ok(exact('ÐÆT', ['þæt'], ang));
  assert.ok(exact('ƿyrd', ['wyrd'], ang));
  assert.ok(exact('æfen', ['ǣfen'], ang));
  assert.ok(exact('cyning', ['ċyning'], ang));
  assert.ok(exact('gear', ['ġēar'], ang));
  assert.equal(normalize('ǣ', ang), 'æ');
  assert.ok(!exact('afen', ['ǣfen'], ang), 'æ никогда не равно a');
  assert.ok(!exact('efen', ['ǣfen'], ang), 'æ никогда не равно e');
});

test('nb: диакритика é è ê ó ò ô необязательна, æ ø å — обязательны', () => {
  const nb = { optionalMarks: ['é', 'è', 'ê', 'ó', 'ò', 'ô'] };
  assert.ok(exact('kafe', ['kafé'], nb));
  assert.ok(exact('for', ['fôr'], nb));
  assert.ok(!exact('gar', ['går'], nb));
  assert.ok(!exact('for', ['før'], nb));
});

test('sr: транслитерация кириллица ↔ латиница, включая lj nj dž đ', () => {
  assert.equal(srCyrToLat('љубав њега џеп ђак ћерка'), 'ljubav njega džep đak ćerka');
  assert.equal(srCyrToLat('Љубав'), 'Ljubav');
  assert.equal(srCyrToLat('ЉУБАВ'), 'LJUBAV');
  assert.equal(srLatToCyr('ljubav njega džep đak ćerka'), 'љубав њега џеп ђак ћерка');
  assert.equal(srLatToCyr('Njegoš'), 'Његош');
  const sr = { script: 'sr' };
  assert.ok(exact('Ја сам из Русије', ['Ja sam iz Rusije'], sr));
  assert.ok(exact('ja sam iz Rusije', ['Ја сам из Русије'], sr));
  assert.ok(exact('Љубљана', ['Ljubljana'], sr));
  assert.ok(exact('džep', ['џеп'], sr));
  // ответ показывается в алфавите пользователя
  assert.equal(checkAnswer('кућа', ['kuća'], sr).expected, 'кућа');
  assert.equal(checkAnswer('kuca', ['kuća'], sr).expected, 'kuća');
});

test('sr: ASCII «dj» = đ полностью; c/s/z вместо č/ć/š/ž — только «почти»', () => {
  const sr = { script: 'sr' };
  assert.ok(exact('Djak', ['Đak'], sr));
  assert.ok(exact('djak', ['ђак'], sr));
  const r = checkAnswer('cuvar', ['čuvar'], sr);
  assert.ok(r.correct && r.almost);
  const r2 = checkAnswer('kuca', ['kuća'], sr);
  assert.ok(r2.correct && r2.almost, 'даже на коротких словах');
  assert.ok(!ok('kuce', ['kuća'], sr));
});

test('«почти верно»: одна опечатка в основе слова длиной ≥ 5', () => {
  const r = checkAnswer('snakkker', ['snakker']);
  assert.ok(r.correct && r.almost);
  assert.equal(r.expected, 'snakker');
  assert.ok(checkAnswer('dmoinus', ['dominus']).almost === false, 'перестановка — две правки');
  assert.ok(checkAnswer('domunus', ['dominus']).almost, 'замена в основе');
  assert.ok(checkAnswer('Jeg snakkker norsk', ['Jeg snakker norsk']).almost, 'опечатка в основе внутри фразы');
  assert.ok(!ok('bila', ['bil']), 'короткие слова — без поблажек');
  assert.ok(!ok('bilene', ['bil']), 'две ошибки — неверно');
  assert.ok(exact('huset', ['husene', 'huset']), 'точное совпадение с любой альтернативой');
});

test('ошибка в окончании — это грамматика, а не опечатка', () => {
  assert.ok(!ok('stānes', ['stānas']));
  assert.ok(!ok('bilenn', ['bilen']));
  assert.ok(!ok('laudabat', ['laudābant']));
  assert.ok(!ok('Jeg snakket norsk', ['Jeg snakker norsk']));
  assert.ok(!ok('dominos', ['dominus']), 'правка на границе зоны окончания');
});

test('«почти» не засчитывается, если ввод — другая реальная форма', () => {
  const r = checkAnswer('biler', ['bilen'], {}, { wrongForms: ['biler', 'bilene'] });
  assert.ok(!r.correct);
  assert.ok(checkAnswer('bilen', ['bilen'], {}, { wrongForms: ['biler'] }).correct);
});

test('ru: ё = е', () => {
  assert.ok(exact('ещё', ['еще'], { equivalents: [['е', 'ё']] }));
});

test('пустой ввод и пустые ответы', () => {
  assert.ok(!ok('', ['a']));
  assert.ok(!ok('a', []));
});

test('levenshtein', () => {
  assert.equal(levenshtein('kitten', 'sitting'), 3);
  assert.equal(levenshtein('', 'abc'), 3);
  assert.equal(levenshtein('æfen', 'æfen'), 0);
  assert.ok(levenshtein('aaaaaaa', 'b', 1) > 1);
  assert.ok(sameText('Bilen.', 'bilen'));
});
