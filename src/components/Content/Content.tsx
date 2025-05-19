import React from 'react';
import styles from './Content.module.css';

export type ContentType = 'history' | 'poetry' | 'english';

interface HistoricalEvent {
  html: string;
}

interface ContentProps {
  type: ContentType;
  data: {
    title: string;
    content: string;
    translation?: string;
    events?: HistoricalEvent[];
    holidays?: HistoricalEvent[];
  };
}

export const Content: React.FC<ContentProps> = ({ type, data }) => {
  const renderContent = () => {
    switch (type) {
      case 'history':
        return (
          <div className={styles.historyContent}>
            <h2>历史上的今天</h2>
            <section className={styles.historicalEvents}>
              <h3>大事记</h3>
              <ul>
                {data.events?.map((event, index) => (
                  <li key={index}>
                    <span className={styles.description} dangerouslySetInnerHTML={{ __html: event.html }}></span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.holidays}>
              <h3>节假日</h3>
              <ul>
                {data.holidays?.map((holiday, index) => (
                  <li key={index}>
                    <span className={styles.description} dangerouslySetInnerHTML={{ __html: holiday.html }}></span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        );
      case 'poetry':
        return (
          <div className={styles.poetryContent}>
            <h2>{data.title}</h2>
            <div className={styles.poem}>{data.content}</div>
            {data.translation && (
              <div className={styles.translation}>{data.translation}</div>
            )}
          </div>
        );
      case 'english':
        return (
          <div className={styles.englishContent}>
            <h2>{data.title}</h2>
            <div className={styles.word}>{data.content}</div>
            {data.translation && (
              <div className={styles.sentence}>{data.translation}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className={styles.content}>
      {renderContent()}
    </main>
  );
}; 