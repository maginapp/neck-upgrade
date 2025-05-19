export interface HistoricalEvent {
  year: string;
  description: string;
}

export interface HolidayInfo {
  name: string;
  date: string;
  isOffDay?: boolean;
  link?: string;
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