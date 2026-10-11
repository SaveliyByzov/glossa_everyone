export default {
  id: 'sr-u04',
  title: 'Rod, broj, akuzativ',
  titleRu: 'Род, число, аккузатив',
  summary: 'Три рода и их окончания, множественное число (-ovi/-evi, сибиляризация, супплетивы), аккузатив с одушевлённостью только в м. р. ед. ч., согласование прилагательных и притяжательные местоимения.',
  lessons: [
    {
      id: 'sr-u04-l01',
      kind: 'grammar',
      title: 'Rod imenica',
      goals: ['Определять род по окончанию', 'Знать мужские существительные на -a', 'Помнить расхождения рода с русским'],
      skills: ['sr.noun.gender'],
      theory: [
        { type: 'table', caption: 'Род по форме номинатива', head: ['Род', 'Окончание', 'Примеры'], rows: [
          ['м.', 'согласный', 'grad, brat, student, prijatelj'],
          ['м. (лица)', '-a', 'tata, deda, kolega, sudija'],
          ['ж.', '-a', 'žena, sestra, kuća'],
          ['ж.', 'согласный (i-склонение)', 'stvar, noć, ljubav, reč, so'],
          ['ср.', '-o / -e', 'selo, pismo, more, srce'],
          ['ср. (основы -en-, -et-)', '-e', 'ime (imena), vreme (vremena), dete (deteta)']
        ] },
        { type: 'rule', text: 'Существительные на **-a**, обозначающие мужчин (tata, deda, kolega), — **мужского рода** (согласование: *moj tata*), но склоняются как женские.' },
        { type: 'contrast', text: 'Почти всё как в русском («папа, дедушка, ночь, любовь»). Но род иногда расходится: **kafa** — ж. р. (кофе — м.), **bol** — м. р. (боль — ж.).' },
        { type: 'examples', items: [
          { t: 'Moj otac je lekar.', ru: 'Мой отец — врач.' },
          { t: 'Moja majka je profesorka.', ru: 'Моя мать — преподаватель.' },
          { t: 'Moj deda je star.', ru: 'Мой дедушка старый.', note: 'deda — м. р.' },
          { t: 'Naša porodica je velika.', ru: 'Наша семья большая.' }
        ] },
        { type: 'pitfall', text: 'Ж. р. на согласный пишется **без мягкого знака**: noć, so, reč. По форме их не отличить от мужских — запоминайте с родительным: noć, noći f.; grad, grada m.' }
      ],
      vocab: [
        { id: 'sr-porodica', w: 'porodica', ru: 'семья', pos: 'n', g: 'f', forms: 'porodica, -e f.', ex: 'Imam veliku porodicu.', exRu: 'У меня большая семья.', note: 'Хорв. obitelj.' },
        { id: 'sr-majka', w: 'majka', ru: 'мать', pos: 'n', g: 'f', forms: 'majka, -e f. (дат./лок. majci)', ex: 'Moja majka je lekarka.', exRu: 'Моя мать — врач.', note: 'Вок. majko. Разг. mama.' },
        { id: 'sr-otac', w: 'otac', ru: 'отец', pos: 'n', g: 'm', forms: 'otac, oca m. (мн. očevi)', ex: 'Otac radi u banci.', exRu: 'Отец работает в банке.', note: 'Г. oca — беглое a. Вок. oče.' },
        { id: 'sr-brat', w: 'brat', ru: 'брат', pos: 'n', g: 'm', forms: 'brat, -a m. (мн. braća)', ex: 'Imam jednog brata.', exRu: 'У меня один брат.', note: 'braća — собирательное (как deca).' },
        { id: 'sr-sestra', w: 'sestra', ru: 'сестра', pos: 'n', g: 'f', forms: 'sestra, -e f. (Г. мн. sestara)', ex: 'Sestra je mlađa od mene.', exRu: 'Сестра младше меня.', note: null },
        { id: 'sr-sin', w: 'sin', ru: 'сын', pos: 'n', g: 'm', forms: 'sin, -a m. (мн. sinovi)', ex: 'Moj sin ima pet godina.', exRu: 'Моему сыну пять лет.', note: null },
        { id: 'sr-muž', w: 'muž', ru: 'муж', pos: 'n', g: 'm', forms: 'muž, -a m. (мн. muževi)', ex: 'Ovo je moj muž.', exRu: 'Это мой муж.', note: '«Мужчина» — muškarac.' },
        { id: 'sr-žena', w: 'žena', ru: 'женщина; жена', pos: 'n', g: 'f', forms: 'žena, -e f.', ex: 'Moja žena je Srpkinja.', exRu: 'Моя жена — сербка.', note: 'Вок. ženo.' },
        { id: 'sr-tata', w: 'tata', ru: 'папа', pos: 'n', g: 'm', forms: 'tata, -e m.', ex: 'Moj tata kuva.', exRu: 'Мой папа готовит.', note: 'М. р., склоняется как ж.' },
        { id: 'sr-deda', w: 'deda', ru: 'дедушка', pos: 'n', g: 'm', forms: 'deda, -e m.', ex: 'Deda živi na selu.', exRu: 'Дедушка живёт в деревне.', note: 'Иекав. djed.' },
        { id: 'sr-baka', w: 'baka', ru: 'бабушка', pos: 'n', g: 'f', forms: 'baka, -e f. (дат./лок. baki)', ex: 'Baka pravi kolače.', exRu: 'Бабушка печёт пирожные.', note: 'baki — без сибиляризации.' },
        { id: 'sr-roditelji', w: 'roditelji', ru: 'родители', pos: 'n', g: 'm', forms: 'roditelji, roditelja m. мн.', ex: 'Moji roditelji žive u Nišu.', exRu: 'Мои родители живут в Нише.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u04-l02',
      kind: 'grammar',
      title: 'Množina',
      goals: ['Образовывать мн. ч. всех трёх родов', 'Применять наращение -ov-/-ev- и сибиляризацию', 'Знать супплетивные формы'],
      skills: ['sr.noun.plural'],
      theory: [
        { type: 'table', caption: 'Номинатив мн. ч.', head: ['Тип', 'ед. ч.', 'мн. ч.'], rows: [
          ['м.', 'student', 'student{{i}}'],
          ['м. односложные', 'grad', 'grad{{ovi}}'],
          ['м. после мягких (c, č, ć, dž, đ, j, lj, nj, š, ž)', 'ključ', 'ključ{{evi}}'],
          ['ж. на -a', 'soba', 'sob{{e}}'],
          ['ж. на согласный', 'stvar', 'stvar{{i}}'],
          ['ср.', 'selo, more', 'sel{{a}}, mor{{a}}']
        ] },
        { type: 'rule', text: '**Сибиляризация**: перед -i в м. р. мн. ч. k → **c**, g → **z**, h → **s**: učenik → učeni{{c}}i, jezik → jezi{{c}}i, bubreg → bubre{{z}}i, đak → đa{{c}}i.' },
        { type: 'p', text: 'Беглое a исчезает в косвенных формах и мн. ч.: muškarac → muškarci, posao → poslovi. Супплетивы и особые формы: čovek → **ljudi**, dete → **deca**, brat → **braća**, oko → **oči**, uho → **uši**.' },
        { type: 'contrast', text: 'Сибиляризация — это вторая палатализация, которую русский утратил в склонении («на руке», но др.-рус. «на руцѣ»). Русское мн. «города, дома» на -а соответствует сербскому -ovi: gradovi.' },
        { type: 'pitfall', text: '**vrata** — «дверь» (только мн. ч., ср. р.: *Vrata su otvorena*), не «ворота» (= kapija).' }
      ],
      vocab: [
        { id: 'sr-stan', w: 'stan', ru: 'квартира', pos: 'n', g: 'm', forms: 'stan, -a m. (мн. stanovi)', ex: 'Stan je mali, ali lep.', exRu: 'Квартира маленькая, но красивая.', note: 'Ложный друг: не «стан».' },
        { id: 'sr-soba', w: 'soba', ru: 'комната', pos: 'n', g: 'f', forms: 'soba, -e f.', ex: 'Stan ima tri sobe.', exRu: 'В квартире три комнаты.', note: null },
        { id: 'sr-kuhinja', w: 'kuhinja', ru: 'кухня', pos: 'n', g: 'f', forms: 'kuhinja, -e f.', ex: 'Mama je u kuhinji.', exRu: 'Мама на кухне.', note: 'u kuhinji — с предлогом u.' },
        { id: 'sr-kupatilo', w: 'kupatilo', ru: 'ванная', pos: 'n', g: 'n', forms: 'kupatilo, -a n.', ex: 'Gde je kupatilo?', exRu: 'Где ванная?', note: null },
        { id: 'sr-sto', w: 'sto', ru: 'стол', pos: 'n', g: 'm', forms: 'sto, stola m. (мн. stolovi)', ex: 'Knjiga je na stolu.', exRu: 'Книга на столе.', note: 'Омоним sto — «сто». Хорв. stol.' },
        { id: 'sr-stolica', w: 'stolica', ru: 'стул', pos: 'n', g: 'f', forms: 'stolica, -e f.', ex: 'Sedi na stolicu!', exRu: 'Садись на стул!', note: null },
        { id: 'sr-krevet', w: 'krevet', ru: 'кровать', pos: 'n', g: 'm', forms: 'krevet, -a m.', ex: 'Krevet je udoban.', exRu: 'Кровать удобная.', note: null },
        { id: 'sr-prozor', w: 'prozor', ru: 'окно', pos: 'n', g: 'm', forms: 'prozor, -a m. (мн. prozori)', ex: 'Otvori prozor!', exRu: 'Открой окно!', note: 'М. р.' },
        { id: 'sr-vrata', w: 'vrata', ru: 'дверь', pos: 'n', g: 'n', forms: 'vrata, vrata n. мн.', ex: 'Vrata su zatvorena.', exRu: 'Дверь закрыта.', note: 'Только мн. ч. Ложный друг: не «ворота».' },
        { id: 'sr-ključ', w: 'ključ', ru: 'ключ', pos: 'n', g: 'm', forms: 'ključ, -a m. (мн. ključevi)', ex: 'Gde su ključevi?', exRu: 'Где ключи?', note: '-evi после мягкого č.' },
        { id: 'sr-telefon', w: 'telefon', ru: 'телефон', pos: 'n', g: 'm', forms: 'telefon, -a m. (мн. telefoni)', ex: 'Telefon je na stolu.', exRu: 'Телефон на столе.', note: null },
        { id: 'sr-učenik', w: 'učenik', ru: 'ученик, школьник', pos: 'n', g: 'm', forms: 'učenik, -a m. (мн. učenici)', ex: 'Učenici su u školi.', exRu: 'Ученики в школе.', note: 'Сибиляризация: k → c.' }
      ],
      text: null
    },
    {
      id: 'sr-u04-l03',
      kind: 'grammar',
      title: 'Akuzativ',
      goals: ['Образовывать аккузатив ед. и мн. ч.', 'Различать одушевлённые и неодушевлённые в м. р.', 'Употреблять u/na + A для направления и дни недели'],
      skills: ['sr.case.acc'],
      theory: [
        { type: 'table', caption: 'Аккузатив', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['м. неодуш.', 'grad', 'grad{{ove}}'],
          ['м. одуш.', 'brat{{a}}', 'student{{e}}'],
          ['ж. на -a', 'žen{{u}}', 'žen{{e}}'],
          ['ж. на согласный', 'stvar', 'stvar{{i}}'],
          ['ср.', 'selo', 'sel{{a}}']
        ] },
        { type: 'rule', text: 'Одушевлённость различается **только в м. р. ед. ч.** (A = G: *vidim brata*). Во мн. ч. у всех м. р. окончание **-e**: *vidim studente, gradove*.' },
        { type: 'contrast', text: 'В русском одушевлённость работает и во мн. ч. («вижу студентов»). В сербском — нет: **Vidim studente** (не «studenata»).' },
        { type: 'p', text: 'Предлоги с A: **u, na** (направление «куда»), **za** (для; за), **kroz** (сквозь), **preko** (через). Дни недели: *u ponedeljak* (в понедельник), *svaki dan* (каждый день — A без предлога).' },
        { type: 'examples', items: [
          { t: 'Idem u školu.', ru: 'Я иду в школу.' },
          { t: 'Idemo na posao.', ru: 'Мы идём на работу.' },
          { t: 'Vidim brata i sestru.', ru: 'Я вижу брата и сестру.' },
          { t: 'Ovo je poklon za tebe.', ru: 'Это подарок для тебя.' },
          { t: 'U subotu idemo na more.', ru: 'В субботу едем на море.' }
        ] },
        { type: 'tip', text: '**nedelja** — и «воскресенье», и (в Сербии) «неделя»; однозначное «неделя» — **sedmica**.' }
      ],
      vocab: [
        { id: 'sr-dan', w: 'dan', ru: 'день', pos: 'n', g: 'm', forms: 'dan, dana m. (мн. dani)', ex: 'Svaki dan učim.', exRu: 'Каждый день я учусь.', note: null },
        { id: 'sr-ponedeljak', w: 'ponedeljak', ru: 'понедельник', pos: 'n', g: 'm', forms: 'ponedeljak, ponedeljka m.', ex: 'U ponedeljak radim.', exRu: 'В понедельник я работаю.', note: 'Иекав. ponedjeljak.' },
        { id: 'sr-utorak', w: 'utorak', ru: 'вторник', pos: 'n', g: 'm', forms: 'utorak, utorka m.', ex: 'U utorak imam čas.', exRu: 'Во вторник у меня урок.', note: null },
        { id: 'sr-sreda', w: 'sreda', ru: 'среда', pos: 'n', g: 'f', forms: 'sreda, -e f.', ex: 'Danas je sreda.', exRu: 'Сегодня среда.', note: 'Иекав. srijeda.' },
        { id: 'sr-četvrtak', w: 'četvrtak', ru: 'четверг', pos: 'n', g: 'm', forms: 'četvrtak, četvrtka m.', ex: 'Vidimo se u četvrtak.', exRu: 'Увидимся в четверг.', note: null },
        { id: 'sr-petak', w: 'petak', ru: 'пятница', pos: 'n', g: 'm', forms: 'petak, petka m.', ex: 'U petak idemo u bioskop.', exRu: 'В пятницу идём в кино.', note: 'М. р.!' },
        { id: 'sr-subota', w: 'subota', ru: 'суббота', pos: 'n', g: 'f', forms: 'subota, -e f.', ex: 'Subotom ne radim.', exRu: 'По субботам я не работаю.', note: 'subotom — творительный: «по субботам».' },
        { id: 'sr-nedelja', w: 'nedelja', ru: 'воскресенье; неделя', pos: 'n', g: 'f', forms: 'nedelja, -e f.', ex: 'U nedelju spavam dugo.', exRu: 'В воскресенье я долго сплю.', note: 'Иекав. nedjelja.' },
        { id: 'sr-sedmica', w: 'sedmica', ru: 'неделя', pos: 'n', g: 'f', forms: 'sedmica, -e f.', ex: 'Sedmica ima sedam dana.', exRu: 'В неделе семь дней.', note: 'Однозначно «неделя».' },
        { id: 'sr-vikend', w: 'vikend', ru: 'выходные', pos: 'n', g: 'm', forms: 'vikend, -a m.', ex: 'Šta radiš za vikend?', exRu: 'Что делаешь на выходных?', note: null },
        { id: 'sr-svaki', w: 'svaki', ru: 'каждый', pos: 'pron', g: null, forms: 'svaki, svaka, svako', ex: 'Svaku subotu idem na pijacu.', exRu: 'Каждую субботу хожу на рынок.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u04-l04',
      kind: 'grammar',
      title: 'Pridevi: slaganje',
      goals: ['Согласовывать прилагательное в роде и числе', 'Помнить беглое a в м. р.', 'Ставить прилагательное в аккузатив'],
      skills: ['sr.adj.agree'],
      theory: [
        { type: 'table', caption: 'Прилагательное в номинативе', head: ['', 'м.', 'ж.', 'ср.'], rows: [
          ['ед. ч.', 'nov / nov{{i}}', 'nov{{a}}', 'nov{{o}}'],
          ['мн. ч.', 'nov{{i}}', 'nov{{e}}', 'nov{{a}}'],
          ['ед. ч.', 'dobar', 'dobr{{a}}', 'dobr{{o}}']
        ], note: 'Беглое a: dobar — dobra, lep — lepa (без), ružan — ružna, skup — skupa.' },
        { type: 'p', text: 'В м. р. ед. ч. есть **неопределённая** (nov) и **определённая** (novi) форма — ср. русские краткие и полные. В роли сказуемого обычно неопределённая (*Stan je nov*), в атрибуте и при указании на известный предмет — определённая (*novi stan*). Некоторые прилагательные имеют только форму на -i: mali, ruski.' },
        { type: 'table', caption: 'Аккузатив ед. ч.', head: ['', 'неодуш. м.', 'одуш. м.', 'ж.', 'ср.'], rows: [
          ['', 'nov stan', 'nov{{og}} prijatelja', 'nov{{u}} kuću', 'nov{{o}} selo']
        ] },
        { type: 'contrast', text: 'Окончания почти совпадают с русскими полными (новый — novi, нового — novog, новую — novu). Но сербские краткие формы употребляются шире, чем русские.' },
        { type: 'pitfall', text: 'Ложные друзья: **ružan** — «некрасивый», а не «розовый» (= roze, ružičast); **skup** — «дорогой (по цене)», а не «скупой» (= škrt).' }
      ],
      vocab: [
        { id: 'sr-dobar', w: 'dobar', ru: 'хороший, добрый', pos: 'adj', g: null, forms: 'dobar, dobra, dobro', ex: 'On je dobar čovek.', exRu: 'Он хороший человек.', note: 'Сравн. bolji.' },
        { id: 'sr-loš', w: 'loš', ru: 'плохой', pos: 'adj', g: null, forms: 'loš, loša, loše', ex: 'Vreme je loše.', exRu: 'Погода плохая.', note: 'Ср. р. на -e после мягкого š.' },
        { id: 'sr-velik', w: 'velik', ru: 'большой', pos: 'adj', g: null, forms: 'velik(i), velika, veliko', ex: 'Beograd je veliki grad.', exRu: 'Белград — большой город.', note: 'Сравн. veći.' },
        { id: 'sr-mali', w: 'mali', ru: 'маленький', pos: 'adj', g: null, forms: 'mali, mala, malo', ex: 'Imam mali stan.', exRu: 'У меня маленькая квартира.', note: 'Сравн. manji.' },
        { id: 'sr-nov', w: 'nov', ru: 'новый', pos: 'adj', g: null, forms: 'nov(i), nova, novo', ex: 'Ovo je moj novi telefon.', exRu: 'Это мой новый телефон.', note: null },
        { id: 'sr-star', w: 'star', ru: 'старый', pos: 'adj', g: null, forms: 'star(i), stara, staro', ex: 'Kuća je stara.', exRu: 'Дом старый.', note: 'Koliko si star? — Сколько тебе лет?' },
        { id: 'sr-mlad', w: 'mlad', ru: 'молодой', pos: 'adj', g: null, forms: 'mlad(i), mlada, mlado', ex: 'Ona je mlada.', exRu: 'Она молодая.', note: 'Сравн. mlađi.' },
        { id: 'sr-lep', w: 'lep', ru: 'красивый; хороший', pos: 'adj', g: null, forms: 'lep(i), lepa, lepo', ex: 'Lepo vreme!', exRu: 'Хорошая погода!', note: 'Иекав. lijep.' },
        { id: 'sr-ružan', w: 'ružan', ru: 'некрасивый, уродливый', pos: 'adj', g: null, forms: 'ružan, ružna, ružno', ex: 'Zgrada je ružna.', exRu: 'Здание некрасивое.', note: 'Ложный друг: не «розовый».' },
        { id: 'sr-skup', w: 'skup', ru: 'дорогой (по цене)', pos: 'adj', g: null, forms: 'skup, skupa, skupo', ex: 'Stan je skup.', exRu: 'Квартира дорогая.', note: 'Ложный друг: не «скупой» (= škrt). Сравн. skuplji.' },
        { id: 'sr-jeftin', w: 'jeftin', ru: 'дешёвый', pos: 'adj', g: null, forms: 'jeftin, jeftina, jeftino', ex: 'Hleb je jeftin.', exRu: 'Хлеб дешёвый.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u04-l05',
      kind: 'reading',
      title: 'Naš stan',
      goals: ['Понять описание квартиры и семьи', 'Узнавать притяжательные местоимения'],
      skills: ['sr.pron.poss', 'sr.case.acc', 'sr.adj.agree'],
      theory: [
        { type: 'table', caption: 'Притяжательные местоимения (ном. м./ж./ср.)', head: ['', 'м.', 'ж.', 'ср.'], rows: [
          ['мой', 'moj', 'moja', 'moje'],
          ['твой', 'tvoj', 'tvoja', 'tvoje'],
          ['его', 'njegov', 'njegova', 'njegovo'],
          ['её', 'njen', 'njena', 'njeno'],
          ['наш', 'naš', 'naša', 'naše'],
          ['ваш', 'vaš', 'vaša', 'vaše'],
          ['их', 'njihov', 'njihova', 'njihovo']
        ], note: 'В отличие от русского, «его, её, их» склоняются и согласуются с предметом: njegova sestra, njen brat. Возвратное svoj — как русское «свой».' }
      ],
      vocab: [
        { id: 'sr-moj', w: 'moj', ru: 'мой', pos: 'pron', g: null, forms: 'moj, moja, moje', ex: 'Moj brat je student.', exRu: 'Мой брат — студент.', note: null },
        { id: 'sr-tvoj', w: 'tvoj', ru: 'твой', pos: 'pron', g: null, forms: 'tvoj, tvoja, tvoje', ex: 'Da li je ovo tvoja knjiga?', exRu: 'Это твоя книга?', note: null },
        { id: 'sr-njegov', w: 'njegov', ru: 'его', pos: 'pron', g: null, forms: 'njegov, njegova, njegovo', ex: 'Njegova sestra je lekarka.', exRu: 'Его сестра — врач.', note: 'Согласуется с предметом.' },
        { id: 'sr-njen', w: 'njen', ru: 'её', pos: 'pron', g: null, forms: 'njen, njena, njeno', ex: 'Njen muž je Srbin.', exRu: 'Её муж — серб.', note: 'Вариант: njezin.' },
        { id: 'sr-naš', w: 'naš', ru: 'наш', pos: 'pron', g: null, forms: 'naš, naša, naše', ex: 'Naš stan je mali.', exRu: 'Наша квартира маленькая.', note: null },
        { id: 'sr-vaš', w: 'vaš', ru: 'ваш; Ваш', pos: 'pron', g: null, forms: 'vaš, vaša, vaše', ex: 'Izvolite, Vaša kafa.', exRu: 'Пожалуйста, ваш кофе.', note: null },
        { id: 'sr-njihov', w: 'njihov', ru: 'их', pos: 'pron', g: null, forms: 'njihov, njihova, njihovo', ex: 'Njihova kuća je velika.', exRu: 'Их дом большой.', note: null },
        { id: 'sr-ovaj', w: 'ovaj', ru: 'этот', pos: 'pron', g: null, forms: 'ovaj, ova, ovo', ex: 'Ovaj stan je skup.', exRu: 'Эта квартира дорогая.', note: 'taj, ta, to — тот/этот; onaj, ona, ono — тот (далеко).' }
      ],
      text: {
        title: 'Naš stan',
        lines: [
          { t: 'Ovo je naš stan. Nije velik, ali je lep.', ru: 'Это наша квартира. Она небольшая, но красивая.' },
          { t: 'Stan ima dve sobe, kuhinju i kupatilo.', ru: 'В квартире две комнаты, кухня и ванная.' },
          { t: 'U velikoj sobi su sto, četiri stolice i stari krevet.', ru: 'В большой комнате стол, четыре стула и старая кровать.' },
          { t: 'Ovo je moja porodica: muž Dragan i naša deca, Luka i Mila.', ru: 'Это моя семья: муж Драган и наши дети, Лука и Мила.' },
          { t: 'Luka ima novi telefon, a Mila ima malu mačku.', ru: 'У Луки новый телефон, а у Милы маленькая кошка.' },
          { t: 'Njihova soba je mala, ali ima veliki prozor.', ru: 'Их комната маленькая, но в ней большое окно.' },
          { t: 'Stan nije skup. Volimo naš stan!', ru: 'Квартира недорогая. Мы любим нашу квартиру!' }
        ]
      }
    }
  ]
}
