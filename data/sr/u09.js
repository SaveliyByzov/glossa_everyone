export default {
  id: 'sr-u09',
  title: 'Pridevi, zamenice i klitike',
  titleRu: 'Прилагательные, местоимения, энклитики',
  summary: 'Склонение прилагательных, степени сравнения, полные и краткие формы личных местоимений и полный порядок энклитического кластера по закону Ваккернагеля.',
  lessons: [
    {
      id: 'sr-u09-l01',
      kind: 'grammar',
      title: 'Deklinacija prideva',
      goals: ['Склонять прилагательное во всех падежах', 'Различать твёрдые и мягкие основы (novog / našeg)', 'Называть цвета'],
      skills: ['sr.adj.decl'],
      theory: [
        { type: 'table', caption: 'nov — новый (ед. ч.)', head: ['Падеж', 'м.', 'ср.', 'ж.'], rows: [
          ['N', 'nov / nov{{i}}', 'nov{{o}}', 'nov{{a}}'],
          ['G', 'nov{{og}}(a)', 'nov{{og}}(a)', 'nov{{e}}'],
          ['D / L', 'nov{{om}}(e)', 'nov{{om}}(e)', 'nov{{oj}}'],
          ['A', 'nov(i) / nov{{og}}', 'nov{{o}}', 'nov{{u}}'],
          ['I', 'nov{{im}}', 'nov{{im}}', 'nov{{om}}']
        ], note: 'Наращения -a, -e (novoga, novome) факультативны: стилистика и ритм. Вин. м. р.: неодуш. = N, одуш. = G.' },
        { type: 'table', caption: 'Множественное число (все роды)', head: ['Падеж', 'м.', 'ж.', 'ср.'], rows: [
          ['N', 'nov{{i}}', 'nov{{e}}', 'nov{{a}}'],
          ['G', 'nov{{ih}}', 'nov{{ih}}', 'nov{{ih}}'],
          ['D / I / L', 'nov{{im}}(a)', 'nov{{im}}(a)', 'nov{{im}}(a)'],
          ['A', 'nov{{e}}', 'nov{{e}}', 'nov{{a}}']
        ] },
        { type: 'rule', text: 'После мягких согласных (č, ć, š, ž, đ, j, lj, nj, dž) **o → e**: naš → naš{{eg}}, naš{{em}}; vruć → vruć{{eg}}. Ср. русское «нашего» — та же логика.' },
        { type: 'contrast', text: 'Окончания очень близки к русским: нового — novog, новому — novom, новой — novoj/nove, новым — novim, новых — novih. Но **ж. р. G** — **-e** (nove kuće), а не «-ой».' },
        { type: 'pitfall', text: 'Ложный друг: **plav** — «синий, голубой; белокурый» (*plava kosa* — светлые волосы). Красное вино — **crno vino**, белое — **belo**.' }
      ],
      vocab: [
        { id: 'sr-boja', w: 'boja', ru: 'цвет; краска', pos: 'n', g: 'f', forms: 'boja, -e f.', ex: 'Koje je boje?', exRu: 'Какого он цвета?', note: 'Цвет — в генитиве: Kuća je bele boje.' },
        { id: 'sr-crven', w: 'crven', ru: 'красный', pos: 'adj', g: null, forms: 'crven, crvena, crveno', ex: 'Crvena jabuka.', exRu: 'Красное яблоко.', note: 'Слоговое r.' },
        { id: 'sr-plav', w: 'plav', ru: 'синий, голубой; белокурый', pos: 'adj', g: null, forms: 'plav, plava, plavo', ex: 'Ima plave oči.', exRu: 'У неё голубые глаза.', note: 'Ложный друг: plava kosa — светлые волосы.' },
        { id: 'sr-zelen', w: 'zelen', ru: 'зелёный', pos: 'adj', g: null, forms: 'zelen, zelena, zeleno', ex: 'Zelena trava.', exRu: 'Зелёная трава.', note: null },
        { id: 'sr-žut', w: 'žut', ru: 'жёлтый', pos: 'adj', g: null, forms: 'žut, žuta, žuto', ex: 'Žuti taksi.', exRu: 'Жёлтое такси.', note: null },
        { id: 'sr-beo', w: 'beo', ru: 'белый', pos: 'adj', g: null, forms: 'beo, bela, belo', ex: 'Beli luk.', exRu: 'Чеснок (букв. белый лук).', note: '-l > -o в м. р. Иекав. bijel, bijela.' },
        { id: 'sr-crn', w: 'crn', ru: 'чёрный', pos: 'adj', g: null, forms: 'crn, crna, crno', ex: 'Crna kafa.', exRu: 'Чёрный кофе.', note: 'crno vino — красное вино.' },
        { id: 'sr-siv', w: 'siv', ru: 'серый', pos: 'adj', g: null, forms: 'siv, siva, sivo', ex: 'Sivo nebo.', exRu: 'Серое небо.', note: null },
        { id: 'sr-braon', w: 'braon', ru: 'коричневый', pos: 'adj', g: null, forms: 'braon (нескл.)', ex: 'Braon cipele.', exRu: 'Коричневые туфли.', note: 'Несклоняемое.' },
        { id: 'sr-roze', w: 'roze', ru: 'розовый', pos: 'adj', g: null, forms: 'roze (нескл.)', ex: 'Roze haljina.', exRu: 'Розовое платье.', note: 'Также ružičast. Не путать с ružan — некрасивый.' },
        { id: 'sr-narandžast', w: 'narandžast', ru: 'оранжевый', pos: 'adj', g: null, forms: 'narandžast, narandžasta, narandžasto', ex: 'Narandžasta majica.', exRu: 'Оранжевая футболка.', note: 'narandža — апельсин.' },
        { id: 'sr-ljubičast', w: 'ljubičast', ru: 'фиолетовый', pos: 'adj', g: null, forms: 'ljubičast, ljubičasta, ljubičasto', ex: 'Ljubičasto cveće.', exRu: 'Фиолетовые цветы.', note: 'ljubičica — фиалка.' }
      ],
      text: null
    },
    {
      id: 'sr-u09-l02',
      kind: 'grammar',
      title: 'Poređenje prideva',
      goals: ['Образовывать компаратив на -iji, -ji, -ši', 'Знать нерегулярные формы', 'Сравнивать с od + G и nego'],
      skills: ['sr.adj.comp'],
      theory: [
        { type: 'table', caption: 'Компаратив', head: ['Тип', 'Положит.', 'Сравнит.'], rows: [
          ['-iji (большинство)', 'nov, star, jeftin', 'nov{{iji}}, star{{iji}}, jeftin{{iji}}'],
          ['-ji + йотация', 'mlad, brz, jak, tih, skup', 'mla{{đi}}, br{{ži}}, ja{{či}}, ti{{ši}}, sku{{plji}}'],
          ['-ši', 'lep, lak, mek', 'lep{{ši}}, lak{{ši}}, mek{{ši}}'],
          ['с выпадением суффикса', 'kratak, težak, nizak, visok, dug', 'kraći, teži, niži, viši, duži'],
          ['супплетив', 'dobar, loš, velik, mali', 'bolji, gori (lošiji), veći, manji']
        ] },
        { type: 'rule', text: 'Суперлатив: **naj-** + компаратив: najbolji, najlepši, najveći. Сравнение: **od** + G (*stariji od mene*) или **nego** + N (*stariji nego ja*).' },
        { type: 'examples', items: [
          { t: 'Beograd je veći od Novog Sada.', ru: 'Белград больше Нового Сада.' },
          { t: 'Brat je stariji nego ja.', ru: 'Брат старше меня.' },
          { t: 'Ovo je najbolja kafa u gradu.', ru: 'Это лучший кофе в городе.' },
          { t: 'Voz je sporiji, ali jeftiniji.', ru: 'Поезд медленнее, но дешевле.' }
        ] },
        { type: 'contrast', text: 'Йотация — та же, что в русском «молодой — моложе, дорогой — дороже, тихий — тише». Но сербский компаратив всегда **склоняемое прилагательное**: *mlađi brat, mlađa sestra* (русское «моложе» неизменяемо).' },
        { type: 'pitfall', text: '«Сильнее, чем я» — **jači od mene** (G), а не «od ja». После nego — номинатив: *jači nego ja*.' }
      ],
      vocab: [
        { id: 'sr-brz', w: 'brz', ru: 'быстрый', pos: 'adj', g: null, forms: 'brz, brza, brzo (сравн. brži)', ex: 'Avion je brži od voza.', exRu: 'Самолёт быстрее поезда.', note: null },
        { id: 'sr-spor', w: 'spor', ru: 'медленный', pos: 'adj', g: null, forms: 'spor, spora, sporo (сравн. sporiji)', ex: 'Internet je spor.', exRu: 'Интернет медленный.', note: null },
        { id: 'sr-visok', w: 'visok', ru: 'высокий', pos: 'adj', g: null, forms: 'visok, visoka, visoko (сравн. viši)', ex: 'On je viši od mene.', exRu: 'Он выше меня.', note: null },
        { id: 'sr-nizak', w: 'nizak', ru: 'низкий', pos: 'adj', g: null, forms: 'nizak, niska, nisko (сравн. niži)', ex: 'Cene su niske.', exRu: 'Цены низкие.', note: 'z → s перед k: niska.' },
        { id: 'sr-dug', w: 'dug', ru: 'длинный, долгий', pos: 'adj', g: null, forms: 'dug, duga, dugo (сравн. duži)', ex: 'Dan je duži leti.', exRu: 'Летом день длиннее.', note: 'dugo — долго.' },
        { id: 'sr-kratak', w: 'kratak', ru: 'короткий', pos: 'adj', g: null, forms: 'kratak, kratka, kratko (сравн. kraći)', ex: 'Film je kratak.', exRu: 'Фильм короткий.', note: null },
        { id: 'sr-težak', w: 'težak', ru: 'тяжёлый, трудный', pos: 'adj', g: null, forms: 'težak, teška, teško (сравн. teži)', ex: 'Srpski nije težak.', exRu: 'Сербский не трудный.', note: 'ž → š перед k: teška.' },
        { id: 'sr-lak', w: 'lak', ru: 'лёгкий', pos: 'adj', g: null, forms: 'lak, laka, lako (сравн. lakši)', ex: 'Ispit je bio lak.', exRu: 'Экзамен был лёгким.', note: null },
        { id: 'sr-jak', w: 'jak', ru: 'сильный, крепкий', pos: 'adj', g: null, forms: 'jak, jaka, jako (сравн. jači)', ex: 'Kafa je jaka.', exRu: 'Кофе крепкий.', note: 'jako — очень.' },
        { id: 'sr-slab', w: 'slab', ru: 'слабый', pos: 'adj', g: null, forms: 'slab, slaba, slabo (сравн. slabiji)', ex: 'Slab sam iz matematike.', exRu: 'Я слаб в математике.', note: null },
        { id: 'sr-važan', w: 'važan', ru: 'важный', pos: 'adj', g: null, forms: 'važan, važna, važno (сравн. važniji)', ex: 'To je veoma važno.', exRu: 'Это очень важно.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u09-l03',
      kind: 'grammar',
      title: 'Lične zamenice: pune i kratke forme',
      goals: ['Знать полные и краткие формы во всех падежах', 'Выбирать форму: после предлога и для контраста — полную', 'Употреблять sebe / se и svoj'],
      skills: ['sr.pron.pers', 'sr.clitics'],
      theory: [
        { type: 'table', caption: 'Личные местоимения: полная / краткая форма', head: ['', 'G / A', 'D', 'I', 'L'], rows: [
          ['ja', 'mene / me', 'meni / mi', 'mnom', 'meni'],
          ['ti', 'tebe / te', 'tebi / ti', 'tobom', 'tebi'],
          ['on, ono', 'njega / ga', 'njemu / mu', 'njim(e)', 'njemu'],
          ['ona', 'nje (G), nju (A) / je', 'njoj / joj', 'njom', 'njoj'],
          ['mi', 'nas', 'nama / nam', 'nama', 'nama'],
          ['vi', 'vas', 'vama / vam', 'vama', 'vama'],
          ['oni', 'njih / ih', 'njima / im', 'njima', 'njima']
        ], note: 'Возвратное: sebe / se (G, A), sebi (D, L), sobom (I).' },
        { type: 'rule', text: '**Краткие формы** — по умолчанию (энклитики, второе место): *Vidim ga.* **Полные** — после предлогов (*za mene, kod nje, o njemu*), для логического ударения и контраста (*Njega volim, a nju ne*), в начале фразы.' },
        { type: 'examples', items: [
          { t: 'Volim te.', ru: 'Я тебя люблю.' },
          { t: 'Ovo je za tebe.', ru: 'Это для тебя.' },
          { t: 'Pitaj nju, ne mene!', ru: 'Спроси её, а не меня!' },
          { t: 'Zovem se Ana.', ru: 'Меня зовут Анна.', note: 'se — возвратная энклитика' },
          { t: 'Niko ne zna.', ru: 'Никто не знает.' }
        ] },
        { type: 'contrast', text: 'В русском одна форма и свободное место («я его вижу / я вижу его»). В сербском краткая форма жёстко второе слово: *Vidim ga* или *Ja ga vidim*, но не «Ga vidim». Русское «-ся» срослось с глаголом, а сербское **se** — подвижная энклитика: *Ja se zovem…, Kako se zoveš?*' },
        { type: 'pitfall', text: '**neko, niko** — сербский стандарт (хорв. netko, nitko). Двойное отрицание обязательно, как в русском: *Niko nije došao.*' }
      ],
      vocab: [
        { id: 'sr-sebe', w: 'sebe', ru: 'себя', pos: 'pron', g: null, forms: 'sebe / se, sebi, sobom', ex: 'Kupio sam sebi nove patike.', exRu: 'Я купил себе новые кроссовки.', note: null },
        { id: 'sr-svoj', w: 'svoj', ru: 'свой', pos: 'pron', g: null, forms: 'svoj, svoja, svoje', ex: 'Ona voli svoj posao.', exRu: 'Она любит свою работу.', note: 'Как в русском: относится к подлежащему.' },
        { id: 'sr-neko', w: 'neko', ru: 'кто-то', pos: 'pron', g: null, forms: 'neko, nekoga, nekome…', ex: 'Neko je na vratima.', exRu: 'Кто-то у двери.', note: 'Хорв. netko.' },
        { id: 'sr-niko', w: 'niko', ru: 'никто', pos: 'pron', g: null, forms: 'niko, nikoga, nikome…', ex: 'Niko nije došao.', exRu: 'Никто не пришёл.', note: 'С предлогом разрывается: ni od koga — ни от кого.' },
        { id: 'sr-svako', w: 'svako', ru: 'каждый, всякий (о людях)', pos: 'pron', g: null, forms: 'svako, svakoga…', ex: 'Svako to zna.', exRu: 'Каждый это знает.', note: null },
        { id: 'sr-svi', w: 'svi', ru: 'все', pos: 'pron', g: null, forms: 'svi, sve, sva (мн.)', ex: 'Svi su ovde.', exRu: 'Все здесь.', note: 'ceo / sav — весь.' },
        { id: 'sr-sam-adj', w: 'sam', ru: 'сам; один', pos: 'pron', g: null, forms: 'sam, sama, samo', ex: 'Živim sam.', exRu: 'Я живу один.', note: 'Омоним sam — энклитика biti.' },
        { id: 'sr-drugi', w: 'drugi', ru: 'другой; второй', pos: 'adj', g: null, forms: 'drugi, druga, drugo', ex: 'Daj mi drugu čašu.', exRu: 'Дай мне другой стакан.', note: null },
        { id: 'sr-isti', w: 'isti', ru: 'тот же, одинаковый', pos: 'adj', g: null, forms: 'isti, ista, isto', ex: 'Imamo isti telefon.', exRu: 'У нас одинаковый телефон.', note: 'isto — так же, тоже.' },
        { id: 'sr-jedan-drugog', w: 'jedan drugog', ru: 'друг друга', pos: 'phr', g: null, forms: 'jedan drugog / jedno drugo', ex: 'Volimo jedno drugo.', exRu: 'Мы любим друг друга.', note: 'Часто просто se: Volimo se.' }
      ],
      text: null
    },
    {
      id: 'sr-u09-l04',
      kind: 'grammar',
      title: 'Red klitika',
      goals: ['Ставить кластер энклитик на второе место', 'Соблюдать порядок li – aux – D – A/G – se – je', 'Понимать «второе место» после союзов da, što, koji'],
      skills: ['sr.clitics'],
      theory: [
        { type: 'rule', text: '**Закон Ваккернагеля**: все энклитики собираются в один кластер сразу **после первого ударного слова или первой составляющей** предложения.' },
        { type: 'table', caption: 'Порядок внутри кластера', head: ['1', '2', '3', '4', '5', '6'], rows: [
          ['li', 'aux: sam, si, smo, ste, su; ću, ćeš…; bih, bi…', 'D: mi, ti, mu, joj, nam, vam, im', 'G/A: me, te, ga, je, nas, vas, ih', 'se', 'je (3 л. biti)']
        ], note: 'Главное исключение: вспомогательное **je** стоит в самом конце, после se; а je + se → просто se (On se vratio).' },
        { type: 'examples', items: [
          { t: 'Dao sam mu ga.', ru: 'Я дал ему его.', note: 'aux – D – A' },
          { t: 'Da li si mu ga dao?', ru: 'Ты дал ему его?', note: 'li – aux – D – A' },
          { t: 'Juče mi ga je dala.', ru: 'Вчера она мне его дала.', note: 'D – A – je' },
          { t: 'Daću ti ga sutra.', ru: 'Я дам тебе его завтра.', note: 'ću – D – A' },
          { t: 'Sviđa mi se.', ru: 'Мне нравится.', note: 'D – se' },
          { t: 'Mislim da sam ga video.', ru: 'Думаю, что я его видел.', note: 'после союза da' },
          { t: 'Čovek koga sam sreo…', ru: 'Человек, которого я встретил…', note: 'после koga' }
        ] },
        { type: 'p', text: 'Первая составляющая может быть целой группой: *Moj stariji brat **mi je** dao knjigu.* Если A-энклитика **je** (её) встречается с aux **je**, вместо неё употребляется **ju**: *Video ju je.*' },
        { type: 'contrast', text: 'Древнерусский тоже знал закон Ваккернагеля (*же, ли, бо, ти, ся* в позиции после первого слова), но современный русский его утратил. Сербский сохранил систему полностью — это **самое трудное** для русскоязычного.' },
        { type: 'pitfall', text: 'Вокатив и слова, отделённые паузой, не считаются «первым местом»: *Marko, video sam ga* (не «Marko, sam ga video»).' },
        { type: 'tip', text: 'Ложные друзья этого урока: **smetati** — «мешать» (Smeta mi buka — мне мешает шум), **baviti se** — «заниматься» (Čime se baviš? — Чем занимаешься?). «Запомнить» — **zapamtiti** (не «zapomniti»).' }
      ],
      vocab: [
        { id: 'sr-dopadati-se', w: 'dopadati se', ru: 'нравиться', pos: 'v', g: null, forms: 'dopadati se (dopada mi se), nesvr. / dopasti se (dopadne mi se), svr.', ex: 'Dopada mi se ovaj grad.', exRu: 'Мне нравится этот город.', note: 'Синоним sviđati se.' },
        { id: 'sr-činiti-se', w: 'činiti se', ru: 'казаться', pos: 'v', g: null, forms: 'činiti se (čini mi se), nesvr.', ex: 'Čini mi se da pada kiša.', exRu: 'Кажется, идёт дождь.', note: null },
        { id: 'sr-upoznati', w: 'upoznati', ru: 'познакомиться; узнать (кого-то)', pos: 'v', g: null, forms: 'upoznati (upoznam), svr. / upoznavati (upoznajem), nesvr.', ex: 'Upoznali smo se u Beogradu.', exRu: 'Мы познакомились в Белграде.', note: null },
        { id: 'sr-poznavati', w: 'poznavati', ru: 'знать (кого-то), быть знакомым', pos: 'v', g: null, forms: 'poznavati (poznajem), nesvr.', ex: 'Poznaješ li ga?', exRu: 'Ты его знаешь?', note: 'znati — знать что-то; poznavati — быть знакомым.' },
        { id: 'sr-sećati-se', w: 'sećati se', ru: 'помнить', pos: 'v', g: null, forms: 'sećati se (sećam se), nesvr. / setiti se (setim se), svr.', ex: 'Sećaš li me se?', exRu: 'Ты меня помнишь?', note: '+ Г. Иекав. sjećati se.' },
        { id: 'sr-zapamtiti', w: 'zapamtiti', ru: 'запомнить', pos: 'v', g: null, forms: 'zapamtiti (zapamtim), svr. / pamtiti (pamtim), nesvr.', ex: 'Zapamti ovu reč!', exRu: 'Запомни это слово!', note: 'Не «zapomniti» — такого слова нет.' },
        { id: 'sr-smetati', w: 'smetati', ru: 'мешать', pos: 'v', g: null, forms: 'smetati (smetam), nesvr.', ex: 'Da li ti smeta muzika?', exRu: 'Тебе мешает музыка?', note: 'Ложный друг: не «сметать». С дативом.' },
        { id: 'sr-baviti-se', w: 'baviti se', ru: 'заниматься', pos: 'v', g: null, forms: 'baviti se (bavim se), nesvr.', ex: 'Čime se baviš?', exRu: 'Чем ты занимаешься?', note: 'Ложный друг: не «забавлять». + И.' },
        { id: 'sr-radovati-se', w: 'radovati se', ru: 'радоваться', pos: 'v', g: null, forms: 'radovati se (radujem se), nesvr. / obradovati se, svr.', ex: 'Radujem se odmoru.', exRu: 'Я радуюсь отпуску.', note: '+ Д. Ср. raditi — работать.' },
        { id: 'sr-brinuti-se', w: 'brinuti se', ru: 'беспокоиться, волноваться', pos: 'v', g: null, forms: 'brinuti se (brinem se), nesvr.', ex: 'Ne brini se!', exRu: 'Не волнуйся!', note: 'brinuti o + L — заботиться о.' }
      ],
      text: null
    },
    {
      id: 'sr-u09-l05',
      kind: 'reading',
      title: 'Rođendanski poklon',
      goals: ['Понять диалог, насыщенный энклитиками', 'Распознавать кластеры mu ga, mi se, ga je'],
      skills: ['sr.clitics', 'sr.pron.pers', 'sr.adj.comp'],
      theory: [
        { type: 'tip', text: '**Slava** — сербский семейный праздник святого покровителя; **rođendan** — день рождения. Поздравление: *Srećan rođendan! Sve najbolje!*' }
      ],
      vocab: [
        { id: 'sr-cveće', w: 'cveće', ru: 'цветы', pos: 'n', g: 'n', forms: 'cveće, -a n. (собир.)', ex: 'Kupio sam joj cveće.', exRu: 'Я купил ей цветы.', note: 'Один цветок — cvet. Иекав. cvijeće.' },
        { id: 'sr-torta', w: 'torta', ru: 'торт', pos: 'n', g: 'f', forms: 'torta, -e f.', ex: 'Torta je ukusna.', exRu: 'Торт вкусный.', note: 'Ж. р.' },
        { id: 'sr-sveća', w: 'sveća', ru: 'свеча', pos: 'n', g: 'f', forms: 'sveća, -e f.', ex: 'Duni svećice!', exRu: 'Задуй свечки!', note: 'Иекав. svijeća.' },
        { id: 'sr-slaviti', w: 'slaviti', ru: 'праздновать', pos: 'v', g: null, forms: 'slaviti (slavim), nesvr. / proslaviti (proslavim), svr.', ex: 'Slavimo rođendan u subotu.', exRu: 'Празднуем день рождения в субботу.', note: null },
        { id: 'sr-čestitati', w: 'čestitati', ru: 'поздравлять', pos: 'v', g: null, forms: 'čestitati (čestitam), dvovid.', ex: 'Čestitam ti rođendan!', exRu: 'Поздравляю тебя с днём рождения!', note: 'Кому — Д., с чем — A (без предлога).' },
        { id: 'sr-iznenađenje', w: 'iznenađenje', ru: 'сюрприз', pos: 'n', g: 'n', forms: 'iznenađenje, -a n.', ex: 'To je iznenađenje!', exRu: 'Это сюрприз!', note: null },
        { id: 'sr-zabava', w: 'zabava', ru: 'вечеринка; развлечение', pos: 'n', g: 'f', forms: 'zabava, -e f.', ex: 'Dođi na zabavu!', exRu: 'Приходи на вечеринку!', note: 'Также žurka (разг.).' },
        { id: 'sr-gost', w: 'gost', ru: 'гость', pos: 'n', g: 'm', forms: 'gost, -a m. (мн. gosti, Г. мн. gostiju)', ex: 'Gosti su stigli.', exRu: 'Гости пришли.', note: 'Г. мн. gostiju — особое окончание.' }
      ],
      text: {
        title: 'Rođendanski poklon',
        lines: [
          { t: 'Jelena: Sutra je Markov rođendan. Šta da mu kupimo?', ru: 'Елена: Завтра день рождения Марко. Что ему купить?' },
          { t: 'Nikola: Prošle godine sam mu dao knjigu. Nije mu se dopala.', ru: 'Никола: В прошлом году я подарил ему книгу. Она ему не понравилась.' },
          { t: 'Jelena: Bolje da mu kupimo nešto korisnije. Treba mu nova torba.', ru: 'Елена: Лучше купим ему что-нибудь полезнее. Ему нужна новая сумка.' },
          { t: 'Nikola: Dobra ideja! Videla si je u prodavnici?', ru: 'Никола: Хорошая идея! Ты видела её в магазине?' },
          { t: 'Jelena: Jesam. Najlepša je plava, ali je i najskuplja.', ru: 'Елена: Да. Самая красивая — синяя, но она и самая дорогая.' },
          { t: 'Nikola: Nema veze. Kupićemo mu je zajedno.', ru: 'Никола: Неважно. Купим её ему вместе.' },
          { t: 'Jelena: A ko će doneti tortu?', ru: 'Елена: А кто принесёт торт?' },
          { t: 'Nikola: Njegova sestra. Rekla mi je da će to biti iznenađenje.', ru: 'Никола: Его сестра. Она сказала мне, что это будет сюрприз.' }
        ]
      }
    }
  ]
}
