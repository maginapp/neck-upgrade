export interface PoetryItem {
  title: string; // 标题 宋词使用rhythmic
  author: string;
  paragraphs: string[];
  prologue?: string;
  tags: string[];
}

export interface CacaoPoem {
  title: string;
  paragraphs: string[];
}

export interface ShijingPoem {
  title: string;
  chapter: string;
  section: string;
  content: string[];
}

export interface ChuciPoem {
  title: string;
  section: string;
  author: string;
  content: string[];
}

export interface TangshiPoem {
  title: string;
  author: string;
  paragraphs: string[];
  tags: string[];
  prologue?: string;
}

export interface SongciPoem {
  rhythmic: string;
  author: string;
  paragraphs: string[];
  tags: string[];
}

export interface ShuimotangshiPoem {
  title: string;
  author: string;
  paragraphs: string[];
  tags: string[];
  prologue: string;
}
