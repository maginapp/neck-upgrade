import React, { useEffect, useState } from 'react';
import { getRandomFamousQuote } from '../../utils/famousQuotes';
import { FamousInfo } from '../../types/famous';
import styles from './FamousSaying.module.scss';

export const FamousSaying: React.FC = () => {
  const [quote, setQuote] = useState<FamousInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const newQuote = await getRandomFamousQuote();
        setQuote(newQuote);
        setError(null);
      } catch (err) {
        setError('获取名言失败，请稍后重试');
        console.error('Failed to fetch famous quote:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) {
    return <div className={styles.container}>加载中...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!quote) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.quote}>
        <p className={styles.content}>{quote.content}</p>
        <div className={styles.author}>
          {quote.source && <span className={styles.source}> -- {quote.source}</span>}
        </div>
      </div>
    </div>
  );
};
