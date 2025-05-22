export interface HistoricalEvent {
  html: string;
}

export interface HolidayToday {
  html: string;
}

export interface HistoricalEventWithCategory extends HistoricalEvent {
  category: string;
}

export interface KnowledgeData {
  allHistoricalEvents: HistoricalEventWithCategory[];
  allHolidays: HolidayToday[];
}
