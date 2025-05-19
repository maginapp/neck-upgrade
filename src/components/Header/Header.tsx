import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  nextHoliday: {
    name: string;
    date: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ nextHoliday }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.timeContainer}>
        <div className={styles.time}>
          {currentTime.toLocaleTimeString()}
        </div>
        <div className={styles.date}>
          {currentTime.toLocaleDateString()}
        </div>
      </div>
      <div className={styles.holidayInfo}>
        Next Holiday: {nextHoliday.name} ({nextHoliday.date})
      </div>
    </header>
  );
}; 