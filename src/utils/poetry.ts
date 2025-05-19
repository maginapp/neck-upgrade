import { readFileSync } from 'fs';
import { join } from 'path';

const caocao = JSON.parse(readFileSync(join(process.cwd(), 'node_modules/chinese-poetry/chinese-poetry/caocao.json'), 'utf-8'));
const chuci = JSON.parse(readFileSync(join(process.cwd(), 'node_modules/chinese-poetry/chinese-poetry/chuci.json'), 'utf-8'));
const tangshi = JSON.parse(readFileSync(join(process.cwd(), 'node_modules/chinese-poetry/chinese-poetry/tangshi.json'), 'utf-8'));
const songci = JSON.parse(readFileSync(join(process.cwd(), 'node_modules/chinese-poetry/chinese-poetry/songci.json'), 'utf-8'));
const shuimotangshi = JSON.parse(readFileSync(join(process.cwd(), 'node_modules/chinese-poetry/chinese-poetry/shuimotangshi.json'), 'utf-8'));

interface PoetryItem {
  title: string;
  author: string;
  content: string;
  dynasty: string;
  source: string;
}

interface RawPoem {
  title: string;
  author?: string;
  content: string[];
}

export function combinePoetryData(): PoetryItem[] {
  const result: PoetryItem[] = [];

  // 处理曹操诗集
  caocao.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: '曹操',
      content: poem.content.join('\n'),
      dynasty: '三国',
      source: '曹操诗集'
    });
  });

  // 处理楚辞
  chuci.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '战国',
      source: '楚辞'
    });
  });

  // 处理唐诗三百首
  tangshi.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '唐',
      source: '唐诗三百首'
    });
  });

  // 处理宋词三百首
  songci.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '宋',
      source: '宋词三百首'
    });
  });

  // 处理水墨唐诗
  shuimotangshi.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '唐',
      source: '水墨唐诗'
    });
  });

  return result;
}

// 导出处理后的数据
export const poetryData = combinePoetryData(); 