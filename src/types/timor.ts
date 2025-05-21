// 日期类型定义
type DayType = 0 | 1 | 2 | 3; // 0=工作日, 1=周末, 2=节日, 3=调休
type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 周一到周日

interface DateTypeInfo {
  type: DayType;
  name: string; // 如 "周六"
  week: WeekDay;
}

// 节假日信息
interface HolidayInfo {
  holiday: true;
  name: string; // 节假日名，如 "国庆节"
  wage: number; // 薪资倍数，如 3
  date: string; // 日期字符串
  rest: number; // 距离还有几天
}

// 调休信息
interface WorkdayInfo {
  holiday: false;
  name: string; // 如 "国庆前调休"
  wage: number;
  after: boolean; // true=节后调休，false=节前调休
  target: string; // 调休关联的节假日名
  date: string;
  rest: number;
}

// 类型信息
interface TypeInfo {
  holiday?: DateTypeInfo;
  workday?: DateTypeInfo;
}

// 最终接口响应类型
export interface HolidayApiResponse {
  code: 0 | -1;
  holiday: HolidayInfo;
  workday: WorkdayInfo | null;
  type?: TypeInfo;
}
