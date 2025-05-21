import React, { useEffect, useState } from 'react';
import styles from './Content.module.scss';
import { getHistoricalEvents, getHolidays } from '@/utils/wikiApi';
import { HistoricalEvent, HolidayWikiInfo } from '@/types';

export const History: React.FC = () => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [holiday, setHolidays] = useState<HolidayWikiInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const historicalEvents = await getHistoricalEvents();
        setEvents(historicalEvents);
        const holiday = await getHolidays();
        setHolidays(holiday);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className={styles.historyContent}>
      <section className={styles.historicalEvents}>
        <h2>历史上的今天</h2>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <div className="description" dangerouslySetInnerHTML={{ __html: event.html }}></div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.holidays}>
        <h2>节假日和习俗</h2>
        <ul>
          {holiday.map((event, index) => (
            <li key={index}>
              <div className="description" dangerouslySetInnerHTML={{ __html: event.html }}></div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
