import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Content } from './components/Content/Content';
import { Settings } from './components/Settings/Settings';
import styles from './App.module.scss';
import { DataType, Theme, NeckMode } from './types/app';

function App() {
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const [neckMode, setNeckMode] = useState<NeckMode>(NeckMode.Normal);
  const [contentType, setContentType] = useState<DataType>(DataType.History);

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <Header />
      <Content type={contentType} />
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
