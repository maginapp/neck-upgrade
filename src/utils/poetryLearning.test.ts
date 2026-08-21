import { describe, it, expect, beforeEach, vi } from 'vitest';

import { PoetrySource, PoetrySourceCategory } from '@/constants/poetry';
import { Poetry } from '@/types';

import { getNextRecord } from './generateNext';
import { filterPoetryData, getNextPoem, getPoetryScopeKey, isSamePoetry } from './poetryLearning';

const poetryData: Poetry[] = [
  {
    title: '静夜思',
    author: '李白',
    paragraphs: ['床前明月光', '疑是地上霜'],
    category: PoetrySourceCategory.Poem,
    sources: [PoetrySource.Tang300, PoetrySource.TangFamousSelected],
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    paragraphs: ['白日依山尽', '黄河入海流'],
    category: PoetrySourceCategory.Poem,
    sources: [PoetrySource.Tang300],
  },
  {
    title: '千字文 · 天地宇宙',
    author: '周兴嗣',
    paragraphs: ['天地玄黄', '宇宙洪荒'],
    category: PoetrySourceCategory.Primer,
    sources: [PoetrySource.Qianziwen],
  },
];

// Mock chrome.storage.local
const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
};
const defaultCacheKey = 'poetry_learning_record:all:all';

global.chrome = {
  runtime: {
    getURL: vi.fn((path: string) => path),
  },
  storage: {
    local: mockStorage,
  },
} as unknown as typeof chrome;

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => poetryData,
}) as unknown as typeof fetch;

const getLastSavedRecords = () => {
  const payload = mockStorage.set.mock.calls.at(-1)?.[0];
  return payload[Object.keys(payload)[0]];
};

const mockStorageResult = (result: Record<string, unknown>, once = true) => {
  const implementation = (_keys: unknown, callback: (items: Record<string, unknown>) => void) => {
    callback(result);
  };

  if (once) {
    mockStorage.get.mockImplementationOnce(implementation);
  } else {
    mockStorage.get.mockImplementation(implementation);
  }
};

// Mock 日期
const mockDate = '2024-03-20';
vi.useFakeTimers();
vi.setSystemTime(new Date(mockDate));

describe('getNextPoem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.set.mockImplementation((_items, callback?: () => void) => callback?.());
  });

  it('首次获取诗词时应该返回新的诗词', async () => {
    // 模拟空的历史记录
    mockStorageResult({ [defaultCacheKey]: null });

    const poems = await getNextPoem();
    const poem = poems?.[0];
    expect(poem).toBeDefined();
    expect(poem?.title).toBeDefined();
    expect(poem?.author).toBeDefined();
    expect(poem?.paragraphs).toBeDefined();
  });

  it('应该按顺序返回当天新增的诗词', async () => {
    // 模拟已有当天记录
    const mockRecords = {
      history: [],
      todayNew: {
        records: [
          {
            title: '静夜思',
            author: '李白',
            paragraphs: ['床前明月光', '疑是地上霜'],
          },
          {
            title: '登鹳雀楼',
            author: '王之涣',
            paragraphs: ['白日依山尽', '黄河入海流'],
          },
        ],
        currentIndex: 0,
      },
      todayReview: {
        records: [],
        currentIndex: 0,
      },
      currentDate: mockDate,
    };

    mockStorageResult({ [defaultCacheKey]: mockRecords }, false);

    const poems = await getNextPoem();
    expect(poems).toEqual(mockRecords.todayNew.records);
  });

  it('当天新增诗词展示完后应该返回复习诗词', async () => {
    // 模拟当天新增诗词已全部展示
    const mockRecords = {
      history: [
        {
          date: '2024-03-19',
          records: [
            {
              title: '静夜思',
              author: '李白',
              paragraphs: ['床前明月光', '疑是地上霜'],
            },
          ],
        },
      ],
      todayNew: {
        records: [
          {
            title: '静夜思',
            author: '李白',
            paragraphs: ['床前明月光', '疑是地上霜'],
          },
          {
            title: '登鹳雀楼',
            author: '王之涣',
            paragraphs: ['白日依山尽', '黄河入海流'],
          },
        ],
        currentIndex: 2, // 已全部展示
      },
      todayReview: {
        records: [
          {
            title: '静夜思',
            author: '李白',
            paragraphs: ['床前明月光', '疑是地上霜'],
          },
        ],
        currentIndex: 0,
      },
      currentDate: mockDate,
    };

    mockStorageResult({ [defaultCacheKey]: mockRecords });

    const poem = (await getNextPoem())?.[0];
    expect(poem).toEqual(mockRecords.todayReview.records[0]);
  });

  it('日期变更时应该重置当天的记录', async () => {
    // 模拟昨天的记录
    const mockRecords = {
      history: [],
      todayNew: {
        records: [
          {
            title: '静夜思',
            author: '李白',
            paragraphs: ['床前明月光', '疑是地上霜'],
          },
          {
            title: '登鹳雀楼',
            author: '王之涣',
            paragraphs: ['白日依山尽', '黄河入海流'],
          },
        ],
        currentIndex: 0,
      },
      todayReview: {
        records: [],
        currentIndex: 0,
      },
      currentDate: '2024-03-19', // 昨天的日期
    };

    mockStorageResult({ [defaultCacheKey]: mockRecords });

    const poem = await getNextPoem();
    expect(poem).toBeDefined();
    expect(mockStorage.set).toHaveBeenCalled();
    // 验证存储的记录中 currentDate 已更新为今天
    const savedRecords = getLastSavedRecords();
    expect(savedRecords.currentDate).toBe(mockDate);
  });

  it('当天的诗词展示后应该被添加到历史记录', async () => {
    // 模拟空的历史记录
    mockStorageResult({ [defaultCacheKey]: null });

    const poems = await getNextPoem();
    const poem = poems?.[0];
    expect(poem).toBeDefined();

    // 验证存储的记录中包含当天的诗词
    const savedRecords = getLastSavedRecords();
    expect(savedRecords.history[0].date).toBe(mockDate);
    expect(savedRecords.history[0].records).toContainEqual(poem);
  });

  it('应该按一级分类过滤诗词', () => {
    const result = filterPoetryData(poetryData, {
      category: PoetrySourceCategory.Primer,
      sources: [],
    });

    expect(result).toHaveLength(1);
    expect(result[0].sources).toContain(PoetrySource.Qianziwen);
  });

  it('应该按多个具体来源过滤诗词', () => {
    const result = filterPoetryData(poetryData, {
      category: PoetrySourceCategory.Poem,
      sources: [PoetrySource.TangFamousSelected],
    });

    expect(result.map((item) => item.title)).toEqual(['静夜思']);
  });

  it('来源顺序不应影响学习记录作用域', () => {
    const first = getPoetryScopeKey({
      category: PoetrySourceCategory.Poem,
      sources: [PoetrySource.Tang300, PoetrySource.ShuimoTang],
    });
    const second = getPoetryScopeKey({
      category: PoetrySourceCategory.Poem,
      sources: [PoetrySource.ShuimoTang, PoetrySource.Tang300],
    });

    expect(first).toBe(second);
  });

  it('使用正文行数及首、中、末行的前三个非空字符区分同名蒙学记录', () => {
    const first: Poetry = {
      title: '增广贤文 · 上集',
      author: '佚名',
      paragraphs: ['  昔 时 贤文，诲汝谆谆', '观今宜鉴古', '无古不成今'],
      category: PoetrySourceCategory.Primer,
      sources: [PoetrySource.Zengguang],
    };
    const differentFirstLine: Poetry = {
      ...first,
      paragraphs: ['集韵增广，多见多闻', '观今宜鉴古', '无古不成今'],
    };
    const sameSamples: Poetry = {
      ...first,
      paragraphs: ['昔时贤，其他文字', '观今宜，其他文字', '无古不，其他文字'],
    };

    expect(isSamePoetry(first, differentFirstLine)).toBe(false);
    expect(
      isSamePoetry(first, {
        ...first,
        paragraphs: [first.paragraphs[0], '察今宜鉴古', first.paragraphs[2]],
      })
    ).toBe(false);
    expect(
      isSamePoetry(first, {
        ...first,
        paragraphs: [first.paragraphs[0], first.paragraphs[1], '今古无不成'],
      })
    ).toBe(false);
    expect(isSamePoetry(first, sameSamples)).toBe(true);
    expect(isSamePoetry(first, { ...first, paragraphs: [...first.paragraphs, '新增一行'] })).toBe(
      false
    );
  });

  it('历史记录覆盖全部等价候选时应该自动开始新一轮', async () => {
    const cacheKey = 'duplicate-record-learning';
    const data = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      group: index < 10 ? '上集' : '下集',
    }));
    const records = {
      history: [
        {
          date: '2024-03-19',
          records: [data[0], data[10]],
        },
      ],
      todayNew: { records: [], currentIndex: 0 },
      todayReview: { records: [], currentIndex: 0 },
      currentDate: '2024-03-19',
    };

    mockStorageResult({ [cacheKey]: records });

    const result = await getNextRecord({
      cacheKey,
      compareFn: (first, second) => first.group === second.group,
      getData: () => data,
      unitCount: 4,
      batchSize: 2,
    });

    expect(result).toHaveLength(2);
  });
});
