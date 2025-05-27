import { useEffect, useState } from 'react';

import { Poetry } from '@/types';
import { getNextPoem } from '@/utils/poetryLearning';

import { Toolbar } from '../Tools';

import styles from './Poetry.module.scss';

export const PoetryComponent: React.FC = () => {
  const [poems, setPoems] = useState<Poetry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchPoem = async () => {
    setLoading(true);
    try {
      const nextPoem = await getNextPoem();
      console.log('🚀 ~ fetchPoem ~ nextPoem:  ', nextPoem);
      setPoems(nextPoem || []);
    } catch (error) {
      console.error('获取诗词失败:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPoem();
  }, []);

  return (
    <>
      <Toolbar loading={loading} onRefresh={fetchPoem} />
      {poems.map((poem, index) => {
        return (
          <div key={index} className={styles.poetryContainer}>
            <h3>{poem.title}</h3>
            <div className={styles.author}>{poem.author}</div>
            {poem.tags && poem.tags.length > 0 && (
              <div className={styles.tags}>
                {poem.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className={styles.poemContent}>
              {poem.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
