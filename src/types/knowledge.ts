export interface HolidayToday {
  html: string;
}

export interface HistoricalEvent {
  category: string;
  html: string;
}

export interface KnowledgeData {
  allHistoricalEvents: HistoricalEvent[];
  allHolidays: HolidayToday[];
}

// 组件展示的数据
export interface KnowledgeDisplay {
  events: HistoricalEvent[];
  holidays: HolidayToday[];
}
