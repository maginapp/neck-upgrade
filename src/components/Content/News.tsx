import React, { useEffect, useState } from 'react';
import styles from './News.module.scss';

import { NewsType, PageInfo } from '@/types/app';
import { NewsDisplay } from '@/types';
import { getNewsTypeLabel } from '@/utils/labels';
import { newsManagerMap } from '@/utils/news';
import { Toolbar } from '../Tools';
import { DEFAULT_PAGE_INFO } from '@/constants';

interface NewsTypeInfoProps {
  newsType: NewsType;
  isActive: boolean;
}

const NewsTypeInfo: React.FC<NewsTypeInfoProps> = (props) => {
  const { newsType, isActive } = props;
  const manager = newsManagerMap[newsType];
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState<NewsDisplay>({
    news: [],
    pageInfo: DEFAULT_PAGE_INFO,
  });
  const [hasFetched, setHasFetched] = useState(false);

  const fetchNews = async (page?: PageInfo) => {
    setLoading(true);
    try {
      const newsData = await manager.getDisplayData(page);
      if (newsData) {
        setNewsData(newsData);
      }
    } catch (error) {
      console.error('获取新闻失败:', error);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };
  useEffect(() => {
    if (!isActive || hasFetched) {
      return;
    }
    // 初始化 首次active 请求一次
    fetchNews();
  }, [isActive, hasFetched]);

  const handleRefresh = async () => {
    fetchNews({
      page: newsData.pageInfo.page + 1,
      pageSize: newsData.pageInfo.pageSize,
    });
  };

  const renderTag = (tag?: string) => {
    if (!tag) {
      return null;
    }
    if (tag.startsWith('https://')) {
      return <img className={styles.tagImg} src={tag} alt={tag} />;
    }
    return <span className={styles.tag}>{tag}</span>;
  };

  return (
    <>
      <Toolbar loading={loading} onRefresh={handleRefresh} />
      {(newsData.news || []).map((item, index) => (
        <section key={index}>
          <a href={item.link} className={styles.newsItem} target="_blank" rel="noreferrer">
            <div className={styles.newsItemContent}>
              <span className={styles.order}>
                {index + 1 + newsData.pageInfo.page * newsData.pageInfo.pageSize}
              </span>
              <span className={styles.newsTitle}>{item.title}</span>
              {/* toutiao / weibo */}
              {renderTag(item.tag)}
            </div>
            <div className={styles.newsItemMore}>
              {/* google */}
              {item.source && <span className={styles.source}>{item.source}</span>}
              {/* xiaohongshu */}
              {item.avatar && <img className={styles.avatar} src={item.avatar} alt={item.avatar} />}
              {item.username && <span className={styles.username}>{item.username}</span>}
            </div>
          </a>
        </section>
      ))}
    </>
  );
};

export const News: React.FC = () => {
  const [activeType, setActiveType] = useState<NewsType>(NewsType.Toutiao);

  const handleTypeChange = (type: NewsType) => {
    setActiveType(type);
  };

  const types = Object.values(NewsType);

  return (
    <div className={styles.newsContainer}>
      <div className={styles.tabs}>
        {types.map((type) => (
          <div
            key={type}
            className={`${styles.tab} ${activeType === type ? styles.active : ''}`}
            onClick={() => handleTypeChange(type)}
          >
            {getNewsTypeLabel(type)}
          </div>
        ))}
      </div>

      {types.map((type) => (
        <div className={`${styles.newsList} ${activeType === type ? styles.activeList : ''}`}>
          <NewsTypeInfo key={type} newsType={type} isActive={activeType === type} />
        </div>
      ))}
    </div>
  );
};
