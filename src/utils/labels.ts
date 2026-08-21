import { PoetrySource, PoetrySourceCategory } from '@/constants/poetry';
import { AppLanguage, Theme, NeckMode, DataType, KnowledgeMode } from '@/types/app';

interface LocalizedLabel {
  [AppLanguage.ZhCN]: string;
  [AppLanguage.En]: string;
}

/**
 * 获取主题的显示标签
 * @param theme 主题类型
 * @returns 主题的显示标签
 */
export const getThemeLabel = (theme: Theme, language = AppLanguage.ZhCN): string => {
  const labels: Record<Theme, LocalizedLabel> = {
    [Theme.System]: { zh_CN: '系统', en: 'System' },
    [Theme.Light]: { zh_CN: '亮色', en: 'Light' },
    [Theme.Dark]: { zh_CN: '暗黑', en: 'Dark' },
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
    [NeckMode.Normal]: { zh_CN: '普通', en: 'Normal' },
    [NeckMode.Training]: { zh_CN: '训练', en: 'Training' },
    [NeckMode.Reading]: { zh_CN: '阅读', en: 'Reading' },
    [NeckMode.Intense]: { zh_CN: '强化', en: 'Intense' },
    [NeckMode.Custom]: { zh_CN: '高级', en: 'Advanced' },
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
    [DataType.Poetry]: { zh_CN: '诗词', en: 'Poetry' },
    [DataType.History]: { zh_CN: '历史', en: 'History' },
    [DataType.English]: { zh_CN: '英语', en: 'English' },
    [DataType.News]: { zh_CN: '热榜', en: 'Trending' },
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
    [KnowledgeMode.Wiki]: { zh_CN: '维基百科', en: 'Wikipedia' },
    [KnowledgeMode.Baidu]: { zh_CN: '百度百科', en: 'Baidu Baike' },
  };
  return labels[mode][language];
};

export const getPoetryCategoryLabel = (
  category: PoetrySourceCategory,
  language = AppLanguage.ZhCN
) => {
  const labels: Record<PoetrySourceCategory, LocalizedLabel> = {
    [PoetrySourceCategory.All]: { zh_CN: '全部', en: 'All' },
    [PoetrySourceCategory.Poem]: { zh_CN: '诗歌', en: 'Poems' },
    [PoetrySourceCategory.Ci]: { zh_CN: '词', en: 'Ci Poetry' },
    [PoetrySourceCategory.Classic]: { zh_CN: '经典', en: 'Classics' },
    [PoetrySourceCategory.Primer]: { zh_CN: '蒙学', en: 'Primers' },
    [PoetrySourceCategory.Essay]: { zh_CN: '文人小品', en: 'Essays' },
  };
  return labels[category][language];
};

export const getPoetrySourceLabel = (source: PoetrySource, language = AppLanguage.ZhCN) => {
  const labels: Record<PoetrySource, LocalizedLabel> = {
    [PoetrySource.Shijing]: { zh_CN: '诗经', en: 'Book of Songs' },
    [PoetrySource.Chuci]: { zh_CN: '楚辞', en: 'Songs of Chu' },
    [PoetrySource.Caocao]: { zh_CN: '曹操诗集', en: "Cao Cao's Poems" },
    [PoetrySource.Tang300]: { zh_CN: '唐诗三百首', en: '300 Tang Poems' },
    [PoetrySource.TangFamousSelected]: { zh_CN: '全唐诗·名家精选', en: 'Selected Tang Poets' },
    [PoetrySource.ShuimoTang]: { zh_CN: '水墨唐诗', en: 'Ink-Wash Tang Poems' },
    [PoetrySource.Qianjiashi]: { zh_CN: '千家诗', en: 'Poems of a Thousand Masters' },
    [PoetrySource.Songci300]: { zh_CN: '宋词三百首', en: '300 Song Ci Poems' },
    [PoetrySource.SongciFamousSelected]: { zh_CN: '全宋词·名家精选', en: 'Selected Song Ci Poets' },
    [PoetrySource.Nalan]: { zh_CN: '纳兰性德词集', en: "Nalan Xingde's Ci" },
    [PoetrySource.Lunyu]: { zh_CN: '论语', en: 'Analects' },
    [PoetrySource.Mengzi]: { zh_CN: '孟子', en: 'Mencius' },
    [PoetrySource.Daxue]: { zh_CN: '大学', en: 'Great Learning' },
    [PoetrySource.Zhongyong]: { zh_CN: '中庸', en: 'Doctrine of the Mean' },
    [PoetrySource.Zengguang]: { zh_CN: '增广贤文', en: 'Zengguang Xianwen' },
    [PoetrySource.Qianziwen]: { zh_CN: '千字文', en: 'Thousand Character Classic' },
    [PoetrySource.Youmengying]: { zh_CN: '幽梦影', en: 'Quiet Dream Shadows' },
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

export const getNewsLabel = (label: string, language = AppLanguage.ZhCN) => {
  return language === AppLanguage.En ? ENGLISH_NEWS_LABELS[label] ?? label : label;
};
