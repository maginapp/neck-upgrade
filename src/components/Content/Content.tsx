import React, { useEffect, useState } from 'react';
import styles from './Content.module.css';
import { getHistoricalEvents, getHolidays } from '@/utils/wikiApi';
import { HistoricalEvent, HolidayWikiInfo } from '@/types';
import { DataType } from '@/types/app';

interface ContentProps {
  type: DataType;
}

export const Content: React.FC<ContentProps> = ({ type }) => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [holiday, setHolidays] = useState<HolidayWikiInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === DataType.History) {
          const historicalEvents = await getHistoricalEvents();
          setEvents(historicalEvents);
          const holiday = await getHolidays();
          setHolidays(holiday);
        }
        // TODO: 添加诗词和英语内容的获取逻辑
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const renderContent = () => {
    if (loading) {
      return <div className="loading">加载中...</div>;
    }
    switch (type) {
      case DataType.History:
        return (
          <div className={styles.historyContent}>
            <h2>历史上的今天</h2>
            <section className={styles.historicalEvents}>
              <h3>大事记</h3>
              <ul>
                {events.map((event, index) => (
                  <li key={index}>
                    <div
                      className="description"
                      dangerouslySetInnerHTML={{ __html: event.html }}
                    ></div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.holidays}>
              <h3>节假日和习俗</h3>
              <ul>
                {holiday.map((event, index) => (
                  <li key={index}>
                    <div
                      className="description"
                      dangerouslySetInnerHTML={{ __html: event.html }}
                    ></div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        );
      case DataType.Poetry:
        return <div className={styles.poetryContent}>诗词内容（待实现）</div>;
      case DataType.English:
        return <div className={styles.englishContent}>英语内容（待实现）</div>;
      default:
        return null;
    }
  };

  return <main className={styles.content}>{renderContent()}</main>;
};
