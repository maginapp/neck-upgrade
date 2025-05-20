export interface HistoricalEvent {
  html: string;
}

export interface HolidayWikiInfo {
  html: string;
}

export interface HolidayInfo {
  name: string;
  date: string;
  isOffDay?: boolean;
}

export interface NextHolidayResponse {
  code: number;
  holiday: {
    holiday: boolean;
    name: string;
    date: string;
    wage: number;
    rest: number;
  };
}
