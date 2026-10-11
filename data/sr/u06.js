export default {
  id: 'sr-u06',
  title: 'Dativ, instrumental, vokativ',
  titleRu: 'Датив, инструментал, вокатив',
  summary: 'Адресат и состояние (датив), совместность и средство (инструментал), обращение (вокатив), сводная таблица семи падежей; транспорт, подарки, письмо другу.',
  lessons: [
    {
      id: 'sr-u06-l01',
      kind: 'grammar',
      title: 'Dativ',
      goals: ['Образовывать датив (= локатив по форме)', 'Выражать адресата и состояние (Hladno mi je)', 'Знать дат. формы местоимений'],
      skills: ['sr.case.dat'],
      theory: [
        { type: 'rule', text: 'Формы датива **совпадают с локативом**: м./ср. -u, ж. -i, мн. ч. -ima / -ama. Отличие — в функции: датив употребляется без предлога (кому?) или с **k/ka, prema**.' },
        { type: 'table', caption: 'Датив', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['м.', 'brat{{u}}', 'brać{{i}} (собир.); student{{ima}}'],
          ['ж.', 'sestr{{i}}, majc{{i}}', 'sestr{{ama}}'],
          ['ср.', 'detet{{u}}', 'dec{{i}} (собир.)']
        ] },
        { type: 'table', caption: 'Личные местоимения в дативе', head: ['', 'полная', 'энклитика'], rows: [
          ['ja', 'meni', 'mi'], ['ti', 'tebi', 'ti'], ['on/ono', 'njemu', 'mu'], ['ona', 'njoj', 'joj'],
          ['mi', 'nama', 'nam'], ['vi', 'vama', 'vam'], ['oni', 'njima', 'im']
        ] },
        { type: 'examples', items: [
          { t: 'Dajem knjigu bratu.', ru: 'Я даю книгу брату.' },
          { t: 'Hladno mi je.', ru: 'Мне холодно.' },
          { t: 'Treba mi pomoć.', ru: 'Мне нужна помощь.' },
          { t: 'Sviđa mi se Beograd.', ru: 'Мне нравится Белград.' },
          { t: 'Idemo ka centru.', ru: 'Мы идём к центру.' },
          { t: 'Žao mi je.', ru: 'Мне жаль.' }
        ] },
        { type: 'contrast', text: 'Дательный состояния — как в русском: «мне холодно, скучно, жаль». Но «к кому-то (домой, на приём)» — обычно **kod** + Г.: *Idem kod lekara*; ka + Д. — направление в пространстве: *ka centru, ka moru*.' },
        { type: 'pitfall', text: 'Энклитика mi/ti/mu стоит на втором месте: *Sviđa mi se* (не «Mi sviđa se»). Полная форма — для контраста: *Meni se sviđa, a tebi?*' }
      ],
      vocab: [
        { id: 'sr-pomagati', w: 'pomagati', ru: 'помогать', pos: 'v', g: null, forms: 'pomagati (pomažem), nesvr. / pomoći (pomognem), svr.', ex: 'Pomažem mami.', exRu: 'Я помогаю маме.', note: 'С дативом, как в русском.' },
        { id: 'sr-verovati', w: 'verovati', ru: 'верить', pos: 'v', g: null, forms: 'verovati (verujem), nesvr.', ex: 'Verujem ti.', exRu: 'Я тебе верю.', note: 'Иекав. vjerovati.' },
        { id: 'sr-sviđati-se', w: 'sviđati se', ru: 'нравиться', pos: 'v', g: null, forms: 'sviđati se (sviđa mi se), nesvr. / svideti se, svr.', ex: 'Sviđa mi se ova pesma.', exRu: 'Мне нравится эта песня.', note: 'Иекав. svidjeti se.' },
        { id: 'sr-poklanjati', w: 'poklanjati', ru: 'дарить', pos: 'v', g: null, forms: 'poklanjati (poklanjam), nesvr. / pokloniti (poklonim), svr.', ex: 'Šta poklanjaš sestri?', exRu: 'Что ты даришь сестре?', note: null },
        { id: 'sr-poklon', w: 'poklon', ru: 'подарок', pos: 'n', g: 'm', forms: 'poklon, -a m. (мн. pokloni)', ex: 'Ovo je poklon za tebe.', exRu: 'Это подарок для тебя.', note: null },
        { id: 'sr-slati', w: 'slati', ru: 'посылать, отправлять', pos: 'v', g: null, forms: 'slati (šaljem), nesvr. / poslati (pošaljem), svr.', ex: 'Šaljem ti poruku.', exRu: 'Посылаю тебе сообщение.', note: null },
        { id: 'sr-javljati-se', w: 'javljati se', ru: 'давать о себе знать, звонить', pos: 'v', g: null, forms: 'javljati se (javljam se), nesvr. / javiti se (javim se), svr.', ex: 'Javi mi se sutra!', exRu: 'Позвони (напиши) мне завтра!', note: null },
        { id: 'sr-hladno', w: 'hladno', ru: 'холодно', pos: 'adv', g: null, forms: '(hladan, hladna, hladno)', ex: 'Hladno mi je.', exRu: 'Мне холодно.', note: null },
        { id: 'sr-toplo', w: 'toplo', ru: 'тепло', pos: 'adv', g: null, forms: '(topao, topla, toplo)', ex: 'Danas je toplo.', exRu: 'Сегодня тепло.', note: 'М. р. topao — -l > -o.' },
        { id: 'sr-dosadno', w: 'dosadno', ru: 'скучно', pos: 'adv', g: null, forms: '(dosadan, dosadna, dosadno)', ex: 'Dosadno mi je.', exRu: 'Мне скучно.', note: null },
        { id: 'sr-žao-mi-je', w: 'žao mi je', ru: 'мне жаль', pos: 'phr', g: null, forms: '', ex: 'Žao mi je, ne mogu.', exRu: 'Извини, не могу.', note: 'Также как извинение.' },
        { id: 'sr-ka', w: 'ka', ru: 'к, по направлению к', pos: 'prep', g: null, forms: 'k / ka; + Д.', ex: 'Idem ka stanici.', exRu: 'Я иду к остановке.', note: null },
        { id: 'sr-prema', w: 'prema', ru: 'к, по отношению к; по направлению к', pos: 'prep', g: null, forms: '+ Д.', ex: 'Dobar je prema deci.', exRu: 'Он добр к детям.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u06-l02',
      kind: 'grammar',
      title: 'Instrumental',
      goals: ['Образовывать инструментал', 'Выражать совместность (sa) и средство (без предлога)', 'Употреблять pod, nad, pred, za, među'],
      skills: ['sr.case.ins'],
      theory: [
        { type: 'table', caption: 'Инструментал', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['м.', 'grad{{om}}', 'grad{{ovima}}'],
          ['м. после мягких', 'prijatelj{{em}}, muž{{em}}', 'prijatelj{{ima}}'],
          ['ж. на -a', 'žen{{om}}', 'žen{{ama}}'],
          ['ж. на согласный', 'stvar{{i}} / ljubav{{lju}}', 'stvar{{ima}}'],
          ['ср.', 'sel{{om}}, mor{{em}}', 'sel{{ima}}']
        ], note: 'После мягких согласных -om → -em (как в русском «мужем»). У ж. р. на согласный — -i или -ju с йотацией: so → solju, ljubav → ljubavlju.' },
        { type: 'rule', text: '**s/sa** + И. — «с кем/чем»: *kafa sa mlekom*. **Без предлога** — средство: *pišem olovkom, idem autobusom*. Места: **pod, nad, pred, za, među** + И. (где?).' },
        { type: 'table', caption: 'Местоимения в инструментале', head: ['', 'форма'], rows: [
          ['ja', 'sa mnom'], ['ti', 's tobom'], ['on', 's njim'], ['ona', 's njom'], ['mi', 's nama'], ['vi', 's vama'], ['oni', 's njima']
        ] },
        { type: 'examples', items: [
          { t: 'Idem u bioskop sa prijateljem.', ru: 'Я иду в кино с другом.' },
          { t: 'Putujem vozom.', ru: 'Я еду поездом.' },
          { t: 'Pišem olovkom.', ru: 'Я пишу карандашом.' },
          { t: 'Mačka je pod stolom.', ru: 'Кошка под столом.' },
          { t: 'Hoćeš li sa mnom?', ru: 'Пойдёшь со мной?' }
        ] },
        { type: 'contrast', text: 'Почти как в русском: «с другом», «пишу ручкой», «под столом». Транспорт — тоже инструментал: *vozom, autobusom* («поездом»). Ложный друг: **voz** = «поезд».' },
        { type: 'pitfall', text: 'Средство без предлога: *jedem viljuškom* (ем вилкой), а не «sa viljuškom» — в разговорной речи встречается, но в норме это ошибка.' }
      ],
      vocab: [
        { id: 'sr-voz', w: 'voz', ru: 'поезд', pos: 'n', g: 'm', forms: 'voz, -a m. (мн. vozovi)', ex: 'Putujem vozom.', exRu: 'Я еду поездом.', note: 'Ложный друг: не «воз». Хорв. vlak.' },
        { id: 'sr-autobus', w: 'autobus', ru: 'автобус', pos: 'n', g: 'm', forms: 'autobus, -a m. (мн. autobusi)', ex: 'Idem autobusom.', exRu: 'Я еду на автобусе.', note: null },
        { id: 'sr-tramvaj', w: 'tramvaj', ru: 'трамвай', pos: 'n', g: 'm', forms: 'tramvaj, -a m. (мн. tramvaji)', ex: 'Tramvaj kasni.', exRu: 'Трамвай опаздывает.', note: 'И. tramvajem.' },
        { id: 'sr-taksi', w: 'taksi', ru: 'такси', pos: 'n', g: 'm', forms: 'taksi, -ja m.', ex: 'Idemo taksijem.', exRu: 'Поедем на такси.', note: 'Склоняется: taksija, taksijem.' },
        { id: 'sr-avion', w: 'avion', ru: 'самолёт', pos: 'n', g: 'm', forms: 'avion, -a m.', ex: 'Letim avionom.', exRu: 'Я лечу самолётом.', note: null },
        { id: 'sr-bicikl', w: 'bicikl', ru: 'велосипед', pos: 'n', g: 'm', forms: 'bicikl, -a m. (мн. bicikli)', ex: 'Vozim bicikl.', exRu: 'Я катаюсь на велосипеде.', note: null },
        { id: 'sr-kola', w: 'kola', ru: 'машина, автомобиль', pos: 'n', g: 'n', forms: 'kola, kola n. мн.', ex: 'Naša kola su nova.', exRu: 'Наша машина новая.', note: 'Только мн. ч. Синоним: auto (м.).' },
        { id: 'sr-peške', w: 'peške', ru: 'пешком', pos: 'adv', g: null, forms: 'peške / pešice', ex: 'Idem peške.', exRu: 'Я иду пешком.', note: 'Иекав. pješke.' },
        { id: 'sr-olovka', w: 'olovka', ru: 'карандаш; ручка', pos: 'n', g: 'f', forms: 'olovka, -e f. (дат. olovci)', ex: 'Imaš li olovku?', exRu: 'У тебя есть ручка?', note: 'hemijska olovka — шариковая ручка.' },
        { id: 'sr-nož', w: 'nož', ru: 'нож', pos: 'n', g: 'm', forms: 'nož, -a m. (мн. noževi)', ex: 'Sečem hleb nožem.', exRu: 'Я режу хлеб ножом.', note: null },
        { id: 'sr-viljuška', w: 'viljuška', ru: 'вилка', pos: 'n', g: 'f', forms: 'viljuška, -e f. (дат. viljušci)', ex: 'Jedem viljuškom.', exRu: 'Я ем вилкой.', note: 'Хорв. vilica.' },
        { id: 'sr-kašika', w: 'kašika', ru: 'ложка', pos: 'n', g: 'f', forms: 'kašika, -e f. (дат. kašici)', ex: 'Treba mi kašika.', exRu: 'Мне нужна ложка.', note: 'Хорв. žlica.' }
      ],
      text: null
    },
    {
      id: 'sr-u06-l03',
      kind: 'grammar',
      title: 'Vokativ',
      goals: ['Образовывать вокатив м. и ж. р.', 'Обращаться вежливо: gospodine, gospođo', 'Знать исключения (Ana!, Milice!)'],
      skills: ['sr.case.voc'],
      theory: [
        { type: 'table', caption: 'Вокатив ед. ч.', head: ['Тип', 'N', 'V'], rows: [
          ['м. (основной)', 'brat, gospodin, Petar', 'brat{{e}}, gospodin{{e}}, Petr{{e}}'],
          ['м. на k, g, h', 'drug, čovek, Bog', 'dru{{že}}, čove{{če}}, Bo{{že}}'],
          ['м. на мягкий согласный', 'prijatelj, muž, učitelj', 'prijatelj{{u}}, muž{{u}}, učitelj{{u}}'],
          ['ж. на -a', 'žena, majka, sestra', 'žen{{o}}, majk{{o}}, sestr{{o}}'],
          ['ж. на -ica', 'Milica, učiteljica', 'Milic{{e}}, učiteljic{{e}}'],
          ['ср.', 'dete', 'dete (= N)']
        ], note: 'Мн. ч. вокатива = номинатив: Dragi prijatelji! Dame i gospodo!' },
        { type: 'rule', text: 'Двусложные женские имена на -a обычно не меняются: **Ana! Maja! Vesna!** Мужские имена на -o/-e тоже: **Marko! Đorđe!** Ласкательные mama, tata, baka — чаще без изменения.' },
        { type: 'contrast', text: 'Русский утратил вокатив (остатки: «Боже», «Господи», «отче»; разговорное «мам!», «Тань!»). В сербском обращение **обязательно** в вокативе: *Dobar dan, gospodine Petroviću!* Палатализация k/g/h → č/ž/š — как в «Боже» < Бог, «человече».' },
        { type: 'examples', items: [
          { t: 'Izvinite, gospođo!', ru: 'Извините, госпожа!' },
          { t: 'Druže, kako si?', ru: 'Дружище, как ты?' },
          { t: 'Hvala, doktore.', ru: 'Спасибо, доктор.' },
          { t: 'Bože moj!', ru: 'Боже мой!' }
        ] },
        { type: 'pitfall', text: 'В обращении «господин + фамилия» в вокативе стоят оба слова: *gospodine Jovanoviću* (фамилии на -ić → -iću).' }
      ],
      vocab: [
        { id: 'sr-gospodin', w: 'gospodin', ru: 'господин', pos: 'n', g: 'm', forms: 'gospodin, -a m. (вок. gospodine; мн. gospoda)', ex: 'Dobar dan, gospodine!', exRu: 'Добрый день, господин!', note: 'Мн. gospoda — собир.: Dame i gospodo!' },
        { id: 'sr-gospođa', w: 'gospođa', ru: 'госпожа', pos: 'n', g: 'f', forms: 'gospođa, -e f. (вок. gospođo)', ex: 'Izvolite, gospođo.', exRu: 'Пожалуйста, госпожа.', note: null },
        { id: 'sr-gospođica', w: 'gospođica', ru: 'девушка (обращение), барышня', pos: 'n', g: 'f', forms: 'gospođica, -e f. (вок. gospođice)', ex: 'Gospođice, račun, molim!', exRu: 'Девушка, счёт, пожалуйста!', note: null },
        { id: 'sr-drug', w: 'drug', ru: 'товарищ, друг', pos: 'n', g: 'm', forms: 'drug, -a m. (вок. druže; мн. drugovi)', ex: 'Ovo je moj drug iz škole.', exRu: 'Это мой школьный товарищ.', note: 'Близкий друг — prijatelj.' },
        { id: 'sr-drugarica', w: 'drugarica', ru: 'подруга, товарищ (ж.)', pos: 'n', g: 'f', forms: 'drugarica, -e f. (вок. drugarice)', ex: 'Ona je moja drugarica.', exRu: 'Она моя подруга.', note: null },
        { id: 'sr-komšija', w: 'komšija', ru: 'сосед', pos: 'n', g: 'm', forms: 'komšija, -e m. (ж. komšinica)', ex: 'Naš komšija je fin čovek.', exRu: 'Наш сосед — приятный человек.', note: 'М. р. на -a. Книжн. sused (иекав. susjed).' },
        { id: 'sr-drag', w: 'drag', ru: 'милый, дорогой (о человеке)', pos: 'adj', g: null, forms: 'drag(i), draga, drago', ex: 'Draga Ana!', exRu: 'Дорогая Анна!', note: '«Дорогой» по цене — skup.' },
        { id: 'sr-kolega', w: 'kolega', ru: 'коллега', pos: 'n', g: 'm', forms: 'kolega, -e m. (ж. koleginica)', ex: 'Moj kolega je Rus.', exRu: 'Мой коллега — русский.', note: 'М. р. на -a; вок. kolega.' },
        { id: 'sr-učitelj', w: 'učitelj', ru: 'учитель', pos: 'n', g: 'm', forms: 'učitelj, -a m. (вок. učitelju)', ex: 'Hvala, učitelju!', exRu: 'Спасибо, учитель!', note: 'Учитель начальных классов.' },
        { id: 'sr-učiteljica', w: 'učiteljica', ru: 'учительница', pos: 'n', g: 'f', forms: 'učiteljica, -e f. (вок. učiteljice)', ex: 'Učiteljice, imam pitanje.', exRu: 'Учительница, у меня вопрос.', note: null },
        { id: 'sr-doktor', w: 'doktor', ru: 'доктор, врач', pos: 'n', g: 'm', forms: 'doktor, -a m. (вок. doktore)', ex: 'Doktore, boli me glava.', exRu: 'Доктор, у меня болит голова.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u06-l04',
      kind: 'reading',
      title: 'Pismo prijatelju',
      goals: ['Понять письмо с обращениями', 'Повторить все семь падежей по сводной таблице'],
      skills: ['sr.case.dat', 'sr.case.ins', 'sr.case.voc', 'sr.case.gen', 'sr.case.loc', 'sr.case.acc'],
      theory: [
        { type: 'table', caption: 'Семь падежей: сводная таблица', head: ['Падеж', 'м. ед.', 'ж. ед.', 'ср. ед.', 'м. мн.', 'ж. мн.', 'ср. мн.'], rows: [
          ['N', 'grad', 'žena', 'selo', 'gradovi', 'žene', 'sela'],
          ['G', 'grada', 'žene', 'sela', 'gradova', 'žena', 'sela'],
          ['D', 'gradu', 'ženi', 'selu', 'gradovima', 'ženama', 'selima'],
          ['A', 'grad / brata', 'ženu', 'selo', 'gradove', 'žene', 'sela'],
          ['V', 'grade', 'ženo', 'selo', 'gradovi', 'žene', 'sela'],
          ['I', 'gradom', 'ženom', 'selom', 'gradovima', 'ženama', 'selima'],
          ['L', 'gradu', 'ženi', 'selu', 'gradovima', 'ženama', 'selima']
        ], note: 'Во мн. ч. D = I = L. В ед. ч. D = L.' }
      ],
      vocab: [
        { id: 'sr-pozdrav', w: 'pozdrav', ru: 'привет, приветствие', pos: 'n', g: 'm', forms: 'pozdrav, -a m. (мн. pozdravi)', ex: 'Puno pozdrava iz Beograda!', exRu: 'Большой привет из Белграда!', note: 'Концовка письма: Pozdrav, Marko.' },
        { id: 'sr-poljubac', w: 'poljubac', ru: 'поцелуй', pos: 'n', g: 'm', forms: 'poljubac, poljupca m.', ex: 'Veliki poljubac!', exRu: 'Целую!', note: 'Беглое a и b → p: poljupca.' },
        { id: 'sr-pozdravljati', w: 'pozdravljati', ru: 'приветствовать, передавать привет', pos: 'v', g: null, forms: 'pozdravljati (pozdravljam), nesvr. / pozdraviti (pozdravim), svr.', ex: 'Pozdravi mamu!', exRu: 'Передай привет маме!', note: null },
        { id: 'sr-uskoro', w: 'uskoro', ru: 'скоро', pos: 'adv', g: null, forms: '', ex: 'Vidimo se uskoro!', exRu: 'Скоро увидимся!', note: null },
        { id: 'sr-jedva-čekam', w: 'jedva čekam', ru: 'не могу дождаться', pos: 'phr', g: null, forms: '', ex: 'Jedva čekam leto!', exRu: 'Жду не дождусь лета!', note: 'Букв. «едва жду».' },
        { id: 'sr-leto', w: 'leto', ru: 'лето', pos: 'n', g: 'n', forms: 'leto, -a n.', ex: 'Leto je toplo.', exRu: 'Лето тёплое.', note: 'Иекав. ljeto. Летом — leti.' },
        { id: 'sr-more', w: 'more', ru: 'море', pos: 'n', g: 'n', forms: 'more, -a n. (мн. mora)', ex: 'Idemo na more.', exRu: 'Едем на море.', note: 'na moru — на море (где).' },
        { id: 'sr-odmor', w: 'odmor', ru: 'отдых; отпуск', pos: 'n', g: 'm', forms: 'odmor, -a m.', ex: 'Treba mi odmor.', exRu: 'Мне нужен отдых.', note: 'Na odmoru sam — Я в отпуске.' },
        { id: 'sr-zajedno', w: 'zajedno', ru: 'вместе', pos: 'adv', g: null, forms: '', ex: 'Idemo zajedno!', exRu: 'Пойдём вместе!', note: null }
      ],
      text: {
        title: 'Pismo prijatelju',
        lines: [
          { t: 'Dragi Ivane,', ru: 'Дорогой Иван,' },
          { t: 'pišem ti iz Beograda. Ovde mi je lepo, ali malo dosadno bez tebe.', ru: 'пишу тебе из Белграда. Мне здесь хорошо, но немного скучно без тебя.' },
          { t: 'Živim u malom stanu sa jednom studentkinjom iz Novog Sada.', ru: 'Я живу в маленькой квартире с одной студенткой из Нового Сада.' },
          { t: 'Na fakultet idem tramvajem, a u centar peške.', ru: 'На факультет езжу на трамвае, а в центр хожу пешком.' },
          { t: 'Juče sam dala poklon našoj profesorki — knjigu o Rusiji.', ru: 'Вчера я подарила нашей преподавательнице подарок — книгу о России.' },
          { t: 'Leti idemo zajedno na more, zar ne? Jedva čekam odmor!', ru: 'Летом едем вместе на море, правда? Жду не дождусь отпуска!' },
          { t: 'Pozdravi mamu i tatu. Javi mi se uskoro!', ru: 'Передай привет маме и папе. Напиши мне скорее!' },
          { t: 'Veliki pozdrav i poljubac, tvoja Maša', ru: 'Большой привет и целую, твоя Маша' }
        ]
      }
    }
  ]
}
