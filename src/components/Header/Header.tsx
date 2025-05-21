import React, { useState, useEffect } from 'react';
import { getNextHoliday } from '../../utils/holidayApi';
import { HolidayInfo } from '../../types';
import styles from './Header.module.scss';

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
    <header className={styles.header}>
      <div className={styles.timeSection}>
        <span className={styles.currentTime}>{currentTime}</span>
        <span className={styles.currentDate}>{currentDate}</span>
      </div>
      {nextHoliday && (
        <div className={styles.holidaySection}>
          距离下一个休息日 - <span className={styles.holidayHighlight}>{nextHoliday.name}</span>
          <span className={styles.holidayHighlight}>{nextHoliday.date}</span>
          还有
          <span className={styles.holidayHighlight}>{nextHoliday.rest}天</span>
        </div>
      )}
    </header>
  );
};
