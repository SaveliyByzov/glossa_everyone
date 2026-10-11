import u01 from './u01.js';
import u01ex from './u01.ex.js';
import u02 from './u02.js';
import u02ex from './u02.ex.js';
import u03 from './u03.js';
import u03ex from './u03.ex.js';
import u04 from './u04.js';
import u04ex from './u04.ex.js';
import u05 from './u05.js';
import u05ex from './u05.ex.js';
import u06 from './u06.js';
import u06ex from './u06.ex.js';
import u07 from './u07.js';
import u07ex from './u07.ex.js';
import u08 from './u08.js';
import u08ex from './u08.ex.js';
import u09 from './u09.js';
import u09ex from './u09.ex.js';
import u10 from './u10.js';
import u10ex from './u10.ex.js';

export default {
  id: 'sr',
  name: 'Srpski',
  nameRu: 'Сербский',
  mode: 'learn',
  level: 'A0–B1',
  keyboard: ['č', 'ć', 'š', 'ž', 'đ', 'dž'],
  answer: {
    ignoreCase: true,
    optionalMarks: [],
    equivalents: [],
    script: 'sr'
  },
  skills: {
    'sr.script': { name: 'Кириллица и латиница', unit: 'sr-u01' },
    'sr.phon': { name: 'Произношение и ударение', unit: 'sr-u01' },
    'sr.lex.greetings': { name: 'Приветствия и вежливость', unit: 'sr-u01' },
    'sr.pron.pers': { name: 'Личные местоимения', unit: 'sr-u02' },
    'sr.biti': { name: 'Глагол biti: полные, краткие, отрицательные формы', unit: 'sr-u02' },
    'sr.questions': { name: 'Вопросы: da li, jesi li, вопросительные слова', unit: 'sr-u02' },
    'sr.lex.people': { name: 'Профессии и национальности', unit: 'sr-u02' },
    'sr.pres.am': { name: 'Презенс: тип -am', unit: 'sr-u03' },
    'sr.pres.im': { name: 'Презенс: тип -im', unit: 'sr-u03' },
    'sr.pres.em': { name: 'Презенс: тип -em', unit: 'sr-u03' },
    'sr.pres.irreg': { name: 'hteti, moći, morati, smeti', unit: 'sr-u03' },
    'sr.noun.gender': { name: 'Род существительных', unit: 'sr-u04' },
    'sr.noun.plural': { name: 'Множественное число', unit: 'sr-u04' },
    'sr.case.acc': { name: 'Аккузатив', unit: 'sr-u04' },
    'sr.adj.agree': { name: 'Согласование прилагательных', unit: 'sr-u04' },
    'sr.pron.poss': { name: 'Притяжательные местоимения', unit: 'sr-u04' },
    'sr.case.loc': { name: 'Локатив', unit: 'sr-u05' },
    'sr.case.gen': { name: 'Генитив', unit: 'sr-u05' },
    'sr.num': { name: 'Числительные и падеж после них', unit: 'sr-u05' },
    'sr.case.dat': { name: 'Датив', unit: 'sr-u06' },
    'sr.case.ins': { name: 'Инструментал', unit: 'sr-u06' },
    'sr.case.voc': { name: 'Вокатив', unit: 'sr-u06' },
    'sr.perf': { name: 'Перфект', unit: 'sr-u07' },
    'sr.lex.time': { name: 'Время, часы, времена года', unit: 'sr-u07' },
    'sr.aspect': { name: 'Вид глагола', unit: 'sr-u08' },
    'sr.fut': { name: 'Футур I', unit: 'sr-u08' },
    'sr.fut2': { name: 'Сов. презенс и футур II в придаточных', unit: 'sr-u08' },
    'sr.adj.decl': { name: 'Склонение прилагательных', unit: 'sr-u09' },
    'sr.adj.comp': { name: 'Степени сравнения', unit: 'sr-u09' },
    'sr.clitics': { name: 'Энклитики: второе место и порядок', unit: 'sr-u09' },
    'sr.da': { name: 'Конструкции с da', unit: 'sr-u10' },
    'sr.subord': { name: 'Придаточные: koji, jer, iako…', unit: 'sr-u10' },
    'sr.cond': { name: 'Кондиционал', unit: 'sr-u10' }
  },
  units: [
    { ...u01, exercises: u01ex },
    { ...u02, exercises: u02ex },
    { ...u03, exercises: u03ex },
    { ...u04, exercises: u04ex },
    { ...u05, exercises: u05ex },
    { ...u06, exercises: u06ex },
    { ...u07, exercises: u07ex },
    { ...u08, exercises: u08ex },
    { ...u09, exercises: u09ex },
    { ...u10, exercises: u10ex }
  ]
}
