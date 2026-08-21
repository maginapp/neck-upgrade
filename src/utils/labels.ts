import { PoetrySource, PoetrySourceCategory } from '@/constants/poetry';
import {
  AppLanguage,
  ChineseBasicsCategory,
  Theme,
  NeckMode,
  DataType,
  KnowledgeMode,
} from '@/types/app';

interface LocalizedLabel {
  [AppLanguage.ZhCN]: string;
  [AppLanguage.ZhTW]: string;
  [AppLanguage.En]: string;
  [AppLanguage.Ru]: string;
  [AppLanguage.Fr]: string;
}

/**
 * 获取主题的显示标签
 * @param theme 主题类型
 * @returns 主题的显示标签
 */
export const getThemeLabel = (theme: Theme, language = AppLanguage.ZhCN): string => {
  const labels: Record<Theme, LocalizedLabel> = {
    [Theme.System]: {
      zh_CN: '系统',
      zh_TW: '系統',
      en: 'System',
      ru: 'Системная',
      fr: 'Système',
    },
    [Theme.Light]: { zh_CN: '亮色', zh_TW: '亮色', en: 'Light', ru: 'Светлая', fr: 'Clair' },
    [Theme.Dark]: { zh_CN: '暗黑', zh_TW: '暗黑', en: 'Dark', ru: 'Тёмная', fr: 'Sombre' },
  };
  return labels[theme]?.[language] ?? labels[Theme.System][language];
};

/**
 * 获取颈椎模式的显示标签
 * @param mode 颈椎模式类型
 * @returns 颈椎模式的显示标签
 */
export const getNeckModeLabel = (mode: NeckMode, language = AppLanguage.ZhCN): string => {
  const labels: Record<NeckMode, LocalizedLabel> = {
    [NeckMode.Normal]: {
      zh_CN: '普通',
      zh_TW: '普通',
      en: 'Normal',
      ru: 'Обычный',
      fr: 'Normal',
    },
    [NeckMode.Training]: {
      zh_CN: '训练',
      zh_TW: '訓練',
      en: 'Training',
      ru: 'Тренировка',
      fr: 'Entraînement',
    },
    [NeckMode.Reading]: {
      zh_CN: '阅读',
      zh_TW: '閱讀',
      en: 'Reading',
      ru: 'Чтение',
      fr: 'Lecture',
    },
    [NeckMode.Intense]: {
      zh_CN: '强化',
      zh_TW: '強化',
      en: 'Intense',
      ru: 'Интенсивный',
      fr: 'Intensif',
    },
    [NeckMode.Custom]: {
      zh_CN: '高级',
      zh_TW: '高級',
      en: 'Advanced',
      ru: 'Расширенный',
      fr: 'Avancé',
    },
  };
  return labels[mode][language];
};

/**
 * 获取数据类型的显示标签
 * @param type 数据类型
 * @returns 数据类型的显示标签
 */
export const getDataTypeLabel = (type: DataType, language = AppLanguage.ZhCN): string => {
  const labels: Record<DataType, LocalizedLabel> = {
    [DataType.Poetry]: {
      zh_CN: '诗词',
      zh_TW: '詩詞',
      en: 'Poetry',
      ru: 'Поэзия',
      fr: 'Poésie',
    },
    [DataType.History]: {
      zh_CN: '历史',
      zh_TW: '歷史',
      en: 'History',
      ru: 'История',
      fr: 'Histoire',
    },
    [DataType.English]: {
      zh_CN: '英语',
      zh_TW: '英語',
      en: 'English',
      ru: 'Английский',
      fr: 'Anglais',
    },
    [DataType.ChineseBasics]: {
      zh_CN: '中文基础',
      zh_TW: '中文基礎',
      en: 'Chinese Basics',
      ru: 'Основы китайского',
      fr: 'Bases du chinois',
    },
    [DataType.News]: {
      zh_CN: '热榜',
      zh_TW: '熱榜',
      en: 'Trending',
      ru: 'Популярное',
      fr: 'Tendances',
    },
  };
  return labels[type][language];
};

export const getChineseBasicsCategoryLabel = (
  category: ChineseBasicsCategory,
  language = AppLanguage.ZhCN
) => {
  const labels: Record<ChineseBasicsCategory, LocalizedLabel> = {
    [ChineseBasicsCategory.All]: {
      zh_CN: '全部',
      zh_TW: '全部',
      en: 'All',
      ru: 'Все',
      fr: 'Tout',
    },
    [ChineseBasicsCategory.Idiom]: {
      zh_CN: '成语',
      zh_TW: '成語',
      en: 'Idioms',
      ru: 'Идиомы',
      fr: 'Expressions',
    },
    [ChineseBasicsCategory.Character]: {
      zh_CN: '汉字',
      zh_TW: '漢字',
      en: 'Characters',
      ru: 'Иероглифы',
      fr: 'Caractères',
    },
    [ChineseBasicsCategory.Xiehouyu]: {
      zh_CN: '歇后语',
      zh_TW: '歇後語',
      en: 'Two-part sayings',
      ru: 'Недоговорки',
      fr: 'Proverbes à chute',
    },
    [ChineseBasicsCategory.Word]: {
      zh_CN: '词语',
      zh_TW: '詞語',
      en: 'Words',
      ru: 'Слова',
      fr: 'Mots',
    },
  };

  return labels[category][language];
};

/**
 * 获取百科数据源的显示标签
 * @param mode 百科数据源类型
 * @returns 百科数据源的显示标签
 */
export const getKnowledgeModeLabel = (mode: KnowledgeMode, language = AppLanguage.ZhCN): string => {
  const labels: Record<KnowledgeMode, LocalizedLabel> = {
    [KnowledgeMode.Wiki]: {
      zh_CN: '维基百科',
      zh_TW: '維基百科',
      en: 'Wikipedia',
      ru: 'Википедия',
      fr: 'Wikipédia',
    },
    [KnowledgeMode.Baidu]: {
      zh_CN: '百度百科',
      zh_TW: '百度百科',
      en: 'Baidu Baike',
      ru: 'Байду Байкэ',
      fr: 'Baidu Baike',
    },
  };
  return labels[mode][language];
};

export const getPoetryCategoryLabel = (
  category: PoetrySourceCategory,
  language = AppLanguage.ZhCN
) => {
  const labels: Record<PoetrySourceCategory, LocalizedLabel> = {
    [PoetrySourceCategory.All]: {
      zh_CN: '全部',
      zh_TW: '全部',
      en: 'All',
      ru: 'Все',
      fr: 'Tout',
    },
    [PoetrySourceCategory.Poem]: {
      zh_CN: '诗歌',
      zh_TW: '詩歌',
      en: 'Poems',
      ru: 'Стихи',
      fr: 'Poèmes',
    },
    [PoetrySourceCategory.Ci]: {
      zh_CN: '词',
      zh_TW: '詞',
      en: 'Ci Poetry',
      ru: 'Поэзия цы',
      fr: 'Poésie ci',
    },
    [PoetrySourceCategory.Classic]: {
      zh_CN: '经典',
      zh_TW: '經典',
      en: 'Classics',
      ru: 'Классика',
      fr: 'Classiques',
    },
    [PoetrySourceCategory.Primer]: {
      zh_CN: '蒙学',
      zh_TW: '蒙學',
      en: 'Primers',
      ru: 'Учебные классики',
      fr: 'Classiques éducatifs',
    },
    [PoetrySourceCategory.Essay]: {
      zh_CN: '文人小品',
      zh_TW: '文人小品',
      en: 'Essays',
      ru: 'Эссе',
      fr: 'Essais',
    },
  };
  return labels[category][language];
};

export const getPoetrySourceLabel = (source: PoetrySource, language = AppLanguage.ZhCN) => {
  const labels: Record<PoetrySource, LocalizedLabel> = {
    [PoetrySource.Shijing]: {
      zh_CN: '诗经',
      zh_TW: '詩經',
      en: 'Book of Songs',
      ru: 'Книга песен',
      fr: 'Livre des Odes',
    },
    [PoetrySource.Chuci]: {
      zh_CN: '楚辞',
      zh_TW: '楚辭',
      en: 'Songs of Chu',
      ru: 'Чуские строфы',
      fr: 'Chants de Chu',
    },
    [PoetrySource.Caocao]: {
      zh_CN: '曹操诗集',
      zh_TW: '曹操詩集',
      en: "Cao Cao's Poems",
      ru: 'Стихи Цао Цао',
      fr: 'Poèmes de Cao Cao',
    },
    [PoetrySource.Tang300]: {
      zh_CN: '唐诗三百首',
      zh_TW: '唐詩三百首',
      en: '300 Tang Poems',
      ru: 'Триста танских поэм',
      fr: 'Trois cents poèmes des Tang',
    },
    [PoetrySource.TangFamousSelected]: {
      zh_CN: '全唐诗·名家精选',
      zh_TW: '全唐詩·名家精選',
      en: 'Selected Tang Poets',
      ru: 'Избранные поэты эпохи Тан',
      fr: 'Poètes Tang sélectionnés',
    },
    [PoetrySource.ShuimoTang]: {
      zh_CN: '水墨唐诗',
      zh_TW: '水墨唐詩',
      en: 'Ink-Wash Tang Poems',
      ru: 'Танская поэзия в туши',
      fr: 'Poèmes Tang à l’encre',
    },
    [PoetrySource.Qianjiashi]: {
      zh_CN: '千家诗',
      zh_TW: '千家詩',
      en: 'Poems of a Thousand Masters',
      ru: 'Стихи тысячи мастеров',
      fr: 'Poèmes de mille maîtres',
    },
    [PoetrySource.Songci300]: {
      zh_CN: '宋词三百首',
      zh_TW: '宋詞三百首',
      en: '300 Song Ci Poems',
      ru: 'Триста песен цы эпохи Сун',
      fr: 'Trois cents poèmes ci des Song',
    },
    [PoetrySource.SongciFamousSelected]: {
      zh_CN: '全宋词·名家精选',
      zh_TW: '全宋詞·名家精選',
      en: 'Selected Song Ci Poets',
      ru: 'Избранные авторы цы эпохи Сун',
      fr: 'Auteurs ci des Song sélectionnés',
    },
    [PoetrySource.Nalan]: {
      zh_CN: '纳兰性德词集',
      zh_TW: '納蘭性德詞集',
      en: "Nalan Xingde's Ci",
      ru: 'Цы Налань Синдэ',
      fr: 'Poèmes ci de Nalan Xingde',
    },
    [PoetrySource.Lunyu]: {
      zh_CN: '论语',
      zh_TW: '論語',
      en: 'Analects',
      ru: 'Беседы и суждения',
      fr: 'Entretiens de Confucius',
    },
    [PoetrySource.Mengzi]: {
      zh_CN: '孟子',
      zh_TW: '孟子',
      en: 'Mencius',
      ru: 'Мэн-цзы',
      fr: 'Mencius',
    },
    [PoetrySource.Daxue]: {
      zh_CN: '大学',
      zh_TW: '大學',
      en: 'Great Learning',
      ru: 'Великое учение',
      fr: 'La Grande Étude',
    },
    [PoetrySource.Zhongyong]: {
      zh_CN: '中庸',
      zh_TW: '中庸',
      en: 'Doctrine of the Mean',
      ru: 'Учение о середине',
      fr: 'L’Invariable Milieu',
    },
    [PoetrySource.Zengguang]: {
      zh_CN: '增广贤文',
      zh_TW: '增廣賢文',
      en: 'Zengguang Xianwen',
      ru: 'Цзэнгуан Сяньвэнь',
      fr: 'Zengguang Xianwen',
    },
    [PoetrySource.Qianziwen]: {
      zh_CN: '千字文',
      zh_TW: '千字文',
      en: 'Thousand Character Classic',
      ru: 'Тысячесловие',
      fr: 'Classique des Mille Caractères',
    },
    [PoetrySource.Youmengying]: {
      zh_CN: '幽梦影',
      zh_TW: '幽夢影',
      en: 'Quiet Dream Shadows',
      ru: 'Тени тихих снов',
      fr: 'Ombres des rêves sereins',
    },
  };
  return labels[source][language];
};

const ENGLISH_NEWS_LABELS: Record<string, string> = {
  微博: 'Weibo',
  我的: 'My Feed',
  热搜: 'Trending',
  文娱: 'Entertainment',
  生活: 'Lifestyle',
  社会: 'Society',
  小红书: 'Xiaohongshu',
  推荐: 'For You',
  头条: 'Toutiao',
  知乎: 'Zhihu',
  热榜: 'Trending',
  综合: 'General',
  动画: 'Anime',
  鬼畜: 'Remix',
  音乐: 'Music',
  舞蹈: 'Dance',
  影视: 'Film & TV',
  娱乐: 'Entertainment',
  知识: 'Knowledge',
  科技: 'Technology',
  美食: 'Food',
  体育: 'Sports',
  中国: 'China',
  全球: 'Global',
  商业: 'Business',
  百度: 'Baidu',
  贴吧: 'Tieba',
  '36氪': '36Kr',
  股票: 'Stocks',
  公司: 'Companies',
  宏观: 'Macro',
  技术: 'Technology',
  好玩: 'Fun',
  创意: 'Creative',
};

const RUSSIAN_NEWS_LABELS: Record<string, string> = {
  微博: 'Weibo',
  我的: 'Моя лента',
  热搜: 'В тренде',
  文娱: 'Культура и развлечения',
  生活: 'Образ жизни',
  社会: 'Общество',
  小红书: 'Xiaohongshu',
  推荐: 'Для вас',
  头条: 'Toutiao',
  知乎: 'Zhihu',
  热榜: 'Популярное',
  综合: 'Общее',
  动画: 'Аниме',
  鬼畜: 'Ремиксы',
  音乐: 'Музыка',
  舞蹈: 'Танцы',
  影视: 'Кино и ТВ',
  娱乐: 'Развлечения',
  知识: 'Знания',
  科技: 'Технологии',
  美食: 'Еда',
  体育: 'Спорт',
  中国: 'Китай',
  全球: 'Мир',
  商业: 'Бизнес',
  百度: 'Baidu',
  贴吧: 'Tieba',
  '36氪': '36Kr',
  股票: 'Акции',
  公司: 'Компании',
  宏观: 'Макроэкономика',
  技术: 'Технологии',
  好玩: 'Интересное',
  创意: 'Творчество',
};

const FRENCH_NEWS_LABELS: Record<string, string> = {
  微博: 'Weibo',
  我的: 'Mon fil',
  热搜: 'Tendances',
  文娱: 'Culture et divertissement',
  生活: 'Mode de vie',
  社会: 'Société',
  小红书: 'Xiaohongshu',
  推荐: 'Pour vous',
  头条: 'Toutiao',
  知乎: 'Zhihu',
  热榜: 'Tendances',
  综合: 'Général',
  动画: 'Animation',
  鬼畜: 'Remix',
  音乐: 'Musique',
  舞蹈: 'Danse',
  影视: 'Cinéma et télévision',
  娱乐: 'Divertissement',
  知识: 'Savoirs',
  科技: 'Technologie',
  美食: 'Cuisine',
  体育: 'Sports',
  中国: 'Chine',
  全球: 'Monde',
  商业: 'Économie',
  百度: 'Baidu',
  贴吧: 'Tieba',
  '36氪': '36Kr',
  股票: 'Actions',
  公司: 'Entreprises',
  宏观: 'Macroéconomie',
  技术: 'Technologie',
  好玩: 'Loisirs',
  创意: 'Création',
};

const TRADITIONAL_NEWS_LABELS: Record<string, string> = {
  微博: '微博',
  我的: '我的',
  热搜: '熱搜',
  文娱: '文娛',
  生活: '生活',
  社会: '社會',
  小红书: '小紅書',
  推荐: '推薦',
  头条: '頭條',
  知乎: '知乎',
  热榜: '熱榜',
  综合: '綜合',
  动画: '動畫',
  鬼畜: '鬼畜',
  音乐: '音樂',
  舞蹈: '舞蹈',
  影视: '影視',
  娱乐: '娛樂',
  知识: '知識',
  科技: '科技',
  美食: '美食',
  体育: '體育',
  中国: '中國',
  全球: '全球',
  商业: '商業',
  百度: '百度',
  贴吧: '貼吧',
  '36氪': '36氪',
  股票: '股票',
  公司: '公司',
  宏观: '宏觀',
  技术: '技術',
  好玩: '好玩',
  创意: '創意',
};

export const getNewsLabel = (label: string, language = AppLanguage.ZhCN) => {
  if (language === AppLanguage.En) {
    return ENGLISH_NEWS_LABELS[label] ?? label;
  }
  if (language === AppLanguage.Ru) {
    return RUSSIAN_NEWS_LABELS[label] ?? label;
  }
  if (language === AppLanguage.Fr) {
    return FRENCH_NEWS_LABELS[label] ?? label;
  }
  return language === AppLanguage.ZhTW ? TRADITIONAL_NEWS_LABELS[label] ?? label : label;
};
