export interface Poetry {
  title: string; // 标题 宋词使用rhythmic
  author: string;
  paragraphs: string[];
  prologue?: string;
  tags?: string[];
  align?: 'center' | 'left';
}
