// 生成脚本运行在独立的 TypeScript project 中；值需与 src/constants/poetry.ts 保持一致。
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

export interface PoetryItem {
  title: string; // 标题 宋词使用rhythmic
  author: string;
  paragraphs: string[];
  category: Exclude<PoetrySourceCategory, PoetrySourceCategory.All>;
  sources: PoetrySource[];
  prologue?: string;
  tags?: string[];
  spells?: string[];
  align?: 'center' | 'left';
}

// 曹操诗集
export interface CacaoPoem {
  title: string;
  paragraphs: string[];
}

// 诗经
export interface ShijingPoem {
  title: string;
  chapter: string;
  section: string;
  content: string[];
}

// 楚辞
export interface ChuciPoem {
  title: string;
  section: string;
  author: string;
  content: string[];
}

// 唐诗
export interface TangshiPoem {
  title: string;
  author: string;
  paragraphs: string[];
  tags: string[];
  prologue?: string;
}

// 宋词
export interface SongciPoem {
  rhythmic: string;
  author: string;
  paragraphs: string[];
  tags: string[];
}

// 水墨唐诗
export interface ShuimotangshiPoem {
  title: string;
  author: string;
  paragraphs: string[];
  tags: string[];
  prologue: string;
}

//  四书五经 / 论语
export interface CommonArticle {
  chapter: string;
  paragraphs: string[];
}

// 幽梦影
export interface YouMengYing {
  content: string;
  comment: string[];
}

export interface ZengGuangXianWen {
  title: string;
  author: string;
  abstract: string;
  content: {
    chapter: string;
    paragraphs: string[];
  }[];
}

interface QianJiaPoem {
  chapter: string;
  author: string;
  paragraphs: string[];
}

export interface QianJiaShi {
  title: string;
  author: string;
  content: {
    type: string;
    content: QianJiaPoem[];
  }[];
}

export interface QianZiWen {
  title: string;
  author: string;
  tags: string;
  paragraphs: string[];
  spells: string[];
}

export type NaLanXingDe = {
  title: string;
  author: string;
  para: string[];
}[];
