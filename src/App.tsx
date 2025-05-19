import  { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Content, ContentType } from './components/Content/Content';
import { Settings } from './components/Settings/Settings';
import { getHistoricalEvents, getHolidays } from './utils/wikiApi';
import { getNextHoliday } from './utils/holidayApi';
import { HistoricalEvent, HolidayInfo } from './types';
import styles from './App.module.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [neckMode, setNeckMode] = useState<'normal' | 'training' | 'intense'>('normal');
  const [contentType, setContentType] = useState<ContentType>('history');
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [holidays, setHolidays] = useState<HistoricalEvent[]>([]);
  const [nextHoliday, setNextHoliday] = useState<HolidayInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historicalEvents, holidayInfo, nextHolidayInfo] = await Promise.all([
          getHistoricalEvents(),
          getHolidays(),
          getNextHoliday()
        ]);

        setEvents(historicalEvents);
        setHolidays(holidayInfo);
        setNextHoliday(nextHolidayInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const contentData = {
    title: '历史上的今天',
    content: '',
    events,
    holidays
  };

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <Header nextHoliday={nextHoliday || { name: 'Loading...', date: '' }} />
      <Content type={contentType} data={contentData} />
      <Settings
        currentTheme={theme}
        currentNeckMode={neckMode}
        currentDataType={contentType}
        onThemeChange={setTheme}
        onNeckModeChange={setNeckMode}
        onDataTypeChange={setContentType}
      />
    </div>
  );
}

export default App; 