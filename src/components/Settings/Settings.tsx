import React, { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { NeckModeSelector } from '../NeckMode/NeckMode';
import { DataSwitch } from '../DataSwitch/DataSwitch';
import styles from './Settings.module.css';
import { DataType, Theme, NeckMode } from '@/types/app';

interface SettingsProps {
  onThemeChange: (theme: Theme) => void;
  onNeckModeChange: (mode: NeckMode) => void;
  onDataTypeChange: (type: DataType) => void;
  currentTheme: Theme;
  currentNeckMode: NeckMode;
  currentDataType: DataType;
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
            <NeckModeSelector currentMode={currentNeckMode} onModeChange={onNeckModeChange} />
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
