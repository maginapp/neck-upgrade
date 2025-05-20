import React, { useState, useEffect } from 'react';
import { getNextHoliday } from '../../utils/holidayApi';
import { HolidayInfo } from '../../types';
import './Header.scss';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [nextHoliday, setNextHoliday] = useState<HolidayInfo | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }));
      setCurrentDate(
        now.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNextHoliday = async () => {
      try {
        const holiday = await getNextHoliday();
        setNextHoliday(holiday);
      } catch (error) {
        console.error('获取下一个节假日失败:', error);
      }
    };

    fetchNextHoliday();
  }, []);

  return (
    <header className="header">
      <div className="time-section">
        <div className="current-time">{currentTime}</div>
        <div className="current-date">{currentDate}</div>
      </div>
      {nextHoliday && (
        <div className="holiday-section">
          <h3>下一个节假日</h3>
          <div className="holiday-info">
            <span className="holiday-name">{nextHoliday.name}</span>
            <span className="holiday-date">{nextHoliday.date}</span>
            {nextHoliday.isOffDay && <span className="off-day">放假</span>}
          </div>
        </div>
      )}
    </header>
  );
};
