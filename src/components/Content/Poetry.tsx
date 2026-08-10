import { useEffect, useState } from 'react';

import { Poetry } from '@/types';
import { PoetrySourceConfig } from '@/types/app';
import { getPoetryDisplayLines } from '@/utils/poetryDisplay';
import { getNextPoem, getPoetryScopeKey } from '@/utils/poetryLearning';

import { Toolbar } from '../Tools';

import styles from './Poetry.module.scss';

interface PoetryComponentProps {
  sourceConfig: PoetrySourceConfig;
}

export const PoetryComponent: React.FC<PoetryComponentProps> = ({ sourceConfig }) => {
  const [poems, setPoems] = useState<Poetry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const sourceScopeKey = getPoetryScopeKey(sourceConfig);
  const fetchPoem = async () => {
    setLoading(true);
    try {
      const nextPoem = await getNextPoem(sourceConfig);
      console.log('🚀 ~ fetchPoem ~ nextPoem:  ', nextPoem);
      setPoems(nextPoem || []);
    } catch (error) {
      console.error('获取诗词失败:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPoems([]);
    fetchPoem();
    // sourceScopeKey 已覆盖完整来源配置，避免数组引用变化造成重复请求。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceScopeKey]);

  return (
    <>
      <Toolbar loading={loading} onRefresh={fetchPoem} />
      {poems.map((poem, index) => {
        const displayLines = getPoetryDisplayLines(poem);

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
            <div
              className={`${styles.poemContent} ${poem.align === 'left' ? styles.alignLeft : ''}`}
            >
              {displayLines.map((line, index) => (
                <div key={index} className={styles.poemLine}>
                  <p>{line.paragraph}</p>
                  {line.spell && <span className={styles.spell}>{line.spell}</span>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
