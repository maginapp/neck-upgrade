import React, { useEffect, useState } from 'react';
import { getHistoricalEvents, getHolidays } from './utils/wikiApi';
import { getNextHoliday } from './utils/holidayApi';
import { HistoricalEvent, HolidayInfo } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [holidays, setHolidays] = useState<HolidayInfo[]>([]);
  const [nextHoliday, setNextHoliday] = useState<HolidayInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historicalEvents, holidayInfo, nextHolidayInfo] = await Promise.all([
          getHistoricalEvents(),
          getHolidays(),
          getNextHoliday()
        ]);
        setEvents(historicalEvents);
        setHolidays(holidayInfo);
        setNextHoliday(nextHolidayInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <h1>历史上的今天</h1>
      
      <section className="historical-events">
        <h2>大事记</h2>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <span className="year">{event.year}</span>
              <span className="description">{event.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="holidays">
        <h2>节假日</h2>
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index}>
              <span className="name">{holiday.name}</span>
              <span className="date">{holiday.date}</span>
              {holiday.link && (
                <a href={holiday.link} target="_blank" rel="noopener noreferrer" className="link">
                  查看详情
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      {nextHoliday && (
        <section className="next-holiday">
          <h2>下一个节假日</h2>
          <div className="holiday-card">
            <h3>{nextHoliday.name}</h3>
            <p>日期：{nextHoliday.date}</p>
            {nextHoliday.isOffDay && <p className="off-day">放假</p>}
          </div>
        </section>
      )}
    </div>
  );
};

export default App; 