import { HistoryRecord } from '.';

// 诗词类型
export interface Poetry {
  title: string;
  author: string;
  paragraphs: string[];
  tags?: string[];
}

// 历史学习记录（30天内）
export type HistoryPomsRecord = HistoryRecord<Poetry>;

// 当天新增的诗词
interface TodayNewPoems {
  poems: Poetry[];
  currentIndex: number;
}

// 当天需要复习的诗词
interface TodayReviewPoems {
  poems: Poetry[];
  currentIndex: number;
}

// 完整的学习记录
export interface LearningRecords {
  history: HistoryPomsRecord[]; // 30天内的学习记录
  todayNew: TodayNewPoems; // 当天新增的诗词
  todayReview: TodayReviewPoems; // 当天需要复习的诗词
  currentDate: string; // 当前日期
}
