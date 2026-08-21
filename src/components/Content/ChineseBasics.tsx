import { useEffect, useState } from 'react';

import { useI18n } from '@/i18n';
import { ChineseBasicsEntry } from '@/types';
import { ChineseBasicsConfig } from '@/types/app';
import { getChineseBasicsScopeKey, getNextChineseBasics } from '@/utils/chineseBasicsLearning';
import { getChineseBasicsCategoryLabel } from '@/utils/labels';

import { Toolbar } from '../Tools';

import styles from './ChineseBasics.module.scss';

const SOURCE_URL = 'https://github.com/pwxcoo/chinese-xinhua';

interface EntryCardProps {
  entry: ChineseBasicsEntry;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  const { language, t } = useI18n();
  const meta = [
    entry.pinyin && `${t('chinese_basics_pinyin')}：${entry.pinyin}`,
    entry.radical && `${t('chinese_basics_radical')}：${entry.radical}`,
    entry.strokes && `${t('chinese_basics_strokes')}：${entry.strokes}`,
    entry.traditional && entry.traditional !== entry.title
      ? `${t('chinese_basics_traditional')}：${entry.traditional}`
      : undefined,
  ].filter(Boolean);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3>{entry.title}</h3>
        <span className={styles.category}>
          {getChineseBasicsCategoryLabel(entry.category, language)}
        </span>
      </header>
      {meta.length > 0 && <div className={styles.meta}>{meta.join(' · ')}</div>}
      <div className={styles.details}>
        {entry.answer && (
          <p className={styles.answer}>
            <span>{t('chinese_basics_answer')}</span>
            {entry.answer}
          </p>
        )}
        {entry.explanation && <p>{entry.explanation}</p>}
        {entry.derivation && (
          <p>
            <span>{t('chinese_basics_derivation')}</span>
            {entry.derivation}
          </p>
        )}
        {entry.example && (
          <p>
            <span>{t('chinese_basics_example')}</span>
            {entry.example}
          </p>
        )}
      </div>
    </article>
  );
};

interface ChineseBasicsProps {
  config: ChineseBasicsConfig;
}

export const ChineseBasics: React.FC<ChineseBasicsProps> = ({ config }) => {
  const { t } = useI18n();
  const [entries, setEntries] = useState<ChineseBasicsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const scopeKey = getChineseBasicsScopeKey(config);

  const fetchEntries = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setEntries(await getNextChineseBasics(config));
    } catch (error) {
      console.error('获取中文基础内容失败:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEntries([]);
    fetchEntries();
    // scopeKey 覆盖完整分类配置，避免对象引用变化导致重复请求。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey]);

  return (
    <>
      <Toolbar loading={loading} onRefresh={fetchEntries} />
      <div className={styles.list}>
        {entries.map((entry) => (
          <EntryCard key={`${entry.category}:${entry.key}`} entry={entry} />
        ))}
      </div>
      <a className={styles.source} href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
        {t('chinese_basics_source')}
      </a>
    </>
  );
};
