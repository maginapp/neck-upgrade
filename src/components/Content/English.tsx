import { useEffect, useMemo, useRef, useState } from 'react';
import { getNextWord } from '@/utils/wordLearning';
import styles from './English.module.scss';
import { DictionaryEntry } from '@/types/dictionary';

interface WordInfo {
  word: string;
  definition?: DictionaryEntry;
}

const WordCard = ({ wordInfo }: { wordInfo: WordInfo }) => {
  const [phonetic, audioUrl]: (string | undefined)[] = useMemo(() => {
    if (!wordInfo.definition) {
      return [];
    }
    const phoneticInner: string | undefined = wordInfo.definition.phonetic;

    if (!wordInfo.definition.phonetics) {
      return [phoneticInner];
    }
    const audioItem = wordInfo.definition.phonetics.find((phonetic) => phonetic.audio);

    return audioItem ? [audioItem.text, audioItem.audio] : [phoneticInner];
  }, [wordInfo]);

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div key={wordInfo.word} className={styles.wordCard}>
      <div className={styles.wordHeader}>
        <h3 className={styles.word}>{wordInfo.word}</h3>
        {phonetic && <span className={styles.phonetic}>/{phonetic}/</span>}
        {audioUrl && (
          <span className={styles.audio}>
            <span className={styles.audioMananger} onClick={() => audioRef.current?.play()}>
              🔊
            </span>
            <audio className={styles.audioPlayer} src={audioUrl} controls ref={audioRef} />
          </span>
        )}
        {wordInfo.definition?.sourceUrls?.map((sourceUrl, index) => {
          return (
            <a
              key={sourceUrl}
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.source}
            >
              {`source${Number(wordInfo.definition?.sourceUrls?.length) > 1 ? `-${index + 1}` : ''}`}
            </a>
          );
        })}
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
  );
};

export const English = () => {
  const [words, setWords] = useState<WordInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNextWords = async () => {
    if (loading) return;
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
      <div className={styles.header} onClick={fetchNextWords}>
        {loading ? '...' : <span className={styles.refresh}>🔁</span>}
      </div>

      <div className={styles.wordList}>
        {words.map((wordInfo) => (
          <WordCard key={wordInfo.word} wordInfo={wordInfo} />
        ))}
      </div>
    </div>
  );
};
