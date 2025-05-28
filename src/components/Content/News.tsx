import { useEffect, useMemo, useState } from 'react';

import { DEFAULT_PAGE_INFO } from '@/constants';
import { NewsDisplay } from '@/types';
import { NewsType, PageInfo } from '@/types/app';
import { getNewsTypeInfo } from '@/utils/labels';
import { newsManagerMap } from '@/utils/news';

import { Toolbar } from '../Tools';

import styles from './News.module.scss';

interface NewsTypeInfoProps {
  newsType: NewsType;
  isActive: boolean;
}

const NewsTypeInfo: React.FC<NewsTypeInfoProps> = (props) => {
  const { newsType, isActive } = props;
  const manager = newsManagerMap[newsType];
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState<NewsDisplay>({
    news: [],
    pageInfo: DEFAULT_PAGE_INFO,
  });

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
    }
  };
  useEffect(() => {
    if (!isActive) {
      return;
    }
    // 初始化 首次active 请求一次
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

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
            <div className={styles.newsItemMore}>
              {/* google */}
              {item.source && <span className={styles.source}>{item.source}</span>}
              {/* xiaohongshu */}
              {item.avatar && <img className={styles.avatar} src={item.avatar} alt={item.avatar} />}
              {item.username && <span className={styles.username}>{item.username}</span>}
              {item.newsImg && (
                <img className={styles.newsImg} src={item.newsImg} alt={item.title} />
              )}
            </div>
            <div className={styles.newsItemContent}>
              <span className={styles.order}>
                {index + 1 + newsData.pageInfo.page * newsData.pageInfo.pageSize}
              </span>
              <span className={styles.newsTitle}>{item.title}</span>
              {/* toutiao / weibo */}
              {renderTag(item.tag)}
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

  const typesInfo = useMemo(() => {
    return Object.values(NewsType).map((item) => {
      const { label, icon } = getNewsTypeInfo(item);
      return {
        label,
        icon,
        type: item,
      };
    });
  }, []);

  return (
    <div className={styles.newsContainer}>
      <div className={styles.tabs}>
        {typesInfo.map((item) => (
          <div
            key={item.type}
            className={`${styles.tab} ${activeType === item.type ? styles.active : ''}`}
            onClick={() => handleTypeChange(item.type)}
          >
            <img src={item.icon} alt={item.label} className={styles.tabIcon} />
            {item.label}
          </div>
        ))}
      </div>

      {typesInfo.map((item) => (
        <div
          key={item.type}
          className={`${styles.newsList} ${activeType === item.type ? styles.activeList : ''}`}
        >
          <NewsTypeInfo newsType={item.type} isActive={activeType === item.type} />
        </div>
      ))}
    </div>
  );
};
