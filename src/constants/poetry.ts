export enum PoetrySourceCategory {
  All = 'all',
  Poem = 'poem',
  Ci = 'ci',
  Classic = 'classic',
  Primer = 'primer',
  Essay = 'essay',
}

export enum PoetrySource {
  Shijing = 'shijing',
  Chuci = 'chuci',
  Caocao = 'caocao',
  Tang300 = 'tang_300',
  TangFamousSelected = 'tang_famous_selected',
  ShuimoTang = 'shuimo_tang',
  Qianjiashi = 'qianjiashi',
  Songci300 = 'songci_300',
  SongciFamousSelected = 'songci_famous_selected',
  Nalan = 'nalan',
  Lunyu = 'lunyu',
  Mengzi = 'mengzi',
  Daxue = 'daxue',
  Zhongyong = 'zhongyong',
  Zengguang = 'zengguang',
  Qianziwen = 'qianziwen',
  Youmengying = 'youmengying',
}

export interface PoetrySourceOption {
  value: PoetrySource;
  label: string;
}

export interface PoetrySourceGroup {
  category: Exclude<PoetrySourceCategory, PoetrySourceCategory.All>;
  label: string;
  sources: PoetrySourceOption[];
}

export const POETRY_SOURCE_GROUPS: PoetrySourceGroup[] = [
  {
    category: PoetrySourceCategory.Poem,
    label: '诗歌',
    sources: [
      { value: PoetrySource.Shijing, label: '诗经' },
      { value: PoetrySource.Chuci, label: '楚辞' },
      { value: PoetrySource.Caocao, label: '曹操诗集' },
      { value: PoetrySource.Tang300, label: '唐诗三百首' },
      { value: PoetrySource.TangFamousSelected, label: '全唐诗·名家精选' },
      { value: PoetrySource.ShuimoTang, label: '水墨唐诗' },
      { value: PoetrySource.Qianjiashi, label: '千家诗' },
    ],
  },
  {
    category: PoetrySourceCategory.Ci,
    label: '词',
    sources: [
      { value: PoetrySource.Songci300, label: '宋词三百首' },
      { value: PoetrySource.SongciFamousSelected, label: '全宋词·名家精选' },
      { value: PoetrySource.Nalan, label: '纳兰性德词集' },
    ],
  },
  {
    category: PoetrySourceCategory.Classic,
    label: '经典',
    sources: [
      { value: PoetrySource.Lunyu, label: '论语' },
      { value: PoetrySource.Mengzi, label: '孟子' },
      { value: PoetrySource.Daxue, label: '大学' },
      { value: PoetrySource.Zhongyong, label: '中庸' },
    ],
  },
  {
    category: PoetrySourceCategory.Primer,
    label: '蒙学',
    sources: [
      { value: PoetrySource.Zengguang, label: '增广贤文' },
      { value: PoetrySource.Qianziwen, label: '千字文' },
    ],
  },
  {
    category: PoetrySourceCategory.Essay,
    label: '文人小品',
    sources: [{ value: PoetrySource.Youmengying, label: '幽梦影' }],
  },
];

export const ALL_POETRY_SOURCES = POETRY_SOURCE_GROUPS.flatMap((group) => group.sources).map(
  (source) => source.value
);

export const getPoetrySourceGroup = (category: PoetrySourceCategory) => {
  return POETRY_SOURCE_GROUPS.find((group) => group.category === category);
};

export const getPoetrySourceOptions = (category: PoetrySourceCategory): PoetrySourceOption[] => {
  if (category === PoetrySourceCategory.All) {
    return POETRY_SOURCE_GROUPS.flatMap((group) => group.sources);
  }

  return getPoetrySourceGroup(category)?.sources ?? [];
};
