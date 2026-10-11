# Glossa — дизайн-система

Файлы: `css/tokens.css` (токены), `css/app.css` (все компоненты), `design/gallery.html` (эталон разметки, все экраны и состояния). Если разметка в этом документе и в галерее расходится, верна галерея.

---

## 1. Концепция: «Скрипторий и словарь»

Пользователь — филолог, который любит грамматику. Интерфейс разговаривает с ним языком книги, а не мультфильма:

- **Бумага и железо-галловые чернила.** Тёплый бумажный фон, сине-чёрный «чернильный» текст. Тёмная тема — та же книга ночью: чернильная синева вместо чёрного.
- **Рубрикация.** В рукописях окончания и инициалы выделяли киноварью. У нас у каждого языка свой «пигмент» (`--accent`). Им набраны морфемы `{{…}}`, инициал заголовка урока, прогресс и текущий урок. Других цветов в интерфейсе почти нет.
- **Типографика как идентичность.** Изучаемый язык всегда набран антиквой (`--font-text`), интерфейс — системным гротеском (`--font-ui`). Уже по гарнитуре видно, где «язык», а где «кнопка».
- **Словарные приёмы:** пометы курсивом (*m.*, *f./m.*, *v.*), римские номера юнитов, карта курса в виде оглавления с «корешком», итоги урока строками с точечными отточиями (колофон), разлинованная строка в упражнении «собери фразу», мастерство в виде ромбов-пунктусов (5-й уровень позолочен).
- **Спокойно, но живо.** Движение короткое и физичное: нажатия, лист обратной связи, рост прогресса, новая отметка мастерства. Маскотов, конфетти и скевоморфизма нет.

### Решения, принятые без интервью (пользователя не было)
| Вопрос | Решение | Почему |
|---|---|---|
| Светлая или тёмная по умолчанию | Следуем системе (`prefers-color-scheme`), ручной переключатель через `[data-theme]` | Тренировка утром и вечером, на телефоне |
| Бренд-цвет вне курса | Лазурит (hue 272) | Красный зарезервирован за «неверно», зелёный за «верно» |
| Пигменты языков | nb — фьорд (242), la — тирийский пурпур (352), ang — ярь-медянка (192), it — сиена (45), sr — иконная охра (75) | Различимы между собой и не совпадают по тону с ok/bad |
| Шрифты | Только системные стеки (CDN нет); порядок подобран по покрытию символов (§3) | Офлайн-PWA |
| Drag & drop | Не используется: в order/classify/match схема «тап-тап» | Одна рука, доступность, без конфликтов с прокруткой |
| Брейкпоинты | Container queries на `.app` вместо медиазапросов | Корректно в Split View/Slide Over и в галерее |
| Иконки | Свой SVG-спрайт (24×24, обводка 1.75) в `gallery.html` | Без эмодзи и сторонних наборов |

---

## 2. Токены (`css/tokens.css`)

### Цвет (OKLCH)
| Токен | Назначение |
|---|---|
| `--bg` | фон (бумага) |
| `--surface` | карточки, поля ввода, варианты |
| `--surface-2` / `--surface-3` | утопленные зоны: треки, пустые места плиток, нажатое состояние |
| `--line` / `--line-strong` | волосяные линии / рамки полей и линовка |
| `--ink` / `--ink-2` / `--ink-3` | текст: основной / вторичный (≥7:1) / третичный и плейсхолдер (≥4.7:1) |
| `--ink-inverse` | текст на `--ink` (тосты, активные чипы) |
| `--ok(-ink,-soft,-line)` | верно |
| `--bad(-ink,-soft,-line)` | неверно |
| `--almost(-ink,-soft,-line)` | почти верно (опечатка) |
| `--gold(-ink,-soft)` | мастерство 5, полученные медали, блок «Запомнить» |
| `--streak` | серия (пламя) |
| `--xp` | опыт |
| `--focus` | кольцо фокуса |

**Акцент.** Язык задаёт только тон и насыщенность, тема задаёт светлоту:
```css
[data-lang="la"] { --hue: 352; --hue-c: 0.145; }
/* производные пересчитываются на каждом [data-lang] */
--accent        /* заливки: кнопка, прогресс, пройденный урок */
--accent-ink    /* текст акцентным цветом на бумаге */
--accent-soft   /* тонированный фон: правило, текущий урок, выбранный вариант */
--accent-line   /* рамка с акцентом */
--on-accent     /* текст на --accent */
--lang-accent   /* алиас --accent из контракта */
```
Ставьте `data-lang="<id>"` на ближайший контейнер курса: `.app`, `.view` или `.course-card`. Вне курса работает бренд-лазурит.

Проверенный контраст (обе темы): текст на акценте ≥ 5.4:1, `--accent-ink` на бумаге ≥ 6.4:1, на `--accent-soft` ≥ 6:1, `--ok/bad/almost-ink` на своих `-soft` ≥ 6:1, `--ink-3` на `--bg` ≥ 5:1.

### Типографика
| Токен | Значение | Где |
|---|---|---|
| `--fs-2xs` | 11px | подписи таббара |
| `--fs-xs` | 12 | лейблы капителью, пометы |
| `--fs-sm` | 14 | вторичный текст |
| `--fs-base` | 16 | основной |
| `--fs-md` | 18 | варианты, поля, теория |
| `--fs-lg` | 22 | заголовки секций, заголовок топбара |
| `--fs-xl` | 28 | заголовок feedback, номер юнита |
| `--fs-2xl` | 36 | заголовок экрана, урока, итогов |
| `--fs-task` | clamp(22px → 32px, по ширине контейнера) | **текст задания** |

Межстрочный интервал: `--lh-tight` 1.15 (дисплей), `--lh-snug` 1.3 (задание, карточки), `--lh-base` 1.5, `--lh-loose` 1.65 (теория). Лейблы капителью: 12px, жирные, `letter-spacing: .08em`.

### Отступы, радиусы, слои
- Шаг 4px: `--s-1`…`--s-16` (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- `--gutter` 16px (24px при ширине `.app` ≥ 720px), `--col-max` 40rem (упражнения, теория), `--col-wide` 56rem (карта курса, профиль, главная).
- `--tap` 44px (минимум), `--tap-lg` 52px (основная кнопка, поля, варианты).
- Радиусы: `--r-xs` 4 · `--r-sm` 6 (плитки, клавиши) · `--r-md` 10 (кнопки, поля) · `--r-lg` 14 (карточки) · `--r-xl` 20 (верх листа) · `--r-pill`.
- Тени: `--shadow-1` (карточки), `--shadow-2` (текущий юнит, тост), `--shadow-sheet`, `--shadow-tile` (плитки и клавиши: «нажимаемость»).
- z-index: `--z-bar` 20, `--z-sheet` 40, `--z-toast` 60.
- Safe area: `--safe-top/bottom/left/right` = `env(safe-area-inset-*)`.

---

## 3. Шрифты и покрытие символов

```css
--font-ui:   system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif;
--font-text: "Charis SIL", "Gentium Plus", Cambria, "Noto Serif", "Iowan Old Style", "Times New Roman", serif;
```
Проверено по таблицам cmap (Windows 10): **Cambria, Segoe UI, Times New Roman** содержат все символы курса: æ ø å þ ð ƿ ȝ ġ ā ē ī ō ū ȳ č ć š ž đ, прописные и кириллицу (ђ ћ љ њ џ). В **Palatino Linotype, Georgia, Constantia и Sitka нет ƿ ȝ ȳ** (Latin Extended-B), поэтому их нет в стеке.

| Платформа | Чем набирается `--font-text` |
|---|---|
| Windows / macOS с Office | Cambria (полное покрытие) |
| Android, Linux | Noto Serif (полное покрытие) |
| iOS / macOS без Office | Iowan Old Style; ƿ ȝ ȳ браузер берёт из запасного шрифта, то есть отдельные глифы будут из другой гарнитуры. Это допустимо |
| Установлены Charis SIL / Gentium Plus | они (лингвистические гарнитуры, лучший вариант) |

**Вариант на будущее:** положить Charis SIL или Noto Serif (OFL, woff2, подмножество Latin + Latin Ext-A/B + Cyrillic, ≈ 150–250 КБ на начертание) в `fonts/`, объявить `@font-face { font-family: "Glossa Text"; src: url(../fonts/…) format("woff2"); font-display: swap; }`, поставить первым в `--font-text` и добавить файлы в кэш Service Worker. Больше ничего менять не нужно.

Изучаемый язык размечайте атрибутом `lang` (`lang="la"`, `lang="ang"`, `lang="sr"` и т.д.). Селектор `[lang]:not(html)` сам включает антикву, а скринридер произносит текст правильно. Для инлайн-фрагментов без `lang` есть класс `.tl`.

---

## 4. Сетка и адаптив

- **Мобильный приоритет, 360px+.** Одна колонка, боковые поля `--gutter`.
- **Каркас:** `.app` — сетка `topbar / view / tabbar`, высота `100dvh` (не `100vh`), safe-area слева/справа. `.topbar` и `.tabbar` залипают (`position: sticky`), на них учтены `--safe-top` и `--safe-bottom`.
- **Container queries** (`.app { container: app / inline-size }`):
  - ≥ 600: `.stats-grid` в 4 колонки
  - ≥ 720: поля 24px, лист обратной связи центрирован по ширине колонки
  - ≥ 760: `.course-list` в 2 колонки
  - ≥ 900: `.units` в 2 колонки
- **Десктоп:** контент — центрированная колонка, бары растянуты на всю ширину, их содержимое выровнено по колонке. Подсказки клавиш (`.option__key`, `.btn__hint`) видны только при `(hover: hover) and (pointer: fine)`.
- **Сессия:** `.view--session` занимает ровно `100dvh`: тело прокручивается, `.session__footer` прижат к низу, лист `.sheet` позиционируется внутри экрана сессии. Топбар и таббар на экране сессии скрыты автоматически (`.app:has(> .view--session)`). Для браузеров без `:has()` ставьте `.app.is-focus`.

---

## 5. Компоненты: разметка

Полная разметка всех состояний — в `design/gallery.html`. Ниже скелеты.

### Иконки
Скопируйте `<svg … ><defs>…</defs></svg>`-спрайт из начала `gallery.html` в `index.html` (один раз, скрытым). Использование:
```html
<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>
```
Набор: `check x almost flame xp goal arrow-right back chevron lock book repeat dict user speaker backspace pilcrow bulb warn swap medal search snow skip read play`.
Тип урока → иконка на узле: grammar `pilcrow`, vocab `dict`, reading `read`, review `repeat`; пройденный урок → `check`.

### Каркас
```html
<div class="app">
  <header class="topbar">
    <a class="btn btn--icon btn--ghost topbar__back" aria-label="Назад">…</a>   <!-- опц. -->
    <h1 class="topbar__title">Glossa</h1>
    <div class="topbar__stats">
      <span class="stat stat--streak [is-inactive]" aria-label="Серия 15 дней"><svg class="icon">#i-flame</svg>15</span>
      <span class="stat stat--xp"><svg class="icon">#i-xp</svg>4 820</span>
      <span class="stat stat--goal [is-done]"><svg class="icon">#i-goal</svg><span class="stat__meter"><i style="--value:.7"></i></span>35</span>
    </div>
  </header>
  <main class="view view--home">…</main>
  <nav class="tabbar" aria-label="Разделы">
    <a class="tabbar__item is-active" aria-current="page"><svg class="icon">#i-book</svg>Курсы</a>
    <a class="tabbar__item"><svg class="icon">#i-repeat</svg>Повторение<span class="tabbar__badge">23</span></a>
    …
  </nav>
</div>
```
`stat--streak.is-inactive` — серия сегодня ещё не продлена (серое пламя): мягкий стимул вместо красной тревоги.

### Прогресс и мастерство
```html
<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62">
  <div class="progress__bar" style="--value:.62"></div>       <!-- 0…1, анимируется transform -->
</div>
<div class="progress progress--ticks" style="--steps:12">…</div> <!-- сессия: деление на каждое упражнение -->

<span class="mastery" data-level="3" role="img" aria-label="Мастерство 3 из 5"><i></i><i></i><i></i><i></i><i></i></span>
```
Всегда 5 элементов `<i>`. Уровень задаётся `data-level` (0–5) или классом `i.is-on`. Уровень 5 — золото. Новый, только что полученный ромб: `i.is-on.is-new` (+ `style="--i:n"` для задержки).

### Карточка курса и карта юнитов
```html
<a class="course-card [is-new]" data-lang="la">
  <span class="course-card__glyph" aria-hidden="true">Ā</span>   <!-- nb Ø · la Ā · ang Þ · it È · sr Ђ -->
  <div class="course-card__body">
    <h3 class="course-card__name" lang="la">Lingua Latīna</h3>
    <p class="course-card__meta">Латынь · A1–B2 <span class="chip chip--quiet">повтор</span></p>
    <div class="progress progress--thin"><div class="progress__bar" style="--value:.38"></div></div>
    <p class="course-card__foot">Юнит III · Третье склонение</p>
  </div>
  <svg class="icon course-card__chev">#i-chevron</svg>
</a>

<section class="unit [is-current|is-locked]">
  <header class="unit__head">
    <span class="unit__num">III</span>
    <div><h2 class="unit__title" lang="la">Dēclīnātiō tertia</h2><p class="unit__sub">Третье склонение</p></div>
    <span class="badge">2/5</span>
  </header>
  <p class="unit__summary">…</p>                                    <!-- опц. -->
  <ol class="unit__lessons">
    <li><a class="lesson-node is-done|is-current|is-locked" [aria-current="step"]>
      <span class="lesson-node__mark"><svg class="icon">…</svg></span>
      <span class="lesson-node__body"><span class="lesson-node__title">…</span><span class="lesson-node__kind">Грамматика</span></span>
      <span class="mastery" data-level="3">…</span>
    </a></li>
  </ol>
  <button class="btn btn--outline btn--sm unit__skip">Тест-переход</button>   <!-- для is-locked в режиме review -->
</section>
```

### Теория (`.view--lesson-intro`)
```html
<header class="lesson-head"><span class="chip chip--accent">Грамматика · 4 мин</span>
  <h2 class="lesson-head__title">…</h2><ul class="goals"><li><svg class="icon">#i-check</svg>…</li></ul></header>
<div class="theory">
  <h3>…</h3>                                         <!-- блок h -->
  <p>…</p>                                           <!-- блок p -->
  <div class="theory__rule"><p class="theory__label"><svg class="icon">#i-pilcrow</svg>Правило</p><p>…</p></div>
  <div class="theory__table"><table><caption>…</caption><thead>…</thead><tbody lang="la"><tr><th scope="row">Nom.</th><td>…</td></tr></tbody></table><p class="theory__note">…</p></div>
  <ul class="theory__examples"><li><p class="tl" lang="la">…</p><p class="ru">…</p><p class="note">…</p></li></ul>
  <div class="theory__contrast"><p class="theory__label"><svg class="icon">#i-swap</svg>Как в русском</p><p>…</p></div>
  <div class="theory__tip"><p class="theory__label"><svg class="icon">#i-bulb</svg>Запомнить</p><p>…</p></div>
  <div class="theory__pitfall"><p class="theory__label"><svg class="icon">#i-warn</svg>Ловушка</p><p>…</p></div>
</div>
<div class="view__actions"><button class="btn btn--primary btn--block">Начать упражнения</button></div>
```
Инлайн-разметка: `**x**` → `<b>`, `*x*` → `<i>`, `{{x}}` → `<span class="morph">x</span>`. Для `kind:'reading'` используйте `.reading > .reading__line > .tl + .ru`.

### Сессия и упражнения
```html
<section class="view view--session" data-lang="nb">
  <header class="session__bar">
    <button class="btn btn--icon btn--ghost" aria-label="Завершить урок">#i-x</button>
    <div class="progress progress--ticks" style="--steps:12" role="progressbar" …><div class="progress__bar" style="--value:calc(3/12)"></div></div>
    <span class="session__count">4/12</span>
  </header>
  <div class="session__body">
    <article class="ex ex--choice">
      <div class="ex__meta"><span class="chip chip--quiet ex__skill">Род существительных</span></div>  <!-- опц. -->
      <p class="ex__prompt">Выберите артикль</p>
      <p class="ex__q" lang="nb">Vi bor i ___ hus ved sjøen.</p>        <!-- ex__q--ru, если задание по-русски -->
      …механика…
    </article>
  </div>
  <footer class="session__footer">
    [<button class="btn btn--icon btn--outline" aria-label="Очистить">#i-backspace</button>]
    <button class="btn btn--primary btn--block">Проверить <span class="btn__hint">Enter</span></button>
  </footer>
  <div class="sheet feedback feedback--correct" role="status" aria-live="polite">…</div>
</section>
```
Пока ответа нет, «Проверить» стоит в состоянии `disabled`: это утопленная серая кнопка, а не бледный акцент.

| type | механика (внутри `.ex`) | состояния |
|---|---|---|
| `choice` | `.options[role=radiogroup] > button.option[role=radio] > kbd.option__key + span.option__text + svg.icon.option__state`; `.options--grid` — 2 колонки | `.option.is-selected / is-correct / is-wrong`; после проверки `.options.is-locked` |
| `cloze` | в тексте `.ex__q`: `<input class="input input--inline" style="--chars:5">` на каждый `___`; `.ex__hint` | `.is-correct / is-wrong / is-almost` на каждом поле |
| `translate` | `.ex__q` (или `.ex__q--ru`) + `textarea.input.input--area` + `.keyboard` | на поле |
| `order` | `.answer-line[data-placeholder] > button.tile` (собранное) + `.tiles > button.tile` (банк) | использованная плитка в банке → `.tile.is-used` (место сохраняется); после проверки `.answer-line.is-correct/is-wrong` |
| `match` | `.pairs > .pairs__col×2 > button.pair` | `.pair.is-selected / is-matched / is-wrong` (неверная пара мигает и сбрасывается через ~600 мс) |
| `paradigm` | `.paradigm-wrap > table.paradigm > caption + thead + tbody`; данная ячейка `td.is-given`, пропуск `td > input.input.input--cell` | на поле |
| `classify` | `.tiles > button.tile` + `.buckets > button.bucket > .bucket__title(<span><b lang>en</b>мужской</span><span class="badge">n</span>) + .bucket__items > .tile` | выбрана плитка → `.tile.is-selected`, корзины → `.bucket.is-target`; после проверки `.tile/.bucket.is-correct/is-wrong` |
| `transform` | `.ex__source(.label + p.tl)` + `p.ex__arrow(svg + span)` + `input.input` + `.keyboard` | на поле |
| `fix` | `.tokens > button.token` + после выбора `input.input` | `.token.is-selected` (зачёркнуто), после проверки `.is-correct / is-wrong` |

Клавиатура спецсимволов: `.keyboard[role=group][aria-label="Особые символы"] > button.keyboard__key[type=button]` — до 7 клавиш в одну строку на 360px. Для служебной клавиши (⇧, «пробел») есть модификатор `.keyboard__key--wide`.

### Обратная связь (лист)
```html
<div class="sheet feedback feedback--wrong is-open" role="alert">        <!-- correct/almost: role="status" aria-live="polite" -->
  <div class="sheet__inner">
    <div class="feedback__head">
      <span class="feedback__icon" aria-hidden="true"><svg class="icon">#i-x</svg></span>   <!-- #i-check / #i-almost -->
      <h2 class="feedback__title">Неверно</h2>                     <!-- Верно / Почти верно -->
      <span class="feedback__xp">+15 XP</span>                      <!-- опц. -->
    </div>
    <p class="feedback__answer"><span class="label">Правильный ответ</span><span class="tl" lang="la">rēg<span class="morph">ī</span></span></p>
    <p class="feedback__mine">Ваш ответ: <s lang="la">rēgō</s></p>       <!-- для almost: <span class="feedback__diff">p</span> вокруг отличия -->
    <p class="feedback__explain">…explain из данных…</p>
    <div class="feedback__actions"><button class="btn btn--primary btn--block feedback__next">Дальше</button></div>
  </div>
</div>
```
Лист держите в DOM всё время и переключайте класс `.is-open`: так анимация входа и выхода прерываемая. Пока лист открыт, ставьте `inert` на `.session__footer` и `.session__body` и переводите фокус на `.feedback__next`.

### Прочее
- **Результат:** `.result > .result__seal[--perfect] + .result__title + .result__sub + .mastery.mastery--lg + .ledger > p.ledger__row(style="--i:n") > .ledger__label + .ledger__dots + .ledger__value[--xp|--ok]`; `.mistakes`; кнопки в `.view__actions`.
- **Повторение:** `.review-hero(.review-hero__count + .chip-row + .btn)`, `.forecast > .forecast__day[.is-today] > .forecast__bar(style="--v:0..1")`, `.list > .list__item`.
- **Лексика (`#/c/<cid>/words`):** `.words-hub(.words-stats > .words-stat[--ok/--due] > __n + __label)`, источник — `.chip-row[role=radiogroup] > .chip[aria-checked] > .chip__n` + `.select` (по уроку/юниту, части речи/роду), режимы `.words-modes > .words-mode(__t/__h)[aria-checked]`, длина — `.segmented`, `.words-note`. Тренировка — тот же `.view--session`; карточка: `.flashcard-wrap > .flashcard(.is-flipped, .is-dragging, [data-swipe=left|right]) > .flashcard__inner > .flashcard__face--front/--back (__tags, __word, __ru, __forms, __ex, __note)`, `.flashcard__speak`, `.flashcard__grades > .btn(--bad/--almost/--ok/--primary) + .flashcard__key`. Переворот — 3D `rotateY` 460 мс; при `prefers-reduced-motion` — кросс-фейд. Вкладка таббара «Лексика» (иконка `cards`) заменила «Словарь»; словарь открывается из хаба.
- **Словарь:** `.vocab-tools(.search > svg + input.input--search, .chip-row--scroll)`, `.dict > .dict__letter + article.entry[.is-due] > .entry__head(.entry__word + .entry__pos + .entry__forms) + .entry__gloss + .entry__ex + .entry__side`.
- **Профиль:** `.rank(.rank__seal + .rank__title + .rank__sub + .progress)`, `dl.stats-grid > div > dt + dd`, `.streak-cal > i[.is-on|.is-frozen|.is-today]` (28 дней = 2×14), `.achievements > .achievement[.is-earned][.is-new] > .achievement__icon + div(.achievement__title + .achievement__desc [+ .progress])`, `.settings > .setting[--stack] > .setting__label + .setting__hint + control`; контролы `.segmented > button[aria-pressed]`, `button.switch[role=switch][aria-checked]`.
- **Тост:** `.toast[--ok|--bad|--achievement] > svg + текст [+ button.toast__action]`. Вход через `@starting-style`; для выхода добавьте `.is-leaving` и удалите элемент через 160 мс. Монтируйте тост в `body` (вне `.app`), один за раз, 3 с, на hover/focus таймер ставится на паузу.
- **Пусто:** `.empty > .empty__orn(<i></i>×3) + .empty__title + .empty__text + .btn`.
- **Кнопки:** `.btn` + `--primary --ghost --outline --danger --block --sm --icon --ok --bad --almost`; `.btn-row`. Чипы: `.chip` (+ `aria-pressed`/`.is-active`), `--accent`, `--quiet`; `.chip-row[--scroll]`. Бейджи: `.badge` + `--accent --ok --bad --gold`.

---

## 6. Motion

Принцип: анимируется только то, что объясняет изменение состояния. Всё, что повторяется десятки раз за сессию, укладывается в 120–220 мс. Анимируем только `transform` и `opacity`.

| Что | Свойства | Длительность | Кривая |
|---|---|---|---|
| Нажатие (кнопки, варианты, плитки, клавиши, карточки) | `scale(.97)`, плитки `.95`, клавиши `.92` | 120 мс (`--dur-press`) | `--ease-out` cubic-bezier(.23,1,.32,1) |
| Смена состояния (выбор, рамка, фон) | color, border, background | 160 мс | `--ease-standard` |
| Вход экрана `.view` | opacity + translateY(6px) | 220 мс | ease-out |
| Новое упражнение `.ex` | opacity + translateX(14px) — «перелистывание» | 220 мс | ease-out |
| Лист feedback: вход | translateY(105%→0) | 340 мс | `--ease-drawer` (.32,.72,0,1) |
| Лист feedback: выход | translateY | 200 мс | ease-out (выход быстрее входа) |
| Иконка в листе | scale(.6→1) + opacity, задержка 90 мс | 300 мс | ease-out |
| Неверно (`.option/.input/.pair.is-wrong`) | shake ±5px, один раз | 320 мс | ease-out |
| Прогресс | `transform: scaleX` | 480 мс | ease-out |
| Плитка появилась в строке | `@starting-style` scale(.92)+opacity | 160 мс | ease-out |
| Итоги: печать | scale(.85)+rotate(-8°)→0 | 520 мс | ease-out |
| Итоги: строки колофона | stagger 45 мс | 220 мс | ease-out |
| Новый ромб мастерства | scale .4→1.25→1 | 420 мс | ease-out |
| Новая медаль | поворот + пружинистый overshoot | 700 мс | ease-out |

- **Клавиатурные действия (1–4, Enter) не анимируются дополнительно.** Масштаб при нажатии срабатывает только от указателя (`:active`).
- **Hover-эффекты** работают только при `(hover: hover) and (pointer: fine)`, чтобы на телефоне не было «залипающего» hover.
- **`prefers-reduced-motion: reduce`:** движение убирается полностью (shake, scale, slide). Остаются короткие (≤160 мс) фейды. Лист появляется через opacity, прогресс меняется без анимации, stagger обнулён.

---

## 7. Обратная связь «верно / неверно»

Сигнал никогда не передаётся одним цветом. Всегда есть **иконка + заголовок-слово + цвет**, а для «неверно» ещё и правильный ответ с объяснением.

| Исход | Цвет | Иконка | Заголовок | Содержимое | XP |
|---|---|---|---|---|---|
| Верно | `--ok` | `#i-check` | «Верно» | `explain` (кратко) | `+N XP` |
| Почти | `--almost` | `#i-almost` (≈) | «Почти верно» | правильный ответ, ваш ответ с `.feedback__diff`, «засчитано» | `+N XP` |
| Неверно | `--bad` | `#i-x` | «Неверно» | правильный ответ (с `.morph`), `<s>` ваш ответ, `explain`, «уйдёт в банк ошибок» | — |

Кнопка «Дальше» стоит ровно там, где была «Проверить»: палец не перемещается. Для «неверно» текст кнопки — «Понятно».

**Haptics (опционально, разработчик):**
```js
const buzz = (p) => settings.vibration && navigator.vibrate?.(p);
buzz(12);            // верно
buzz([8, 40, 8]);    // почти
buzz([22, 60, 22]);  // неверно
buzz([10, 30, 10, 30, 40]); // урок пройден / новое достижение
```
`navigator.vibrate` не работает на iOS Safari: вызов просто ничего не делает. В Capacitor можно подставить `@capacitor/haptics` (`impact light`, `notification error/success`). Выключатель — в профиле, по умолчанию включено.

---

## 8. Доступность

- Контраст AA проверен численно в обеих темах (§2). Текст на `--surface-2` использует не светлее `--ink-3` (4.7:1).
- Фокус: `:focus-visible` — 2px кольцо `--focus` с отступом 2px; у полей — рамка акцента и мягкое кольцо. `outline` нигде не убирается без замены.
- Тап-цели ≥ 44px (клавиши спецсимволов 44px в высоту, ≥ 40px в ширину), основные действия 52px.
- `lang` на любом тексте изучаемого языка (произношение в скринридере, переносы).
- Варианты choice: `role="radiogroup"` / `role="radio"` + `aria-checked`. Плитки и токены: `aria-pressed` для выбранного. Использованная плитка в банке: `aria-hidden="true" tabindex="-1"`.
- Feedback: «неверно» — `role="alert"`, «верно» и «почти» — `role="status" aria-live="polite"`. После проверки фокус переходит на кнопку «Дальше», остальное получает `inert`.
- Поля ввода: `aria-label` с описанием пропуска («Пропуск 1: rēx», «Gen. Pl.»), `aria-invalid="true"` при ошибке.
- Прогресс: `role="progressbar"` + `aria-valuenow/max`. Мастерство: `role="img"` + `aria-label="Мастерство 3 из 5"`.
- Иконки декоративны (`aria-hidden="true"`), у кнопок-иконок есть `aria-label`.

---

## 9. Классы сверх контракта (добавлены UI/UX)

**Каркас/общее:** `.icon`, `.icon--fill`, `.tl`, `.ru`, `.muted`, `.num`, `.visually-hidden`, `.label`, `.topbar__back`, `.stat__label`, `.stat__meter`, `.stat--streak.is-inactive`, `.stat--goal.is-done`, `.tabbar__badge`, `.app.is-focus`, `.view__head`, `.view__title`, `.view__sub`, `.view__actions`, `.section`, `.section__title`.
**Кнопки/чипы:** `.btn--outline`, `.btn--sm`, `.btn--icon`, `.btn--ok`, `.btn--bad`, `.btn--almost`, `.btn__hint`, `.btn-row`, `.chip--accent`, `.chip--quiet`, `.chip-row`, `.chip-row--scroll`, `.badge--accent/--ok/--bad/--gold`, `.card--flat`, `.card--accent`, `.card__title/__text/__actions`.
**Прогресс/мастерство:** `.progress--thin`, `.progress--ok`, `.progress--ticks` (+ `--steps`), `.mastery--lg`, `.mastery i.is-on`, `.mastery i.is-new`.
**Главная/курс:** `.course-list`, `.course-card__glyph/__body/__name/__meta/__foot/__chev`, `.course-card.is-new`, `.daily(__title/__sub)`, `.course-head(__title/__meta)`, `.units`, `.unit__head/__num/__title/__sub/__summary/__skip`, `.unit.is-current/.is-locked`, `.lesson-node__mark/__body/__title/__kind`.
**Теория:** `.lesson-head(__title)`, `.goals`, `.theory__h`, `.theory__label`, `.theory__note`, `.reading(__line)`, `.ex-say`.
**Сессия:** `.session__bar`, `.session__count`, `.session__body`, `.session__footer`, `.ex__meta`, `.ex__skill`, `.ex__q--ru`, `.ex__gloss`, `.ex__hint`, `.ex__speak`, `.ex__source`, `.ex__arrow`, `.options`, `.options--grid`, `.options.is-locked`, `.option__key/__text/__state`, `.input--inline` (+ `--chars`), `.input--area`, `.input--cell`, `.input--search`, `.input.is-almost`, `.search`, `.keyboard__key--wide`, `.tile.is-selected/.is-correct/.is-wrong`, `.answer-line.is-correct/.is-wrong`, `.pairs`, `.pairs__col`, `.pair.is-selected/.is-matched/.is-wrong`, `.paradigm-wrap`, `.paradigm .is-given`, `.buckets`, `.bucket__title`, `.bucket__items`, `.bucket.is-target/.is-correct/.is-wrong`, `.tokens`, `.token(.is-selected/.is-correct/.is-wrong)`.
**Feedback:** `.sheet.is-open`, `.sheet__inner`, `.sheet__grip`, `.feedback__head/__icon/__xp/__mine/__diff/__actions/__next`.
**Результат/повтор/словарь/профиль:** `.result(__seal, __seal--perfect, __title, __sub)`, `.ledger(__row/__label/__dots/__value, __value--xp/--ok)`, `.mistakes`, `.review-hero(__count)`, `.forecast(__day/__bar)`, `.list(__item/__title/__sub)`, `.vocab-tools`, `.dict(__letter)`, `.entry(__head/__word/__pos/__forms/__gloss/__ex/__side, .is-due)`, `.rank(__seal/__title/__sub)`, `.stats-grid`, `.streak-cal`, `.achievements`, `.achievement__icon/__title/__desc`, `.achievement.is-new`, `.settings`, `.setting(__label/__hint, --stack)`, `.segmented`, `.switch`, `.toast--ok/--bad/--achievement`, `.toast.is-leaving`, `.toast__action`, `.empty__orn/__title/__text`.

---

## 10. Рекомендации разработчику

**`index.html` / PWA (ощущение нативного приложения):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f6f3ee">
<meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#15171d">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="stylesheet" href="css/tokens.css"><link rel="stylesheet" href="css/app.css">
```
При ручном переключении темы обновляйте `meta[name=theme-color]` из вычисленного `--bg`. `manifest.webmanifest`: `background_color` и `theme_color` — `#f6f3ee`, `display: "standalone"`.

1. **Тема:** `document.documentElement.dataset.theme = 'light'|'dark'`, для «Авто» атрибут удаляется. Значение храните в `glossa:v1`.
2. **Язык:** `data-lang` на `.app` (или на `.view`) при входе в курс, снимайте его на главной.
3. **Поля ввода:** `autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done"`, а также `lang`. Шрифт ≥16px уже задан (iOS не масштабирует страницу при фокусе).
4. **Клавиатура спецсимволов:** на `pointerdown` вызывайте `preventDefault()`, чтобы поле не теряло фокус. Вставляйте символ в позицию каретки (`setRangeText(ch, start, end, 'end')`) и затем генерируйте событие `input`. Целевое поле — последнее сфокусированное `.input`.
5. **Шорткаты (десктоп):** `1–9` выбирают вариант, `Enter` проверяет / идёт дальше, `Esc` — выход с подтверждением. Если фокус в `textarea`, Enter отправляет ответ, Shift+Enter переводит строку.
6. **Feedback:** см. §5. Последовательность: добавить классы состояний → `sheet.classList.add('is-open')` → `inert` на тело и футер → фокус на «Дальше» → вибрация. При «Дальше»: снять `is-open` и `inert`, отрендерить следующий `.ex` (у него своя анимация входа).
7. **Прогресс:** задавайте `--value` (0–1), а не `width`: анимация по transform дешевле.
8. **Тап-тап вместо drag** в order/classify/match. Плитку из `.answer-line` возвращают тапом: в банке у неё снимается `.is-used`.
9. **Тосты** монтируйте в `body`, не внутри `.view`.
10. **Не используйте `100vh`** (только `dvh`), не вешайте `:hover`-эффекты без медиазапроса, не отключайте `outline` без замены.
11. **Service Worker:** при изменении CSS меняйте версию кэша, иначе пользователи останутся на старых стилях (в разработке эта проблема воспроизвелась).
12. **Озвучка:** кнопка `.btn.btn--icon.btn--ghost.ex__speak` с `#i-speaker` показывается только при наличии голоса (`speechSynthesis.getVoices()` с нужным `lang`).

---

## 11. Фаза 2: правки по живому приложению

- `css/dev.css` перенесён в `app.css` и пуст (из `index.html` не подключается): `.app { grid-template-columns: minmax(0,1fr) }`, `.dialog`, `.course-card.is-disabled`, `.view:focus`.
- Топбар на узких экранах (контейнер < 480px): XP скрыт (виден в профиле), заголовок получает место.
- Широкие таблицы теории и парадигмы прокручиваются по горизонтали с тенями-подсказками; ячейки переносят длинные слова.
- Заголовки экранов адаптивны (`cqi`); у `.bucket__title` название корзины в `<b>`.
- Обратная связь: для match, classify и paradigm перечень ошибок не зачёркивается; пропущенный символ в «почти верно» показан штрихом `.feedback__diff--gap`.
- Результат без зачёта: печать `.result__seal--retry` (значок повтора).
- Словарь: рубрики-буквы без макронов, пропуская дефис.
- Достижения на телефоне: колонка (иконка над текстом), на ширине от 600px: строка.
- `.session__body` прокручивается во всю ширину экрана, контент остаётся в колонке.

---

## 12. Оформления (стили): B «Игровое», C «Типографичное», «Скрипторий»

Три оформления живут поверх одной разметки и одних токенов. Переключатель — профиль → «Оформление» (стиль: Игровое / Типографика / Скрипторий; цвет: Авто / Светлая / Тёмная). **По умолчанию — B.**

**Механизм.** `<html data-style="b|c|scriptorium" data-theme="light|dark|(нет)" data-mode="light|dark">`.
- `data-style` — оформление; `data-theme` — выбор пользователя (нет атрибута = «Авто», как раньше); `data-mode` — всегда разрешённая тема (`light` или `dark`), на неё опираются `css/style-b.css` и `css/style-c.css` (не нужно дублировать `@media (prefers-color-scheme)`).
- Значения лежат в `localStorage['glossa:v1'].settings.style` (по умолчанию `'b'`) и `.theme`. Встроенный скрипт в `<head>` `index.html` читает их и ставит атрибуты до первой отрисовки (без вспышки); `applyTheme()` / `applyStyle()` в `js/ui.js` делают то же после загрузки, импорта и сброса и реагируют на смену системной темы.
- `css/style-b.css`, `css/style-c.css` подключены после `app.css`. Правила записаны как `:where([data-style="b"]) .класс` (специфичность `.класс`, идут позже `app.css`), поэтому состояния `.is-correct`, `.is-wrong`, `[data-swipe]` и т. п. по-прежнему побеждают. Токены переопределяются на `:root[data-style][data-mode]`. В «Скриптории» (`data-style="scriptorium"`) оба файла не действуют.
- Акценты языков `[data-lang]` работают в обоих стилях: B усиливает насыщенность (`--accent`, `--accent-edge` для «объёма»), C использует акцент как цвет плоских блоков. Разметка и логика общие; единственное JS-добавление — `celebrate()` (буквы языка на экране итога, только в B).

**B «Игровое».** Яркие, слегка подкрашенные в тон языка фоны; крупные радиусы (10–30px); объёмные кнопки/варианты/клавиши с нижней «кромкой» (`box-shadow 0 4px 0`) и пружинной физикой (`--spring`, нажатие уводит элемент на 3–4px вниз); округлый UI-шрифт (`ui-rounded` и т. д.), текст изучаемого языка по-прежнему антиквой. Карта курса — «острова»: плашка юнита акцентным цветом, под ней пятно-остров, уроки круглыми кнопками зигзагом, текущий урок крупнее с «солнечным» кольцом и покачиванием. Серия — жёлтая «таблетка» с мерцающим пламенем в шапке. Итог — большая круглая печать с пружиной, строки-плашки (XP жёлтая), буквы языка разлетаются (WAAPI, 16 шт., отключается при `prefers-reduced-motion`). Флэшкарта: лицо — сплошной акцент, оборот — белый с акцентной рамкой.

**C «Типографичное».** Нулевые радиусы, линейки 1–2px, плоские блоки цвета. Масштаб — главный приём: заголовки 40–72px с трекингом −0.04em, контурные римские цифры юнитов, огромные числа в статистике и на итоге. Шапка курса — блок цвета с гигантской буквой языка. Карта — оглавление: строки-уроки с линейками, текущий урок — инвертированная строка. Упражнение: вопрос 32–51px, пропуск — блок акцента, клавиатура спецсимволов — сетка с линейками. Feedback — блок цвета на всю ширину с заголовком 58–80px (`--fbk-ok/bad/almost` + `--fbk-ink`). Итог — весь экран цвета курса, «+N XP» до 150px. Флэшкарта: слово 54–96px на акценте, оборот — чёрный блок.

**Проверено** (оба стиля × светлая/тёмная × 5 языков, 375px): контраст текста ≥ AA (автоматическая проверка computed-стилей на главной, карте, теории, всех 9 типах упражнений и feedback, повторении, словаре, лексике, профиле), нет горизонтального скролла, тап-цели ≥ 44px (`.btn--sm`, `button.chip`, плитки в корзинах подняты до 44px; у `.switch` зона нажатия расширена псевдоэлементом). `prefers-reduced-motion`: пламя, покачивание узла, пружины печати/строк итога и буквы-конфетти отключаются; общие правила из §6 остаются.

**Как добавить стиль.** Новый файл `css/style-x.css` с токенами на `:root[data-style="x"][data-mode=…]` и правилами `:where([data-style="x"]) .компонент`; подключить в `index.html`; добавить значение в `STYLES` (`js/ui.js`), встроенный скрипт и сегмент в `appearance()` (`js/views/profile.js`). `tools/build-sw.mjs` подхватывает файлы из `css/` сам.
