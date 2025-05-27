import { useEffect, useState } from 'react';

import { FamousInfo } from '@/types';

import { getRandomFamousQuote } from '../../utils/famousQuotes';
import { Loading } from '../Tools';

import styles from './FamousSaying.module.scss';

export const FamousSaying: React.FC = () => {
  const [quote, setQuote] = useState<FamousInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const newQuote = await getRandomFamousQuote();
        setQuote(newQuote);
      } catch (err) {
        console.error('Failed to fetch famous quote:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);
  return (
    <>
      {loading && <Loading writingMode="initial" />}
      {quote && (
        <div className={styles.quote}>
          <p className={styles.content}>{quote.content}</p>
          <div className={styles.info}>
            {quote.source && <span className={styles.source}> -- {quote.source}</span>}
            {quote.website && <span className={styles.website}>[{quote.website}]</span>}
          </div>
        </div>
      )}
    </>
  );
};
