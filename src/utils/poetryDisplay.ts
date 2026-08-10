import { PoetrySource } from '@/constants/poetry';
import { Poetry } from '@/types';

export interface PoetryDisplayLine {
  paragraph: string;
  spell?: string;
}

export const getPoetryDisplayLines = (poem: Poetry): PoetryDisplayLine[] => {
  const isQianZiWen = poem.sources.includes(PoetrySource.Qianziwen);

  if (!isQianZiWen) {
    return poem.paragraphs.map((paragraph, index) => ({
      paragraph,
      spell: poem.spells?.[index],
    }));
  }

  const lines: PoetryDisplayLine[] = [];
  for (let index = 0; index < poem.paragraphs.length; index += 2) {
    const paragraphs = poem.paragraphs.slice(index, index + 2);
    const spells = poem.spells?.slice(index, index + 2).filter(Boolean);

    lines.push({
      paragraph: paragraphs.join('，'),
      spell: spells?.length ? spells.join('，') : undefined,
    });
  }

  return lines;
};
