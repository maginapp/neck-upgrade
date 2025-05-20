import { useEffect, useState } from 'react';
import { getNextWord } from '@/utils/wordLearning';
import styles from './English.module.scss';

interface WordInfo {
  word: string;
  definition?: {
    word: string;
    phonetic?: string;
    meanings?: Array<{
      partOfSpeech: string;
      definitions: Array<{
        definition: string;
      }>;
    }>;
  };
}

export const English = () => {
  const [words, setWords] = useState<WordInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNextWords = async () => {
    try {
      setLoading(true);
      const nextWords = await getNextWord();
      console.log('🚀 ~ fetchNextWords ~ nextWords:  ', nextWords);
      if (nextWords) {
        setWords(nextWords);
      }
    } catch (error) {
      console.error('获取单词失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextWords();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>单词学习</h2>
        <button onClick={fetchNextWords} disabled={loading} className={styles.button}>
          {loading ? '加载中...' : '下一个'}
        </button>
      </div>

      <div className={styles.wordList}>
        {words.map((wordInfo) => (
          <div key={wordInfo.word} className={styles.wordCard}>
            <div className={styles.wordHeader}>
              <h3 className={styles.word}>{wordInfo.word}</h3>
              {wordInfo.definition?.phonetic && (
                <span className={styles.phonetic}>/{wordInfo.definition.phonetic}/</span>
              )}
            </div>

            <div className={styles.meanings}>
              {wordInfo.definition?.meanings?.map((meaning, index) => (
                <div key={index} className={styles.meaning}>
                  <span className={styles.partOfSpeech}>{meaning.partOfSpeech}</span>
                  <ul className={styles.definitions}>
                    {meaning.definitions.map((def, defIndex) => (
                      <li key={defIndex} className={styles.definition}>
                        {def.definition}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
