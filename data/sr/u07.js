export default {
  id: 'sr-u07',
  title: 'Perfekat',
  titleRu: 'Перфект — прошедшее время',
  summary: 'l-причастие и перфект со вспомогательным biti, порядок слов, отрицание и вопрос, распорядок дня, время по часам, месяцы и времена года.',
  lessons: [
    {
      id: 'sr-u07-l01',
      kind: 'grammar',
      title: 'Glagolski pridev radni',
      goals: ['Образовывать l-причастие (čitao, čitala)', 'Знать неправильные причастия (išao, došao, rekao, mogao, jeo)', 'Строить перфект: sam + причастие'],
      skills: ['sr.perf'],
      theory: [
        { type: 'rule', text: 'Перфект = **энклитика biti** (sam, si, je, smo, ste, su) + **l-причастие**, согласованное в роде и числе: *Ja sam čitao* (м.), *Ja sam čitala* (ж.).' },
        { type: 'table', caption: 'l-причастие: основа инфинитива без -ti + окончания', head: ['', 'м.', 'ж.', 'ср.'], rows: [
          ['ед. ч.', 'čita{{o}}', 'čita{{la}}', 'čita{{lo}}'],
          ['мн. ч.', 'čita{{li}}', 'čita{{le}}', 'čita{{la}}']
        ], note: 'В м. р. ед. ч. конечное -l перешло в -o: *čital > čitao (ср. beo — bela, posao — posla).' },
        { type: 'table', caption: 'Перфект: čitati', head: ['', 'м.', 'ж.'], rows: [
          ['ja', 'čitao sam', 'čitala sam'],
          ['ti', 'čitao si', 'čitala si'],
          ['on / ona', 'čitao je', 'čitala je'],
          ['mi', 'čitali smo', 'čitale smo'],
          ['vi', 'čitali ste', 'čitale ste'],
          ['oni / one', 'čitali su', 'čitale su']
        ] },
        { type: 'table', caption: 'Частые неправильные причастия', head: ['Инфинитив', 'м.', 'ж.'], rows: [
          ['ići', 'išao', 'išla'], ['doći', 'došao', 'došla'], ['otići', 'otišao', 'otišla'],
          ['reći', 'rekao', 'rekla'], ['moći', 'mogao', 'mogla'], ['jesti', 'jeo', 'jela'],
          ['hteti', 'hteo', 'htela'], ['videti', 'video', 'videla'], ['biti', 'bio', 'bila'],
          ['stići', 'stigao', 'stigla']
        ], note: 'Глаголы на -eti: -eo/-ela (иекав. -io/-jela: htio, htjela; vidio, vidjela).' },
        { type: 'contrast', text: 'Русское прошедшее «читал» — это то же самое древнее l-причастие, но русский **потерял** связку («азъ есмь читалъ» → «я читал»). Сербский её сохранил: **Čitao sam**, а не «Ja čitao».' },
        { type: 'pitfall', text: 'Не забывайте вспомогательный глагол — самая частая ошибка русскоязычных: *Juče sam bio u gradu* (не «Juče bio u gradu»).' }
      ],
      vocab: [
        { id: 'sr-doći', w: 'doći', ru: 'прийти, приехать', pos: 'v', g: null, forms: 'doći (dođem), svr. / dolaziti (dolazim), nesvr.', ex: 'Došao sam juče.', exRu: 'Я приехал вчера.', note: 'Прич. došao, došla.' },
        { id: 'sr-otići', w: 'otići', ru: 'уйти, уехать', pos: 'v', g: null, forms: 'otići (odem), svr. / odlaziti (odlazim), nesvr.', ex: 'Ana je otišla kući.', exRu: 'Анна ушла домой.', note: 'Прич. otišao, otišla.' },
        { id: 'sr-vratiti-se', w: 'vratiti se', ru: 'вернуться', pos: 'v', g: null, forms: 'vratiti se (vratim se), svr. / vraćati se (vraćam se), nesvr.', ex: 'Kad si se vratio?', exRu: 'Когда ты вернулся?', note: null },
        { id: 'sr-ostati', w: 'ostati', ru: 'остаться', pos: 'v', g: null, forms: 'ostati (ostanem), svr. / ostajati (ostajem), nesvr.', ex: 'Ostali smo kod kuće.', exRu: 'Мы остались дома.', note: null },
        { id: 'sr-stići', w: 'stići', ru: 'прибыть, успеть', pos: 'v', g: null, forms: 'stići (stignem), svr. / stizati (stižem), nesvr.', ex: 'Voz je stigao.', exRu: 'Поезд прибыл.', note: 'Прич. stigao, stigla.' },
        { id: 'sr-zaboraviti', w: 'zaboraviti', ru: 'забыть', pos: 'v', g: null, forms: 'zaboraviti (zaboravim), svr. / zaboravljati (zaboravljam), nesvr.', ex: 'Zaboravio sam ključ.', exRu: 'Я забыл ключ.', note: null },
        { id: 'sr-juče', w: 'juče', ru: 'вчера', pos: 'adv', g: null, forms: '', ex: 'Juče sam radio.', exRu: 'Вчера я работал.', note: 'Хорв. jučer.' },
        { id: 'sr-prekjuče', w: 'prekjuče', ru: 'позавчера', pos: 'adv', g: null, forms: '', ex: 'Prekjuče je padala kiša.', exRu: 'Позавчера шёл дождь.', note: null },
        { id: 'sr-prošli', w: 'prošli', ru: 'прошлый', pos: 'adj', g: null, forms: 'prošli, prošla, prošlo', ex: 'Prošle godine sam bio u Rusiji.', exRu: 'В прошлом году я был в России.', note: 'Г. времени: prošle nedelje, prošlog meseca.' },
        { id: 'sr-već', w: 'već', ru: 'уже', pos: 'adv', g: null, forms: '', ex: 'Već sam jeo.', exRu: 'Я уже поел.', note: null },
        { id: 'sr-ranije', w: 'ranije', ru: 'раньше', pos: 'adv', g: null, forms: '', ex: 'Ranije sam živeo u Nišu.', exRu: 'Раньше я жил в Нише.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u07-l02',
      kind: 'grammar',
      title: 'Perfekat: red reči, negacija, pitanje',
      goals: ['Ставить энклитику на второе место', 'Отрицать (nisam čitao) и спрашивать (Da li si čitao?)', 'Употреблять возвратные глаголы в перфекте'],
      skills: ['sr.perf', 'sr.clitics'],
      theory: [
        { type: 'rule', text: 'Энклитика sam/si/je… стоит **после первого ударного слова (или группы)**: *Ja sam čitao. — Čitao sam. — Juče sam čitao. — Moj brat je čitao.* Начинать с неё нельзя.' },
        { type: 'table', caption: 'Утверждение, отрицание, вопрос', head: ['', 'Пример', 'Перевод'], rows: [
          ['утв.', 'Gledao sam film.', 'Я смотрел фильм.'],
          ['отр.', 'Nisam gledao film.', 'Я не смотрел фильм.'],
          ['вопр. 1', 'Da li si gledao film?', 'Ты смотрел фильм?'],
          ['вопр. 2', 'Jesi li gledao film?', 'Ты смотрел фильм?'],
          ['краткий ответ', 'Jesam. / Nisam.', 'Да. / Нет.']
        ] },
        { type: 'p', text: 'С возвратными глаголами в 3 л. ед. ч. **je** после **se** опускается: *On se vratio* (не «se je»). В остальных лицах порядок: aux + se: *Vratio sam se. Da li si se umio?*' },
        { type: 'examples', items: [
          { t: 'Ustala sam rano i obukla se.', ru: 'Я встала рано и оделась.' },
          { t: 'Jesi li doručkovao?', ru: 'Ты завтракал?' },
          { t: 'Nismo ručali.', ru: 'Мы не обедали.' },
          { t: 'Film je počeo u osam.', ru: 'Фильм начался в восемь.' },
          { t: 'Ona se probudila kasno.', ru: 'Она проснулась поздно.' }
        ] },
        { type: 'contrast', text: '«Вчера я читал» можно сказать в любом порядке; в сербском порядок свободен **только для ударных слов** — энклитика всегда вторая: *Juče sam čitao* / *Čitao sam juče*.' },
        { type: 'pitfall', text: 'nisam — ударная форма, значит, может стоять первой: *Nisam znao.* А вот *Sam znao* — ошибка.' }
      ],
      vocab: [
        { id: 'sr-ustati', w: 'ustati', ru: 'встать', pos: 'v', g: null, forms: 'ustati (ustanem), svr. / ustajati (ustajem), nesvr.', ex: 'Ustao sam u sedam.', exRu: 'Я встал в семь.', note: null },
        { id: 'sr-obući-se', w: 'obući se', ru: 'одеться', pos: 'v', g: null, forms: 'obući se (obučem se), svr. / oblačiti se (oblačim se), nesvr.', ex: 'Obukla sam se brzo.', exRu: 'Я быстро оделась.', note: 'Прич. obukao, obukla.' },
        { id: 'sr-umiti-se', w: 'umiti se', ru: 'умыться', pos: 'v', g: null, forms: 'umiti se (umijem se), svr. / umivati se (umivam se), nesvr.', ex: 'Umio sam se hladnom vodom.', exRu: 'Я умылся холодной водой.', note: null },
        { id: 'sr-probuditi-se', w: 'probuditi se', ru: 'проснуться', pos: 'v', g: null, forms: 'probuditi se (probudim se), svr. / buditi se (budim se), nesvr.', ex: 'Probudio sam se kasno.', exRu: 'Я проснулся поздно.', note: null },
        { id: 'sr-doručkovati', w: 'doručkovati', ru: 'завтракать', pos: 'v', g: null, forms: 'doručkovati (doručkujem), dvovid.', ex: 'Doručkovali smo u kafiću.', exRu: 'Мы позавтракали в кафе.', note: null },
        { id: 'sr-ručati', w: 'ručati', ru: 'обедать', pos: 'v', g: null, forms: 'ručati (ručam), dvovid.', ex: 'Gde ste ručali?', exRu: 'Где вы обедали?', note: null },
        { id: 'sr-večerati', w: 'večerati', ru: 'ужинать', pos: 'v', g: null, forms: 'večerati (večeram), dvovid.', ex: 'Večerali smo kasno.', exRu: 'Мы поужинали поздно.', note: null },
        { id: 'sr-doručak', w: 'doručak', ru: 'завтрак', pos: 'n', g: 'm', forms: 'doručak, doručka m.', ex: 'Šta jedeš za doručak?', exRu: 'Что ты ешь на завтрак?', note: null },
        { id: 'sr-ručak', w: 'ručak', ru: 'обед', pos: 'n', g: 'm', forms: 'ručak, ručka m.', ex: 'Ručak je spreman.', exRu: 'Обед готов.', note: 'Главная трапеза дня (около 14–15 ч).' },
        { id: 'sr-večera', w: 'večera', ru: 'ужин', pos: 'n', g: 'f', forms: 'večera, -e f.', ex: 'Posle večere gledamo film.', exRu: 'После ужина мы смотрим фильм.', note: null },
        { id: 'sr-početi', w: 'početi', ru: 'начать(ся)', pos: 'v', g: null, forms: 'početi (počnem), svr. / počinjati (počinjem), nesvr.', ex: 'Čas je počeo.', exRu: 'Урок начался.', note: 'Прич. počeo, počela.' },
        { id: 'sr-završiti', w: 'završiti', ru: 'закончить', pos: 'v', g: null, forms: 'završiti (završim), svr. / završavati (završavam), nesvr.', ex: 'Završio sam posao.', exRu: 'Я закончил работу.', note: null },
        { id: 'sr-kasniti', w: 'kasniti', ru: 'опаздывать', pos: 'v', g: null, forms: 'kasniti (kasnim), nesvr. / zakasniti (zakasnim), svr.', ex: 'Zakasnio sam na posao.', exRu: 'Я опоздал на работу.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u07-l03',
      kind: 'vocab',
      title: 'Vreme i sat',
      goals: ['Спрашивать и называть время', 'Называть месяцы и времена года', 'Употреблять предлоги времени'],
      skills: ['sr.lex.time', 'sr.num'],
      theory: [
        { type: 'examples', items: [
          { t: 'Koliko je sati?', ru: 'Который час?' },
          { t: 'Sad je jedan sat. / Dva su sata. / Pet je sati.', ru: 'Сейчас час. / Два часа. / Пять часов.', note: 'sat — sata — sati, как «час — часа — часов»' },
          { t: 'Pola tri.', ru: 'Половина третьего (2:30).' },
          { t: 'Deset do pet. / Pet i deset.', ru: 'Без десяти пять. / Пять десять.' },
          { t: 'U koliko sati? — U osam.', ru: 'Во сколько? — В восемь.' }
        ] },
        { type: 'p', text: 'Месяцы — международные, м. р., со строчной: januar, februar, mart, april, maj, jun, jul, avgust, septembar, oktobar, novembar, decembar. «В мае» — **u maju** (L).' },
        { type: 'p', text: 'Времена года и наречия: leto — **leti** (летом), zima — **zimi**, proleće — **u proleće**, jesen — **u jesen**.' },
        { type: 'contrast', text: 'Ложные друзья: **čas** = «урок; мгновение» (час = sat), **godina** = «год» (не «година»). *Imam čas u pet sati.* — У меня урок в пять часов.' },
        { type: 'tip', text: '**pola** + числительное считает к следующему часу, как в русском «пол-третьего»: pola tri = 2:30.' }
      ],
      vocab: [
        { id: 'sr-sat', w: 'sat', ru: 'час; часы', pos: 'n', g: 'm', forms: 'sat, -a m. (мн. sati — часы времени; satovi — часы-прибор)', ex: 'Koliko je sati?', exRu: 'Который час?', note: 'Ложный друг čas: час = sat.' },
        { id: 'sr-minut', w: 'minut', ru: 'минута', pos: 'n', g: 'm', forms: 'minut, -a m. (и minuta, -e f.)', ex: 'Čekam pet minuta.', exRu: 'Жду пять минут.', note: null },
        { id: 'sr-pola', w: 'pola', ru: 'половина, пол-', pos: 'num', g: null, forms: '', ex: 'Pola tri.', exRu: 'Половина третьего.', note: null },
        { id: 'sr-podne', w: 'podne', ru: 'полдень', pos: 'n', g: 'n', forms: 'podne, podneva n.', ex: 'Vidimo se u podne.', exRu: 'Увидимся в полдень.', note: 'popodne — после полудня.' },
        { id: 'sr-ponoć', w: 'ponoć', ru: 'полночь', pos: 'n', g: 'f', forms: 'ponoć, ponoći f.', ex: 'Legao sam u ponoć.', exRu: 'Я лёг в полночь.', note: null },
        { id: 'sr-jutro', w: 'jutro', ru: 'утро', pos: 'n', g: 'n', forms: 'jutro, -a n.', ex: 'Lepo jutro!', exRu: 'Прекрасное утро!', note: 'Не ложный друг; ловушка — sutra «завтра».' },
        { id: 'sr-mesec', w: 'mesec', ru: 'месяц; луна', pos: 'n', g: 'm', forms: 'mesec, -a m. (Г. мн. meseci)', ex: 'Godina ima dvanaest meseci.', exRu: 'В году двенадцать месяцев.', note: 'Иекав. mjesec.' },
        { id: 'sr-godina', w: 'godina', ru: 'год', pos: 'n', g: 'f', forms: 'godina, -e f.', ex: 'Koliko imaš godina?', exRu: 'Сколько тебе лет?', note: 'Ложный друг: не «година».' },
        { id: 'sr-zima', w: 'zima', ru: 'зима', pos: 'n', g: 'f', forms: 'zima, -e f.', ex: 'Zimi pada sneg.', exRu: 'Зимой идёт снег.', note: 'zimi — зимой.' },
        { id: 'sr-proleće', w: 'proleće', ru: 'весна', pos: 'n', g: 'n', forms: 'proleće, -a n.', ex: 'U proleće je lepo.', exRu: 'Весной красиво.', note: 'Иекав. proljeće. Ср. р.' },
        { id: 'sr-jesen', w: 'jesen', ru: 'осень', pos: 'n', g: 'f', forms: 'jesen, jeseni f.', ex: 'U jesen počinje škola.', exRu: 'Осенью начинается школа.', note: null },
        { id: 'sr-čas', w: 'čas', ru: 'урок; мгновение', pos: 'n', g: 'm', forms: 'čas, -a m. (мн. časovi)', ex: 'Imam čas srpskog.', exRu: 'У меня урок сербского.', note: 'Ложный друг: не «час» (= sat). Za čas — в одно мгновение.' }
      ],
      text: null
    },
    {
      id: 'sr-u07-l04',
      kind: 'reading',
      title: 'Jučerašnji dan',
      goals: ['Понять рассказ в перфекте', 'Отслеживать согласование причастия по роду'],
      skills: ['sr.perf', 'sr.clitics', 'sr.lex.time'],
      theory: [
        { type: 'tip', text: 'Рассказчица — женщина: все причастия в ж. р. (ustala sam, otišla sam). Найдите в тексте каждую энклитику и проверьте, что она стоит второй.' }
      ],
      vocab: [
        { id: 'sr-desiti-se', w: 'desiti se', ru: 'случиться', pos: 'v', g: null, forms: 'desiti se (desi se), svr. / dešavati se (dešava se), nesvr.', ex: 'Šta se desilo?', exRu: 'Что случилось?', note: null },
        { id: 'sr-zanimljiv', w: 'zanimljiv', ru: 'интересный', pos: 'adj', g: null, forms: 'zanimljiv, zanimljiva, zanimljivo', ex: 'Film je bio zanimljiv.', exRu: 'Фильм был интересный.', note: null },
        { id: 'sr-dosadan', w: 'dosadan', ru: 'скучный; надоедливый', pos: 'adj', g: null, forms: 'dosadan, dosadna, dosadno', ex: 'Čas je bio dosadan.', exRu: 'Урок был скучный.', note: null },
        { id: 'sr-nešto', w: 'nešto', ru: 'что-то, что-нибудь', pos: 'pron', g: null, forms: '', ex: 'Hoćeš li nešto da popiješ?', exRu: 'Хочешь что-нибудь выпить?', note: null },
        { id: 'sr-ništa', w: 'ništa', ru: 'ничего', pos: 'pron', g: null, forms: '', ex: 'Ništa nisam jela.', exRu: 'Я ничего не ела.', note: 'Двойное отрицание.' },
        { id: 'sr-prvo', w: 'prvo', ru: 'сначала', pos: 'adv', g: null, forms: '', ex: 'Prvo sam popila kafu.', exRu: 'Сначала я выпила кофе.', note: null },
        { id: 'sr-kraj', w: 'kraj', ru: 'конец; край, район', pos: 'n', g: 'm', forms: 'kraj, -a m. (мн. krajevi)', ex: 'Na kraju smo otišli kući.', exRu: 'В конце концов мы пошли домой.', note: 'na kraju — в конце.' },
        { id: 'sr-ceo', w: 'ceo', ru: 'целый, весь', pos: 'adj', g: null, forms: 'ceo, cela, celo', ex: 'Ceo dan sam radila.', exRu: 'Весь день я работала.', note: 'Иекав. cio / cijeli, cijela.' }
      ],
      text: {
        title: 'Jučerašnji dan',
        lines: [
          { t: 'Juče sam se probudila u sedam sati.', ru: 'Вчера я проснулась в семь часов.' },
          { t: 'Prvo sam popila kafu, a onda sam se obukla i otišla na posao.', ru: 'Сначала я выпила кофе, потом оделась и пошла на работу.' },
          { t: 'Autobus je kasnio, pa sam zakasnila deset minuta.', ru: 'Автобус опаздывал, поэтому я опоздала на десять минут.' },
          { t: 'Ceo dan sam radila i ništa nisam jela.', ru: 'Весь день я работала и ничего не ела.' },
          { t: 'Posle posla sam sela sa drugaricom u kafić.', ru: 'После работы я посидела с подругой в кафе.' },
          { t: 'Ona mi je rekla nešto zanimljivo: udaje se u maju!', ru: 'Она сказала мне кое-что интересное: она выходит замуж в мае!' },
          { t: 'Vratila sam se kući u devet i večerala.', ru: 'Я вернулась домой в девять и поужинала.' },
          { t: 'Na kraju sam legla u ponoć. Bio je to dug dan.', ru: 'В конце концов я легла в полночь. Это был длинный день.' }
        ]
      }
    }
  ]
}
