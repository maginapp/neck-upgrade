import { PoetrySource, PoetrySourceCategory } from '@/constants/poetry';
import { AppLanguage, Theme, NeckMode, DataType, KnowledgeMode } from '@/types/app';

interface LocalizedLabel {
  [AppLanguage.ZhCN]: string;
  [AppLanguage.ZhTW]: string;
  [AppLanguage.En]: string;
}

/**
 * 获取主题的显示标签
 * @param theme 主题类型
 * @returns 主题的显示标签
 */
export const getThemeLabel = (theme: Theme, language = AppLanguage.ZhCN): string => {
  const labels: Record<Theme, LocalizedLabel> = {
    [Theme.System]: { zh_CN: '系统', zh_TW: '系統', en: 'System' },
    [Theme.Light]: { zh_CN: '亮色', zh_TW: '亮色', en: 'Light' },
    [Theme.Dark]: { zh_CN: '暗黑', zh_TW: '暗黑', en: 'Dark' },
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
    [NeckMode.Normal]: { zh_CN: '普通', zh_TW: '普通', en: 'Normal' },
    [NeckMode.Training]: { zh_CN: '训练', zh_TW: '訓練', en: 'Training' },
    [NeckMode.Reading]: { zh_CN: '阅读', zh_TW: '閱讀', en: 'Reading' },
    [NeckMode.Intense]: { zh_CN: '强化', zh_TW: '強化', en: 'Intense' },
    [NeckMode.Custom]: { zh_CN: '高级', zh_TW: '高級', en: 'Advanced' },
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
    [DataType.Poetry]: { zh_CN: '诗词', zh_TW: '詩詞', en: 'Poetry' },
    [DataType.History]: { zh_CN: '历史', zh_TW: '歷史', en: 'History' },
    [DataType.English]: { zh_CN: '英语', zh_TW: '英語', en: 'English' },
    [DataType.News]: { zh_CN: '热榜', zh_TW: '熱榜', en: 'Trending' },
  };
  return labels[type][language];
};

/**
 * 获取百科数据源的显示标签
 * @param mode 百科数据源类型
 * @returns 百科数据源的显示标签
 */
export const getKnowledgeModeLabel = (mode: KnowledgeMode, language = AppLanguage.ZhCN): string => {
  const labels: Record<KnowledgeMode, LocalizedLabel> = {
    [KnowledgeMode.Wiki]: { zh_CN: '维基百科', zh_TW: '維基百科', en: 'Wikipedia' },
    [KnowledgeMode.Baidu]: { zh_CN: '百度百科', zh_TW: '百度百科', en: 'Baidu Baike' },
  };
  return labels[mode][language];
};

export const getPoetryCategoryLabel = (
  category: PoetrySourceCategory,
  language = AppLanguage.ZhCN
) => {
  const labels: Record<PoetrySourceCategory, LocalizedLabel> = {
    [PoetrySourceCategory.All]: { zh_CN: '全部', zh_TW: '全部', en: 'All' },
    [PoetrySourceCategory.Poem]: { zh_CN: '诗歌', zh_TW: '詩歌', en: 'Poems' },
    [PoetrySourceCategory.Ci]: { zh_CN: '词', zh_TW: '詞', en: 'Ci Poetry' },
    [PoetrySourceCategory.Classic]: { zh_CN: '经典', zh_TW: '經典', en: 'Classics' },
    [PoetrySourceCategory.Primer]: { zh_CN: '蒙学', zh_TW: '蒙學', en: 'Primers' },
    [PoetrySourceCategory.Essay]: { zh_CN: '文人小品', zh_TW: '文人小品', en: 'Essays' },
  };
  return labels[category][language];
};

export const getPoetrySourceLabel = (source: PoetrySource, language = AppLanguage.ZhCN) => {
  const labels: Record<PoetrySource, LocalizedLabel> = {
    [PoetrySource.Shijing]: { zh_CN: '诗经', zh_TW: '詩經', en: 'Book of Songs' },
    [PoetrySource.Chuci]: { zh_CN: '楚辞', zh_TW: '楚辭', en: 'Songs of Chu' },
    [PoetrySource.Caocao]: { zh_CN: '曹操诗集', zh_TW: '曹操詩集', en: "Cao Cao's Poems" },
    [PoetrySource.Tang300]: { zh_CN: '唐诗三百首', zh_TW: '唐詩三百首', en: '300 Tang Poems' },
    [PoetrySource.TangFamousSelected]: {
      zh_CN: '全唐诗·名家精选',
      zh_TW: '全唐詩·名家精選',
      en: 'Selected Tang Poets',
    },
    [PoetrySource.ShuimoTang]: {
      zh_CN: '水墨唐诗',
      zh_TW: '水墨唐詩',
      en: 'Ink-Wash Tang Poems',
    },
    [PoetrySource.Qianjiashi]: {
      zh_CN: '千家诗',
      zh_TW: '千家詩',
      en: 'Poems of a Thousand Masters',
    },
    [PoetrySource.Songci300]: {
      zh_CN: '宋词三百首',
      zh_TW: '宋詞三百首',
      en: '300 Song Ci Poems',
    },
    [PoetrySource.SongciFamousSelected]: {
      zh_CN: '全宋词·名家精选',
      zh_TW: '全宋詞·名家精選',
      en: 'Selected Song Ci Poets',
    },
    [PoetrySource.Nalan]: {
      zh_CN: '纳兰性德词集',
      zh_TW: '納蘭性德詞集',
      en: "Nalan Xingde's Ci",
    },
    [PoetrySource.Lunyu]: { zh_CN: '论语', zh_TW: '論語', en: 'Analects' },
    [PoetrySource.Mengzi]: { zh_CN: '孟子', zh_TW: '孟子', en: 'Mencius' },
    [PoetrySource.Daxue]: { zh_CN: '大学', zh_TW: '大學', en: 'Great Learning' },
    [PoetrySource.Zhongyong]: { zh_CN: '中庸', zh_TW: '中庸', en: 'Doctrine of the Mean' },
    [PoetrySource.Zengguang]: {
      zh_CN: '增广贤文',
      zh_TW: '增廣賢文',
      en: 'Zengguang Xianwen',
    },
    [PoetrySource.Qianziwen]: {
      zh_CN: '千字文',
      zh_TW: '千字文',
      en: 'Thousand Character Classic',
    },
    [PoetrySource.Youmengying]: {
      zh_CN: '幽梦影',
      zh_TW: '幽夢影',
      en: 'Quiet Dream Shadows',
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
  return language === AppLanguage.ZhTW ? TRADITIONAL_NEWS_LABELS[label] ?? label : label;
};
