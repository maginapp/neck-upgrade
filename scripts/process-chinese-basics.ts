import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ChineseBasicsCategory } from '../src/types/app';
import { ChineseBasicsEntry } from '../src/types/chineseBasics';

const SOURCE_URL = 'https://github.com/pwxcoo/chinese-xinhua';
const MAX_ENTRIES_PER_CATEGORY = 10_000;
const inputDirectory = path.resolve(process.argv[2] || 'temp/chinese-xinhua/data');
const outputDirectory = path.resolve('public/data/chinese-basics');

interface SourceIdiom {
  word?: string;
  pinyin?: string;
  explanation?: string;
  derivation?: string;
  example?: string;
}

interface SourceCharacter {
  word?: string;
  oldword?: string;
  strokes?: string;
  pinyin?: string;
  radicals?: string;
  explanation?: string;
}

interface SourceXiehouyu {
  riddle?: string;
  answer?: string;
}

interface SourceWord {
  ci?: string;
  explanation?: string;
}

const clean = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.replace(/\s+/gu, ' ').trim();
  if (!normalized) return undefined;
  const chars = Array.from(normalized);
  return chars.length > maxLength ? `${chars.slice(0, maxLength).join('')}…` : normalized;
};

const compact = <T extends object>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, field]) => field !== undefined)) as T;

const score = (entry: ChineseBasicsEntry) =>
  createHash('sha256').update(`${entry.category}:${entry.key}`).digest('hex');

export const selectDeterministicSample = (
  entries: ChineseBasicsEntry[],
  limit = MAX_ENTRIES_PER_CATEGORY
) => entries.sort((first, second) => score(first).localeCompare(score(second))).slice(0, limit);

const readJson = async <T>(filename: string): Promise<T[]> =>
  JSON.parse(await readFile(path.join(inputDirectory, filename), 'utf8')) as T[];

const processIdiom = async () => {
  const source = await readJson<SourceIdiom>('idiom.json');
  return source
    .map((item): ChineseBasicsEntry | null => {
      const title = clean(item.word, 40);
      const explanation = clean(item.explanation, 800);
      if (!title || !explanation) return null;
      return compact({
        category: ChineseBasicsCategory.Idiom,
        key: title,
        title,
        pinyin: clean(item.pinyin, 120),
        explanation,
        derivation: clean(item.derivation, 300),
        example: clean(item.example, 300),
      });
    })
    .filter((entry): entry is ChineseBasicsEntry => entry !== null);
};

const processCharacter = async () => {
  const source = await readJson<SourceCharacter>('word.json');
  return source
    .map((item): ChineseBasicsEntry | null => {
      const title = clean(item.word, 8);
      const explanation = clean(item.explanation, 600);
      if (!title || !explanation) return null;
      return compact({
        category: ChineseBasicsCategory.Character,
        key: title,
        title,
        traditional: clean(item.oldword, 8),
        pinyin: clean(item.pinyin, 120),
        radical: clean(item.radicals, 20),
        strokes: clean(item.strokes, 10),
        explanation,
      });
    })
    .filter((entry): entry is ChineseBasicsEntry => entry !== null);
};

const processXiehouyu = async () => {
  const source = await readJson<SourceXiehouyu>('xiehouyu.json');
  return source
    .map((item): ChineseBasicsEntry | null => {
      const title = clean(item.riddle, 100);
      const answer = clean(item.answer, 160);
      if (!title || !answer) return null;
      return {
        category: ChineseBasicsCategory.Xiehouyu,
        key: `${title}—${answer}`,
        title,
        answer,
      };
    })
    .filter((entry): entry is ChineseBasicsEntry => entry !== null);
};

const processWord = async () => {
  const source = await readJson<SourceWord>('ci.json');
  return source
    .map((item): ChineseBasicsEntry | null => {
      const title = clean(item.ci, 40);
      const explanation = clean(item.explanation, 600);
      if (!title || !explanation) return null;
      return {
        category: ChineseBasicsCategory.Word,
        key: title,
        title,
        explanation,
      };
    })
    .filter((entry): entry is ChineseBasicsEntry => entry !== null);
};

const run = async () => {
  const processors = [
    ['idiom.json', processIdiom],
    ['character.json', processCharacter],
    ['xiehouyu.json', processXiehouyu],
    ['word.json', processWord],
  ] as const;
  await mkdir(outputDirectory, { recursive: true });

  const counts: Record<string, { source: number; packaged: number }> = {};
  for (const [filename, process] of processors) {
    const entries = await process();
    const selected = selectDeterministicSample(entries);
    await writeFile(path.join(outputDirectory, filename), JSON.stringify(selected));
    counts[filename] = { source: entries.length, packaged: selected.length };
  }

  await writeFile(
    path.join(outputDirectory, 'source.json'),
    `${JSON.stringify(
      {
        source: SOURCE_URL,
        generatedAt: new Date().toISOString(),
        selection: `Deterministic SHA-256 sample, up to ${MAX_ENTRIES_PER_CATEGORY} valid entries per category`,
        counts,
        notice:
          'The upstream repository states that its data was collected online for non-commercial use; verify rights before redistribution.',
      },
      null,
      2
    )}\n`
  );
  console.log(`Chinese basics data generated in ${outputDirectory}`, counts);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
