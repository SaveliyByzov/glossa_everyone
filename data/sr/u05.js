export default {
  id: 'sr-u05',
  title: 'Lokativ i genitiv',
  titleRu: 'Локатив и генитив',
  summary: 'Где? — локатив с u/na/o/po; откуда, у кого, без чего — генитив; родительный мн. ч., числительные 2–4 и 5+, ima/nema + генитив, покупки на рынке.',
  lessons: [
    {
      id: 'sr-u05-l01',
      kind: 'grammar',
      title: 'Lokativ: gde?',
      goals: ['Образовывать локатив ед. и мн. ч.', 'Различать направление (A) и место (L)', 'Выбирать u или na'],
      skills: ['sr.case.loc'],
      theory: [
        { type: 'table', caption: 'Локатив', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['м.', 'u grad{{u}}', 'u grad{{ovima}}'],
          ['ж. на -a', 'u kuć{{i}}', 'u kuć{{ama}}'],
          ['ж. на согласный', 'u noć{{i}}', 'u noć{{ima}}'],
          ['ср.', 'na sel{{u}}', 'na sel{{ima}}']
        ] },
        { type: 'rule', text: 'Локатив употребляется **только с предлогами**: **u** (в), **na** (на), **o** (о), **po** (по), **pri** (при). Вопрос «где?» → L; вопрос «куда?» → A: *Idem u grad* — *Ja sam u gradu*.' },
        { type: 'p', text: 'В ж. р. перед -i работает сибиляризация: pijaca → na pija{{c}}i (c уже было), knjiga → u knji{{z}}i, reka → na re{{c}}i, Amerika → u Ameri{{c}}i. Ласкательные и имена — без неё: baki, Maji.' },
        { type: 'contrast', text: 'Русский предложный м./ср. р. на -е («в городе, в селе»), сербский — на **-u**: *u gradu, u selu*. Ж. р. на -i: «в доме» по смыслу = *u kući*. Выбор u/na в основном как в русском: **na poslu, na fakultetu, na pijaci, na koncertu**; но **u banci, u školi**.' },
        { type: 'examples', items: [
          { t: 'Radim u banci.', ru: 'Я работаю в банке.' },
          { t: 'Mama je na pijaci.', ru: 'Мама на рынке.' },
          { t: 'Pričamo o filmu.', ru: 'Мы говорим о фильме.' },
          { t: 'Šetam po gradu.', ru: 'Я гуляю по городу.' }
        ] },
        { type: 'pitfall', text: 'Не «u grade» по русской модели: **u gradu**. И не путайте: *Idem u školu* (A, куда) — *Ja sam u školi* (L, где).' }
      ],
      vocab: [
        { id: 'sr-banka', w: 'banka', ru: 'банк', pos: 'n', g: 'f', forms: 'banka, -e f. (лок. banci)', ex: 'Radim u banci.', exRu: 'Я работаю в банке.', note: 'Ж. р.!' },
        { id: 'sr-pošta', w: 'pošta', ru: 'почта', pos: 'n', g: 'f', forms: 'pošta, -e f.', ex: 'Idem na poštu.', exRu: 'Я иду на почту.', note: 'na pošti / na poštu.' },
        { id: 'sr-apoteka', w: 'apoteka', ru: 'аптека', pos: 'n', g: 'f', forms: 'apoteka, -e f. (лок. apoteci)', ex: 'Apoteka je blizu.', exRu: 'Аптека близко.', note: 'Хорв. ljekarna.' },
        { id: 'sr-bolnica', w: 'bolnica', ru: 'больница', pos: 'n', g: 'f', forms: 'bolnica, -e f.', ex: 'Otac radi u bolnici.', exRu: 'Отец работает в больнице.', note: null },
        { id: 'sr-prodavnica', w: 'prodavnica', ru: 'магазин', pos: 'n', g: 'f', forms: 'prodavnica, -e f.', ex: 'Prodavnica je zatvorena.', exRu: 'Магазин закрыт.', note: 'Хорв. trgovina; также radnja.' },
        { id: 'sr-pijaca', w: 'pijaca', ru: 'рынок', pos: 'n', g: 'f', forms: 'pijaca, -e f.', ex: 'Kupujem voće na pijaci.', exRu: 'Я покупаю фрукты на рынке.', note: 'na pijaci.' },
        { id: 'sr-park', w: 'park', ru: 'парк', pos: 'n', g: 'm', forms: 'park, -a m. (мн. parkovi)', ex: 'Deca su u parku.', exRu: 'Дети в парке.', note: null },
        { id: 'sr-centar', w: 'centar', ru: 'центр', pos: 'n', g: 'm', forms: 'centar, centra m.', ex: 'Živim u centru.', exRu: 'Я живу в центре.', note: 'Беглое a: centra, u centru.' },
        { id: 'sr-bioskop', w: 'bioskop', ru: 'кинотеатр', pos: 'n', g: 'm', forms: 'bioskop, -a m.', ex: 'Idemo u bioskop?', exRu: 'Пойдём в кино?', note: 'Хорв. kino.' },
        { id: 'sr-pozorište', w: 'pozorište', ru: 'театр', pos: 'n', g: 'n', forms: 'pozorište, -a n.', ex: 'Narodno pozorište je u centru.', exRu: 'Национальный театр в центре.', note: 'Ложный друг: не «позорище». Хорв. kazalište.' },
        { id: 'sr-ulica', w: 'ulica', ru: 'улица', pos: 'n', g: 'f', forms: 'ulica, -e f.', ex: 'U kojoj ulici živiš?', exRu: 'На какой улице ты живёшь?', note: 'Сербск. u ulici — «на улице» (адрес).' },
        { id: 'sr-zgrada', w: 'zgrada', ru: 'здание', pos: 'n', g: 'f', forms: 'zgrada, -e f.', ex: 'Stan je u novoj zgradi.', exRu: 'Квартира в новом доме.', note: 'Многоквартирный дом — zgrada, частный — kuća.' },
        { id: 'sr-stanica', w: 'stanica', ru: 'остановка; станция', pos: 'n', g: 'f', forms: 'stanica, -e f.', ex: 'Čekam na stanici.', exRu: 'Я жду на остановке.', note: 'železnička stanica — вокзал.' }
      ],
      text: null
    },
    {
      id: 'sr-u05-l02',
      kind: 'grammar',
      title: 'Genitiv jednine',
      goals: ['Образовывать генитив ед. ч.', 'Употреблять предлоги с генитивом', 'Выражать принадлежность и происхождение'],
      skills: ['sr.case.gen'],
      theory: [
        { type: 'table', caption: 'Генитив ед. ч.', head: ['Тип', 'N', 'G'], rows: [
          ['м.', 'grad, brat', 'grad{{a}}, brat{{a}}'],
          ['ж. на -a', 'žena', 'žen{{e}}'],
          ['ж. на согласный', 'stvar', 'stvar{{i}}'],
          ['ср.', 'selo', 'sel{{a}}']
        ] },
        { type: 'rule', text: 'Генитив: принадлежность (*kuća moga brata*), часть, отсутствие, количество и множество предлогов: **od, iz, sa (s), do, bez, kod, posle, pre, pored, blizu, ispred, iza, između, preko puta**.' },
        { type: 'examples', items: [
          { t: 'Ja sam iz Rusije.', ru: 'Я из России.' },
          { t: 'Vraćam se sa posla.', ru: 'Я возвращаюсь с работы.' },
          { t: 'Kafa bez šećera, molim.', ru: 'Кофе без сахара, пожалуйста.' },
          { t: 'Večeras sam kod brata.', ru: 'Сегодня вечером я у брата.' },
          { t: 'Posle časa idem kući.', ru: 'После урока я иду домой.' },
          { t: 'Pošta je pored banke.', ru: 'Почта рядом с банком.' }
        ] },
        { type: 'contrast', text: '**kod** + G = русское «у» (кого, чего): *kod kuće* (дома), *kod lekara* (у врача). Пара **iz / sa** — как «из / с»: *iz grada, sa pijace*. **do** — «до» и «рядом»: *Sedi do mene* — Сиди рядом со мной.' },
        { type: 'pitfall', text: '**sa** + G = «с, со» (откуда: *sa stola*), **sa** + I = «с» (кем, чем: *sa bratom*) — как в русском. Но «у меня есть» — не «kod mene je», а **imam**.' }
      ],
      vocab: [
        { id: 'sr-od', w: 'od', ru: 'от; из (материал); чем (при сравнении)', pos: 'prep', g: null, forms: '+ Г.', ex: 'Pismo je od mame.', exRu: 'Письмо от мамы.', note: 'Stariji je od mene — Он старше меня.' },
        { id: 'sr-do', w: 'do', ru: 'до; рядом с', pos: 'prep', g: null, forms: '+ Г.', ex: 'Radim do pet.', exRu: 'Я работаю до пяти.', note: null },
        { id: 'sr-bez', w: 'bez', ru: 'без', pos: 'prep', g: null, forms: '+ Г.', ex: 'Čaj bez šećera.', exRu: 'Чай без сахара.', note: null },
        { id: 'sr-kod', w: 'kod', ru: 'у (кого, чего)', pos: 'prep', g: null, forms: '+ Г.', ex: 'Idem kod lekara.', exRu: 'Я иду к врачу.', note: 'Также направление к человеку: idem kod mame.' },
        { id: 'sr-posle', w: 'posle', ru: 'после', pos: 'prep', g: null, forms: '+ Г.', ex: 'Posle posla idem u teretanu.', exRu: 'После работы я иду в спортзал.', note: 'Иекав. poslije.' },
        { id: 'sr-pre', w: 'pre', ru: 'до, перед; назад', pos: 'prep', g: null, forms: '+ Г.', ex: 'Pre ručka pijem vodu.', exRu: 'Перед обедом я пью воду.', note: 'pre dve godine — два года назад. Иекав. prije.' },
        { id: 'sr-pored', w: 'pored', ru: 'рядом с, возле', pos: 'prep', g: null, forms: '+ Г.', ex: 'Sedim pored prozora.', exRu: 'Я сижу у окна.', note: null },
        { id: 'sr-blizu', w: 'blizu', ru: 'близко; вблизи (от)', pos: 'prep', g: null, forms: '+ Г.; нареч.', ex: 'Živim blizu centra.', exRu: 'Я живу близко от центра.', note: null },
        { id: 'sr-ispred', w: 'ispred', ru: 'перед', pos: 'prep', g: null, forms: '+ Г.', ex: 'Čekam ispred zgrade.', exRu: 'Я жду перед зданием.', note: null },
        { id: 'sr-iza', w: 'iza', ru: 'за, позади', pos: 'prep', g: null, forms: '+ Г.', ex: 'Park je iza škole.', exRu: 'Парк за школой.', note: 'Место «за» — iza + G (ср. русск. «за» + твор.).' },
        { id: 'sr-između', w: 'između', ru: 'между', pos: 'prep', g: null, forms: '+ Г.', ex: 'Između banke i pošte.', exRu: 'Между банком и почтой.', note: null },
        { id: 'sr-sa', w: 'sa', ru: 'с (откуда — Г.; с кем — Т.)', pos: 'prep', g: null, forms: 'sa / s; + Г. или Т.', ex: 'Dolazim sa fakulteta.', exRu: 'Я иду с факультета.', note: 'Форма sa перед s, z, š, ž и в sa mnom; разг. — везде.' }
      ],
      text: null
    },
    {
      id: 'sr-u05-l03',
      kind: 'grammar',
      title: 'Genitiv množine i brojevi',
      goals: ['Образовывать генитив мн. ч.', 'Употреблять числительные 1, 2–4 и 5+', 'Работать с mnogo, malo, koliko'],
      skills: ['sr.case.gen', 'sr.num'],
      theory: [
        { type: 'table', caption: 'Генитив мн. ч.', head: ['Тип', 'N мн.', 'G мн.'], rows: [
          ['м.', 'gradovi, prozori', 'grad{{ova}}, prozor{{a}}'],
          ['м. с беглым a', 'studenti', 'stude{{na}}ta'],
          ['ж. на -a', 'žene, sestre', 'žen{{a}}, sest{{a}}ra'],
          ['ж. на согласный', 'stvari', 'stvar{{i}}'],
          ['ср.', 'sela', 'sel{{a}}']
        ], note: 'Г. мн. -a — долгое; на письме совпадает с другими формами (žena — N ед. и G мн.), различают по контексту. При стечении согласных вставляется a: sestra → sestara, student → studenata.' },
        { type: 'table', caption: 'Числительные и падеж', head: ['Число', 'м./ср.', 'ж.'], rows: [
          ['1', 'jedan grad, jedno selo', 'jedna kuća'],
          ['2, 3, 4', 'dva grad{{a}}, tri sel{{a}}', 'dve kuć{{e}}, četiri žen{{e}}'],
          ['5 и больше', 'pet grad{{ova}}', 'pet kuć{{a}}']
        ], note: 'После 2–4 м./ср. р. стоит форма, совпадающая с Г. ед. (паукал, ист. двойственное число), ж. р. — с N мн. dva (м., ср.) / dve (ж.). Составные — по последнему слову: dvadeset dva grada.' },
        { type: 'contrast', text: 'Система **как в русском**: «два города — пять городов», «две женщины — пять женщин». Даже dva/dve совпадает с «два/две». mnogo, malo, nekoliko, koliko + Г. мн.: *mnogo ljudi, koliko dana?*' },
        { type: 'examples', items: [
          { t: 'Imam dva brata i tri sestre.', ru: 'У меня два брата и три сестры.' },
          { t: 'U gradu ima pet bioskopa.', ru: 'В городе пять кинотеатров.' },
          { t: 'Koliko imaš godina? — Dvadeset tri.', ru: 'Сколько тебе лет? — Двадцать три.' },
          { t: 'Ovde ima mnogo ljudi.', ru: 'Здесь много людей.' }
        ] },
        { type: 'pitfall', text: 'После 2–4 ж. р. — форма на -e (dve žene), а не на -a (не «dve žena»).' }
      ],
      vocab: [
        { id: 'sr-jedan', w: 'jedan', ru: 'один', pos: 'num', g: null, forms: 'jedan, jedna, jedno', ex: 'Imam jednu sestru.', exRu: 'У меня одна сестра.', note: 'Склоняется как прилагательное.' },
        { id: 'sr-dva', w: 'dva', ru: 'два', pos: 'num', g: null, forms: 'dva (м., ср.), dve (ж.)', ex: 'Dva brata i dve sestre.', exRu: 'Два брата и две сестры.', note: 'Иекав. dvije.' },
        { id: 'sr-tri', w: 'tri', ru: 'три', pos: 'num', g: null, forms: '', ex: 'Tri dana.', exRu: 'Три дня.', note: null },
        { id: 'sr-četiri', w: 'četiri', ru: 'четыре', pos: 'num', g: null, forms: '', ex: 'Četiri sobe.', exRu: 'Четыре комнаты.', note: null },
        { id: 'sr-pet', w: 'pet', ru: 'пять', pos: 'num', g: null, forms: '', ex: 'Pet minuta.', exRu: 'Пять минут.', note: '5+ → Г. мн.' },
        { id: 'sr-šest', w: 'šest', ru: 'шесть', pos: 'num', g: null, forms: '', ex: 'Šest sati.', exRu: 'Шесть часов.', note: null },
        { id: 'sr-sedam', w: 'sedam', ru: 'семь', pos: 'num', g: null, forms: '', ex: 'Sedam dana.', exRu: 'Семь дней.', note: null },
        { id: 'sr-osam', w: 'osam', ru: 'восемь', pos: 'num', g: null, forms: '', ex: 'Osam ljudi.', exRu: 'Восемь человек.', note: null },
        { id: 'sr-devet', w: 'devet', ru: 'девять', pos: 'num', g: null, forms: '', ex: 'Devet godina.', exRu: 'Девять лет.', note: null },
        { id: 'sr-deset', w: 'deset', ru: 'десять', pos: 'num', g: null, forms: '', ex: 'Deset dinara.', exRu: 'Десять динаров.', note: '11 jedanaest, 12 dvanaest, 20 dvadeset.' },
        { id: 'sr-sto-num', w: 'sto', ru: 'сто', pos: 'num', g: null, forms: '', ex: 'Sto dinara.', exRu: 'Сто динаров.', note: 'Омоним sto — «стол».' },
        { id: 'sr-hiljada', w: 'hiljada', ru: 'тысяча', pos: 'num', g: 'f', forms: 'hiljada, -e f.', ex: 'Dve hiljade dinara.', exRu: 'Две тысячи динаров.', note: 'Хорв. tisuća.' },
        { id: 'sr-koliko', w: 'koliko', ru: 'сколько', pos: 'adv', g: null, forms: '+ Г.', ex: 'Koliko košta?', exRu: 'Сколько стоит?', note: null },
        { id: 'sr-mnogo', w: 'mnogo', ru: 'много; очень', pos: 'adv', g: null, forms: '+ Г.', ex: 'Imam mnogo posla.', exRu: 'У меня много работы.', note: 'Синоним: puno.' }
      ],
      text: null
    },
    {
      id: 'sr-u05-l04',
      kind: 'grammar',
      title: 'Ima / nema + genitiv',
      goals: ['Выражать наличие и отсутствие', 'Употреблять разделительный генитив', 'Называть основные продукты'],
      skills: ['sr.case.gen'],
      theory: [
        { type: 'rule', text: 'Безличное **ima** = «есть, имеется», **nema** = «нет». При отсутствии — всегда генитив: **Nema hleba.** При ima — генитив для неопределённого количества: **Ima li mleka?**' },
        { type: 'examples', items: [
          { t: 'U frižideru nema mleka.', ru: 'В холодильнике нет молока.' },
          { t: 'Ima li hleba?', ru: 'Есть хлеб?' },
          { t: 'Nema problema.', ru: 'Без проблем (нет проблем).' },
          { t: 'Daj mi vode, molim te.', ru: 'Дай мне воды, пожалуйста.' },
          { t: 'Marko nije ovde. — Nema ga?', ru: 'Марко здесь нет. — Его нет?' }
        ] },
        { type: 'contrast', text: 'Полностью как в русском: «нет молока», «дай воды». Личное «у меня нет» — **nemam**: *Nemam vremena.* Нельзя «nije mleka» по аналогии с nisam: только **nema**.' },
        { type: 'contrast', text: 'Ложный друг из этой темы: **jagoda** — «клубника», а не «ягода» (= bobica).' },
        { type: 'tip', text: '**voće** (фрукты) и **povrće** (овощи) — собирательные ср. р. ед. ч.: *Voće je sveže.*' }
      ],
      vocab: [
        { id: 'sr-meso', w: 'meso', ru: 'мясо', pos: 'n', g: 'n', forms: 'meso, -a n.', ex: 'Ne jedem meso.', exRu: 'Я не ем мясо.', note: null },
        { id: 'sr-riba', w: 'riba', ru: 'рыба', pos: 'n', g: 'f', forms: 'riba, -e f.', ex: 'Petkom jedemo ribu.', exRu: 'По пятницам мы едим рыбу.', note: null },
        { id: 'sr-sir', w: 'sir', ru: 'сыр', pos: 'n', g: 'm', forms: 'sir, -a m. (мн. sirevi)', ex: 'Ima li sira?', exRu: 'Сыр есть?', note: null },
        { id: 'sr-jaje', w: 'jaje', ru: 'яйцо', pos: 'n', g: 'n', forms: 'jaje, jajeta n. (мн. jaja)', ex: 'Za doručak jedem dva jajeta.', exRu: 'На завтрак я ем два яйца.', note: 'Основа на -et-.' },
        { id: 'sr-šećer', w: 'šećer', ru: 'сахар', pos: 'n', g: 'm', forms: 'šećer, -a m.', ex: 'Kafa bez šećera.', exRu: 'Кофе без сахара.', note: null },
        { id: 'sr-so', w: 'so', ru: 'соль', pos: 'n', g: 'f', forms: 'so, soli f.', ex: 'Daj mi so, molim te.', exRu: 'Дай мне соль, пожалуйста.', note: 'Ж. р.; хорв. sol.' },
        { id: 'sr-voće', w: 'voće', ru: 'фрукты', pos: 'n', g: 'n', forms: 'voće, -a n. (собир.)', ex: 'Volim voće.', exRu: 'Я люблю фрукты.', note: 'Собирательное ед. ч.' },
        { id: 'sr-povrće', w: 'povrće', ru: 'овощи', pos: 'n', g: 'n', forms: 'povrće, -a n. (собир.)', ex: 'Povrće je zdravo.', exRu: 'Овощи полезны.', note: null },
        { id: 'sr-krompir', w: 'krompir', ru: 'картофель', pos: 'n', g: 'm', forms: 'krompir, -a m.', ex: 'Kilo krompira, molim.', exRu: 'Кило картошки, пожалуйста.', note: 'Хорв. krumpir.' },
        { id: 'sr-paradajz', w: 'paradajz', ru: 'помидоры', pos: 'n', g: 'm', forms: 'paradajz, -a m.', ex: 'Paradajz je jeftin.', exRu: 'Помидоры дешёвые.', note: 'Обычно собирательно. Хорв. rajčica.' },
        { id: 'sr-pivo', w: 'pivo', ru: 'пиво', pos: 'n', g: 'n', forms: 'pivo, -a n.', ex: 'Jedno pivo, molim.', exRu: 'Одно пиво, пожалуйста.', note: null },
        { id: 'sr-vino', w: 'vino', ru: 'вино', pos: 'n', g: 'n', forms: 'vino, -a n.', ex: 'Crno ili belo vino?', exRu: 'Красное или белое вино?', note: 'Красное вино — crno (букв. «чёрное»).' },
        { id: 'sr-sok', w: 'sok', ru: 'сок', pos: 'n', g: 'm', forms: 'sok, -a m. (мн. sokovi)', ex: 'Sok od jabuke.', exRu: 'Яблочный сок.', note: 'sok od + Г. — сок из чего.' }
      ],
      text: null
    },
    {
      id: 'sr-u05-l05',
      kind: 'reading',
      title: 'Na pijaci',
      goals: ['Понять диалог покупки', 'Спрашивать цену и количество'],
      skills: ['sr.case.gen', 'sr.num', 'sr.case.loc'],
      theory: [
        { type: 'tip', text: '**Koliko košta…?** — Сколько стоит…? Мн. ч.: **Koliko koštaju…?** Цена — генитив после числа: *sto dinara, dvesta dinara*.' }
      ],
      vocab: [
        { id: 'sr-koštati', w: 'koštati', ru: 'стоить', pos: 'v', g: null, forms: 'koštati (košta), nesvr.', ex: 'Koliko košta kilo jabuka?', exRu: 'Сколько стоит кило яблок?', note: null },
        { id: 'sr-dinar', w: 'dinar', ru: 'динар', pos: 'n', g: 'm', forms: 'dinar, -a m.', ex: 'To je sto dinara.', exRu: 'Это сто динаров.', note: 'Валюта Сербии.' },
        { id: 'sr-kilo', w: 'kilo', ru: 'килограмм, кило', pos: 'n', g: 'n', forms: 'kilo, -a n. (kilogram, -a m.)', ex: 'Dva kila paradajza.', exRu: 'Два кило помидоров.', note: null },
        { id: 'sr-dati', w: 'dati', ru: 'дать', pos: 'v', g: null, forms: 'dati (dam), svr. / davati (dajem), nesvr.', ex: 'Dajte mi kilo jabuka.', exRu: 'Дайте мне кило яблок.', note: 'Императив: daj, dajte.' },
        { id: 'sr-evo', w: 'evo', ru: 'вот', pos: 'part', g: null, forms: '', ex: 'Evo, izvolite.', exRu: 'Вот, пожалуйста.', note: 'evo — здесь, eto — там, eno — вон там.' },
        { id: 'sr-još', w: 'još', ru: 'ещё', pos: 'adv', g: null, forms: '', ex: 'Još nešto?', exRu: 'Что-нибудь ещё?', note: null },
        { id: 'sr-sve', w: 'sve', ru: 'всё', pos: 'pron', g: null, forms: '', ex: 'To je sve, hvala.', exRu: 'Это всё, спасибо.', note: null },
        { id: 'sr-svež', w: 'svež', ru: 'свежий', pos: 'adj', g: null, forms: 'svež, sveža, sveže', ex: 'Hleb je svež.', exRu: 'Хлеб свежий.', note: 'Иекав. svjež.' }
      ],
      text: {
        title: 'Na pijaci',
        lines: [
          { t: 'Prodavačica: Dobar dan! Izvolite?', ru: 'Продавщица: Добрый день! Что желаете?' },
          { t: 'Kupac: Dobar dan. Koliko košta kilo paradajza?', ru: 'Покупатель: Добрый день. Сколько стоит кило помидоров?' },
          { t: 'Prodavačica: Sto dvadeset dinara. Paradajz je svež, domaći.', ru: 'Продавщица: Сто двадцать динаров. Помидоры свежие, домашние.' },
          { t: 'Kupac: Dajte mi dva kila. Imate li sira?', ru: 'Покупатель: Дайте мне два кило. У вас есть сыр?' },
          { t: 'Prodavačica: Nemam sira danas, ali imam jaja.', ru: 'Продавщица: Сыра сегодня нет, но есть яйца.' },
          { t: 'Kupac: Onda deset jaja, molim. I pet jabuka.', ru: 'Покупатель: Тогда десять яиц, пожалуйста. И пять яблок.' },
          { t: 'Prodavačica: Evo. Još nešto?', ru: 'Продавщица: Вот. Что-нибудь ещё?' },
          { t: 'Kupac: Ne, to je sve. Koliko je ukupno?', ru: 'Покупатель: Нет, это всё. Сколько всего?' },
          { t: 'Prodavačica: Petsto dinara. Hvala, prijatno!', ru: 'Продавщица: Пятьсот динаров. Спасибо, всего доброго!' }
        ]
      }
    }
  ]
}
