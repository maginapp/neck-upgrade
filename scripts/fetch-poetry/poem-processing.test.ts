import { describe, expect, it } from 'vitest';

import { processQianZiWen, QIAN_ZI_WEN_SEMANTIC_SECTIONS } from './poem-processing';
import { PoetrySource, PoetrySourceCategory, QianZiWen } from './types';

const createQianZiWen = (): QianZiWen => ({
  title: '千字文',
  author: '周興嗣',
  tags: '南北朝',
  paragraphs: Array.from({ length: 250 }, (_, index) => `正文${index + 1}`),
  spells: Array.from({ length: 250 }, (_, index) => `拼音${index + 1}`),
});

describe('processQianZiWen', () => {
  it('应该按语义边界生成 34 个小节，并完整保留原文顺序', () => {
    const source = createQianZiWen();
    const result = processQianZiWen(source);

    expect(result).toHaveLength(34);
    expect(result).toHaveLength(QIAN_ZI_WEN_SEMANTIC_SECTIONS.length);
    expect(result.flatMap((item) => item.paragraphs)).toEqual(source.paragraphs);
    expect(result.flatMap((item) => item.spells || [])).toEqual(source.spells);
    expect(result.every((item) => item.paragraphs.length % 2 === 0)).toBe(true);
  });

  it('应该将篇章和语义小节写入标题及标签', () => {
    const result = processQianZiWen(createQianZiWen());

    expect(result[0]).toMatchObject({
      title: '千字文 · 天地宇宙',
      paragraphs: Array.from({ length: 10 }, (_, index) => `正文${index + 1}`),
      category: PoetrySourceCategory.Primer,
      sources: [PoetrySource.Qianziwen],
      tags: ['南北朝', '千字文', '天地、人文与王道', '天地宇宙'],
    });
    expect(result.at(-1)).toMatchObject({
      title: '千字文 · 文末语助',
      paragraphs: ['正文249', '正文250'],
      tags: ['南北朝', '千字文', '篇末收束', '文末语助'],
    });
  });

  it('原文或拼音数量不符合预期时应该中止生成', () => {
    const missingSpell = createQianZiWen();
    missingSpell.spells.pop();
    expect(() => processQianZiWen(missingSpell)).toThrow('千字文正文与拼音数量不一致');

    const missingParagraph = createQianZiWen();
    missingParagraph.paragraphs.splice(-1);
    missingParagraph.spells.splice(-1);
    expect(() => processQianZiWen(missingParagraph)).toThrow('千字文应包含 250 个四字句');
  });
});
