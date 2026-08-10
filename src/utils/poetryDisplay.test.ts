import { describe, expect, it } from 'vitest';

import { PoetrySource, PoetrySourceCategory } from '@/constants/poetry';
import { Poetry } from '@/types';

import { getPoetryDisplayLines } from './poetryDisplay';

const qianZiWen: Poetry = {
  title: '千字文 · 天地宇宙',
  author: '周興嗣',
  paragraphs: ['天地玄黃', '宇宙洪荒', '日月盈昃', '辰宿列張'],
  spells: ['tiān dì xuán huáng', 'yǔ zhòu hóng huāng', 'rì yuè yíng zè', 'chén xiù liè zhāng'],
  category: PoetrySourceCategory.Primer,
  sources: [PoetrySource.Qianziwen],
};

describe('getPoetryDisplayLines', () => {
  it('千字文应该将两个四字句合并为一行', () => {
    expect(getPoetryDisplayLines(qianZiWen)).toEqual([
      {
        paragraph: '天地玄黃，宇宙洪荒',
        spell: 'tiān dì xuán huáng，yǔ zhòu hóng huāng',
      },
      {
        paragraph: '日月盈昃，辰宿列張',
        spell: 'rì yuè yíng zè，chén xiù liè zhāng',
      },
    ]);
  });

  it('其他诗词应该保持原始分行', () => {
    const poem: Poetry = {
      ...qianZiWen,
      title: '静夜思',
      paragraphs: ['床前明月光', '疑是地上霜'],
      spells: undefined,
      category: PoetrySourceCategory.Poem,
      sources: [PoetrySource.Tang300],
    };

    expect(getPoetryDisplayLines(poem)).toEqual([
      { paragraph: '床前明月光', spell: undefined },
      { paragraph: '疑是地上霜', spell: undefined },
    ]);
  });
});
