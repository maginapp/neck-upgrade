export interface PoetryItem {
  title: string; // 标题 宋词使用rhythmic
  author: string;
  paragraphs: string[];
  prologue?: string;
  tags?: string[];
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

export type NaLanXingDe = {
  title: string;
  author: string;
  para: string[];
}[];
