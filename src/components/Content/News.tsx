import { useEffect, useMemo, useState, useRef } from 'react';

import { DEFAULT_PAGE_INFO } from '@/constants';
import { NEWS_GROUP_LABELS } from '@/constants/labels';
import { NewsDisplay } from '@/types';
import { NewsGroup, NewsType, PageInfo } from '@/types/app';
import { newsManagerMap } from '@/utils/news';

import { Toolbar } from '../Tools';

import styles from './News.module.scss';

type NewsGroupItem = (typeof NEWS_GROUP_LABELS)[number];

interface NewsTypeInfoProps {
  isActive: boolean;
  typeInfo: {
    label: string;
    icon: string;
    type: NewsType;
  };
}

const NewsTypeInfo: React.FC<NewsTypeInfoProps> = (props) => {
  const { typeInfo, isActive } = props;
  const manager = newsManagerMap[typeInfo.type];
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
      {newsData.loginUrl && (
        <a className={styles.loginUrl} href={newsData.loginUrl} target="_blank" rel="noreferrer">
          请先登录 <img className={styles.loginIcon} src={typeInfo.icon} alt={typeInfo.label} />
        </a>
      )}
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
  const [activeGroup, setActiveGroup] = useState<NewsGroup>(NewsGroup.Toutiao);
  const [showGroup, setShowGroup] = useState<NewsGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rightAlign, setRightAlign] = useState<boolean>(false);

  const handleTypeChange = (group: NewsGroup, type: NewsType) => {
    setShowGroup(null);
    setActiveType(type);
    setActiveGroup(group);
  };

  const handleClickGroup = (groupItem: NewsGroupItem) => {
    if (groupItem.children.length === 1) {
      setShowGroup(null);
      setActiveType(groupItem.children[0].type);
      setActiveGroup(groupItem.group);
    } else {
      setShowGroup(groupItem.group);
      // 计算是否需要右对齐
      if (containerRef.current) {
        const container = containerRef.current;
        const tab = container.querySelector(`[data-group="${groupItem.group}"]`) as HTMLElement;
        if (tab) {
          const containerRight = container.getBoundingClientRect().right;
          const tabRect = tab.getBoundingClientRect();
          const tabRight = tabRect.right;
          const spaceToRight = containerRight - tabRight;
          setRightAlign(tabRect.width + spaceToRight < 100);
        }
      }
    }
  };

  const typeInfo = useMemo(() => {
    const group = NEWS_GROUP_LABELS.find((item) => item.group === activeGroup);
    if (!group) {
      return null;
    }
    const typeDetail = group.children.find((item) => item.type === activeType) ?? null;
    if (!typeDetail) {
      return null;
    }
    return {
      label: typeDetail.label,
      icon: group.icon,
      type: typeDetail.type,
    };
  }, [activeGroup, activeType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setShowGroup(null);
      }
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.newsContainer}>
      <div className={styles.tabs} ref={containerRef}>
        {NEWS_GROUP_LABELS.map((item) => (
          <div
            key={item.group}
            data-group={item.group}
            className={`${styles.tab} ${activeGroup === item.group ? styles.active : ''}`}
            onClick={() => handleClickGroup(item)}
          >
            <img src={item.icon} alt={item.label} className={styles.tabIcon} />
            {item.group === activeGroup && typeInfo?.label}
            {showGroup === item.group && (
              <div
                className={`${styles.typeList} ${styles.show} ${rightAlign ? styles.rightAlign : ''}`}
              >
                {item.children.map((child) => (
                  <div
                    key={child.type}
                    className={`${styles.typeItem} ${activeType === child.type ? styles.active : ''}`}
                    onClick={(e) => {
                      handleTypeChange(item.group, child.type);
                      e.stopPropagation();
                    }}
                  >
                    <img src={item.icon} alt={item.label} className={styles.tabIcon} />
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {typeInfo ? (
        <div key={typeInfo.type} className={`${styles.newsList} ${styles.activeList}`}>
          <NewsTypeInfo typeInfo={typeInfo} isActive={activeType === typeInfo.type} />
        </div>
      ) : null}
    </div>
  );
};
