import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './History.module.scss';
import { getHistoricalEvents, getHolidays } from '@/utils/wikiApi';
import { HistoricalEvent, HolidayToday } from '@/types/knowledge';
import { getBaiduHistoricalEvents, getBaiduHolidays } from '@/utils/baiduApi';
import { KnowledgeMode } from '@/types/app';
import { Toolbar } from '../Tools';

const useHistory = (knowledgeMode: KnowledgeMode) => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [holiday, setHolidays] = useState<HolidayToday[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const successRef = useRef(false);

  const fetchWiki = async () => {
    setLoading(true);
    try {
      const historicalEvents = await getHistoricalEvents();
      setEvents(historicalEvents);
      const holiday = await getHolidays();
      setHolidays(holiday);
      console.log('🚀 ~ fetchData wiki ~:  ', historicalEvents, holiday);
      if (historicalEvents.length <= 0 && holiday.length <= 0) {
        throw new Error('wiki数据空');
      } else {
        successRef.current = true;
      }
    } catch (error) {
      console.error('获取wiki数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBaidu = async () => {
    setLoading(true);
    try {
      const baiduHistoricalEvents = await getBaiduHistoricalEvents();
      const baiduHolidays = await getBaiduHolidays();
      setEvents(baiduHistoricalEvents);
      setHolidays(baiduHolidays);
      console.log('🚀 ~ fetchData baidu ~:  ', baiduHistoricalEvents, baiduHolidays);
      if (baiduHistoricalEvents.length <= 0 && baiduHolidays.length <= 0) {
        throw new Error('baidu数据空');
      } else {
        successRef.current = true;
      }
    } catch (error) {
      console.error('获取baidu数据失败:', error);
      // 重置缓存
    } finally {
      setLoading(false);
    }
  };

  const [a, b] =
    knowledgeMode === KnowledgeMode.Wiki ? [fetchWiki, fetchBaidu] : [fetchBaidu, fetchWiki];

  const fetchData = async () => {
    await a();
    if (!successRef.current) {
      await b();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { events, holiday, loading, fetchData };
};

export const History: React.FC<{ knowledgeMode: KnowledgeMode }> = (props) => {
  const { knowledgeMode } = props;
  const { events, holiday, loading, fetchData } = useHistory(knowledgeMode);

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

  return (
    <>
      <Toolbar loading={loading} onRefresh={fetchData} />
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
