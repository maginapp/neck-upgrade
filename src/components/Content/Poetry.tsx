import React, { useEffect, useState } from 'react';
import styles from './Content.module.scss';
import { getNextPoem } from '@/utils/poetryLearning';
import { Poetry } from '@/types/poetry';

export const PoetryComponent: React.FC = () => {
  const [poems, setPoems] = useState<Poetry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPoem = async () => {
      setLoading(true);
      try {
        const nextPoem = await getNextPoem();
        setPoems(nextPoem || []);
      } catch (error) {
        console.error('获取诗词失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoem();
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!poems.length) {
    return <div>暂无诗词</div>;
  }

  // console.log('???? poems', poems);

  return (
    <div>
      {poems.map((poem, index) => {
        return (
          <div key={index} className={styles.poetryContent}>
            <h2>{poem.title}</h2>
            <h3>{poem.author}</h3>
            <div className={styles.poemContent}>
              {poem.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {poem.tags && poem.tags.length > 0 && (
              <div className={styles.tags}>
                {poem.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
