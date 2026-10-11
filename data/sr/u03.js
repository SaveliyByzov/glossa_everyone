export default {
  id: 'sr-u03',
  title: 'Prezent',
  titleRu: 'Настоящее время',
  summary: 'Три типа спряжения по форме 1 л. ед. ч. (-am, -im, -em), неправильные и модальные глаголы hteti, moći, morati, smeti, первое знакомство с конструкцией da + презенс.',
  lessons: [
    {
      id: 'sr-u03-l01',
      kind: 'grammar',
      title: 'Prezent: tip -am',
      goals: ['Определять тип спряжения по 1 л. ед. ч.', 'Спрягать глаголы на -ati (čitam)', 'Употреблять imati / nemati'],
      skills: ['sr.pres.am'],
      theory: [
        { type: 'rule', text: 'Тип спряжения определяется по форме **ja**: -**am**, -**im** или -**em**. Поэтому в словаре у каждого глагола указана 1 л. ед. ч.: *čitati (čitam), govoriti (govorim), pisati (pišem)*.' },
        { type: 'table', caption: 'čitati — читать', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['1 л.', 'čita{{m}}', 'čita{{mo}}'],
          ['2 л.', 'čita{{š}}', 'čita{{te}}'],
          ['3 л.', 'čita', 'čita{{ju}}']
        ], note: 'Так же: imati (imam), znati (znam), gledati (gledam), čekati (čekam), slušati (slušam), spavati (spavam).' },
        { type: 'contrast', text: 'Окончание 1 л. ед. ч. **-m** — древнее (ср. русск. «е{{м}}, да{{м}}»): в сербском оно распространилось почти на все глаголы. Русское «читаю — читают» ↔ сербское čitam — čitaju.' },
        { type: 'p', text: 'Отрицание — частица **ne** отдельно: *ne čitam, ne znam*. Исключение: **nemam** (не имею) пишется слитно.' },
        { type: 'examples', items: [
          { t: 'Čitam knjigu.', ru: 'Я читаю книгу.' },
          { t: 'Imaš li brata?', ru: 'У тебя есть брат?', note: 'imati = «иметь», где по-русски «у меня есть»' },
          { t: 'Nemam vremena.', ru: 'У меня нет времени.' },
          { t: 'Oni gledaju film.', ru: 'Они смотрят фильм.' }
        ] },
        { type: 'pitfall', text: '**pitati** — «спрашивать», а не «питать» (= hraniti): *Pitam profesora.* — Я спрашиваю преподавателя.' }
      ],
      vocab: [
        { id: 'sr-čitati', w: 'čitati', ru: 'читать', pos: 'v', g: null, forms: 'čitati (čitam), nesvr. / pročitati (pročitam), svr.', ex: 'Čitam novine.', exRu: 'Я читаю газету.', note: null },
        { id: 'sr-imati', w: 'imati', ru: 'иметь; «у меня есть»', pos: 'v', g: null, forms: 'imati (imam), nesvr.', ex: 'Imam sestru.', exRu: 'У меня есть сестра.', note: 'Безличное ima — «есть, имеется».' },
        { id: 'sr-nemati', w: 'nemati', ru: 'не иметь; «у меня нет»', pos: 'v', g: null, forms: 'nemati (nemam), nesvr.', ex: 'Nemam auto.', exRu: 'У меня нет машины.', note: 'Пишется слитно. Безличное nema + Г. — «нет».' },
        { id: 'sr-znati', w: 'znati', ru: 'знать; уметь', pos: 'v', g: null, forms: 'znati (znam), nesvr.', ex: 'Ne znam.', exRu: 'Не знаю.', note: 'Znam da plivam — я умею плавать.' },
        { id: 'sr-slušati', w: 'slušati', ru: 'слушать', pos: 'v', g: null, forms: 'slušati (slušam), nesvr. / poslušati, svr.', ex: 'Slušam muziku.', exRu: 'Я слушаю музыку.', note: null },
        { id: 'sr-gledati', w: 'gledati', ru: 'смотреть', pos: 'v', g: null, forms: 'gledati (gledam), nesvr. / pogledati, svr.', ex: 'Gledamo film.', exRu: 'Мы смотрим фильм.', note: 'Не «гладить» (= peglati).' },
        { id: 'sr-čekati', w: 'čekati', ru: 'ждать', pos: 'v', g: null, forms: 'čekati (čekam), nesvr. / sačekati, svr.', ex: 'Čekam autobus.', exRu: 'Я жду автобус.', note: 'С аккузативом: čekam brata.' },
        { id: 'sr-pitati', w: 'pitati', ru: 'спрашивать', pos: 'v', g: null, forms: 'pitati (pitam), nesvr. (svr. upitati)', ex: 'Mogu li nešto da pitam?', exRu: 'Можно спросить?', note: 'Ложный друг: не «питать».' },
        { id: 'sr-spavati', w: 'spavati', ru: 'спать', pos: 'v', g: null, forms: 'spavati (spavam), nesvr.', ex: 'Dete spava.', exRu: 'Ребёнок спит.', note: null },
        { id: 'sr-kuvati', w: 'kuvati', ru: 'готовить (еду), варить', pos: 'v', g: null, forms: 'kuvati (kuvam), nesvr. / skuvati, svr.', ex: 'Mama kuva ručak.', exRu: 'Мама готовит обед.', note: 'Хорв. kuhati.' },
        { id: 'sr-knjiga', w: 'knjiga', ru: 'книга', pos: 'n', g: 'f', forms: 'knjiga, -e f. (лок. knjizi)', ex: 'Knjiga je zanimljiva.', exRu: 'Книга интересная.', note: null },
        { id: 'sr-film', w: 'film', ru: 'фильм', pos: 'n', g: 'm', forms: 'film, -a m. (мн. filmovi)', ex: 'Gledam film.', exRu: 'Я смотрю фильм.', note: null },
        { id: 'sr-muzika', w: 'muzika', ru: 'музыка', pos: 'n', g: 'f', forms: 'muzika, -e f.', ex: 'Volim muziku.', exRu: 'Я люблю музыку.', note: 'Хорв. glazba.' }
      ],
      text: null
    },
    {
      id: 'sr-u03-l02',
      kind: 'grammar',
      title: 'Prezent: tip -im',
      goals: ['Спрягать глаголы на -iti и -eti', 'Помнить 3 л. мн. ч. на -e', 'Не переносить русские чередования'],
      skills: ['sr.pres.im'],
      theory: [
        { type: 'table', caption: 'govoriti — говорить', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['1 л.', 'govori{{m}}', 'govori{{mo}}'],
          ['2 л.', 'govori{{š}}', 'govori{{te}}'],
          ['3 л.', 'govori', 'govor{{e}}']
        ] },
        { type: 'rule', text: 'К типу -im относятся почти все глаголы на **-iti** (raditi, učiti, misliti) и большинство на **-eti** (videti → vidim, voleti → volim, živeti → živim), а также некоторые на -ati после ž, č, j (ležati → ležim, držati → držim). 3 л. мн. ч. — **-e**: oni govore, vide, leže.' },
        { type: 'contrast', text: 'В русском — чередования в 1 л. ед. ч.: «вижу — видишь», «люблю — любишь», «сижу». В сербском их **нет**: vidim, volim, sedim.' },
        { type: 'pitfall', text: 'Несколько глаголов на -eti спрягаются по типу -em: **razumeti → razumem**, **umeti → umem**, **smeti → smem**.' },
        { type: 'examples', items: [
          { t: 'Govorim malo srpski.', ru: 'Я немного говорю по-сербски.' },
          { t: 'Gde radiš?', ru: 'Где ты работаешь?' },
          { t: 'Volim kafu.', ru: 'Я люблю кофе.' },
          { t: 'Oni žive u Beogradu.', ru: 'Они живут в Белграде.' }
        ] },
        { type: 'tip', text: '**raditi** = «работать» и «делать» (*Šta radiš?* — Что делаешь?), а не «радовать» (= radovati).' }
      ],
      vocab: [
        { id: 'sr-govoriti', w: 'govoriti', ru: 'говорить', pos: 'v', g: null, forms: 'govoriti (govorim), nesvr. / reći (reknem, rečem), svr.', ex: 'Govoriš li engleski?', exRu: 'Ты говоришь по-английски?', note: null },
        { id: 'sr-raditi', w: 'raditi', ru: 'работать; делать', pos: 'v', g: null, forms: 'raditi (radim), nesvr. / uraditi (uradim), svr.', ex: 'Šta radiš?', exRu: 'Что ты делаешь?', note: 'Ложный друг: не «радовать».' },
        { id: 'sr-učiti', w: 'učiti', ru: 'учить, учиться', pos: 'v', g: null, forms: 'učiti (učim), nesvr. / naučiti (naučim), svr.', ex: 'Učim srpski.', exRu: 'Я учу сербский.', note: '«Учиться в вузе» — studirati.' },
        { id: 'sr-misliti', w: 'misliti', ru: 'думать', pos: 'v', g: null, forms: 'misliti (mislim), nesvr.', ex: 'Mislim da je tako.', exRu: 'Думаю, что это так.', note: null },
        { id: 'sr-videti', w: 'videti', ru: 'видеть', pos: 'v', g: null, forms: 'videti (vidim), dvovid.', ex: 'Vidim more.', exRu: 'Я вижу море.', note: 'Двувидовой. Иекав. vidjeti.' },
        { id: 'sr-voleti', w: 'voleti', ru: 'любить', pos: 'v', g: null, forms: 'voleti (volim), nesvr.', ex: 'Volim te.', exRu: 'Я тебя люблю.', note: 'Иекав. voljeti.' },
        { id: 'sr-živeti', w: 'živeti', ru: 'жить', pos: 'v', g: null, forms: 'živeti (živim), nesvr.', ex: 'Gde živiš?', exRu: 'Где ты живёшь?', note: 'Иекав. živjeti.' },
        { id: 'sr-sedeti', w: 'sedeti', ru: 'сидеть', pos: 'v', g: null, forms: 'sedeti (sedim), nesvr.', ex: 'Sedim u kafiću.', exRu: 'Я сижу в кафе.', note: 'Иекав. sjedjeti.' },
        { id: 'sr-želeti', w: 'želeti', ru: 'желать, хотеть', pos: 'v', g: null, forms: 'želeti (želim), nesvr.', ex: 'Šta želite?', exRu: 'Что желаете?', note: 'Иекав. željeti.' },
        { id: 'sr-ležati', w: 'ležati', ru: 'лежать', pos: 'v', g: null, forms: 'ležati (ležim), nesvr.', ex: 'Mačka leži na krevetu.', exRu: 'Кошка лежит на кровати.', note: '-ati, но тип -im.' },
        { id: 'sr-jezik', w: 'jezik', ru: 'язык', pos: 'n', g: 'm', forms: 'jezik, -a m. (мн. jezici)', ex: 'Srpski jezik je lep.', exRu: 'Сербский язык красивый.', note: 'Мн. jezici: k → c.' },
        { id: 'sr-posao', w: 'posao', ru: 'работа; дело', pos: 'n', g: 'm', forms: 'posao, posla m. (мн. poslovi)', ex: 'Idem na posao.', exRu: 'Я иду на работу.', note: 'Беглое a и -o < -l: posao — posla.' }
      ],
      text: null
    },
    {
      id: 'sr-u03-l03',
      kind: 'grammar',
      title: 'Prezent: tip -em',
      goals: ['Спрягать глаголы типа pisati, piti, ići', 'Знать 3 л. мн. ч. на -u', 'Узнавать -ovati → -ujem'],
      skills: ['sr.pres.em'],
      theory: [
        { type: 'table', caption: 'pisati — писать', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['1 л.', 'piše{{m}}', 'piše{{mo}}'],
          ['2 л.', 'piše{{š}}', 'piše{{te}}'],
          ['3 л.', 'piše', 'piš{{u}}']
        ] },
        { type: 'rule', text: 'Тип -em самый разнородный, основу презенса надо запоминать: **pisati → pišem**, **piti → pijem**, **ići → idem**, **jesti → jedem**, **zvati → zovem**, **prati → perem**, **-ovati → -ujem** (kupovati → kupujem). 3 л. мн. ч. — **-u**: pišu, piju, idu, kupuju.' },
        { type: 'contrast', text: 'Многие чередования совпадают с русскими: писать — пишу ↔ pisati — pišem; рисовать — рисую ↔ kupovati — kupujem; звать — зову ↔ zvati — zovem.' },
        { type: 'examples', items: [
          { t: 'Pišem pismo.', ru: 'Я пишу письмо.' },
          { t: 'Šta piješ?', ru: 'Что ты пьёшь?' },
          { t: 'Idemo u grad.', ru: 'Мы идём в город.' },
          { t: 'Oni kupuju hleb.', ru: 'Они покупают хлеб.' },
          { t: 'Razumem.', ru: 'Понимаю.' }
        ] },
        { type: 'contrast', text: 'Ложные друзья: **slovo** = «буква», **reč** = «слово».' },
        { type: 'pitfall', text: 'ići — один глагол для «идти» и «ехать»: *Idem u Beograd autobusom.* Русское различие идти/ехать передаётся контекстом.' }
      ],
      vocab: [
        { id: 'sr-pisati', w: 'pisati', ru: 'писать', pos: 'v', g: null, forms: 'pisati (pišem), nesvr. / napisati (napišem), svr.', ex: 'Pišem pismo.', exRu: 'Я пишу письмо.', note: null },
        { id: 'sr-piti', w: 'piti', ru: 'пить', pos: 'v', g: null, forms: 'piti (pijem), nesvr. / popiti (popijem), svr.', ex: 'Pijem vodu.', exRu: 'Я пью воду.', note: null },
        { id: 'sr-jesti', w: 'jesti', ru: 'есть, кушать', pos: 'v', g: null, forms: 'jesti (jedem), nesvr. / pojesti (pojedem), svr.', ex: 'Šta jedeš?', exRu: 'Что ты ешь?', note: 'Прош. jeo, jela.' },
        { id: 'sr-ići', w: 'ići', ru: 'идти; ехать', pos: 'v', g: null, forms: 'ići (idem), nesvr.', ex: 'Kuda ideš?', exRu: 'Куда ты идёшь?', note: 'Прош. išao, išla. Будущ. ići ću (раздельно).' },
        { id: 'sr-zvati', w: 'zvati', ru: 'звать; звонить', pos: 'v', g: null, forms: 'zvati (zovem), nesvr. / pozvati (pozovem), svr.', ex: 'Zovem mamu.', exRu: 'Я звоню маме.', note: 'zvati nekoga — звонить кому-то (с аккузативом).' },
        { id: 'sr-kupovati', w: 'kupovati', ru: 'покупать', pos: 'v', g: null, forms: 'kupovati (kupujem), nesvr. / kupiti (kupim), svr.', ex: 'Gde kupuješ hleb?', exRu: 'Где ты покупаешь хлеб?', note: null },
        { id: 'sr-putovati', w: 'putovati', ru: 'путешествовать, ездить', pos: 'v', g: null, forms: 'putovati (putujem), nesvr.', ex: 'Volim da putujem.', exRu: 'Я люблю путешествовать.', note: null },
        { id: 'sr-razumeti', w: 'razumeti', ru: 'понимать', pos: 'v', g: null, forms: 'razumeti (razumem), dvovid.', ex: 'Ne razumem.', exRu: 'Не понимаю.', note: '-eti, но тип -em! Иекав. razumjeti.' },
        { id: 'sr-prati', w: 'prati', ru: 'мыть; стирать', pos: 'v', g: null, forms: 'prati (perem), nesvr. / oprati (operem), svr.', ex: 'Perem sudove.', exRu: 'Я мою посуду.', note: null },
        { id: 'sr-stanovati', w: 'stanovati', ru: 'жить, проживать', pos: 'v', g: null, forms: 'stanovati (stanujem), nesvr.', ex: 'Stanujem u centru.', exRu: 'Я живу в центре.', note: 'О месте проживания; ср. stan — квартира.' },
        { id: 'sr-pismo', w: 'pismo', ru: 'письмо', pos: 'n', g: 'n', forms: 'pismo, -a n. (мн. pisma)', ex: 'Imam pismo za tebe.', exRu: 'У меня для тебя письмо.', note: 'Также «письменность»: dva pisma — две графики.' },
        { id: 'sr-reč', w: 'reč', ru: 'слово', pos: 'n', g: 'f', forms: 'reč, reči f.', ex: 'Šta znači ova reč?', exRu: 'Что значит это слово?', note: 'Ж. р. на согласный. Иекав. riječ.' },
        { id: 'sr-slovo', w: 'slovo', ru: 'буква', pos: 'n', g: 'n', forms: 'slovo, -a n. (мн. slova)', ex: 'Azbuka ima trideset slova.', exRu: 'В азбуке тридцать букв.', note: 'Ложный друг: не «слово» (= reč).' }
      ],
      text: null
    },
    {
      id: 'sr-u03-l04',
      kind: 'grammar',
      title: 'Hteti, moći, morati, smeti',
      goals: ['Спрягать hteti и moći', 'Различать «хочу / могу / должен / смею»', 'Строить модель модальный глагол + da + презенс'],
      skills: ['sr.pres.irreg', 'sr.da'],
      theory: [
        { type: 'table', caption: 'Неправильные модальные глаголы', head: ['', 'hteti', 'moći'], rows: [
          ['ja', 'hoću', 'mogu'],
          ['ti', 'hoćeš', 'možeš'],
          ['on/ona', 'hoće', 'može'],
          ['mi', 'hoćemo', 'možemo'],
          ['vi', 'hoćete', 'možete'],
          ['oni', 'hoće', 'mogu']
        ], note: 'Отрицание hteti — слитно: neću, nećeš, neće… morati (moram) и smeti (smem) спрягаются правильно.' },
        { type: 'rule', text: 'После модальных глаголов в Сербии обычно употребляется **da + презенс** (с тем же лицом): **Hoću da spavam.** **Mogu da dođem.** **Moram da radim.** Инфинитив (*Hoću spavati*) тоже правилен, но звучит более «западно».' },
        { type: 'examples', items: [
          { t: 'Hoćeš li kafu?', ru: 'Хочешь кофе?' },
          { t: 'Ne mogu da dođem.', ru: 'Я не могу прийти.' },
          { t: 'Moram da idem.', ru: 'Мне надо идти.' },
          { t: 'Ovde ne smeš da pušiš.', ru: 'Здесь нельзя курить.' },
          { t: 'Treba da učim.', ru: 'Мне нужно учиться.' }
        ] },
        { type: 'contrast', text: 'Русское «я должен» / «мне надо» = **moram** (личный глагол). «Нужно» — безличное **treba**: *Treba da učim.* Двойное отрицание — как в русском: *Nikad ne spavam dugo.*' },
        { type: 'pitfall', text: 'Краткие формы hteti (ću, ćeš, će…) — это уже вспомогательный глагол будущего времени. «Хочу» в значении желания — всегда полная форма **hoću**.' }
      ],
      vocab: [
        { id: 'sr-hteti', w: 'hteti', ru: 'хотеть', pos: 'v', g: null, forms: 'hteti (hoću), nesvr.; отриц. neću', ex: 'Hoću da spavam.', exRu: 'Я хочу спать.', note: 'Иекав. htjeti. Прош. hteo, htela.' },
        { id: 'sr-moći', w: 'moći', ru: 'мочь', pos: 'v', g: null, forms: 'moći (mogu, možeš), nesvr.', ex: 'Mogu li da uđem?', exRu: 'Можно войти?', note: 'Прош. mogao, mogla.' },
        { id: 'sr-morati', w: 'morati', ru: 'быть должным, приходиться', pos: 'v', g: null, forms: 'morati (moram), nesvr.', ex: 'Moram da radim.', exRu: 'Мне надо работать.', note: null },
        { id: 'sr-smeti', w: 'smeti', ru: 'сметь, иметь право', pos: 'v', g: null, forms: 'smeti (smem), nesvr.', ex: 'Smem li da pitam?', exRu: 'Можно спросить?', note: 'Ne sme — нельзя. Иекав. smjeti.' },
        { id: 'sr-treba', w: 'treba', ru: 'нужно, надо', pos: 'v', g: null, forms: 'trebati (treba), nesvr.', ex: 'Treba mi pomoć.', exRu: 'Мне нужна помощь.', note: 'Обычно безлично: treba da…, treba mi…' },
        { id: 'sr-plivati', w: 'plivati', ru: 'плавать', pos: 'v', g: null, forms: 'plivati (plivam), nesvr.', ex: 'Znam da plivam.', exRu: 'Я умею плавать.', note: null },
        { id: 'sr-danas', w: 'danas', ru: 'сегодня', pos: 'adv', g: null, forms: '', ex: 'Danas radim.', exRu: 'Сегодня я работаю.', note: null },
        { id: 'sr-uvek', w: 'uvek', ru: 'всегда', pos: 'adv', g: null, forms: '', ex: 'Uvek pijem kafu.', exRu: 'Я всегда пью кофе.', note: 'Иекав. uvijek.' },
        { id: 'sr-nikad', w: 'nikad', ru: 'никогда', pos: 'adv', g: null, forms: 'nikad / nikada', ex: 'Nikad ne kasnim.', exRu: 'Я никогда не опаздываю.', note: 'Двойное отрицание, как в русском.' },
        { id: 'sr-često', w: 'često', ru: 'часто', pos: 'adv', g: null, forms: '', ex: 'Često putujem.', exRu: 'Я часто езжу.', note: null },
        { id: 'sr-ponekad', w: 'ponekad', ru: 'иногда', pos: 'adv', g: null, forms: '', ex: 'Ponekad kuvam.', exRu: 'Иногда я готовлю.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u03-l05',
      kind: 'reading',
      title: 'Moj dan',
      goals: ['Понять рассказ о распорядке дня в презенсе', 'Узнать глаголы трёх типов в тексте'],
      skills: ['sr.pres.am', 'sr.pres.im', 'sr.pres.em', 'sr.pres.irreg'],
      theory: [
        { type: 'tip', text: 'Ищите в тексте глаголы и определяйте тип по окончанию: -am, -im, -em; 3 л. мн. ч. -ju, -e, -u.' }
      ],
      vocab: [
        { id: 'sr-ujutru', w: 'ujutru', ru: 'утром', pos: 'adv', g: null, forms: '', ex: 'Ujutru pijem kafu.', exRu: 'Утром я пью кофе.', note: 'Также ujutro.' },
        { id: 'sr-uveče', w: 'uveče', ru: 'вечером', pos: 'adv', g: null, forms: '', ex: 'Uveče čitam.', exRu: 'Вечером я читаю.', note: 'Иекав. uvečer.' },
        { id: 'sr-novine', w: 'novine', ru: 'газета', pos: 'n', g: 'f', forms: 'novine, novina f. мн.', ex: 'Čitam novine.', exRu: 'Я читаю газету.', note: 'Только мн. ч.' },
        { id: 'sr-onda', w: 'onda', ru: 'потом, тогда', pos: 'adv', g: null, forms: '', ex: 'Onda idem na posao.', exRu: 'Потом я иду на работу.', note: null },
        { id: 'sr-obično', w: 'obično', ru: 'обычно', pos: 'adv', g: null, forms: '', ex: 'Obično ustajem rano.', exRu: 'Обычно я встаю рано.', note: null },
        { id: 'sr-kod-kuće', w: 'kod kuće', ru: 'дома', pos: 'phr', g: null, forms: '', ex: 'Danas sam kod kuće.', exRu: 'Сегодня я дома.', note: '«Домой» — kući.' },
        { id: 'sr-rano', w: 'rano', ru: 'рано', pos: 'adv', g: null, forms: '', ex: 'Rano je.', exRu: 'Рано.', note: null },
        { id: 'sr-kasno', w: 'kasno', ru: 'поздно', pos: 'adv', g: null, forms: '', ex: 'Već je kasno.', exRu: 'Уже поздно.', note: null }
      ],
      text: {
        title: 'Moj dan',
        lines: [
          { t: 'Zovem se Marko i živim u Beogradu.', ru: 'Меня зовут Марко, я живу в Белграде.' },
          { t: 'Radim u banci, ali ne radim subotom.', ru: 'Я работаю в банке, но по субботам не работаю.' },
          { t: 'Ujutru obično pijem kafu i čitam novine.', ru: 'Утром я обычно пью кофе и читаю газету.' },
          { t: 'Onda idem na posao. Posao je zanimljiv.', ru: 'Потом я иду на работу. Работа интересная.' },
          { t: 'Moja žena Jelena je lekarka. Ona često radi kasno.', ru: 'Моя жена Елена — врач. Она часто работает допоздна.' },
          { t: 'Uveče kuvam, a Jelena pere sudove.', ru: 'Вечером я готовлю, а Елена моет посуду.' },
          { t: 'Posle večere gledamo film ili slušamo muziku.', ru: 'После ужина мы смотрим фильм или слушаем музыку.' },
          { t: 'Hoćemo da putujemo, ali nemamo vremena.', ru: 'Мы хотим путешествовать, но у нас нет времени.' }
        ]
      }
    }
  ]
}
