# Glossa — общий контракт проекта

Этот файл — единый источник правды для всех агентов (UI/UX, разработчик, лингвист, методолог).
Если что-то нужно изменить в контракте — не ломайте его молча, а опишите изменение в своём отчёте.

## Продукт
Офлайн-приложение для изучения и повторения **грамматики и лексики**. Язык интерфейса и пояснений — **русский**.
Курс (в этой сборке — единственный):

| id    | Язык     | Режим    | Особенности |
|-------|----------|----------|-------------|
| `sr`  | Сербский | с нуля   | два алфавита: ввод латиницей и кириллицей принимается одинаково, показ — по настройке `settings.script` (`lat`/`cyr`, транслитерация на лету, `js/script.js`); 7 падежей, вид глагола |

Контент пишется латиницей; в данных можно пометить `keepScript: true` у урока/упражнения, где показываются сами алфавиты (без транслитерации).

Пользователь — русскоязычный, филологически грамотный, любит грамматику. Термины можно использовать (номинатив, претерит, аблатив), но объяснения — ясные и сжатые. Важна опора на русский (L1-трансфер: «как в русском» / «в отличие от русского»).

## Платформы и архитектура
- **Одна кодовая база — PWA**, без сборки и без зависимостей: чистый HTML + CSS + ES-модули.
  - Web: открыть в браузере (локальный сервер или хостинг), Service Worker кэширует всё → работает без интернета.
  - iPhone: Safari → «На экран Домой» (полностью офлайн) **или** обёртка Capacitor (`ios/`, нужен Mac + Xcode).
  - Android: Chrome → «Установить приложение» **или** обёртка Capacitor (`android/`, Android Studio → APK).
- Хранилище прогресса: `localStorage` (ключ `glossa:v1`) + экспорт/импорт JSON-файла (бэкап/перенос между устройствами).
- Озвучка (опционально): `speechSynthesis`, только если в системе есть голос языка (sr).

## Структура файлов
```
index.html                 — оболочка (разработчик)
manifest.webmanifest, sw.js, icons/   — PWA (разработчик)
css/tokens.css             — дизайн-токены (UI/UX)
css/app.css                — все стили компонентов (UI/UX; разработчик пишет только временный минимум в css/dev.css)
js/                        — движок (разработчик)
data/courses.js            — реестр курсов (разработчик)
data/pedagogy.js           — параметры геймификации/сессий/SRS/достижения (методолог)
data/<lang>/index.js       — сборка курса из юнитов (лингвист)
data/<lang>/uNN.js         — теория + лексика юнита (лингвист)
data/<lang>/uNN.ex.js      — упражнения юнита (методолог)
docs/DESIGN.md             — дизайн-система (UI/UX)
docs/LINGUISTICS.md        — логика подачи материала, scope & sequence (лингвист)
docs/PEDAGOGY.md           — методика, типы упражнений, геймификация (методолог)
README.md                  — запуск и сборка под платформы (разработчик)
capacitor.config.json, package.json   — нативные обёртки (разработчик)
```

## Схема данных курса

Все данные — ES-модули с `export default`. Только UTF-8. Без функций внутри данных.

### data/<lang>/index.js
```js
import u01 from './u01.js'; import u01ex from './u01.ex.js';
// ...
export default {
  id: 'nb',
  name: 'Norsk bokmål',
  nameRu: 'Норвежский (букмол)',
  mode: 'review',                 // 'review' | 'learn'
  level: 'A1–B1',
  keyboard: ['æ','ø','å'],         // кнопки спецсимволов над полем ввода
  answer: {                        // политика проверки ввода
    ignoreCase: true,
    optionalMarks: [],             // символы, которые можно не вводить: для la ['ā','ē','ī','ō','ū','ȳ'] → a e i o u y
    equivalents: [],               // пары взаимозаменяемых символов, напр. ang: [['ð','þ'],['ƿ','w'],['ȝ','g']]
    script: null                   // для sr: 'sr' → кириллица и латиница считаются эквивалентными
  },
  skills: {                        // каталог грамматических навыков курса
    'nb.noun.gender': { name: 'Род существительных', unit: 'nb-u01' },
    // ...
  },
  units: [ { ...u01, exercises: u01ex }, /* ... */ ]
}
```
Если файл `uNN.ex.js` ещё не готов — индекс импортирует только `uNN.js` (движок должен работать без упражнений, генерируя упражнения из лексики автоматически).

### data/<lang>/uNN.js  (лингвист)
```js
export default {
  id: 'nb-u01',
  title: 'Substantiv: kjønn og bestemthet',
  titleRu: 'Существительное: род и определённость',
  summary: 'Одно-два предложения: что даёт юнит.',
  lessons: [
    {
      id: 'nb-u01-l01',
      kind: 'grammar',             // 'grammar' | 'vocab' | 'reading' | 'review'
      title: 'Три рода',
      goals: ['Определять род по артиклю', 'Выбирать en/ei/et'],
      skills: ['nb.noun.gender'],
      theory: [ /* блоки, см. ниже */ ],
      vocab: [ /* лексемы, см. ниже */ ],
      text: null                   // для kind:'reading': { title, lines: [{t:'...', ru:'...'}] }
    }
  ]
}
```

**Блоки теории** (`theory`):
| type | поля | смысл |
|---|---|---|
| `h` | `text` | подзаголовок |
| `p` | `text` | абзац |
| `rule` | `text` | ключевое правило (выделенная карточка) |
| `table` | `caption?`, `head: string[]`, `rows: string[][]`, `note?` | парадигма/таблица; первая колонка — метки |
| `examples` | `items: [{ t, ru, note? }]` | примеры: t — на изучаемом языке |
| `contrast` | `text` | сопоставление с русским (L1-трансфер) |
| `tip` | `text` | мнемоника / лайфхак |
| `pitfall` | `text` | типичная ошибка |

**Инлайн-разметка в любых строках:** `**жирный**`, `*курсив*`, `{{окончание}}` — подсветка морфемы (например `bil{{en}}`, `ros{{ae}}`). Больше ничего (никакого HTML).

**Лексема** (`vocab`):
```js
{ id: 'nb-bil', w: 'bil', ru: 'машина, автомобиль', pos: 'n', g: 'm',
  forms: 'bilen, biler, bilene',       // главные формы строкой (для la: 'rosa, -ae f.'; для глаголов — основные формы)
  ex: 'Bilen er ny.', exRu: 'Машина новая.', note: null }
```
`pos`: n, v, adj, adv, pron, prep, conj, num, part, phr. `g` (род): m, f, n, c (общий) — если применимо. `id` уникален в пределах курса: `<lang>-<слово>` (+ суффикс при омонимии).

### data/<lang>/uNN.ex.js  (методолог)
```js
export default {
  'nb-u01-l01': [ /* упражнения урока, по возрастанию сложности */ ],
  'nb-u01-l02': [ ... ],
}
```
Общие поля любого упражнения: `type`, `skill?` (id из `skills`), `level` (1–3), `explain` (почему так — показывается после ответа, ВСЕГДА для грамматики), `prompt?` (инструкция по-русски, если отличается от стандартной).

| type | поля | механика |
|---|---|---|
| `choice` | `q`, `options: string[]`, `answer: number` | выбор одного варианта |
| `cloze` | `text` с `___` (по числу пропусков), `answers: (string\|string[])[]`, `hint?` | ввод пропущенных форм; массив = допустимые варианты |
| `translate` | `dir: 'toTarget'\|'toRu'`, `q`, `answers: string[]` | перевод фразы; несколько допустимых вариантов |
| `order` | `q` (рус. смысл), `tokens: string[]` (в ПРАВИЛЬНОМ порядке), `distractors?: string[]`, `alt?: string[][]` | собрать фразу из плиток (движок перемешивает) |
| `match` | `pairs: [string, string][]` | сопоставить пары (4–6 пар) |
| `paradigm` | `lemma`, `head: string[]`, `rows: string[][]`, `blanks: [row, col][] \| 'all'` | заполнить таблицу склонения/спряжения; колонка 0 — метки |
| `classify` | `buckets: string[]`, `items: [string, number][]` | разложить слова по корзинам (род, склонение, класс глагола) |
| `transform` | `instruction`, `source`, `answers: string[]` | преобразовать (наст. → прош., ед. → мн., актив → пассив) |
| `fix` | `tokens: string[]`, `wrong: number`, `answers: string[]` | найти ошибочное слово и исправить его |

Проверка ввода: движок нормализует (регистр, пробелы, конечная пунктуация, политика `answer` курса) и сравнивает со всеми допустимыми ответами. «Почти верно» (опечатка в 1 символ при длине ≥ 5) — засчитывается с пометкой.

## Геймификация и прогресс (минимум, который реализует движок)
Параметры — из `data/pedagogy.js` (методолог), у движка есть значения по умолчанию.
```js
export default {
  xp: { correct: 10, firstTry: 5, lessonComplete: 20, perfectLesson: 30, review: 5 },
  dailyGoals: [20, 50, 100, 200],        // XP/день на выбор
  streak: { freezes: 2 },                // заморозки серии
  session: { lessonLength: 12, reviewLength: 15, mixOldRatio: 0.2 },
  mastery: { levels: 5, thresholds: [0.6, 0.75, 0.85, 0.9, 0.95] },
  srs: { algorithm: 'sm2-lite', learningSteps: [10, 1440], graduatingInterval: 3, easyBonus: 1.3 },
  achievements: [ { id, title, desc, icon, rule: { type: 'xpTotal'|'streak'|'lessons'|'perfect'|'skillMastery'|'reviews'|'courses', value } } ],
  ranks: [ { xp: 0, title: '...' }, ... ]   // звания
}
```
- **XP**, **дневная цель**, **серия (streak)** с заморозками.
- **Мастерство урока** 0–5 (по точности последних сессий); юнит открыт, если предыдущий пройден (можно «перепрыгнуть» тестом — для режима `review`).
- **SRS** по лексемам И по грамматическим навыкам: ошибки попадают в «банк ошибок» и возвращаются в повторении.
- **Достижения** и звания — data-driven.

## Классы разметки (договорённость UI/UX ↔ разработчик)
Разработчик генерирует разметку с этими классами; UI/UX стилизует их в `css/app.css` (может добавлять модификаторы `--*`, но не переименовывает).
Методология именования — BEM-lite: `.block`, `.block__elem`, `.block--mod`, состояния `.is-*`.

Каркас: `.app`, `.topbar`, `.topbar__title`, `.topbar__stats`, `.stat` (`.stat--xp`, `.stat--streak`, `.stat--goal`), `.view`, `.tabbar`, `.tabbar__item` (`.is-active`).
Экраны (`.view--*`): `home` (выбор курса), `course` (карта юнитов), `lesson-intro` (теория), `session` (упражнения), `result`, `review` (повторение), `vocab` (словарь), `profile` (статистика/достижения/настройки).
Компоненты: `.card`, `.course-card`, `.unit`, `.unit__lessons`, `.lesson-node` (`.is-locked`, `.is-done`, `.is-current`), `.mastery` (точки/короны 0–5), `.progress` + `.progress__bar`, `.btn` (`--primary`, `--ghost`, `--danger`, `--block`), `.chip`, `.badge`, `.achievement` (`.is-earned`), `.theory`, `.theory__rule`, `.theory__table`, `.theory__examples`, `.theory__contrast`, `.theory__tip`, `.theory__pitfall`, `.morph` (подсветка `{{…}}`), `.ex` (контейнер упражнения) + `.ex--<type>`, `.ex__prompt`, `.ex__q`, `.option` (`.is-selected`, `.is-correct`, `.is-wrong`), `.input` (`.is-correct`, `.is-wrong`), `.keyboard` + `.keyboard__key`, `.tile` (`.is-used`), `.tiles`, `.answer-line`, `.pair`, `.bucket`, `.paradigm` (table), `.feedback` (`--correct`, `--wrong`, `--almost`) + `.feedback__title`, `.feedback__explain`, `.feedback__answer`, `.sheet` (нижняя панель), `.toast`, `.empty`.

Тема: светлая и тёмная (`prefers-color-scheme` + ручной переключатель `[data-theme]` на `<html>`). Мобильный приоритет: 360px+, safe-area, крупные тап-цели ≥ 44px; на десктопе — центрированная колонка + клавиатурные шорткаты (1–4 для вариантов, Enter — проверить/дальше).
