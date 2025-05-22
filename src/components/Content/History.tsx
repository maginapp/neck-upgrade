import React, { useEffect, useMemo, useState } from 'react';
import styles from './History.module.scss';
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
        console.log('🚀 ~ fetchData ~:  ', historicalEvents, holiday);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const title = useMemo(() => {
    if (events.length > 0 && holiday.length > 0) {
      return '历史上的今天 - 节假日和习俗';
    }

    if (events.length > 0) {
      return '历史上的今天';
    }

    if (holiday.length > 0) {
      return '节假日和习俗';
    }
  }, [events, holiday]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <>
      <h2>{title}</h2>
      <section className={styles.historicalSection}>
        <ul>
          {holiday.map((event, index) => (
            <li key={index}>
              <div className="description" dangerouslySetInnerHTML={{ __html: event.html }}></div>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.historicalSection}>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <div className="description" dangerouslySetInnerHTML={{ __html: event.html }}></div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
