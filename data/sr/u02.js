export default {
  id: 'sr-u02',
  title: 'Biti: jesam, nisam',
  titleRu: 'Глагол biti, местоимения, вопросы',
  summary: 'Личные местоимения, полные, краткие и отрицательные формы глагола biti, первая энклитика и правило второго места, вопросы с da li / jesi li, профессии и национальности.',
  lessons: [
    {
      id: 'sr-u02-l01',
      kind: 'grammar',
      title: 'Lične zamenice i glagol biti',
      goals: ['Знать личные местоимения в номинативе', 'Спрягать biti в настоящем (краткие и полные формы)', 'Ставить sam/si/je на второе место'],
      skills: ['sr.pron.pers', 'sr.biti', 'sr.clitics'],
      theory: [
        { type: 'table', caption: 'Личные местоимения (номинатив)', head: ['', 'ед. ч.', 'мн. ч.'], rows: [
          ['1 л.', 'ja', 'mi'],
          ['2 л.', 'ti', 'vi / Vi'],
          ['3 л. м.', 'on', 'oni'],
          ['3 л. ж.', 'ona', 'one'],
          ['3 л. ср.', 'ono', 'ona']
        ], note: 'oni — мужчины или смешанная группа; one — только женщины; ona (мн.) — существительные ср. р.' },
        { type: 'contrast', text: 'Русское «они» одно; в сербском 3 л. мн. ч. различает род: **oni** (studenti), **one** (studentkinje), **ona** (deca, sela).' },
        { type: 'table', caption: 'biti — настоящее время', head: ['', 'краткая (энклитика)', 'полная', 'отрицание'], rows: [
          ['ja', '{{sam}}', 'jesam', 'nisam'],
          ['ti', '{{si}}', 'jesi', 'nisi'],
          ['on / ona / ono', '{{je}}', 'jeste', 'nije'],
          ['mi', '{{smo}}', 'jesmo', 'nismo'],
          ['vi', '{{ste}}', 'jeste', 'niste'],
          ['oni / one / ona', '{{su}}', 'jesu', 'nisu']
        ] },
        { type: 'rule', text: 'Краткие формы — **энклитики**: у них нет ударения, и они не могут стоять в начале предложения. Их место — **второе**, после первого ударного слова: **Ja sam student.** / **Student sam.** Но не *Sam student.*' },
        { type: 'p', text: 'Полные формы (jesam, jesi…) употребляются для эмфазы («да, я действительно…»), в кратком ответе и в начале вопроса: *Jesi li umoran? — Jesam.*' },
        { type: 'examples', items: [
          { t: 'Ja sam Marko.', ru: 'Я Марко.' },
          { t: 'Student sam.', ru: 'Я студент.', note: 'местоимение опущено, sam — после первого слова' },
          { t: 'Ona je ovde.', ru: 'Она здесь.' },
          { t: 'Mi smo kod kuće.', ru: 'Мы дома.' },
          { t: 'Oni su tamo.', ru: 'Они там.' }
        ] },
        { type: 'contrast', text: 'В русском связка в настоящем времени опускается («Я студент»). В сербском **без неё нельзя**: *Ja student* — ошибка.' },
        { type: 'pitfall', text: 'Местоимение-подлежащее обычно опускают (как в итальянском): *Umoran sam.* Но тогда sam всё равно не может начать фразу.' }
      ],
      vocab: [
        { id: 'sr-ja', w: 'ja', ru: 'я', pos: 'pron', g: null, forms: '', ex: 'Ja sam Ana.', exRu: 'Я Анна.', note: null },
        { id: 'sr-ti', w: 'ti', ru: 'ты', pos: 'pron', g: null, forms: '', ex: 'Ti si moj prijatelj.', exRu: 'Ты мой друг.', note: null },
        { id: 'sr-on', w: 'on', ru: 'он', pos: 'pron', g: null, forms: '', ex: 'On je student.', exRu: 'Он студент.', note: null },
        { id: 'sr-ona', w: 'ona', ru: 'она; они (ср. р.)', pos: 'pron', g: null, forms: '', ex: 'Ona je ovde.', exRu: 'Она здесь.', note: 'ona — также 3 л. мн. ч. ср. р.' },
        { id: 'sr-ono', w: 'ono', ru: 'оно', pos: 'pron', g: null, forms: '', ex: 'Dete? Ono spava.', exRu: 'Ребёнок? Он спит.', note: null },
        { id: 'sr-mi', w: 'mi', ru: 'мы', pos: 'pron', g: null, forms: '', ex: 'Mi smo iz Rusije.', exRu: 'Мы из России.', note: 'Омоним: mi — дат. энклитика «мне».' },
        { id: 'sr-vi', w: 'vi', ru: 'вы; Вы', pos: 'pron', g: null, forms: '', ex: 'Da li ste Vi profesor?', exRu: 'Вы профессор?', note: 'Вежливое Vi — с глаголом во мн. ч.' },
        { id: 'sr-oni', w: 'oni', ru: 'они (м. р. / смеш.)', pos: 'pron', g: null, forms: 'oni, one, ona', ex: 'Oni su studenti, one su studentkinje.', exRu: 'Они студенты, они (ж.) студентки.', note: null },
        { id: 'sr-biti', w: 'biti', ru: 'быть', pos: 'v', g: null, forms: 'biti (jesam / sam), nesvr.; отриц. nisam', ex: 'Gde si? — Ovde sam.', exRu: 'Где ты? — Я здесь.', note: 'Краткие формы — энклитики.' },
        { id: 'sr-ovde', w: 'ovde', ru: 'здесь', pos: 'adv', g: null, forms: '', ex: 'Ja sam ovde.', exRu: 'Я здесь.', note: 'Иекав. ovdje.' },
        { id: 'sr-tamo', w: 'tamo', ru: 'там', pos: 'adv', g: null, forms: '', ex: 'Stanica je tamo.', exRu: 'Остановка там.', note: null },
        { id: 'sr-sad', w: 'sad', ru: 'сейчас', pos: 'adv', g: null, forms: 'sad / sada', ex: 'Sad sam zauzet.', exRu: 'Сейчас я занят.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u02-l02',
      kind: 'grammar',
      title: 'Negacija i pitanja',
      goals: ['Отрицать: nisam, nisi, nije…', 'Задавать вопрос тремя способами', 'Пользоваться вопросительными словами'],
      skills: ['sr.biti', 'sr.questions'],
      theory: [
        { type: 'rule', text: 'Отрицательные формы **nisam, nisi, nije, nismo, niste, nisu** — ударные, пишутся слитно и **могут** начинать фразу: *Nisam umoran.*' },
        { type: 'p', text: 'С другими глаголами отрицание — частица **ne** (отдельно): *Ne znam.* Слитно пишутся только nisam, nemam (не имею), neću (не хочу / не буду).' },
        { type: 'h', text: 'Три модели вопроса' },
        { type: 'table', head: ['Модель', 'Пример', 'Комментарий'], rows: [
          ['Da li + энклитика', 'Da li si umoran?', 'основная в Сербии'],
          ['полная форма + li', 'Jesi li umoran?', 'нейтральная, общесербохорватская'],
          ['Je li…', 'Je li to tvoja kuća?', 'для 3 л. ед. ч., разговорное']
        ], note: 'li — тоже энклитика: она стоит сразу после первого слова.' },
        { type: 'examples', items: [
          { t: 'Da li ste gladni? — Nismo.', ru: 'Вы голодны? — Нет.' },
          { t: 'Jesi li zauzet? — Jesam.', ru: 'Ты занят? — Да.' },
          { t: 'Gde je Ana?', ru: 'Где Анна?' },
          { t: 'Ko je to?', ru: 'Кто это?' },
          { t: 'Šta je ovo?', ru: 'Что это?' }
        ] },
        { type: 'contrast', text: 'В русском вопрос часто выражается одной интонацией. В сербском нужен маркер — da li или полная форма + li (интонационный вопрос возможен, но разговорен). Кратко ответить можно и da/ne, и формой глагола: *Jesam / Nisam.*' },
        { type: 'tip', text: '**šta** — «что» (вопрос, сербский стандарт); **što** — в zašto (почему) и в союзах. В Хорватии во всех случаях što.' },
        { type: 'pitfall', text: 'После вопросительного слова da li не нужно: *Gde si?*, а не *Gde da li si?*' }
      ],
      vocab: [
        { id: 'sr-da', w: 'da', ru: 'да; что, чтобы (союз)', pos: 'part', g: null, forms: '', ex: 'Da, ja sam Ana.', exRu: 'Да, я Анна.', note: 'Также союз: Mislim da… — Думаю, что…' },
        { id: 'sr-ne', w: 'ne', ru: 'нет; не', pos: 'part', g: null, forms: '', ex: 'Ne, nisam umoran.', exRu: 'Нет, я не устал.', note: null },
        { id: 'sr-ko', w: 'ko', ru: 'кто', pos: 'pron', g: null, forms: 'ko, koga, kome…', ex: 'Ko je to?', exRu: 'Кто это?', note: 'Хорв. tko.' },
        { id: 'sr-šta', w: 'šta', ru: 'что', pos: 'pron', g: null, forms: 'šta, čega, čemu…', ex: 'Šta radiš?', exRu: 'Что ты делаешь?', note: 'Хорв. što.' },
        { id: 'sr-gde', w: 'gde', ru: 'где; куда', pos: 'adv', g: null, forms: '', ex: 'Gde si?', exRu: 'Где ты?', note: 'Иекав. gdje.' },
        { id: 'sr-kada', w: 'kada', ru: 'когда', pos: 'adv', g: null, forms: 'kada / kad', ex: 'Kada je čas?', exRu: 'Когда урок?', note: null },
        { id: 'sr-zašto', w: 'zašto', ru: 'почему, зачем', pos: 'adv', g: null, forms: '', ex: 'Zašto si tužan?', exRu: 'Почему ты грустный?', note: 'Ответ: zato što… — потому что…' },
        { id: 'sr-odakle', w: 'odakle', ru: 'откуда', pos: 'adv', g: null, forms: '', ex: 'Odakle ste?', exRu: 'Откуда вы?', note: null },
        { id: 'sr-umoran', w: 'umoran', ru: 'усталый', pos: 'adj', g: null, forms: 'umoran, umorna, umorno', ex: 'Umorna sam.', exRu: 'Я устала.', note: 'Беглое a: umoran — umorna.' },
        { id: 'sr-gladan', w: 'gladan', ru: 'голодный', pos: 'adj', g: null, forms: 'gladan, gladna, gladno', ex: 'Da li si gladan?', exRu: 'Ты голоден?', note: null },
        { id: 'sr-zauzet', w: 'zauzet', ru: 'занятый', pos: 'adj', g: null, forms: 'zauzet, zauzeta, zauzeto', ex: 'Sad sam zauzet.', exRu: 'Сейчас я занят.', note: null },
        { id: 'sr-srećan', w: 'srećan', ru: 'счастливый', pos: 'adj', g: null, forms: 'srećan, srećna, srećno', ex: 'Srećna sam.', exRu: 'Я счастлива.', note: 'Хорв. sretan.' }
      ],
      text: null
    },
    {
      id: 'sr-u02-l03',
      kind: 'vocab',
      title: 'Zanimanja i nacionalnosti',
      goals: ['Называть профессии и национальности в м. и ж. роде', 'Говорить, откуда ты и какой язык знаешь'],
      skills: ['sr.lex.people', 'sr.biti'],
      theory: [
        { type: 'p', text: 'Для женщин используются особые суффиксы: student → student{{kinja}}, lekar → lekar{{ka}}, konobar → konobar{{ica}}, Rus → Rus{{kinja}}, Srbin → Srp{{kinja}} (b → p перед k — фонетическое письмо).' },
        { type: 'rule', text: 'Названия людей по национальности — с заглавной (**Rus, Srpkinja**), прилагательные и языки — со строчной (**ruski, srpski**), как в русском.' },
        { type: 'examples', items: [
          { t: 'Ja sam Rus. Ona je Ruskinja.', ru: 'Я русский. Она русская.' },
          { t: 'Govorim srpski.', ru: 'Я говорю по-сербски.', note: 'язык — в аккузативе без предлога' },
          { t: 'Ja sam iz Rusije.', ru: 'Я из России.' }
        ] },
        { type: 'contrast', text: '«Говорить по-сербски» = **govoriti srpski** (прилагательное в роли существительного), «на сербском» = **na srpskom**.' }
      ],
      vocab: [
        { id: 'sr-student', w: 'student', ru: 'студент', pos: 'n', g: 'm', forms: 'student, -a m. (мн. studenti, Г. мн. studenata)', ex: 'On je student.', exRu: 'Он студент.', note: null },
        { id: 'sr-studentkinja', w: 'studentkinja', ru: 'студентка', pos: 'n', g: 'f', forms: 'studentkinja, -e f.', ex: 'Ona je studentkinja.', exRu: 'Она студентка.', note: null },
        { id: 'sr-lekar', w: 'lekar', ru: 'врач', pos: 'n', g: 'm', forms: 'lekar, -a m. (ж. lekarka)', ex: 'Moj otac je lekar.', exRu: 'Мой отец — врач.', note: 'Иекав. ljekar; разг. doktor.' },
        { id: 'sr-profesor', w: 'profesor', ru: 'преподаватель, профессор', pos: 'n', g: 'm', forms: 'profesor, -a m. (ж. profesorka)', ex: 'Ona je profesorka srpskog.', exRu: 'Она преподаватель сербского.', note: 'profesor — и школьный учитель-предметник.' },
        { id: 'sr-konobar', w: 'konobar', ru: 'официант', pos: 'n', g: 'm', forms: 'konobar, -a m. (ж. konobarica)', ex: 'Konobar, račun, molim!', exRu: 'Официант, счёт, пожалуйста!', note: null },
        { id: 'sr-inženjer', w: 'inženjer', ru: 'инженер', pos: 'n', g: 'm', forms: 'inženjer, -a m.', ex: 'Brat je inženjer.', exRu: 'Брат — инженер.', note: null },
        { id: 'sr-rus', w: 'Rus', ru: 'русский (человек)', pos: 'n', g: 'm', forms: 'Rus, -a m. (мн. Rusi)', ex: 'Ja sam Rus.', exRu: 'Я русский.', note: null },
        { id: 'sr-ruskinja', w: 'Ruskinja', ru: 'русская (женщина)', pos: 'n', g: 'f', forms: 'Ruskinja, -e f.', ex: 'Maša je Ruskinja.', exRu: 'Маша — русская.', note: null },
        { id: 'sr-srbin', w: 'Srbin', ru: 'серб', pos: 'n', g: 'm', forms: 'Srbin, -a m. (мн. Srbi)', ex: 'Marko je Srbin.', exRu: 'Марко — серб.', note: 'Во мн. ч. суффикс -in выпадает: Srbi.' },
        { id: 'sr-srpkinja', w: 'Srpkinja', ru: 'сербка', pos: 'n', g: 'f', forms: 'Srpkinja, -e f.', ex: 'Jelena je Srpkinja.', exRu: 'Елена — сербка.', note: 'b → p перед k.' },
        { id: 'sr-ruski', w: 'ruski', ru: 'русский (прил.); русский язык', pos: 'adj', g: null, forms: 'ruski, ruska, rusko', ex: 'Govoriš li ruski?', exRu: 'Ты говоришь по-русски?', note: null },
        { id: 'sr-srpski', w: 'srpski', ru: 'сербский; сербский язык', pos: 'adj', g: null, forms: 'srpski, srpska, srpsko', ex: 'Učim srpski.', exRu: 'Я учу сербский.', note: null },
        { id: 'sr-rusija', w: 'Rusija', ru: 'Россия', pos: 'n', g: 'f', forms: 'Rusija, -e f.', ex: 'Ja sam iz Rusije.', exRu: 'Я из России.', note: null },
        { id: 'sr-srbija', w: 'Srbija', ru: 'Сербия', pos: 'n', g: 'f', forms: 'Srbija, -e f.', ex: 'Živim u Srbiji.', exRu: 'Я живу в Сербии.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u02-l04',
      kind: 'reading',
      title: 'Na fakultetu',
      goals: ['Понять диалог с вежливым Vi', 'Узнать формы biti в живой речи'],
      skills: ['sr.biti', 'sr.questions', 'sr.lex.people'],
      theory: [
        { type: 'tip', text: 'Обратите внимание: в вежливом обращении прилагательное стоит во мн. ч. — *Da li ste umorni?* (к одному человеку на Vi).' }
      ],
      vocab: [
        { id: 'sr-fakultet', w: 'fakultet', ru: 'факультет; университет (разг.)', pos: 'n', g: 'm', forms: 'fakultet, -a m.', ex: 'Ja sam na fakultetu.', exRu: 'Я в университете.', note: 'На fakultetu — с предлогом na.' },
        { id: 'sr-malo', w: 'malo', ru: 'немного, мало', pos: 'adv', g: null, forms: '', ex: 'Malo sam umoran.', exRu: 'Я немного устал.', note: null },
        { id: 'sr-veoma', w: 'veoma', ru: 'очень', pos: 'adv', g: null, forms: '', ex: 'Veoma mi je drago.', exRu: 'Мне очень приятно.', note: 'Синонимы: jako, vrlo.' },
        { id: 'sr-ali', w: 'ali', ru: 'но', pos: 'conj', g: null, forms: '', ex: 'Umoran sam, ali srećan.', exRu: 'Я устал, но счастлив.', note: null },
        { id: 'sr-ovo', w: 'ovo', ru: 'это (здесь, рядом)', pos: 'pron', g: null, forms: '', ex: 'Šta je ovo?', exRu: 'Что это?', note: 'ovo — близко к говорящему, to — нейтрально, ono — далеко.' },
        { id: 'sr-to', w: 'to', ru: 'это; то', pos: 'pron', g: null, forms: '', ex: 'To je moja sestra.', exRu: 'Это моя сестра.', note: null },
        { id: 'sr-prijatelj', w: 'prijatelj', ru: 'друг', pos: 'n', g: 'm', forms: 'prijatelj, -a m. (мн. prijatelji)', ex: 'Ivan je moj prijatelj.', exRu: 'Иван — мой друг.', note: 'Вок. prijatelju, твор. prijateljem.' },
        { id: 'sr-prijateljica', w: 'prijateljica', ru: 'подруга', pos: 'n', g: 'f', forms: 'prijateljica, -e f.', ex: 'Ana je moja prijateljica.', exRu: 'Анна — моя подруга.', note: null },
        { id: 'sr-iz', w: 'iz', ru: 'из', pos: 'prep', g: null, forms: '+ Г.', ex: 'Odakle si? — Iz Moskve.', exRu: 'Откуда ты? — Из Москвы.', note: null }
      ],
      text: {
        title: 'Na fakultetu',
        lines: [
          { t: 'Maša: Izvinite, da li ste Vi profesor Petrović?', ru: 'Маша: Извините, вы профессор Петрович?' },
          { t: 'Profesor: Jesam. A ko ste Vi?', ru: 'Профессор: Да. А вы кто?' },
          { t: 'Maša: Ja sam Maša. Studentkinja sam. Iz Rusije sam.', ru: 'Маша: Я Маша. Я студентка. Я из России.' },
          { t: 'Profesor: Drago mi je, Maša. Da li ste umorni?', ru: 'Профессор: Очень приятно, Маша. Вы устали?' },
          { t: 'Maša: Nisam umorna, ali sam malo gladna.', ru: 'Маша: Я не устала, но немного голодна.' },
          { t: 'Profesor: I ja sam gladan! Kafeterija je tamo.', ru: 'Профессор: Я тоже голоден! Кафетерий там.' },
          { t: 'Maša: Hvala. A ko je ovo?', ru: 'Маша: Спасибо. А кто это?' },
          { t: 'Profesor: To je Ivan. On je student i Vaš novi prijatelj.', ru: 'Профессор: Это Иван. Он студент и ваш новый друг.' }
        ]
      }
    }
  ]
}
