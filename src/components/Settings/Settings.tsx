import React, { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { NeckMode } from '../NeckMode/NeckMode';
import { DataSwitch } from '../DataSwitch/DataSwitch';
import styles from './Settings.module.css';

interface SettingsProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
  onNeckModeChange: (mode: 'normal' | 'training' | 'intense') => void;
  onDataTypeChange: (type: 'poetry' | 'history' | 'english') => void;
  currentTheme: 'light' | 'dark';
  currentNeckMode: 'normal' | 'training' | 'intense';
  currentDataType: 'poetry' | 'history' | 'english';
}

export const Settings: React.FC<SettingsProps> = ({
  onThemeChange,
  onNeckModeChange,
  onDataTypeChange,
  currentTheme,
  currentNeckMode,
  currentDataType,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className={styles.settingsButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        ⚙️
      </button>
      
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <button 
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close settings"
          >
            ×
          </button>
          <h2>设置</h2>
          <div className={styles.settingsGroup}>
            <h3>主题</h3>
            <ThemeToggle currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h3>颈椎模式</h3>
            <NeckMode currentMode={currentNeckMode} onModeChange={onNeckModeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h3>内容类型</h3>
            <DataSwitch currentType={currentDataType} onTypeChange={onDataTypeChange} />
          </div>
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}; 