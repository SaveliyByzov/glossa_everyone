// Glossa — параметры методики и геймификации (методолог).
// Смысл всех параметров — docs/PEDAGOGY.md. Поля сверх CONTRACT.md помечены «// +».
export default {
  xp: {
    correct: 10,
    firstTry: 5,
    lessonComplete: 20,
    perfectLesson: 30,
    review: 5,
    mistakeFixed: 5,            // + ошибка окончательно ушла из банка
    bossPassed: 50,             // + босс юнита пройден
    placementPassed: 30,        // + входной тест юнита пройден
    masteredReplayFactor: 0.3,  // + множитель XP за урок на мастерстве 5 без decay (анти-гринд)
    speedBonus: 0               // + сознательно 0: скорость не награждается
  },

  dailyGoals: [20, 50, 100, 200],
  defaultDailyGoal: 50,         // +

  streak: {
    freezes: 2,
    maxFreezes: 2,              // +
    earnFreezeEvery: 7,         // + дней серии за новую заморозку
    vacationDays: 14            // + дней паузы серии в год
  },

  session: {
    lessonLength: 12,
    reviewLength: 15,
    mixOldRatio: 0.2,                               // learn (sr)
    mixOldRatioByMode: { learn: 0.2, review: 0.3 }, // +
    maxSameTypeInRow: 3,                            // +
    maxSameSkillInRow: 2,                           // + для повторения
    retryWrongInLesson: true,                       // + ошибка возвращается в конце урока (1 раз)
    reviewMix: { mistakes: 0.3, skills: 0.4, vocab: 0.3 }, // +
    crossLanguage: false,                           // + межъязыковое повторение (по умолчанию выкл.)
    crossLanguageBlock: [3, 5],                     // + размер блока одного языка
    placement: {                                    // + входной тест юнита (только mode:'review')
      length: [8, 12], perSkill: [2, 3], levels: [2, 3],
      excludeTypes: ['choice', 'match'],
      passSkill: 0.85, grantMastery: 3
    },
    boss: {                                         // + смешанный тест юнита
      length: [15, 20], levels: [2, 3],
      excludeTypes: ['choice', 'match'],
      pass: 0.8, unlockMastery: { learn: 3, review: 0 },
      grantMastery: 4, retryAfterHours: 20
    },
    unlockNextLesson: { learn: 3, review: 1 }       // + мин. мастерство урока для открытия следующего
  },

  mastery: {
    levels: 5,
    thresholds: [0.6, 0.75, 0.85, 0.9, 0.95],
    window: 3,                          // + последние N сессий урока
    weights: [0.5, 0.3, 0.2],           // + вес свежей → старой сессии
    spacedForLevel: { 4: 2, 5: 3 },     // + уровень требует сессий в N разных днях
    decayDays: [3, 7, 14, 30, 60],      // + срок свежести уровней 1..5, затем −1 уровень
    decayGrowth: 2,                     // + восстановление уровня умножает срок
    floor: 1                            // + пройденный урок не опускается ниже
  },

  srs: {
    algorithm: 'sm2-lite',
    learningSteps: [10, 1440],          // минуты
    graduatingInterval: 3,              // дни
    easyBonus: 1.3,
    startEase: 2.5,                     // +
    minEase: 1.3,                       // +
    lapseEasePenalty: 0.2,              // +
    almostCorrectFactor: 1.0,           // + «почти верно»: интервал ×1, ease не растёт
    maxInterval: 180,                   // + дни
    matureInterval: 21,                 // + лексема «в долговременной памяти»
    applyTo: ['vocab', 'skills'],       // +
    overdueCap: 3                       // + долг > 3×reviewLength → растягиваем просроченное
  },

  mistakes: {                           // + банк ошибок
    clearAfterCorrect: 2,               // верных ответов в разные дни для удаления
    dueSteps: [1, 3],                   // дни до возвращения
    countAlmostAsError: false
  },

  achievements: [
    // — старт и регулярность —
    { id: 'first-lesson',   title: 'Первая строка',        desc: 'Пройти первый урок',                         icon: '✒️', rule: { type: 'lessons', value: 1 } },
    { id: 'streak-3',       title: 'Три дня кряду',        desc: '3 дня подряд с выполненной целью',           icon: '🕯️', rule: { type: 'streak', value: 3 } },
    { id: 'streak-7',       title: 'Седмица',              desc: '7 дней подряд',                              icon: '🔥', rule: { type: 'streak', value: 7 } },
    { id: 'streak-30',      title: 'Месяц в скриптории',   desc: '30 дней подряд',                             icon: '📜', rule: { type: 'streak', value: 30 } },
    { id: 'streak-100',     title: 'Centuria',             desc: '100 дней подряд',                            icon: '🏛️', rule: { type: 'streak', value: 100 } },
    { id: 'goal-30',        title: 'Верность цели',        desc: 'Дневная цель выполнена в 30 разных дней',    icon: '🎯', rule: { type: 'goalDays', value: 30 } },
    { id: 'lessons-25',     title: 'Четверть сотни',       desc: 'Пройти 25 уроков',                           icon: '📘', rule: { type: 'lessons', value: 25 } },
    { id: 'lessons-100',    title: 'Кодекс',               desc: 'Пройти 100 уроков',                          icon: '📚', rule: { type: 'lessons', value: 100 } },

    // — точность —
    { id: 'perfect-1',      title: 'Безошибочный урок',    desc: 'Урок без единой ошибки',                     icon: '✨', rule: { type: 'perfect', value: 1 } },
    { id: 'perfect-10',     title: 'Твёрдая рука',         desc: '10 безошибочных уроков',                     icon: '🖋️', rule: { type: 'perfect', value: 10 } },
    { id: 'perfect-50',     title: 'Каллиграф',            desc: '50 безошибочных уроков',                     icon: '🪶', rule: { type: 'perfect', value: 50 } },
    { id: 'boss-1',         title: 'Испытание юнита',      desc: 'Пройти первого «босса» юнита',               icon: '🛡️', rule: { type: 'bossPassed', value: 1 } },
    { id: 'boss-perfect',   title: 'Summa cum laude',      desc: 'Пройти «босса» юнита без ошибок',            icon: '🏅', rule: { type: 'bossPerfect', value: 1 } },

    // — повторение и работа над ошибками —
    { id: 'reviews-100',    title: 'Repetitio',            desc: '100 заданий в повторении',                   icon: '🔁', rule: { type: 'reviews', value: 100 } },
    { id: 'reviews-1000',   title: 'Mater studiorum',      desc: '1000 заданий в повторении',                  icon: '♾️', rule: { type: 'reviews', value: 1000 } },
    { id: 'fixed-10',       title: 'Правка',               desc: 'Исправить 10 ошибок из банка',               icon: '🩹', rule: { type: 'mistakesFixed', value: 10 } },
    { id: 'fixed-100',      title: 'Корректор',            desc: 'Исправить 100 ошибок из банка',              icon: '🔍', rule: { type: 'mistakesFixed', value: 100 } },
    { id: 'fixed-500',      title: 'Эмендатор',            desc: 'Исправить 500 ошибок из банка',              icon: '📝', rule: { type: 'mistakesFixed', value: 500 } },
    { id: 'words-200',      title: 'Тезаурус',             desc: '200 слов в долговременной памяти (интервал ≥ 21 дня)', icon: '🗃️', rule: { type: 'wordsMature', value: 200 } },
    { id: 'skills-10',      title: 'Десять правил',        desc: '10 грамматических навыков на мастерстве ≥ 4', icon: '⚖️', rule: { type: 'skillMastery', value: 10, level: 4 } },

    // — грамматика по курсам —
    { id: 'sr-cases',       title: 'Sedam padeža',         desc: 'Все 7 сербских падежей на мастерстве ≥ 4',   icon: '🦅', rule: { type: 'skillSet', value: ['sr.case.nom', 'sr.case.gen', 'sr.case.dat', 'sr.case.acc', 'sr.case.voc', 'sr.case.ins', 'sr.case.loc'], level: 4 } },

    // — широта —
    { id: 'placement-5',    title: 'Старый знакомый',      desc: 'Пройти 5 входных тестов юнитов',             icon: '🗝️', rule: { type: 'placementPassed', value: 5 } },
    { id: 'xp-10000',       title: 'Десять тысяч строк',   desc: 'Набрать 10 000 XP',                          icon: '💎', rule: { type: 'xpTotal', value: 10000 } }
  ],

  ranks: [
    { xp: 0,     title: 'Ученик писца' },
    { xp: 150,   title: 'Переписчик' },
    { xp: 400,   title: 'Глоссатор' },
    { xp: 900,   title: 'Схолиаст' },
    { xp: 1800,  title: 'Лексикограф' },
    { xp: 3500,  title: 'Грамматик' },
    { xp: 6000,  title: 'Комментатор' },
    { xp: 10000, title: 'Компаративист' },
    { xp: 16000, title: 'Хранитель скриптория' },
    { xp: 25000, title: 'Магистр грамматики' }
  ]
};
