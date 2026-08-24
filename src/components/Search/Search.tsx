import { ChangeEvent, useEffect, useState } from 'react';

import { useI18n } from '@/i18n';
import {
  getDatabaseSearchResults,
  getHistorySearchResults,
  SearchResult,
  searchResults,
} from '@/utils/search';

import styles from './Search.module.scss';

const getSourceLabel = (source: SearchResult['source']) => {
  const labels: Record<SearchResult['source'], string> = {
    poetry: '诗词',
    'chinese-basics': '中文基础',
    english: 'English',
  };
  return labels[source];
};

export const Search = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [databaseResults, setDatabaseResults] = useState<SearchResult[]>([]);
  const [historyResults, setHistoryResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'database' | 'history'>('database');

  useEffect(() => {
    const closeSearch = () => {
      setIsOpen(false);
      setKeyword('');
    };
    window.addEventListener('neck-upgrade:open-settings', closeSearch);
    return () => window.removeEventListener('neck-upgrade:open-settings', closeSearch);
  }, []);

  useEffect(() => {
    const query = keyword.trim();
    if (!isOpen || !query) {
      setDatabaseResults([]);
      setHistoryResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setIsSearching(true);
      Promise.all([getDatabaseSearchResults(), getHistorySearchResults()])
        .then(([database, history]) => {
          if (!cancelled) {
            const nextDatabaseResults = searchResults(database, query);
            const nextHistoryResults = searchResults(history, query);
            setDatabaseResults(nextDatabaseResults);
            setHistoryResults(nextHistoryResults);
            if (!nextDatabaseResults.length && nextHistoryResults.length) {
              setActiveTab('history');
            }
          }
        })
        .catch((error) => console.error('Search data failed to load:', error))
        .finally(() => {
          if (!cancelled) {
            setIsSearching(false);
          }
        });
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isOpen, keyword]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value);
  const hasResults = databaseResults.length > 0 || historyResults.length > 0;

  return (
    <div className={styles.search}>
      <button
        className={styles.searchButton}
        type="button"
        aria-label={t('search_open')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </button>
      {isOpen ? (
        <section className={styles.searchPanel} aria-label={t('search_title')}>
          <div className={styles.searchHeader}>
            <strong>{t('search_title')}</strong>
            <button type="button" aria-label={t('search_close')} onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          <input
            autoFocus
            value={keyword}
            onChange={handleChange}
            placeholder={t('search_placeholder')}
            aria-label={t('search_placeholder')}
          />
          {keyword.trim() ? (
            <div className={styles.resultArea}>
              <div className={styles.resultTabs} role="tablist" aria-label={t('search_title')}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'database'}
                  className={activeTab === 'database' ? styles.activeTab : ''}
                  onClick={() => setActiveTab('database')}
                >
                  {t('search_database')} ({databaseResults.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'history'}
                  className={activeTab === 'history' ? styles.activeTab : ''}
                  onClick={() => setActiveTab('history')}
                >
                  {t('search_history')} ({historyResults.length})
                </button>
              </div>
              <ResultGroup results={activeTab === 'database' ? databaseResults : historyResults} />
              {!isSearching && !hasResults ? (
                <p className={styles.empty}>{t('search_empty')}</p>
              ) : null}
              {isSearching ? <p className={styles.loading}>{t('search_loading')}</p> : null}
            </div>
          ) : (
            <p className={styles.hint}>{t('search_hint')}</p>
          )}
        </section>
      ) : null}
    </div>
  );
};

const ResultGroup: React.FC<{ results: SearchResult[] }> = ({ results }) => (
  <section className={styles.resultGroup}>
    {results.length ? (
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <span className={styles.resultSource}>{getSourceLabel(result.source)}</span>
            <strong>{result.title}</strong>
            {result.detail ? <p>{result.detail}</p> : null}
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.groupEmpty}>0</p>
    )}
  </section>
);
