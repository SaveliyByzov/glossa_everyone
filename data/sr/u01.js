export default {
  id: 'sr-u01',
  title: 'Azbuka, abeceda i izgovor',
  titleRu: 'Алфавиты, произношение, первые фразы',
  summary: 'Две равноправные графики — кириллица Вука и латиница Гая, принцип «одна буква — один звук», особые согласные (č/ć, dž/đ, lj/nj), слоговое r и первые фразы вежливости.',
  lessons: [
    {
      id: 'sr-u01-l01',
      keepScript: true,
      kind: 'grammar',
      title: 'Ћирилица и latinica',
      goals: ['Читать сербскую кириллицу и латиницу', 'Переводить слово из одной графики в другую', 'Не путать ј/j, ц/c, х/h'],
      skills: ['sr.script'],
      theory: [
        { type: 'p', text: 'Сербский — **диграфичный** язык. Официальная графика — **кириллица** (азбука Вука Караджича, 1818; официально с 1868 г.), в быту равноправно используется **латиница** (гаевица, 1830-е; букву đ ввёл Дж. Даничич). Обе системы соответствуют друг другу **один к одному** — любой текст механически переводится из одной в другую.' },
        { type: 'rule', text: '**Одна буква — один звук.** Пишется так, как произносится, и читается всё, что написано. 30 букв в обеих графиках; lj, nj, dž в латинице — это одна буква (диграф).' },
        { type: 'table', caption: 'Соответствие график (порядок азбуки)', head: ['Ћир.', 'Lat.', 'Звук'], rows: [
          ['А а', 'A a', '[а]'], ['Б б', 'B b', '[б]'], ['В в', 'V v', '[в]'], ['Г г', 'G g', '[г]'], ['Д д', 'D d', '[д]'],
          ['Ђ ђ', 'Đ đ', 'мягкое звонкое [дь’], пара к ć'], ['Е е', 'E e', '[э] — без смягчения'], ['Ж ж', 'Ž ž', '[ж]'], ['З з', 'Z z', '[з]'], ['И и', 'I i', '[и]'],
          ['Ј ј', 'J j', '[й]'], ['К к', 'K k', '[к]'], ['Л л', 'L l', '[л]'], ['Љ љ', 'Lj lj', '[ль]'], ['М м', 'M m', '[м]'],
          ['Н н', 'N n', '[н]'], ['Њ њ', 'Nj nj', '[нь]'], ['О о', 'O o', '[о] — без аканья'], ['П п', 'P p', '[п]'], ['Р р', 'R r', '[р], бывает слоговым'],
          ['С с', 'S s', '[с]'], ['Т т', 'T t', '[т]'], ['Ћ ћ', 'Ć ć', 'мягкое [ть’], близко к русскому ч'], ['У у', 'U u', '[у]'], ['Ф ф', 'F f', '[ф]'],
          ['Х х', 'H h', '[х], слабее русского'], ['Ц ц', 'C c', '[ц]'], ['Ч ч', 'Č č', 'твёрдое [ч]'], ['Џ џ', 'Dž dž', 'твёрдое звонкое [дж]'], ['Ш ш', 'Š š', '[ш]']
        ], note: 'Латинская абецеда идёт в другом порядке: A B C Č Ć D Dž Đ E F G H I J K L Lj M N Nj O P R S Š T U V Z Ž.' },
        { type: 'examples', items: [
          { t: 'Beograd', ru: 'Белград', note: 'Београд' },
          { t: 'hvala', ru: 'спасибо', note: 'хвала' },
          { t: 'jabuka', ru: 'яблоко', note: 'јабука — ј = й' },
          { t: 'ljubav', ru: 'любовь', note: 'љубав — lj одна буква' },
          { t: 'noć', ru: 'ночь', note: 'ноћ' },
          { t: 'džep', ru: 'карман', note: 'џеп' },
          { t: 'đak', ru: 'школьник', note: 'ђак' },
          { t: 'Njujork', ru: 'Нью-Йорк', note: 'Њујорк — иностранные имена пишутся по произношению' }
        ] },
        { type: 'contrast', text: 'Буквы-«обманщики» для русского глаза: кир. **в** = v, **н** = n, **р** = r, **с** = s, **у** = u, **х** = h; лат. **c** = ц, **j** = й, **h** = х. В сербской кириллице **нет** я, ю, ё, э, ы, щ, й, ъ, ь: «я» пишется ја (ja), «ю» — ју (ju), мягкость — отдельными буквами љ, њ, ћ, ђ.' },
        { type: 'pitfall', text: 'На стыке морфем dž, lj, nj могут быть **двумя** буквами: nad-živeti → кир. **надживети** (д+ж, не џ), kon-jugacija → **конјугација** (н+ј, не њ).' },
        { type: 'tip', text: 'В курсе всё пишется латиницей, но ответ можно вводить любой графикой — движок считает их равными. Курсивные кириллические б, г, д, п, т в сербской типографике выглядят иначе, чем в русской: не пугайтесь.' }
      ],
      vocab: [
        { id: 'sr-voda', w: 'voda', ru: 'вода', pos: 'n', g: 'f', forms: 'voda, -e f. (мн. vode)', ex: 'Voda je hladna.', exRu: 'Вода холодная.', note: 'Читается [вода], без аканья.' },
        { id: 'sr-čaj', w: 'čaj', ru: 'чай', pos: 'n', g: 'm', forms: 'čaj, -a m. (мн. čajevi)', ex: 'Čaj je topao.', exRu: 'Чай тёплый.', note: null },
        { id: 'sr-kafa', w: 'kafa', ru: 'кофе', pos: 'n', g: 'f', forms: 'kafa, -e f.', ex: 'Kafa je dobra.', exRu: 'Кофе хороший.', note: 'Женский род! В Хорватии — kava.' },
        { id: 'sr-hleb', w: 'hleb', ru: 'хлеб', pos: 'n', g: 'm', forms: 'hleb, -a m.', ex: 'Hleb je svež.', exRu: 'Хлеб свежий.', note: 'Иекавское hljeb; хорв. kruh.' },
        { id: 'sr-kuća', w: 'kuća', ru: 'дом', pos: 'n', g: 'f', forms: 'kuća, -e f.', ex: 'Kuća je velika.', exRu: 'Дом большой.', note: 'Ложный друг: не «куча» (= gomila).' },
        { id: 'sr-škola', w: 'škola', ru: 'школа', pos: 'n', g: 'f', forms: 'škola, -e f.', ex: 'Škola je blizu.', exRu: 'Школа близко.', note: null },
        { id: 'sr-jabuka', w: 'jabuka', ru: 'яблоко', pos: 'n', g: 'f', forms: 'jabuka, -e f. (дат./лок. jabuci)', ex: 'Jabuka je crvena.', exRu: 'Яблоко красное.', note: 'Женский род; j = й: [йабука].' },
        { id: 'sr-ljubav', w: 'ljubav', ru: 'любовь', pos: 'n', g: 'f', forms: 'ljubav, ljubavi f.', ex: 'Ljubav je slepa.', exRu: 'Любовь слепа.', note: 'Ж. р. на согласный (i-склонение), без мягкого знака.' },
        { id: 'sr-noć', w: 'noć', ru: 'ночь', pos: 'n', g: 'f', forms: 'noć, noći f.', ex: 'Noć je duga.', exRu: 'Ночь длинная.', note: null },
        { id: 'sr-đak', w: 'đak', ru: 'школьник, ученик', pos: 'n', g: 'm', forms: 'đak, -a m. (мн. đaci)', ex: 'On je dobar đak.', exRu: 'Он хороший ученик.', note: 'Мн. ч. đaci: k → c перед -i.' },
        { id: 'sr-džep', w: 'džep', ru: 'карман', pos: 'n', g: 'm', forms: 'džep, -a m. (мн. džepovi)', ex: 'Ključ je u džepu.', exRu: 'Ключ в кармане.', note: null },
        { id: 'sr-ćirilica', w: 'ćirilica', ru: 'кириллица', pos: 'n', g: 'f', forms: 'ćirilica, -e f.', ex: 'Čitam ćirilicu.', exRu: 'Я читаю кириллицу.', note: null },
        { id: 'sr-latinica', w: 'latinica', ru: 'латиница', pos: 'n', g: 'f', forms: 'latinica, -e f.', ex: 'Pišem latinicom.', exRu: 'Я пишу латиницей.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u01-l02',
      keepScript: true,
      kind: 'grammar',
      title: 'Izgovor i naglasak',
      goals: ['Различать č/ć и dž/đ', 'Произносить гласные без редукции и согласные без смягчения', 'Читать слоговое r', 'Знать основы сербского ударения'],
      skills: ['sr.phon'],
      theory: [
        { type: 'h', text: 'Гласные: пять и без редукции' },
        { type: 'p', text: 'a, e, i, o, u звучат одинаково в любой позиции: **voda** [вода], **mleko** [млеко], **dobro** [добро]. Долгота гласных смыслоразличительна, но на письме не отмечается.' },
        { type: 'h', text: 'Согласные: нет парной мягкости' },
        { type: 'rule', text: 'Перед e и i согласные **не смягчаются**: dete [дэтэ], ne [нэ], ti [ти] с твёрдым т. Мягкие согласные — отдельные фонемы: **lj, nj, ć, đ, j**.' },
        { type: 'table', caption: 'Две пары аффрикат', head: ['Буква', 'Звук', 'Примеры'], rows: [
          ['č', 'твёрдое ч (как польск. cz)', 'čaša, čovek, čaj'],
          ['ć', 'мягкое, ближе к русскому ч', 'kuća, noć, ćerka'],
          ['dž', 'твёрдое звонкое дж', 'džep, džem'],
          ['đ', 'мягкое звонкое дь’', 'đak, rođendan']
        ], note: 'Русское ч стоит ближе к ć; čaj произносится твёрже, чем русское «чай».' },
        { type: 'h', text: 'Слоговое r' },
        { type: 'p', text: 'Между согласными **r** образует слог: **prst** (палец), **srce** (сердце), **trg** (площадь), **crn** (чёрный), **Srbija**. Не вставляйте гласную: [пр̥ст], не [пэрст].' },
        { type: 'h', text: 'Фонетическое письмо' },
        { type: 'p', text: 'Ассимиляция по звонкости отражается на письме: sladak — sla{{t}}ka (сладкий — сладкая), Srbin — Sr{{p}}kinja. В конце слова звонкие в норме **не оглушаются**: grad звучит с [д].' },
        { type: 'contrast', text: 'Русская орфография морфологическая («сладкий» с д), сербская — фонетическая. Русское аканье и оглушение («го[р]о[т]») переносить нельзя: govorim, grad.' },
        { type: 'h', text: 'Ударение' },
        { type: 'p', text: 'Ударение музыкальное: **четыре типа** (краткий нисходящий, краткий восходящий, долгий нисходящий, долгий восходящий) + заударные долготы. Практические правила: в односложных словах ударение всегда нисходящее; нисходящие бывают только на первом слоге; **последний слог не бывает ударным** (кроме немногих заимствований и междометий).' },
        { type: 'tip', text: 'В курсе ударение не размечается. Для начала: ставьте ударение ближе к началу слова и никогда на конец — и слушайте озвучку.' },
        { type: 'pitfall', text: 'Не смягчайте согласные по-русски: dete — [дэтэ], а не [д’ет’е]; nebo — [нэбо].' }
      ],
      vocab: [
        { id: 'sr-čovek', w: 'čovek', ru: 'человек; мужчина', pos: 'n', g: 'm', forms: 'čovek, -a m. (мн. ljudi)', ex: 'Taj čovek je moj otac.', exRu: 'Тот человек — мой отец.', note: 'Мн. ч. супплетивное — ljudi. Иекав. čovjek. Вок. čoveče.' },
        { id: 'sr-ćerka', w: 'ćerka', ru: 'дочь', pos: 'n', g: 'f', forms: 'ćerka, -e f.', ex: 'Ovo je moja ćerka.', exRu: 'Это моя дочь.', note: 'Книжн. kći (kćeri).' },
        { id: 'sr-čaša', w: 'čaša', ru: 'стакан, бокал', pos: 'n', g: 'f', forms: 'čaša, -e f.', ex: 'Čaša vode, molim.', exRu: 'Стакан воды, пожалуйста.', note: 'Ложный друг: не «чаша».' },
        { id: 'sr-mleko', w: 'mleko', ru: 'молоко', pos: 'n', g: 'n', forms: 'mleko, -a n.', ex: 'Pijem kafu sa mlekom.', exRu: 'Я пью кофе с молоком.', note: 'Иекав. mlijeko.' },
        { id: 'sr-dete', w: 'dete', ru: 'ребёнок', pos: 'n', g: 'n', forms: 'dete, deteta n. (мн. deca)', ex: 'Dete spava.', exRu: 'Ребёнок спит.', note: 'deca — собирательное: прилагательное в ж. р. ед. ч. (mala deca), глагол во мн. ч. (Deca spavaju). Иекав. dijete.' },
        { id: 'sr-srce', w: 'srce', ru: 'сердце', pos: 'n', g: 'n', forms: 'srce, -a n.', ex: 'Imaš dobro srce.', exRu: 'У тебя доброе сердце.', note: 'Слоговое r.' },
        { id: 'sr-prst', w: 'prst', ru: 'палец', pos: 'n', g: 'm', forms: 'prst, -a m. (мн. prsti)', ex: 'Imam pet prstiju.', exRu: 'У меня пять пальцев.', note: 'Слоговое r. Г. мн. prstiju.' },
        { id: 'sr-trg', w: 'trg', ru: 'площадь', pos: 'n', g: 'm', forms: 'trg, -a m. (мн. trgovi)', ex: 'Trg je u centru.', exRu: 'Площадь в центре.', note: 'Trg republike — главная площадь Белграда.' },
        { id: 'sr-reka', w: 'reka', ru: 'река', pos: 'n', g: 'f', forms: 'reka, -e f. (лок. reci)', ex: 'Sava je reka.', exRu: 'Сава — река.', note: 'Иекав. rijeka.' },
        { id: 'sr-rođendan', w: 'rođendan', ru: 'день рождения', pos: 'n', g: 'm', forms: 'rođendan, -a m.', ex: 'Srećan rođendan!', exRu: 'С днём рождения!', note: null },
        { id: 'sr-vreme', w: 'vreme', ru: 'время; погода', pos: 'n', g: 'n', forms: 'vreme, vremena n. (мн. vremena)', ex: 'Kakvo je vreme danas?', exRu: 'Какая сегодня погода?', note: 'Иекав. vrijeme. Основа на -en- (как русск. «время — времени»).' }
      ],
      text: null
    },
    {
      id: 'sr-u01-l03',
      kind: 'vocab',
      title: 'Pozdravi i učtivost',
      goals: ['Здороваться и прощаться в разное время суток', 'Различать ti и Vi', 'Благодарить, извиняться, предлагать'],
      skills: ['sr.lex.greetings'],
      theory: [
        { type: 'p', text: 'Как и в русском, есть **ti** (ты) и вежливое **Vi** (Вы; в письме с заглавной). С незнакомыми и старшими — Vi: *Kako ste?* С друзьями — ti: *Kako si?*' },
        { type: 'examples', items: [
          { t: 'Dobar dan! Kako ste?', ru: 'Добрый день! Как вы?' },
          { t: 'Dobro sam, hvala. A Vi?', ru: 'Хорошо, спасибо. А вы?' },
          { t: 'Izvolite!', ru: 'Пожалуйста! (вот, прошу, берите)' },
          { t: 'Hvala lepo! — Nema na čemu.', ru: 'Большое спасибо! — Не за что.' }
        ] },
        { type: 'rule', text: '**Molim** — универсальное слово: «пожалуйста» (просьба), «пожалуйста» (ответ на спасибо), «что?» (переспрос). **Izvolite** — «пожалуйста» при подаче, приглашении: вот, прошу.' },
        { type: 'contrast', text: '**jutro** = «утро» — тут всё как в русском, а вот **sutra** = «завтра» (не «с утра»), а завтрак — doručak.' },
        { type: 'tip', text: 'zdravo и ćao — неформально, при встрече и прощании. Doviđenja пишется слитно.' }
      ],
      vocab: [
        { id: 'sr-zdravo', w: 'zdravo', ru: 'привет; пока', pos: 'phr', g: null, forms: '', ex: 'Zdravo, Ana!', exRu: 'Привет, Анна!', note: 'Неформально.' },
        { id: 'sr-ćao', w: 'ćao', ru: 'привет; пока', pos: 'phr', g: null, forms: '', ex: 'Ćao, vidimo se!', exRu: 'Пока, увидимся!', note: 'Из итальянского ciao.' },
        { id: 'sr-dobar-dan', w: 'dobar dan', ru: 'добрый день', pos: 'phr', g: null, forms: '', ex: 'Dobar dan, gospodine.', exRu: 'Добрый день, господин.', note: null },
        { id: 'sr-dobro-jutro', w: 'dobro jutro', ru: 'доброе утро', pos: 'phr', g: null, forms: '', ex: 'Dobro jutro, mama!', exRu: 'Доброе утро, мама!', note: null },
        { id: 'sr-dobro-vece', w: 'dobro veče', ru: 'добрый вечер', pos: 'phr', g: null, forms: '', ex: 'Dobro veče svima.', exRu: 'Добрый вечер всем.', note: 'Хорв. dobra večer.' },
        { id: 'sr-laku-noć', w: 'laku noć', ru: 'спокойной ночи', pos: 'phr', g: null, forms: '', ex: 'Laku noć, deco!', exRu: 'Спокойной ночи, дети!', note: 'Аккузатив пожелания: laku noć.' },
        { id: 'sr-doviđenja', w: 'doviđenja', ru: 'до свидания', pos: 'phr', g: null, forms: '', ex: 'Hvala, doviđenja!', exRu: 'Спасибо, до свидания!', note: 'Пишется слитно.' },
        { id: 'sr-hvala', w: 'hvala', ru: 'спасибо', pos: 'phr', g: null, forms: '', ex: 'Hvala lepo!', exRu: 'Большое спасибо!', note: 'Hvala lepo / hvala puno.' },
        { id: 'sr-molim', w: 'molim', ru: 'пожалуйста; что? (переспрос)', pos: 'phr', g: null, forms: '', ex: 'Kafu, molim.', exRu: 'Кофе, пожалуйста.', note: 'Букв. «прошу» (moliti).' },
        { id: 'sr-izvinite', w: 'izvinite', ru: 'извините', pos: 'phr', g: null, forms: '(ti: izvini)', ex: 'Izvinite, gde je stanica?', exRu: 'Извините, где остановка?', note: null },
        { id: 'sr-izvolite', w: 'izvolite', ru: 'пожалуйста (вот, прошу)', pos: 'phr', g: null, forms: '(ti: izvoli)', ex: 'Izvolite, Vaša kafa.', exRu: 'Пожалуйста, ваш кофе.', note: 'Также «Что вам угодно?» в магазине.' },
        { id: 'sr-drago-mi-je', w: 'drago mi je', ru: 'очень приятно', pos: 'phr', g: null, forms: '', ex: 'Ja sam Ivan. — Drago mi je.', exRu: 'Я Иван. — Очень приятно.', note: 'Букв. «мне мило».' },
        { id: 'sr-nema-na-čemu', w: 'nema na čemu', ru: 'не за что', pos: 'phr', g: null, forms: '', ex: 'Hvala! — Nema na čemu.', exRu: 'Спасибо! — Не за что.', note: null }
      ],
      text: null
    },
    {
      id: 'sr-u01-l04',
      kind: 'reading',
      title: 'Upoznavanje',
      goals: ['Понять диалог знакомства', 'Представиться и спросить имя'],
      skills: ['sr.lex.greetings', 'sr.phon'],
      theory: [
        { type: 'p', text: 'Как спросить имя: **Kako se zoveš?** (ты) / **Kako se zovete?** (Вы) — букв. «как ты зовёшься». Ответ: **Zovem se Ana.**' },
        { type: 'tip', text: '**Vidimo se!** — «Увидимся!» — самое частое дружеское прощание.' }
      ],
      vocab: [
        { id: 'sr-kako', w: 'kako', ru: 'как', pos: 'adv', g: null, forms: '', ex: 'Kako si?', exRu: 'Как дела? (Как ты?)', note: null },
        { id: 'sr-dobro', w: 'dobro', ru: 'хорошо', pos: 'adv', g: null, forms: '', ex: 'Dobro sam.', exRu: 'Я в порядке.', note: null },
        { id: 'sr-odlično', w: 'odlično', ru: 'отлично', pos: 'adv', g: null, forms: '', ex: 'Odlično, hvala!', exRu: 'Отлично, спасибо!', note: null },
        { id: 'sr-i', w: 'i', ru: 'и', pos: 'conj', g: null, forms: '', ex: 'Ana i Ivan', exRu: 'Анна и Иван', note: null },
        { id: 'sr-a', w: 'a', ru: 'а', pos: 'conj', g: null, forms: '', ex: 'A ti?', exRu: 'А ты?', note: 'Противительное, как русское «а».' },
        { id: 'sr-ime', w: 'ime', ru: 'имя', pos: 'n', g: 'n', forms: 'ime, imena n. (мн. imena)', ex: 'Moje ime je Ana.', exRu: 'Меня зовут Анна.', note: 'Основа на -en-, как русск. «имя — имени».' },
        { id: 'sr-zvati-se', w: 'zvati se', ru: 'называться, зваться', pos: 'v', g: null, forms: 'zvati se (zovem se), nesvr.', ex: 'Kako se zoveš?', exRu: 'Как тебя зовут?', note: 'se — энклитика, стоит на втором месте.' },
        { id: 'sr-takođe', w: 'takođe', ru: 'тоже, также', pos: 'adv', g: null, forms: '', ex: 'I meni je takođe drago.', exRu: 'Мне тоже приятно.', note: null },
        { id: 'sr-vidimo-se', w: 'vidimo se', ru: 'увидимся', pos: 'phr', g: null, forms: '', ex: 'Vidimo se sutra!', exRu: 'Увидимся завтра!', note: null },
        { id: 'sr-sutra', w: 'sutra', ru: 'завтра', pos: 'adv', g: null, forms: '', ex: 'Sutra je subota.', exRu: 'Завтра суббота.', note: 'Ловушка: не «с утра». Утро — jutro.' }
      ],
      text: {
        title: 'Upoznavanje',
        lines: [
          { t: 'Ana: Dobar dan! Kako se zoveš?', ru: 'Анна: Добрый день! Как тебя зовут?' },
          { t: 'Ivan: Zdravo! Zovem se Ivan. A ti?', ru: 'Иван: Привет! Меня зовут Иван. А тебя?' },
          { t: 'Ana: Ja sam Ana. Drago mi je.', ru: 'Анна: Я Анна. Очень приятно.' },
          { t: 'Ivan: I meni je drago. Kako si?', ru: 'Иван: Мне тоже. Как дела?' },
          { t: 'Ana: Odlično, hvala. A ti?', ru: 'Анна: Отлично, спасибо. А у тебя?' },
          { t: 'Ivan: Dobro sam. Izvini, moram da idem.', ru: 'Иван: Хорошо. Извини, мне надо идти.' },
          { t: 'Ana: Nema problema. Vidimo se sutra!', ru: 'Анна: Без проблем. Увидимся завтра!' },
          { t: 'Ivan: Ćao, Ana!', ru: 'Иван: Пока, Анна!' }
        ]
      }
    }
  ]
}
