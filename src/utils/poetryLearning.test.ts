import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getNextPoem } from './poetryLearning';

// Mock poetryData
vi.mock('@/data/poetry.json', () => ({
  default: [
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
    {
      title: '春晓',
      author: '孟浩然',
      paragraphs: ['春眠不觉晓', '处处闻啼鸟'],
    },
  ],
}));

// Mock chrome.storage.local
const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
};

global.chrome = {
  storage: {
    // @ts-expect-error QUOTA_BYTES, getBytesInUse, clear, remove, and 2 more.
    local: mockStorage,
  },
};

// Mock 日期
const mockDate = '2024-03-20';
vi.useFakeTimers();
vi.setSystemTime(new Date(mockDate));

describe('getNextPoem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('首次获取诗词时应该返回新的诗词', async () => {
    // 模拟空的历史记录
    mockStorage.get.mockReturnValueOnce(Promise.resolve({ poetry_learning_record: null }));

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

    mockStorage.get.mockReturnValue(Promise.resolve({ poetry_learning_record: mockRecords }));

    const poem1 = (await getNextPoem())?.[0];
    expect(poem1).toEqual(mockRecords.todayNew.records[0]);

    const poem2 = (await getNextPoem())?.[0];
    expect(poem2).toEqual(mockRecords.todayNew.records[1]);
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

    mockStorage.get.mockReturnValueOnce(Promise.resolve({ poetry_learning_record: mockRecords }));

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

    mockStorage.get.mockReturnValueOnce(Promise.resolve({ poetry_learning_record: mockRecords }));

    const poem = await getNextPoem();
    expect(poem).toBeDefined();
    expect(mockStorage.set).toHaveBeenCalled();
    // 验证存储的记录中 currentDate 已更新为今天
    const savedRecords = mockStorage.set.mock.calls[0][0].poetry_learning_record;
    expect(savedRecords.currentDate).not.toBe(mockDate);
  });

  it('当天的诗词展示后应该被添加到历史记录', async () => {
    // 模拟空的历史记录
    mockStorage.get.mockReturnValueOnce(Promise.resolve({ poetry_learning_record: null }));

    const poems = await getNextPoem();
    const poem = poems?.[0];
    expect(poem).toBeDefined();

    // 验证存储的记录中包含当天的诗词
    const savedRecords = mockStorage.set.mock.calls[0][0].poetry_learning_record;
    expect(savedRecords.history[0].date).toBe(mockDate);
    expect(savedRecords.history[0].records).toContainEqual(poem);
  });
});
