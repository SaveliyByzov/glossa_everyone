export default {
  id: 'sr-u10',
  title: 'Složena rečenica i kondicional',
  titleRu: 'Сложное предложение и условное наклонение',
  summary: 'Конструкция da + презенс вместо инфинитива и вместо русского «чтобы» + прош., относительное koji, причинные и уступительные союзы, кондиционал I (bih, bi, bismo, biste) и da bih; итоговое чтение о ложных друзьях.',
  lessons: [
    {
      id: 'sr-u10-l01',
      kind: 'grammar',
      title: 'Da + prezent',
      goals: ['Употреблять da + презенс после модальных и волевых глаголов', 'Переводить «хочу, чтобы ты…»', 'Различать da «что», da «чтобы» и da li'],
      skills: ['sr.da'],
      theory: [
        { type: 'rule', text: 'В сербском (особенно в Сербии) инфинитив часто заменяется конструкцией **da + презенс**: *Hoću da spavam* = *Hoću spavati*. При **разных подлежащих** возможна только da-конструкция: **Hoću da ti dođeš.**' },
        { type: 'table', caption: 'Три функции da', head: ['Функция', 'Пример', 'Перевод'], rows: [
          ['вместо инфинитива', 'Moram da idem.', 'Мне надо идти.'],
          ['«что» (изъяснит.)', 'Mislim da je kasno.', 'Думаю, что поздно.'],
          ['«чтобы» (цель, желание)', 'Došao sam da te vidim.', 'Я пришёл, чтобы увидеть тебя.']
        ] },
        { type: 'examples', items: [
          { t: 'Želim da mi pomogneš.', ru: 'Я хочу, чтобы ты мне помог.' },
          { t: 'Mama ne dozvoljava da gledam televiziju.', ru: 'Мама не разрешает мне смотреть телевизор.' },
          { t: 'Pokušaću da stignem na vreme.', ru: 'Постараюсь успеть вовремя.' },
          { t: 'Bojim se da će padati kiša.', ru: 'Боюсь, что пойдёт дождь.' }
        ] },
        { type: 'contrast', text: 'Русское «хочу, чтобы ты **пришёл**» (форма прошедшего) → сербское **Hoću da dođeš** (презенс сов. вида!). Это балканизм: так же устроены болгарский, греческий, албанский, румынский.' },
        { type: 'pitfall', text: 'Не калькируйте «чтобы» + прош.: *Hoću da si došao* — ошибка. Энклитики после da стоят сразу за ним: *Moram da ga vidim.*' }
      ],
      vocab: [
        { id: 'sr-moliti', w: 'moliti', ru: 'просить; молить', pos: 'v', g: null, forms: 'moliti (molim), nesvr. / zamoliti (zamolim), svr.', ex: 'Molim te da dođeš.', exRu: 'Прошу тебя прийти.', note: 'Отсюда molim — «пожалуйста».' },
        { id: 'sr-dozvoliti', w: 'dozvoliti', ru: 'разрешить', pos: 'v', g: null, forms: 'dozvoliti (dozvolim), svr. / dozvoljavati (dozvoljavam), nesvr.', ex: 'Dozvolite da se predstavim.', exRu: 'Позвольте представиться.', note: null },
        { id: 'sr-zabraniti', w: 'zabraniti', ru: 'запретить', pos: 'v', g: null, forms: 'zabraniti (zabranim), svr. / zabranjivati (zabranjujem), nesvr.', ex: 'Lekar mi je zabranio da pušim.', exRu: 'Врач запретил мне курить.', note: 'zabranjeno — запрещено.' },
        { id: 'sr-nameravati', w: 'nameravati', ru: 'намереваться, собираться', pos: 'v', g: null, forms: 'nameravati (nameravam), nesvr.', ex: 'Nameravam da se preselim.', exRu: 'Я собираюсь переехать.', note: 'Иекав. namjeravati.' },
        { id: 'sr-uspeti', w: 'uspeti', ru: 'суметь, удаться', pos: 'v', g: null, forms: 'uspeti (uspem), svr. / uspevati (uspevam), nesvr.', ex: 'Uspeo sam da nađem stan.', exRu: 'Мне удалось найти квартиру.', note: 'Иекав. uspjeti. uspeh — успех.' },
        { id: 'sr-bojati-se', w: 'bojati se', ru: 'бояться', pos: 'v', g: null, forms: 'bojati se (bojim se), nesvr.', ex: 'Bojim se pasa.', exRu: 'Я боюсь собак.', note: '-ati, но тип -im. + Г. Синоним plašiti se.' },
        { id: 'sr-predložiti', w: 'predložiti', ru: 'предложить', pos: 'v', g: null, forms: 'predložiti (predložim), svr. / predlagati (predlažem), nesvr.', ex: 'Predlažem da idemo peške.', exRu: 'Предлагаю пойти пешком.', note: null },
        { id: 'sr-obećati', w: 'obećati', ru: 'обещать', pos: 'v', g: null, forms: 'obećati (obećam), svr. / obećavati (obećavam), nesvr.', ex: 'Obećao sam da ću doći.', exRu: 'Я обещал, что приду.', note: null },
        { id: 'sr-verovatno', w: 'verovatno', ru: 'вероятно', pos: 'adv', g: null, forms: '', ex: 'Verovatno će zakasniti.', exRu: 'Вероятно, он опоздает.', note: 'Иекав. vjerovatno.' },
        { id: 'sr-potreban', w: 'potreban', ru: 'нужный, необходимый', pos: 'adj', g: null, forms: 'potreban, potrebna, potrebno', ex: 'Potrebno je da učiš svaki dan.', exRu: 'Нужно, чтобы ты учился каждый день.', note: null },
        { id: 'sr-moguć', w: 'moguć', ru: 'возможный', pos: 'adj', g: null, forms: 'moguć, moguća, moguće', ex: 'Moguće je da pada kiša.', exRu: 'Возможно, идёт дождь.', note: 'Ср. р. на -e после ć.' }
      ],
      text: null
    },
    {
      id: 'sr-u10-l02',
      kind: 'grammar',
      title: 'Zavisne rečenice',
      goals: ['Склонять относительное koji', 'Выражать причину (jer, zato što, pošto) и уступку (iako)', 'Ставить энклитики после союзного слова'],
      skills: ['sr.subord', 'sr.clitics'],
      theory: [
        { type: 'rule', text: '**koji, koja, koje** — «который», склоняется как прилагательное и согласуется с определяемым словом в роде и числе; падеж — по роли в придаточном: *čovek **koji** radi ovde*, *knjiga **koju** čitam*, *grad **u kojem** živim*.' },
        { type: 'table', caption: 'koji: основные формы ед. ч.', head: ['Падеж', 'м.', 'ж.', 'ср.'], rows: [
          ['N', 'koji', 'koja', 'koje'],
          ['G', 'kojeg / koga', 'koje', 'kojeg'],
          ['D / L', 'kojem / kome', 'kojoj', 'kojem'],
          ['A', 'koji / kojeg (koga)', 'koju', 'koje'],
          ['I', 'kojim', 'kojom', 'kojim']
        ], note: 'Для одушевлённых м. р. в A — koga / kojeg: čovek koga sam video.' },
        { type: 'table', caption: 'Союзы', head: ['Значение', 'Союзы', 'Пример'], rows: [
          ['причина', 'jer, zato što, pošto', 'Ne idem, jer sam bolestan.'],
          ['следствие', 'zato, pa', 'Bolestan sam, zato ne idem.'],
          ['уступка', 'iako, mada', 'Iako je kasno, radim.'],
          ['время', 'kad, dok, čim, pre nego što, pošto', 'Pre nego što odeš, javi se.'],
          ['противопоставление', 'međutim, ali', 'Hteo sam; međutim, nisam mogao.']
        ] },
        { type: 'examples', items: [
          { t: 'Ovo je devojka o kojoj sam ti pričao.', ru: 'Это девушка, о которой я тебе рассказывал.' },
          { t: 'Grad u kojem živim nije velik.', ru: 'Город, в котором я живу, небольшой.' },
          { t: 'Nisam došao zato što sam bio bolestan.', ru: 'Я не пришёл, потому что был болен.' },
          { t: 'Pošto nemam vremena, idem taksijem.', ru: 'Так как у меня нет времени, еду на такси.' }
        ] },
        { type: 'contrast', text: 'koji ≈ «который», и одушевлённость та же. Но энклитики идут **сразу после** koji/da/jer: *čovek koga **sam** video* (не «koga video sam»). **zato što** «потому что» ≠ **zašto** «почему». **pošto** — «так как», «после того как» и «почём» (*Pošto je paradajz?*).' },
        { type: 'pitfall', text: 'В разговорной речи вместо koji часто неизменяемое **što**: *čovek što radi ovde*. Понимать нужно, но в письменной речи лучше koji.' }
      ],
      vocab: [
        { id: 'sr-koji', w: 'koji', ru: 'который; какой', pos: 'pron', g: null, forms: 'koji, koja, koje', ex: 'Koji je danas dan?', exRu: 'Какой сегодня день?', note: 'И вопросительное, и относительное.' },
        { id: 'sr-jer', w: 'jer', ru: 'потому что, так как', pos: 'conj', g: null, forms: '', ex: 'Ostajem kod kuće jer pada kiša.', exRu: 'Остаюсь дома, потому что идёт дождь.', note: 'Не начинает предложение.' },
        { id: 'sr-zato-što', w: 'zato što', ru: 'потому что', pos: 'conj', g: null, forms: '', ex: 'Učim srpski zato što volim Srbiju.', exRu: 'Я учу сербский, потому что люблю Сербию.', note: null },
        { id: 'sr-zato', w: 'zato', ru: 'поэтому', pos: 'adv', g: null, forms: '', ex: 'Umoran sam, zato idem kući.', exRu: 'Я устал, поэтому иду домой.', note: null },
        { id: 'sr-pošto', w: 'pošto', ru: 'так как; после того как; почём', pos: 'conj', g: null, forms: '', ex: 'Pošto je kasno, idem.', exRu: 'Так как поздно, я пойду.', note: 'Pošto je…? — Почём…?' },
        { id: 'sr-iako', w: 'iako', ru: 'хотя', pos: 'conj', g: null, forms: '', ex: 'Iako je hladno, idem u šetnju.', exRu: 'Хотя холодно, я иду гулять.', note: 'Синоним mada.' },
        { id: 'sr-pre-nego-što', w: 'pre nego što', ru: 'прежде чем, перед тем как', pos: 'conj', g: null, forms: '', ex: 'Operi ruke pre nego što jedeš.', exRu: 'Помой руки перед тем, как есть.', note: 'Иекав. prije nego što.' },
        { id: 'sr-međutim', w: 'međutim', ru: 'однако', pos: 'conj', g: null, forms: '', ex: 'Međutim, nije došao.', exRu: 'Однако он не пришёл.', note: null },
        { id: 'sr-dakle', w: 'dakle', ru: 'итак, значит', pos: 'conj', g: null, forms: '', ex: 'Dakle, vidimo se u pet.', exRu: 'Итак, увидимся в пять.', note: null },
        { id: 'sr-zbog', w: 'zbog', ru: 'из-за', pos: 'prep', g: null, forms: '+ Г.', ex: 'Zbog kiše ostajemo kod kuće.', exRu: 'Из-за дождя остаёмся дома.', note: null },
        { id: 'sr-umesto', w: 'umesto', ru: 'вместо', pos: 'prep', g: null, forms: '+ Г.', ex: 'Pijem čaj umesto kafe.', exRu: 'Я пью чай вместо кофе.', note: 'Иекав. umjesto.' },
        { id: 'sr-tek', w: 'tek', ru: 'только (лишь); только что', pos: 'part', g: null, forms: '', ex: 'Tek sam stigao.', exRu: 'Я только что пришёл.', note: 'tek sutra — только завтра (не раньше).' }
      ],
      text: null
    },
    {
      id: 'sr-u10-l03',
      kind: 'grammar',
      title: 'Kondicional I',
      goals: ['Образовывать кондиционал I (bih + l-причастие)', 'Вежливо просить (Hteo bih…, Da li biste…?)', 'Строить нереальное условие и цель (da bih)'],
      skills: ['sr.cond', 'sr.clitics'],
      theory: [
        { type: 'table', caption: 'Кондиционал I = bih… + l-причастие', head: ['', 'энклитика', 'пример', 'отрицание'], rows: [
          ['ja', '{{bih}}', 'išao / išla bih', 'ne bih išao'],
          ['ti', '{{bi}}', 'išao bi', 'ne bi išao'],
          ['on / ona', '{{bi}}', 'išao / išla bi', 'ne bi išla'],
          ['mi', '{{bismo}}', 'išli bismo', 'ne bismo išli'],
          ['vi', '{{biste}}', 'išli biste', 'ne biste išli'],
          ['oni', '{{bi}}', 'išli bi', 'ne bi išli']
        ], note: 'bih, bi… — энклитики (второе место): Ja bih išao / Išao bih.' },
        { type: 'rule', text: 'Нереальное условие: **kad bi / da** + …, + кондиционал: *Kad bih imao vremena, išao bih u bioskop.* = *Da imam vremena, išao bih…* (da + презенс). Цель с тем же подлежащим: **da bih** + причастие: *Učim srpski da bih razumeo pesme.*' },
        { type: 'examples', items: [
          { t: 'Hteo bih kafu, molim.', ru: 'Я бы хотел кофе, пожалуйста.' },
          { t: 'Da li biste mi pomogli?', ru: 'Не могли бы вы мне помочь?' },
          { t: 'Na tvom mestu ne bih to radila.', ru: 'На твоём месте я бы этого не делала.' },
          { t: 'Da sam bogat, putovao bih po svetu.', ru: 'Если бы я был богат, я бы путешествовал по миру.' }
        ] },
        { type: 'contrast', text: 'Русское «бы» — неизменяемая частица. Сербское **bih, bi, bismo, biste** спрягается (это старый аорист глагола biti; ср. др.-рус. «бых, бы, быхомъ»). Ложный друг: **rado** = «охотно» (*Rado bih došao*), а «рад» = *drago mi je*.' },
        { type: 'pitfall', text: '*Ja bi išao* — частая разговорная ошибка даже у носителей; норма — **Ja bih išao**. Кондиционал II (*bio bih išao*) книжный и редкий — на уровне B1 его достаточно узнавать.' }
      ],
      vocab: [
        { id: 'sr-rado', w: 'rado', ru: 'охотно, с удовольствием', pos: 'adv', g: null, forms: '', ex: 'Rado bih došao.', exRu: 'Я бы с удовольствием пришёл.', note: 'Ложный друг: «рад» = drago mi je.' },
        { id: 'sr-radije', w: 'radije', ru: 'охотнее, лучше (предпочтение)', pos: 'adv', g: null, forms: '', ex: 'Radije bih čaj.', exRu: 'Я бы лучше чаю.', note: null },
        { id: 'sr-voleo-bih', w: 'voleo bih', ru: 'я бы хотел', pos: 'phr', g: null, forms: 'voleo bih (м.) / volela bih (ж.)', ex: 'Voleo bih da vidim Beograd.', exRu: 'Я бы хотел увидеть Белград.', note: 'Букв. «я бы любил». Иекав. volio bih.' },
        { id: 'sr-pomoć', w: 'pomoć', ru: 'помощь', pos: 'n', g: 'f', forms: 'pomoć, pomoći f.', ex: 'Hvala na pomoći!', exRu: 'Спасибо за помощь!', note: 'hitna pomoć — скорая помощь.' },
        { id: 'sr-savet', w: 'savet', ru: 'совет', pos: 'n', g: 'm', forms: 'savet, -a m. (мн. saveti)', ex: 'Daj mi neki savet.', exRu: 'Дай мне какой-нибудь совет.', note: 'Иекав. savjet.' },
        { id: 'sr-na-tvom-mestu', w: 'na tvom mestu', ru: 'на твоём месте', pos: 'phr', g: null, forms: '(na Vašem mestu)', ex: 'Na tvom mestu bih ostao.', exRu: 'На твоём месте я бы остался.', note: null },
        { id: 'sr-zamisliti', w: 'zamisliti', ru: 'представить (себе)', pos: 'v', g: null, forms: 'zamisliti (zamislim), svr. / zamišljati (zamišljam), nesvr.', ex: 'Zamisli da živiš na moru.', exRu: 'Представь, что ты живёшь у моря.', note: null },
        { id: 'sr-san', w: 'san', ru: 'сон; мечта', pos: 'n', g: 'm', forms: 'san, sna m. (мн. snovi)', ex: 'To je moj san.', exRu: 'Это моя мечта.', note: 'Беглое a: sna.' },
        { id: 'sr-sanjati', w: 'sanjati', ru: 'видеть во сне; мечтать', pos: 'v', g: null, forms: 'sanjati (sanjam), nesvr.', ex: 'Sanjao sam te.', exRu: 'Ты мне снился.', note: null },
        { id: 'sr-bogat', w: 'bogat', ru: 'богатый', pos: 'adj', g: null, forms: 'bogat, bogata, bogato', ex: 'Da sam bogat…', exRu: 'Если бы я был богат…', note: null },
        { id: 'sr-siromašan', w: 'siromašan', ru: 'бедный', pos: 'adj', g: null, forms: 'siromašan, siromašna, siromašno', ex: 'Bio je siromašan, ali srećan.', exRu: 'Он был беден, но счастлив.', note: null },
        { id: 'sr-svet', w: 'svet', ru: 'мир (вселенная, люди)', pos: 'n', g: 'm', forms: 'svet, -a m.', ex: 'Putovao bih po celom svetu.', exRu: 'Я бы путешествовал по всему миру.', note: 'Ложный друг: «свет» = svetlo. «Мир» (покой) = mir. Иекав. svijet.' }
      ],
      text: null
    },
    {
      id: 'sr-u10-l04',
      kind: 'reading',
      title: 'Lažni prijatelji',
      goals: ['Понять связный текст с придаточными и кондиционалом', 'Закрепить главных ложных друзей'],
      skills: ['sr.da', 'sr.subord', 'sr.cond'],
      theory: [
        { type: 'contrast', text: 'Главные ложные друзья курса: **pitati** — спрашивать; **život** — жизнь (живот = stomak); **ružan** — некрасивый; **slovo** — буква; **čas** — урок; **godina** — год; **stan** — квартира; **vrata** — дверь; **raditi** — работать; **skup** — дорогой; **strana** — сторона, страница (страна = zemlja); **pozorište** — театр; **pokušati** — попытаться; **vredan** — трудолюбивый (вредный = štetan); **hitan** — срочный (хитрый = lukav); **trudna** — беременная; **ponos** — гордость.' }
      ],
      vocab: [
        { id: 'sr-život', w: 'život', ru: 'жизнь', pos: 'n', g: 'm', forms: 'život, -a m.', ex: 'Takav je život.', exRu: 'Такова жизнь.', note: 'Ложный друг: «живот» = stomak.' },
        { id: 'sr-vredan', w: 'vredan', ru: 'трудолюбивый; ценный', pos: 'adj', g: null, forms: 'vredan, vredna, vredno', ex: 'Ona je veoma vredna.', exRu: 'Она очень трудолюбивая.', note: 'Ложный друг: «вредный» = štetan. Иекав. vrijedan.' },
        { id: 'sr-ponosan', w: 'ponosan', ru: 'гордый', pos: 'adj', g: null, forms: 'ponosan, ponosna, ponosno', ex: 'Ponosan sam na tebe.', exRu: 'Я горжусь тобой.', note: 'ponos — гордость (не «понос»!). na + A.' },
        { id: 'sr-trudna', w: 'trudna', ru: 'беременная', pos: 'adj', g: null, forms: 'trudna (ж.)', ex: 'Moja sestra je trudna.', exRu: 'Моя сестра беременна.', note: 'Ложный друг: «трудная» = teška.' },
        { id: 'sr-hitan', w: 'hitan', ru: 'срочный', pos: 'adj', g: null, forms: 'hitan, hitna, hitno', ex: 'Imam hitan sastanak.', exRu: 'У меня срочная встреча.', note: 'Ложный друг: «хитрый» = lukav. hitno — срочно.' },
        { id: 'sr-strana', w: 'strana', ru: 'сторона; страница', pos: 'n', g: 'f', forms: 'strana, -e f.', ex: 'Otvorite knjigu na strani deset.', exRu: 'Откройте книгу на десятой странице.', note: 'Ложный друг: «страна» = zemlja, država.' },
        { id: 'sr-preporučiti', w: 'preporučiti', ru: 'порекомендовать', pos: 'v', g: null, forms: 'preporučiti (preporučim), svr. / preporučivati (preporučujem), nesvr.', ex: 'Šta biste mi preporučili?', exRu: 'Что бы вы мне порекомендовали?', note: null },
        { id: 'sr-iskustvo', w: 'iskustvo', ru: 'опыт', pos: 'n', g: 'n', forms: 'iskustvo, -a n.', ex: 'Imam iskustva sa decom.', exRu: 'У меня есть опыт работы с детьми.', note: null }
      ],
      text: {
        title: 'Lažni prijatelji',
        lines: [
          { t: 'Kad sam počela da učim srpski, mislila sam da će biti lako.', ru: 'Когда я начала учить сербский, я думала, что будет легко.' },
          { t: 'Međutim, jezik koji izgleda poznato može da te prevari.', ru: 'Однако язык, который кажется знакомым, может тебя обмануть.' },
          { t: 'Prvog dana sam rekla komšinici da je njena ćerka „vredna“, a mislila sam da je nestašna.', ru: 'В первый же день я сказала соседке, что её дочь «vredna» (трудолюбивая), а имела в виду «вредная» (озорная).' },
          { t: 'Srećom, ona se samo nasmejala, jer je to bio kompliment.', ru: 'К счастью, она только рассмеялась, потому что это был комплимент.' },
          { t: 'Drugi put sam htela da kažem da je zadatak „trudan“, iako to znači nešto sasvim drugo.', ru: 'В другой раз я хотела сказать, что задание «трудное», хотя это слово значит совсем другое.' },
          { t: 'Da sam znala za lažne prijatelje, ne bih pravila takve greške.', ru: 'Если бы я знала о ложных друзьях, я бы не делала таких ошибок.' },
          { t: 'Zato vam preporučujem da ih zapišete i zapamtite.', ru: 'Поэтому советую вам их записать и запомнить.' },
          { t: 'Iskustvo je najbolji učitelj — ali i najskuplji!', ru: 'Опыт — лучший учитель, но и самый дорогой!' }
        ]
      }
    }
  ]
}
