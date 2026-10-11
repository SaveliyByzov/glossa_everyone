export default {
  id: 'sr-u08',
  title: 'Glagolski vid i futur',
  titleRu: 'Вид глагола и будущее время',
  summary: 'Видовые пары и способы их образования, главное расхождение с русским — презенс совершенного вида не выражает будущее; футур I (radiću, ići ću), сов. презенс и футур II после kad/ako; погода и планы на лето.',
  lessons: [
    {
      id: 'sr-u08-l01',
      kind: 'grammar',
      title: 'Glagolski vid',
      goals: ['Узнавать видовые пары', 'Знать способы образования (префикс, суффикс, супплетивизм)', 'Понимать, где сербский вид расходится с русским'],
      skills: ['sr.aspect'],
      theory: [
        { type: 'p', text: 'Как и в русском, глаголы бывают **несвршени** (nesvr., процесс, повторение) и **свршени** (svr., результат, однократное завершённое действие).' },
        { type: 'table', caption: 'Способы образования пар', head: ['Способ', 'nesvr.', 'svr.'], rows: [
          ['приставка', 'pisati, čitati, piti', '{{na}}pisati, {{pro}}čitati, {{po}}piti'],
          ['суффикс', 'kup{{ova}}ti, da{{va}}ti, otv{{ara}}ti', 'kupiti, dati, otvoriti'],
          ['чередование основы', 'uzimati, nalaziti', 'uzeti, naći'],
          ['супплетивизм', 'govoriti', 'reći']
        ] },
        { type: 'rule', text: 'Главное отличие: **презенс сов. вида в сербском не означает будущее**. «Прочитаю» = **pročitaću** (футур). Форма *pročitam* употребляется только в придаточных и после da: *Kad pročitam knjigu…*, *Hoću da pročitam…*' },
        { type: 'examples', items: [
          { t: 'Čitam knjigu.', ru: 'Я читаю книгу.' },
          { t: 'Pročitao sam knjigu.', ru: 'Я прочитал книгу.' },
          { t: 'Pročitaću knjigu sutra.', ru: 'Я прочитаю книгу завтра.' },
          { t: 'Hoću da pročitam ovu knjigu.', ru: 'Я хочу прочитать эту книгу.' }
        ] },
        { type: 'contrast', text: 'Двувидовых глаголов больше, чем в русском: **videti, čuti, ručati, doručkovati, razumeti**, все на -irati (studirati, organizovati — двувидовые). Ложный друг: **pokušati** — «попытаться, попробовать», а не «покушать».' },
        { type: 'pitfall', text: 'Не говорите *Sutra kupim hleb* в значении «завтра куплю». Правильно: **Sutra ću kupiti hleb** / **Kupiću hleb sutra**.' }
      ],
      vocab: [
        { id: 'sr-otvoriti', w: 'otvoriti', ru: 'открыть', pos: 'v', g: null, forms: 'otvoriti (otvorim), svr. / otvarati (otvaram), nesvr.', ex: 'Otvori prozor, molim te.', exRu: 'Открой окно, пожалуйста.', note: null },
        { id: 'sr-zatvoriti', w: 'zatvoriti', ru: 'закрыть', pos: 'v', g: null, forms: 'zatvoriti (zatvorim), svr. / zatvarati (zatvaram), nesvr.', ex: 'Prodavnica zatvara u osam.', exRu: 'Магазин закрывается в восемь.', note: null },
        { id: 'sr-uzeti', w: 'uzeti', ru: 'взять', pos: 'v', g: null, forms: 'uzeti (uzmem), svr. / uzimati (uzimam), nesvr.', ex: 'Uzmi kišobran!', exRu: 'Возьми зонт!', note: 'Прич. uzeo, uzela.' },
        { id: 'sr-naći', w: 'naći', ru: 'найти', pos: 'v', g: null, forms: 'naći (nađem), svr. / nalaziti (nalazim), nesvr.', ex: 'Našao sam ključ!', exRu: 'Я нашёл ключ!', note: 'Прич. našao, našla. nalaziti se — находиться.' },
        { id: 'sr-tražiti', w: 'tražiti', ru: 'искать; просить, требовать', pos: 'v', g: null, forms: 'tražiti (tražim), nesvr.', ex: 'Tražim posao.', exRu: 'Я ищу работу.', note: null },
        { id: 'sr-pokušati', w: 'pokušati', ru: 'попытаться, попробовать', pos: 'v', g: null, forms: 'pokušati (pokušam), svr. / pokušavati (pokušavam), nesvr.', ex: 'Pokušaću da dođem.', exRu: 'Попробую прийти.', note: 'Ложный друг: не «покушать».' },
        { id: 'sr-probati', w: 'probati', ru: 'пробовать; примерять', pos: 'v', g: null, forms: 'probati (probam), dvovid.', ex: 'Probaj ovu tortu!', exRu: 'Попробуй этот торт!', note: null },
        { id: 'sr-odlučiti', w: 'odlučiti', ru: 'решить', pos: 'v', g: null, forms: 'odlučiti (odlučim), svr. / odlučivati (odlučujem), nesvr.', ex: 'Odlučila sam da učim srpski.', exRu: 'Я решила учить сербский.', note: null },
        { id: 'sr-promeniti', w: 'promeniti', ru: 'изменить, поменять', pos: 'v', g: null, forms: 'promeniti (promenim), svr. / menjati (menjam), nesvr.', ex: 'Promenio sam stan.', exRu: 'Я сменил квартиру.', note: 'Иекав. promijeniti / mijenjati.' },
        { id: 'sr-spremiti', w: 'spremiti', ru: 'приготовить; прибрать', pos: 'v', g: null, forms: 'spremiti (spremim), svr. / spremati (spremam), nesvr.', ex: 'Spremila sam ručak.', exRu: 'Я приготовила обед.', note: 'spreman — готовый.' },
        { id: 'sr-sesti', w: 'sesti', ru: 'сесть', pos: 'v', g: null, forms: 'sesti (sednem), svr. / sedati (sedam), nesvr.', ex: 'Sednite, molim Vas.', exRu: 'Садитесь, пожалуйста.', note: 'Прич. seo, sela. Иекав. sjesti (sjednem).' },
        { id: 'sr-staviti', w: 'staviti', ru: 'положить, поставить', pos: 'v', g: null, forms: 'staviti (stavim), svr. / stavljati (stavljam), nesvr.', ex: 'Stavi knjigu na sto.', exRu: 'Положи книгу на стол.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u08-l02',
      kind: 'grammar',
      title: 'Futur I',
      goals: ['Образовывать футур I обоих видов', 'Писать radiću слитно, ići ću раздельно', 'Строить вопрос и отрицание (Hoćeš li…? Neću…)'],
      skills: ['sr.fut', 'sr.clitics'],
      theory: [
        { type: 'rule', text: 'Футур I = **энклитика hteti** (ću, ćeš, će, ćemo, ćete, će) + **инфинитив**. Если в начале стоит подлежащее — форма раздельная: *Ja ću raditi*. Если глагол первый — инфинитив теряет **-ti** и пишется слитно: **Radiću**.' },
        { type: 'table', caption: 'Футур I: raditi', head: ['', 'с подлежащим', 'глагол первым', 'отрицание'], rows: [
          ['ja', 'ja ću raditi', 'radi{{ću}}', 'neću raditi'],
          ['ti', 'ti ćeš raditi', 'radi{{ćeš}}', 'nećeš raditi'],
          ['on', 'on će raditi', 'radi{{će}}', 'neće raditi'],
          ['mi', 'mi ćemo raditi', 'radi{{ćemo}}', 'nećemo raditi'],
          ['vi', 'vi ćete raditi', 'radi{{ćete}}', 'nećete raditi'],
          ['oni', 'oni će raditi', 'radi{{će}}', 'neće raditi']
        ] },
        { type: 'p', text: 'Инфинитивы на **-ći** не сливаются: **ići ću, doći ću, moći ću**. Вопрос: **Hoćeš li doći?** / **Da li ćeš doći?** Разговорный сербский вариант: *Ja ću da radim* (ću + da + презенс).' },
        { type: 'examples', items: [
          { t: 'Sutra ću raditi.', ru: 'Завтра я буду работать.' },
          { t: 'Pročitaću to večeras.', ru: 'Я прочитаю это сегодня вечером.' },
          { t: 'Ići ćemo na more.', ru: 'Мы поедем на море.' },
          { t: 'Hoćeš li doći? — Hoću!', ru: 'Ты придёшь? — Приду!' },
          { t: 'Neću zaboraviti.', ru: 'Я не забуду.' }
        ] },
        { type: 'contrast', text: 'В русском две модели («буду читать» / «прочитаю»), в сербском одна для обоих видов: **čitaću** / **pročitaću**. Ср. английское will, тоже из глагола желания.' },
        { type: 'pitfall', text: '*Čitati ću* и *Čitat ću* — неверно для сербской нормы (второе — хорватское написание). Правильно: **Čitaću** или **Ja ću čitati**. И ću не может стоять первым: не *Ću čitati*.' }
      ],
      vocab: [
        { id: 'sr-prekosutra', w: 'prekosutra', ru: 'послезавтра', pos: 'adv', g: null, forms: '', ex: 'Doći ću prekosutra.', exRu: 'Я приду послезавтра.', note: null },
        { id: 'sr-kasnije', w: 'kasnije', ru: 'позже', pos: 'adv', g: null, forms: '', ex: 'Zvaću te kasnije.', exRu: 'Я позвоню тебе позже.', note: null },
        { id: 'sr-sledeći', w: 'sledeći', ru: 'следующий', pos: 'adj', g: null, forms: 'sledeći, sledeća, sledeće', ex: 'Sledeće godine idem u Srbiju.', exRu: 'В следующем году я еду в Сербию.', note: 'Иекав. sljedeći.' },
        { id: 'sr-plan', w: 'plan', ru: 'план', pos: 'n', g: 'm', forms: 'plan, -a m. (мн. planovi)', ex: 'Kakvi su tvoji planovi?', exRu: 'Какие у тебя планы?', note: null },
        { id: 'sr-nadati-se', w: 'nadati se', ru: 'надеяться', pos: 'v', g: null, forms: 'nadati se (nadam se), nesvr.', ex: 'Nadam se da ćeš doći.', exRu: 'Надеюсь, что ты придёшь.', note: null },
        { id: 'sr-planirati', w: 'planirati', ru: 'планировать', pos: 'v', g: null, forms: 'planirati (planiram), dvovid.', ex: 'Planiramo put u Grčku.', exRu: 'Мы планируем поездку в Грецию.', note: null },
        { id: 'sr-možda', w: 'možda', ru: 'может быть', pos: 'adv', g: null, forms: '', ex: 'Možda ću doći.', exRu: 'Может быть, я приду.', note: null },
        { id: 'sr-sigurno', w: 'sigurno', ru: 'наверняка, конечно', pos: 'adv', g: null, forms: '', ex: 'Sigurno će padati kiša.', exRu: 'Наверняка пойдёт дождь.', note: 'Также «надёжно, безопасно».' },
        { id: 'sr-putovanje', w: 'putovanje', ru: 'путешествие, поездка', pos: 'n', g: 'n', forms: 'putovanje, -a n.', ex: 'Srećan put! — Hvala, putovanje je dugo.', exRu: 'Счастливого пути! — Спасибо, поездка долгая.', note: null },
        { id: 'sr-letovanje', w: 'letovanje', ru: 'летний отдых, отпуск летом', pos: 'n', g: 'n', forms: 'letovanje, -a n.', ex: 'Gde ideš na letovanje?', exRu: 'Куда едешь летом отдыхать?', note: 'Иекав. ljetovanje.' },
        { id: 'sr-karta', w: 'karta', ru: 'билет; карта', pos: 'n', g: 'f', forms: 'karta, -e f.', ex: 'Kupio sam kartu za voz.', exRu: 'Я купил билет на поезд.', note: 'karta za + A.' },
        { id: 'sr-hotel', w: 'hotel', ru: 'гостиница', pos: 'n', g: 'm', forms: 'hotel, -a m. (мн. hoteli)', ex: 'Hotel je blizu plaže.', exRu: 'Отель рядом с пляжем.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u08-l03',
      kind: 'grammar',
      title: 'Kad dođem… Futur II',
      goals: ['Употреблять сов. презенс после kad, ako, čim', 'Образовывать футур II (budem + причастие)', 'Говорить о погоде'],
      skills: ['sr.aspect', 'sr.fut2'],
      theory: [
        { type: 'rule', text: 'В придаточных времени и условия о будущем (**kad, ako, čim, dok ne**) футур I не употребляется. Сов. вид → **презенс**: *Kad dođem, zvaću te.* Несов. вид и biti → **футур II**: *Ako budem imao vremena…*' },
        { type: 'table', caption: 'Футур II = budem + l-причастие', head: ['', 'форма', 'пример'], rows: [
          ['ja', 'budem', 'Ako budem imao vremena…'],
          ['ti', 'budeš', 'Kad budeš u Beogradu…'],
          ['on', 'bude', 'Ako bude padala kiša…'],
          ['mi', 'budemo', 'Kad budemo putovali…'],
          ['vi', 'budete', 'Ako budete hteli…'],
          ['oni', 'budu', 'Ako budu radili…']
        ], note: 'С biti — просто budem: Kad budem u Beogradu (без причастия).' },
        { type: 'examples', items: [
          { t: 'Kad dođeš, javi mi se.', ru: 'Когда придёшь, дай знать.' },
          { t: 'Čim završim posao, idem kući.', ru: 'Как только закончу работу, пойду домой.' },
          { t: 'Ako bude lepo vreme, idemo u park.', ru: 'Если будет хорошая погода, пойдём в парк.' },
          { t: 'Čekaću dok ne dođeš.', ru: 'Я буду ждать, пока ты не придёшь.' }
        ] },
        { type: 'contrast', text: 'Русский тут употребляет будущее («когда приду», «если будет»). Сербский — презенс сов. вида или футур II: **Kad dođem** (не «Kad ću doći»).' },
        { type: 'p', text: 'Погода: **Pada kiša / sneg.** — Идёт дождь / снег. **Duva vetar.** — Дует ветер. **Sunčano je. Oblačno je.**' }
      ],
      vocab: [
        { id: 'sr-ako', w: 'ako', ru: 'если', pos: 'conj', g: null, forms: '', ex: 'Ako hoćeš, idemo.', exRu: 'Если хочешь, пойдём.', note: null },
        { id: 'sr-čim', w: 'čim', ru: 'как только', pos: 'conj', g: null, forms: '', ex: 'Zvaću te čim stignem.', exRu: 'Позвоню, как только доеду.', note: null },
        { id: 'sr-dok', w: 'dok', ru: 'пока; в то время как', pos: 'conj', g: null, forms: '', ex: 'Čitam dok on spava.', exRu: 'Я читаю, пока он спит.', note: 'dok ne — пока не.' },
        { id: 'sr-ili', w: 'ili', ru: 'или', pos: 'conj', g: null, forms: '', ex: 'Čaj ili kafa?', exRu: 'Чай или кофе?', note: null },
        { id: 'sr-kiša', w: 'kiša', ru: 'дождь', pos: 'n', g: 'f', forms: 'kiša, -e f.', ex: 'Pada kiša.', exRu: 'Идёт дождь.', note: 'Ж. р.' },
        { id: 'sr-sneg', w: 'sneg', ru: 'снег', pos: 'n', g: 'm', forms: 'sneg, -a m.', ex: 'Pada sneg.', exRu: 'Идёт снег.', note: 'Иекав. snijeg.' },
        { id: 'sr-sunce', w: 'sunce', ru: 'солнце', pos: 'n', g: 'n', forms: 'sunce, -a n.', ex: 'Sunce sija.', exRu: 'Светит солнце.', note: 'sunčano — солнечно.' },
        { id: 'sr-vetar', w: 'vetar', ru: 'ветер', pos: 'n', g: 'm', forms: 'vetar, vetra m.', ex: 'Duva jak vetar.', exRu: 'Дует сильный ветер.', note: 'Иекав. vjetar.' },
        { id: 'sr-oblak', w: 'oblak', ru: 'облако', pos: 'n', g: 'm', forms: 'oblak, -a m. (мн. oblaci)', ex: 'Nebo je puno oblaka.', exRu: 'Небо в облаках.', note: 'М. р.; oblačno — облачно.' },
        { id: 'sr-padati', w: 'padati', ru: 'падать; идти (о дожде, снеге)', pos: 'v', g: null, forms: 'padati (padam), nesvr. / pasti (padnem), svr.', ex: 'Ceo dan pada kiša.', exRu: 'Весь день идёт дождь.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u08-l04',
      kind: 'reading',
      title: 'Planovi za leto',
      goals: ['Понять рассказ о планах в футуре', 'Различать футур I и сов. презенс в придаточных'],
      skills: ['sr.fut', 'sr.fut2', 'sr.aspect'],
      theory: [
        { type: 'tip', text: 'Подчеркните в тексте все формы на -ću/-ćemo и все kad/ako + презенс — увидите, как распределяются времена.' }
      ],
      vocab: [
        { id: 'sr-planina', w: 'planina', ru: 'гора, горы', pos: 'n', g: 'f', forms: 'planina, -e f.', ex: 'Idemo na planinu.', exRu: 'Едем в горы.', note: 'na planini — в горах.' },
        { id: 'sr-selo', w: 'selo', ru: 'деревня, село', pos: 'n', g: 'n', forms: 'selo, -a n. (мн. sela)', ex: 'Baka živi na selu.', exRu: 'Бабушка живёт в деревне.', note: 'na selu — с предлогом na.' },
        { id: 'sr-obala', w: 'obala', ru: 'берег', pos: 'n', g: 'f', forms: 'obala, -e f.', ex: 'Šetamo obalom.', exRu: 'Гуляем по берегу.', note: null },
        { id: 'sr-plaža', w: 'plaža', ru: 'пляж', pos: 'n', g: 'f', forms: 'plaža, -e f.', ex: 'Ceo dan smo na plaži.', exRu: 'Весь день мы на пляже.', note: null },
        { id: 'sr-kupati-se', w: 'kupati se', ru: 'купаться', pos: 'v', g: null, forms: 'kupati se (kupam se), nesvr. / okupati se, svr.', ex: 'Kupamo se u moru.', exRu: 'Мы купаемся в море.', note: null },
        { id: 'sr-odmarati-se', w: 'odmarati se', ru: 'отдыхать', pos: 'v', g: null, forms: 'odmarati se (odmaram se), nesvr. / odmoriti se (odmorim se), svr.', ex: 'Leti se odmaramo.', exRu: 'Летом мы отдыхаем.', note: null },
        { id: 'sr-jezero', w: 'jezero', ru: 'озеро', pos: 'n', g: 'n', forms: 'jezero, -a n.', ex: 'Jezero je čisto.', exRu: 'Озеро чистое.', note: null },
        { id: 'sr-šuma', w: 'šuma', ru: 'лес', pos: 'n', g: 'f', forms: 'šuma, -e f.', ex: 'Šetamo kroz šumu.', exRu: 'Гуляем по лесу.', note: null }
      ],
      text: {
        title: 'Planovi za leto',
        lines: [
          { t: 'Ovog leta nećemo ići na more.', ru: 'Этим летом мы не поедем на море.' },
          { t: 'Prvo ćemo posetiti baku i dedu na selu.', ru: 'Сначала мы навестим бабушку и дедушку в деревне.' },
          { t: 'Kad stignemo, baka će spremiti veliki ručak.', ru: 'Когда мы приедем, бабушка приготовит большой обед.' },
          { t: 'Posle toga idemo na Zlatibor — to je planina sa lepim šumama.', ru: 'После этого мы поедем на Златибор — это гора с красивыми лесами.' },
          { t: 'Spavaćemo u malom hotelu blizu jezera.', ru: 'Мы будем ночевать в маленькой гостинице недалеко от озера.' },
          { t: 'Ako bude toplo, kupaćemo se u jezeru.', ru: 'Если будет тепло, будем купаться в озере.' },
          { t: 'Ako bude padala kiša, čitaćemo i odmaraćemo se.', ru: 'Если будет идти дождь, будем читать и отдыхать.' },
          { t: 'Jedva čekam! Javiću ti se čim se vratim.', ru: 'Жду не дождусь! Напишу тебе, как только вернусь.' }
        ]
      }
    }
  ]
}
