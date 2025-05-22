export interface HolidayInfo {
  name: string;
  date: string;
  rest: number;
}

// 历史学习记录（30天内）
export interface HistoryRecord<T> {
  date: string;
  records: T[];
}

// 当天新增的
interface TodayNew<T> {
  currentIndex: number;
  records: T[];
}

// 当天需要复习的
interface TodayReview<T> {
  currentIndex: number;
  records: T[];
}

// 完整的学习记录
export interface LearningRecords<T> {
  history: HistoryRecord<T>[]; // 30天内的学习记录
  todayNew: TodayNew<T>; // 当天新增的单词
  todayReview: TodayReview<T>; // 当天需要复习的
  currentDate: string; // 当前日期
}
