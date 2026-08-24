import { useEffect, useMemo, useRef, useState } from 'react';

import { useI18n } from '@/i18n';
import { KnowledgeData, KnowledgeDisplay } from '@/types';
import { AppLanguage, KnowledgeMode } from '@/types/app';
import { CrawlerManager } from '@/utils/crawlerManager';
import { baiduManager } from '@/utils/knowledgeBaidu';
import { getWikiManager } from '@/utils/knowledgeWiki';
import { getKnowledgeModeLabel } from '@/utils/labels';

import { Toolbar } from '../Tools';

import styles from './History.module.scss';

const useHistory = (knowledgeMode: KnowledgeMode, language: AppLanguage) => {
  const [data, setData] = useState<KnowledgeDisplay>({ events: [], holidays: [] });
  const [loading, setLoading] = useState<boolean>(false);
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
    successRef.current = false;
    const wikiManager = getWikiManager(language);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeMode, language]);

  return { events: data.events, holidays: data.holidays, loading, fetchData, showMode };
};

export const History: React.FC<{ knowledgeMode: KnowledgeMode }> = (props) => {
  const { language, t } = useI18n();
  const { knowledgeMode } = props;
  const { events, holidays, loading, fetchData, showMode } = useHistory(knowledgeMode, language);

  const title = useMemo(() => {
    if (events.length > 0 && holidays.length > 0) {
      return `${t('history_today')} - ${t('history_holidays')}`;
    }

    if (events.length > 0) {
      return t('history_today');
    }

    if (holidays.length > 0) {
      return t('history_holidays');
    }
  }, [events, holidays, t]);

  return (
    <>
      <Toolbar loading={loading} onRefresh={fetchData} />
      <div className={styles.title}>
        <h2>{title}</h2>
        <span className={styles.source}>{getKnowledgeModeLabel(showMode, language)}</span>
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
