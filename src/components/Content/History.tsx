import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './History.module.scss';
import { KnowledgeData, KnowledgeDisplay } from '@/types';
import { KnowledgeMode } from '@/types/app';
import { Toolbar } from '../Tools';
import { baiduManager } from '@/utils/knowledgeBaidu';
import { wikiManager } from '@/utils/knowledgeWiki';
import { CrawlerManager } from '@/utils/crawlerManager';

const useHistory = (knowledgeMode: KnowledgeMode) => {
  const [data, setData] = useState<KnowledgeDisplay>({ events: [], holidays: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const successRef = useRef(false);
  const [showMode, setShowMode] = useState<KnowledgeMode>(knowledgeMode);
  const fetchKnowledge = async (manager: CrawlerManager<KnowledgeData, KnowledgeDisplay>) => {
    setLoading(true);
    try {
      const result = await manager.getDisplayData();

      if (result) {
        const { events, holidays } = result;
        setData(result);
        if (events.length <= 0 && holidays.length <= 0) {
          throw new Error('获取数据为空');
        } else {
          successRef.current = true;
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      // 重置缓存
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (knowledgeMode === KnowledgeMode.Wiki) {
      await fetchKnowledge(wikiManager);
      if (!successRef.current) {
        setShowMode(KnowledgeMode.Baidu);
        await fetchKnowledge(baiduManager);
      }
    } else {
      await fetchKnowledge(baiduManager);
      if (!successRef.current) {
        setShowMode(KnowledgeMode.Wiki);
        await fetchKnowledge(wikiManager);
      }
    }
  };

  useEffect(() => {
    setShowMode(knowledgeMode);
    fetchData();
  }, [knowledgeMode]);

  return { events: data.events, holidays: data.holidays, loading, fetchData, showMode };
};

export const History: React.FC<{ knowledgeMode: KnowledgeMode }> = (props) => {
  const { knowledgeMode } = props;
  const { events, holidays, loading, fetchData, showMode } = useHistory(knowledgeMode);

  const title = useMemo(() => {
    if (events.length > 0 && holidays.length > 0) {
      return '历史上的今天 - 节假日和习俗';
    }

    if (events.length > 0) {
      return '历史上的今天';
    }

    if (holidays.length > 0) {
      return '节假日和习俗';
    }
  }, [events, holidays]);

  return (
    <>
      <Toolbar loading={loading} onRefresh={fetchData} />
      <div className={styles.title}>
        <h2>{title}</h2>
        <span className={styles.source}>
          {showMode === KnowledgeMode.Wiki ? '维基百科' : '百度百科'}
        </span>
      </div>
      <section className={styles.historicalSection}>
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index}>
              <div className="description" dangerouslySetInnerHTML={{ __html: holiday.html }}></div>
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
