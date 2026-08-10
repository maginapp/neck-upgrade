import { PoetrySource, PoetrySourceCategory } from '@/constants/poetry';

export interface Poetry {
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
