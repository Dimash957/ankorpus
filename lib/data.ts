export type ArchiveType = "жеке мұрағат" | "тақырыптық мұрағат" | "аралас қор";

export type SongSectionType = "verse" | "chorus" | "bridge";

export interface ArtistArchive {
  slug: string;
  name: string;
  years: string;
  periodStart: number;
  periodEnd: number;
  songCount: number;
  genres: string[];
  summary: string;
}

export interface ThematicArchive {
  id: string;
  title: string;
  years: string;
  countLabel: string;
  summary: string;
}

export interface SongSection {
  type: SongSectionType;
  lines: string[];
}

export interface Song {
  id: string;
  title: string;
  artistSlug: string;
  year: number;
  genre: string;
  archiveType: ArchiveType;
  tags: string[];
  chartsRank: number;
  sections: SongSection[];
}

export interface AnnotationToken {
  token: string;
  lemma: string;
  pos: string;
  namedEntity: "PER" | "LOC" | "ORG" | "O";
}

const POS_OVERRIDES: Record<string, string> = {
  мен: "PRON",
  сен: "PRON",
  біз: "PRON",
  олар: "PRON",
  менің: "PRON",
  сенің: "PRON",
  қала: "NOUN",
  дала: "NOUN",
  ән: "NOUN",
  жүрек: "NOUN",
  арман: "NOUN",
  үн: "NOUN",
  жарық: "NOUN",
  түн: "NOUN",
  күн: "NOUN",
  жаңа: "ADJ",
  кең: "ADJ",
  тынық: "ADJ",
  биік: "ADJ",
  мөлдір: "ADJ",
  тыңдайды: "VERB",
  соғады: "VERB",
  айтады: "VERB",
  жазады: "VERB",
  келеді: "VERB",
  кетеді: "VERB",
  оянады: "VERB",
  жаңғырады: "VERB",
  үшін: "ADP",
  туралы: "ADP",
  және: "CCONJ",
  бірақ: "CCONJ",
  тек: "PART",
  емес: "PART",
};

const PER_ENTITIES = new Set([
  "роза",
  "батырхан",
  "нұрлан",
  "иманбек",
  "алибек",
  "скриптонит",
  "кайрат",
  "қайрат",
  "желтоқсан",
]);

const LOC_ENTITIES = new Set([
  "алматы",
  "астана",
  "семей",
  "түркістан",
  "қазақ",
  "қазақстан",
]);

const ORG_ENTITIES = new Set(["дос-мұқасан", "jeltoksan"]);

export const artists: ArtistArchive[] = [
  {
    slug: "roza-rymbaeva",
    name: "Роза Рымбаева",
    years: "1975-2023",
    periodStart: 1975,
    periodEnd: 2023,
    songCount: 1470,
    genres: ["поп", "баллада", "эстрада"],
    summary: "Классикалық эстрада стиліндегі вокал мәтіндерінің уақыт ішіндегі эволюциясы.",
  },
  {
    slug: "batyrkhan-shukenov",
    name: "Батырхан Шукенов",
    years: "1987-2013",
    periodStart: 1987,
    periodEnd: 2013,
    songCount: 820,
    genres: ["поп", "соул", "баллада"],
    summary: "Лирикалық образдар мен урбанистік мотивтерді біріктірген корпус.",
  },
  {
    slug: "nurlan-onerbayev",
    name: "Нұрлан Өнербаев",
    years: "1995-2020",
    periodStart: 1995,
    periodEnd: 2020,
    songCount: 690,
    genres: ["поп", "романс", "дәстүрлі"],
    summary: "Поэтикалық құрылымы тығыз, риторикалық қайталауы мол мәтіндер.",
  },
  {
    slug: "imanbek-zeikenov",
    name: "Иманбек Зейкенов",
    years: "2017-2024",
    periodStart: 2017,
    periodEnd: 2024,
    songCount: 420,
    genres: ["электро-поп", "ремикс", "клуб"],
    summary: "Қысқа синтаксистік құрылымдар мен ағылшын-қазақ кодаралас үлгілері.",
  },
  {
    slug: "alibek-dinishev",
    name: "Алибек Дінішев",
    years: "1970-2010",
    periodStart: 1970,
    periodEnd: 2010,
    songCount: 510,
    genres: ["классика", "романс", "дәстүрлі"],
    summary: "Архаикалық және әдеби лексикасы жоғары академиялық ән мәтіндері.",
  },
  {
    slug: "dos-mukasan",
    name: "Дос-Мұқасан тобы",
    years: "1967-1991",
    periodStart: 1967,
    periodEnd: 1991,
    songCount: 930,
    genres: ["рок", "фолк-рок", "поп"],
    summary: "Ансамбльдік орындауға бейім ұйқастық құрылымдар және жастық дискурс.",
  },
  {
    slug: "kairat-nurtas",
    name: "Кайрат Нуртас",
    years: "2005-2024",
    periodStart: 2005,
    periodEnd: 2024,
    songCount: 1280,
    genres: ["поп", "той әндері", "баллада"],
    summary: "Кең аудиторияға бағытталған қарапайым синтаксис пен эмоциялық сөздік.",
  },
  {
    slug: "skriptonit",
    name: "Скриптонит",
    years: "2013-2024",
    periodStart: 2013,
    periodEnd: 2024,
    songCount: 760,
    genres: ["рэп", "хип-хоп", "трэп"],
    summary: "Қалалық әлеуметтік лексика мен ритмдік сегментациясы басым мәтіндер.",
  },
  {
    slug: "jeltoksan",
    name: "Jeltoksan тобы",
    years: "2010-2024",
    periodStart: 2010,
    periodEnd: 2024,
    songCount: 510,
    genres: ["инди-поп", "рок", "альтернатива"],
    summary: "Заманауи жастар дискурсы мен метафоралық желісі айқын авторлық мәтіндер.",
  },
];

export const thematicArchives: ThematicArchive[] = [
  {
    id: "hit-parad",
    title: "Хит-парад әндері",
    years: "1970-2024",
    countLabel: "2000+ мәтін",
    summary: "Рейтингке енген мәтіндердің онжылдық бойынша салыстырмалы қоры.",
  },
  {
    id: "kazssr",
    title: "Қазақ ССР әндері",
    years: "1960-1991",
    countLabel: "800 мәтін",
    summary: "Кеңестік кезеңдегі поэтикалық нормалар мен идеологиялық маркерлер жиынтығы.",
  },
  {
    id: "rap",
    title: "Рэп әндері",
    years: "2010-2024",
    countLabel: "5000+ мәтін",
    summary: "Ритм, жаргон және урбанистік тақырыптар басым заманауи корпус.",
  },
  {
    id: "folk",
    title: "Халық әндері",
    years: "дәстүрлі",
    countLabel: "500 мәтін",
    summary: "Фольклорлық формула, тұрақты эпитеттер және орындаушылық вариациялар.",
  },
];

export const songs: Song[] = [
  {
    id: "roza-1",
    title: "Көктемгі дауыс",
    artistSlug: "roza-rymbaeva",
    year: 1982,
    genre: "поп",
    archiveType: "жеке мұрағат",
    tags: ["махаббат", "көктем", "эстрада"],
    chartsRank: 7,
    sections: [
      {
        type: "verse",
        lines: [
          "Қалаға көктем үнсіз келді",
          "Жүрегім жаңа әуен терді",
          "Таңғы жел терезе қағып",
          "Көңілге нәзік сәуле берді",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Әнімде сенің атың жаңғырады",
          "Әр буын жарық болып жандырады",
        ],
      },
    ],
  },
  {
    id: "roza-2",
    title: "Самалдағы хат",
    artistSlug: "roza-rymbaeva",
    year: 1991,
    genre: "баллада",
    archiveType: "аралас қор",
    tags: ["ностальгия", "естелік"],
    chartsRank: 12,
    sections: [
      {
        type: "verse",
        lines: [
          "Кешкі самал ескі хатты ақтарды",
          "Сөз ішінен сенің күлкің сақталды",
          "Уақыт бізді бөлек жолға бастаса",
          "Әуен бізді бір кеңістікке апарды",
        ],
      },
      {
        type: "bridge",
        lines: [
          "Түн ортасы, қала тыныш",
          "Жүрек бірақ әлі сөйлейді",
        ],
      },
    ],
  },
  {
    id: "batyrkhan-1",
    title: "Жаңбыр астында",
    artistSlug: "batyrkhan-shukenov",
    year: 1995,
    genre: "соул",
    archiveType: "жеке мұрағат",
    tags: ["қала", "жаңбыр", "эмоция"],
    chartsRank: 5,
    sections: [
      {
        type: "verse",
        lines: [
          "Жаңбыр тамып тұр аялдама шетінде",
          "Біз айтпаған сөздер қалды кеудемде",
          "Трамвай ізі сырғып өтті алыстап",
          "Әуен ғана бізді қалдырды бетпе-бет",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Қала ұйықтамайды, сен де ұмытпа",
          "Түнгі шамдар бізге белгі қып тұр да",
        ],
      },
    ],
  },
  {
    id: "batyrkhan-2",
    title: "Ақ парақ",
    artistSlug: "batyrkhan-shukenov",
    year: 2002,
    genre: "баллада",
    archiveType: "аралас қор",
    tags: ["ішкі монолог", "үміт"],
    chartsRank: 11,
    sections: [
      {
        type: "verse",
        lines: [
          "Ақ парақта үнсіз тұрған жолдар бар",
          "Әр әріпте айтылмаған ойлар бар",
          "Мен қаламды жүрекпенен ұстадым",
          "Сол сәтте сен есіміме оралдың",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Бүгін тағы жаңа өлең бастаймын",
          "Бір ауыз сөзбен саған жақындаймын",
        ],
      },
    ],
  },
  {
    id: "nurlan-1",
    title: "Дала жыры",
    artistSlug: "nurlan-onerbayev",
    year: 1999,
    genre: "дәстүрлі",
    archiveType: "жеке мұрағат",
    tags: ["дала", "ұлттық", "рух"],
    chartsRank: 18,
    sections: [
      {
        type: "verse",
        lines: [
          "Кең далада қоңыр дауыс тербелді",
          "Жылқы ізімен көне сарын өрнелді",
          "Атамекен атын айтып таң сайын",
          "Жас буынға жаңа үміт сіңірді",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Дала жыры жүрекке жақын",
          "Әр қайырмада туған шақырым",
        ],
      },
    ],
  },
  {
    id: "nurlan-2",
    title: "Киелі түн",
    artistSlug: "nurlan-onerbayev",
    year: 2010,
    genre: "романс",
    archiveType: "жеке мұрағат",
    tags: ["лирика", "түн", "ой"],
    chartsRank: 24,
    sections: [
      {
        type: "verse",
        lines: [
          "Киелі түн тереземді ақ нұр қылды",
          "Жалғыз шамым үнсіз ғана сақ тұрды",
          "Сен айтқан бір қысқа сөздің салмағы",
          "Көп жыл өтсе де санамда анық тұрды",
        ],
      },
      {
        type: "bridge",
        lines: [
          "Тыныштық та сөйлей алады",
          "Егер жүрек тыңдай алса",
        ],
      },
    ],
  },
  {
    id: "imanbek-1",
    title: "Түнгі пульс",
    artistSlug: "imanbek-zeikenov",
    year: 2021,
    genre: "электро-поп",
    archiveType: "тақырыптық мұрағат",
    tags: ["клуб", "beat", "жылдам"],
    chartsRank: 3,
    sections: [
      {
        type: "verse",
        lines: [
          "Түнгі қала неон болып жанып тұр",
          "Ритм мені жаңа жолға алып тұр",
          "Қысқа фраза, анық импульс, таза үн",
          "Бір секунд та босқа кетпей қалып тұр",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Пульс жоғары, би алаңы қозғалды",
          "Дыбыс толқынымен түн де жаңғырды",
        ],
      },
    ],
  },
  {
    id: "imanbek-2",
    title: "Digital таң",
    artistSlug: "imanbek-zeikenov",
    year: 2024,
    genre: "ремикс",
    archiveType: "тақырыптық мұрағат",
    tags: ["цифрлық", "таң", "ремикс"],
    chartsRank: 9,
    sections: [
      {
        type: "verse",
        lines: [
          "Экран жақты, тереземде digital таң",
          "Сэмпл арасы жаңа әуен, қысқа план",
          "Тілді ауыстырып ырғақпенен ойнаймын",
          "Қазақ сөзі тренд ішінде тап-таза жан",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Код секілді қайталанам, тоқтамай",
          "Beat үстінде жаңа мәтін, жоғалмай",
        ],
      },
    ],
  },
  {
    id: "alibek-1",
    title: "Ғасыр үні",
    artistSlug: "alibek-dinishev",
    year: 1980,
    genre: "классика",
    archiveType: "жеке мұрағат",
    tags: ["академиялық", "классика"],
    chartsRank: 28,
    sections: [
      {
        type: "verse",
        lines: [
          "Ғасыр үні тас қабырғада жаңғырды",
          "Биік залда көне ария қалқып тұрды",
          "Әр фразада дәуір тынысы сезілді",
          "Салтанатты ырғақ уақытпен үндесті",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Дауыс биік, ой терең",
          "Музыкада мәңгі өрнек",
        ],
      },
    ],
  },
  {
    id: "alibek-2",
    title: "Таңғы дұға",
    artistSlug: "alibek-dinishev",
    year: 1994,
    genre: "романс",
    archiveType: "аралас қор",
    tags: ["лирика", "классикалық мәтін"],
    chartsRank: 30,
    sections: [
      {
        type: "verse",
        lines: [
          "Таңғы дұға тыныш үйге нұр қылып",
          "Әр дыбысым ақ параққа гүл қондырып",
          "Көне сөздің жаңа тыныс тапқаны",
          "Тыңдаушыға ой мен сезім сый қылып",
        ],
      },
      {
        type: "bridge",
        lines: [
          "Тіл мен әуен тоғысқанда",
          "Сөздің салмағы артады",
        ],
      },
    ],
  },
  {
    id: "dos-1",
    title: "Жастық керуен",
    artistSlug: "dos-mukasan",
    year: 1972,
    genre: "рок",
    archiveType: "жеке мұрағат",
    tags: ["жастық", "гитара", "ансамбль"],
    chartsRank: 14,
    sections: [
      {
        type: "verse",
        lines: [
          "Гитара үні алаңға еркін таралды",
          "Жастық шағым от секілді жанарды",
          "Бірге айтқан көп дауысты қайырма",
          "Көп көшені мерекеге айналдырды",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Керуеніміз жол үстінде тоқтама",
          "Әнмен бірге жаңа күнге аттана",
        ],
      },
    ],
  },
  {
    id: "dos-2",
    title: "Уақыт таспасы",
    artistSlug: "dos-mukasan",
    year: 1985,
    genre: "фолк-рок",
    archiveType: "аралас қор",
    tags: ["уақыт", "естелік"],
    chartsRank: 17,
    sections: [
      {
        type: "verse",
        lines: [
          "Уақыт таспасы баяу ғана айналды",
          "Ескі фото жаңа ойға сайланды",
          "Домбыра мен электр үнін қоса алып",
          "Бір буынның ортақ жыры байланыпты",
        ],
      },
      {
        type: "bridge",
        lines: [
          "Кеше мен бүгін арасы",
          "Әуенмен ғана жалғанды",
        ],
      },
    ],
  },
  {
    id: "kairat-1",
    title: "Сезім хаты",
    artistSlug: "kairat-nurtas",
    year: 2012,
    genre: "поп",
    archiveType: "жеке мұрағат",
    tags: ["махаббат", "той", "лирика"],
    chartsRank: 4,
    sections: [
      {
        type: "verse",
        lines: [
          "Сезім хатын үнсіз ғана жолдадым",
          "Қолтаңбаға жүрек дүрсіл қондырдым",
          "Қарапайым сөздер кейде ең биік",
          "Сол сөздермен саған жақын болдым",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Бір ауыз сөз, бір жылы үн",
          "Екі жүрекке ортақ түн",
        ],
      },
    ],
  },
  {
    id: "kairat-2",
    title: "Мереке кеші",
    artistSlug: "kairat-nurtas",
    year: 2020,
    genre: "той әндері",
    archiveType: "тақырыптық мұрағат",
    tags: ["мереке", "қуаныш"],
    chartsRank: 2,
    sections: [
      {
        type: "verse",
        lines: [
          "Мереке кеші шамдарын жарқыратып",
          "Көңіл күйді әуенімен арттырып",
          "Әр үстелде күлкі толқын қозғалып",
          "Бәрі бірге қол соғады шат қылып",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Бүгін бәрі биік нотада",
          "Қуаныш бар әр бір қадамда",
        ],
      },
    ],
  },
  {
    id: "sk-1",
    title: "Қала коды",
    artistSlug: "skriptonit",
    year: 2016,
    genre: "рэп",
    archiveType: "тақырыптық мұрағат",
    tags: ["урбан", "әлеумет", "ритм"],
    chartsRank: 1,
    sections: [
      {
        type: "verse",
        lines: [
          "Қала коды қабырғада граффити",
          "Сөз салмағы метро үнін қайтты",
          "Жылдам ойдың тынысын да ұстаймын",
          "Әр буында шындықпенен айқастым",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Ритм қатты, мәтін нақты",
          "Көше үні бәрін бақты",
        ],
      },
    ],
  },
  {
    id: "sk-2",
    title: "Түнгі аудан",
    artistSlug: "skriptonit",
    year: 2023,
    genre: "трэп",
    archiveType: "тақырыптық мұрағат",
    tags: ["night", "trap", "қала"],
    chartsRank: 6,
    sections: [
      {
        type: "verse",
        lines: [
          "Түнгі аудан үнсіз емес, бәрі тірі",
          "Бір қарасаң әр көшенің өз тілі",
          "Кадр ауысса да ойым тоқтамайды",
          "Қара ритмге байланғандай мезгілі",
        ],
      },
      {
        type: "bridge",
        lines: [
          "Баяу бас та, анық айт",
          "Сөздің жүгі ауырлайды",
        ],
      },
    ],
  },
  {
    id: "jel-1",
    title: "Қаңтар жарығы",
    artistSlug: "jeltoksan",
    year: 2015,
    genre: "инди-поп",
    archiveType: "жеке мұрағат",
    tags: ["инди", "қыс", "метафора"],
    chartsRank: 10,
    sections: [
      {
        type: "verse",
        lines: [
          "Қаңтар жарығы көшеге ақ із салды",
          "Суық ауа ойыма анық түр қондырды",
          "Біз іздеген жаңа мағына осы ма",
          "Қарапайым үннен терең сыр қалды",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Желтоқсаннан қалған белгі",
          "Қаңтарда да өшпей келді",
        ],
      },
    ],
  },
  {
    id: "jel-2",
    title: "Ашық терезе",
    artistSlug: "jeltoksan",
    year: 2024,
    genre: "альтернатива",
    archiveType: "жеке мұрағат",
    tags: ["жастар", "альтернатива", "қала"],
    chartsRank: 8,
    sections: [
      {
        type: "verse",
        lines: [
          "Ашық терезе арқылы қала дыбысы кірді",
          "Біз жазған ән ертеңгі күнмен тілдесті",
          "Қысқа формат, батыл ой, жаңа тыныс",
          "Көп дауыстың арасынан өз үн шықты",
        ],
      },
      {
        type: "chorus",
        lines: [
          "Оян қала, жаңа буын",
          "Ән ішінде өсіп тұр үн",
        ],
      },
    ],
  },
];

export function getArtistBySlug(slug: string) {
  return artists.find((artist) => artist.slug === slug);
}

export function getSongsByArtist(slug: string) {
  return songs.filter((song) => song.artistSlug === slug);
}

export function getArtistName(slug: string) {
  return getArtistBySlug(slug)?.name ?? slug;
}

export function getAllGenres(sourceSongs: Song[] = songs) {
  return Array.from(new Set(sourceSongs.map((song) => song.genre))).sort((a, b) => a.localeCompare(b, "kk"));
}

export function getYearRange(sourceSongs: Song[] = songs) {
  const years = sourceSongs.map((song) => song.year);

  if (years.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...years),
    max: Math.max(...years),
  };
}

export function getSongText(song: Song) {
  return song.sections.flatMap((section) => section.lines).join(" ");
}

function normalizeWord(word: string) {
  return word
    .toLocaleLowerCase("kk")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .trim();
}

function tokenize(text: string) {
  return (text.match(/[\p{L}\p{N}-]+/gu) ?? []).map((chunk) => chunk.trim()).filter(Boolean);
}

function inferPos(word: string) {
  const normalized = normalizeWord(word);
  if (!normalized) {
    return "X";
  }

  if (POS_OVERRIDES[normalized]) {
    return POS_OVERRIDES[normalized];
  }

  if (normalized.endsWith("ды") || normalized.endsWith("ді") || normalized.endsWith("ты") || normalized.endsWith("ті")) {
    return "VERB";
  }

  if (normalized.endsWith("лық") || normalized.endsWith("лік") || normalized.endsWith("дық") || normalized.endsWith("дік")) {
    return "NOUN";
  }

  if (normalized.endsWith("лы") || normalized.endsWith("лі")) {
    return "ADJ";
  }

  return "NOUN";
}

function inferEntity(word: string): "PER" | "LOC" | "ORG" | "O" {
  const normalized = normalizeWord(word);
  if (PER_ENTITIES.has(normalized)) {
    return "PER";
  }
  if (LOC_ENTITIES.has(normalized)) {
    return "LOC";
  }
  if (ORG_ENTITIES.has(normalized)) {
    return "ORG";
  }
  return "O";
}

export function annotateLine(line: string): AnnotationToken[] {
  return tokenize(line).map((token) => ({
    token,
    lemma: normalizeWord(token),
    pos: inferPos(token),
    namedEntity: inferEntity(token),
  }));
}

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildTeiXml(song: Song, artistName: string) {
  const sections = song.sections
    .map((section) => {
      const lines = section.lines
        .map((line) => {
          const words = annotateLine(line)
            .map(
              (token) =>
                `<w xml:lang="kk" lemma="${xmlEscape(token.lemma)}" pos="${token.pos}" ne="${token.namedEntity}">${xmlEscape(token.token)}</w>`,
            )
            .join(" ");
          return `      <l>${words}</l>`;
        })
        .join("\n");

      return `    <lg type="${section.type}">\n${lines}\n    </lg>`;
    })
    .join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    `<TEI xmlns=\"http://www.tei-c.org/ns/1.0\" xml:lang=\"kk\">`,
    "  <teiHeader>",
    "    <fileDesc>",
    "      <titleStmt>",
    `        <title>${xmlEscape(song.title)}</title>`,
    `        <author>${xmlEscape(artistName)}</author>`,
    "      </titleStmt>",
    "      <publicationStmt>",
    "        <publisher>Ән мәтіндерінің корпусы</publisher>",
    "        <availability status=\"free\">CC BY-NC 4.0</availability>",
    "      </publicationStmt>",
    "      <sourceDesc>",
    `        <bibl><date when=\"${song.year}\">${song.year}</date></bibl>`,
    "      </sourceDesc>",
    "    </fileDesc>",
    "    <profileDesc>",
    `      <textClass><keywords><term>${xmlEscape(song.genre)}</term></keywords></textClass>`,
    `      <notesStmt><note type=\"chartsrank\">${song.chartsRank}</note></notesStmt>`,
    "    </profileDesc>",
    "  </teiHeader>",
    "  <text>",
    "    <body>",
    `      <div1 type=\"song\" n=\"${song.id}\">`,
    sections,
    "      </div1>",
    "    </body>",
    "  </text>",
    "</TEI>",
  ].join("\n");
}

function songWords(song: Song) {
  return tokenize(getSongText(song)).map((word) => normalizeWord(word)).filter(Boolean);
}

export function getWordFrequency(limit = 12, sourceSongs: Song[] = songs) {
  const frequency = new Map<string, number>();

  sourceSongs.forEach((song) => {
    songWords(song).forEach((word) => {
      frequency.set(word, (frequency.get(word) ?? 0) + 1);
    });
  });

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function getGenreDistribution(sourceSongs: Song[] = songs) {
  const frequency = new Map<string, number>();

  sourceSongs.forEach((song) => {
    frequency.set(song.genre, (frequency.get(song.genre) ?? 0) + 1);
  });

  return [...frequency.entries()].map(([genre, count]) => ({ genre, count }));
}

export function getTimelineDistribution(sourceSongs: Song[] = songs) {
  const grouped = new Map<number, number>();

  sourceSongs.forEach((song) => {
    const bucket = Math.floor(song.year / 5) * 5;
    grouped.set(bucket, (grouped.get(bucket) ?? 0) + 1);
  });

  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ period: `${year}-${year + 4}`, count }));
}

export function getCharacterStats(sourceSongs: Song[] = songs) {
  const allText = sourceSongs.map((song) => getSongText(song)).join(" ");
  const chars = allText.length;
  const letters = (allText.match(/[\p{L}]/gu) ?? []).length;
  const digits = (allText.match(/[0-9]/g) ?? []).length;
  const punctuation = (allText.match(/[.,!?;:]/g) ?? []).length;

  return [
    { label: "Барлық таңба", value: chars },
    { label: "Әріп", value: letters },
    { label: "Сан", value: digits },
    { label: "Тыныс белгі", value: punctuation },
  ];
}

export function getWordNgramData(sourceSongs: Song[] = songs) {
  const bigramFreq = new Map<string, number>();

  sourceSongs.forEach((song) => {
    const words = songWords(song);
    for (let i = 0; i < words.length - 1; i += 1) {
      const key = `${words[i]} ${words[i + 1]}`;
      bigramFreq.set(key, (bigramFreq.get(key) ?? 0) + 1);
    }
  });

  return [...bigramFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ngram, count]) => ({ ngram, count }));
}

export function getVerseLengthStats(sourceSongs: Song[] = songs) {
  const buckets = [
    { label: "1-4 сөз", min: 1, max: 4, count: 0 },
    { label: "5-8 сөз", min: 5, max: 8, count: 0 },
    { label: "9-12 сөз", min: 9, max: 12, count: 0 },
    { label: "13+ сөз", min: 13, max: Number.POSITIVE_INFINITY, count: 0 },
  ];

  sourceSongs.forEach((song) => {
    song.sections.forEach((section) => {
      section.lines.forEach((line) => {
        const words = tokenize(line).length;
        const bucket = buckets.find((item) => words >= item.min && words <= item.max);
        if (bucket) {
          bucket.count += 1;
        }
      });
    });
  });

  return buckets.map(({ label, count }) => ({ label, count }));
}

export function getSongLevelMetrics(sourceSongs: Song[] = songs) {
  return sourceSongs.map((song) => {
    const text = getSongText(song);
    const words = tokenize(text).length;
    const unique = new Set(tokenize(text).map((word) => normalizeWord(word))).size;
    const lines = song.sections.reduce((sum, section) => sum + section.lines.length, 0);

    return {
      song: song.title,
      words,
      unique,
      lines,
      year: song.year,
    };
  });
}

export const archiveTypeOptions: ArchiveType[] = ["жеке мұрағат", "тақырыптық мұрағат", "аралас қор"];
