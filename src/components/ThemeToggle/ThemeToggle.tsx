import React from 'react';
import styles from './ThemeToggle.module.css';
import { Theme } from '@/types/app';
import { getThemeLabel } from '@/utils/labels';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <button
      className={styles.themeToggle}
      onClick={() => onThemeChange(currentTheme === Theme.Light ? Theme.Dark : Theme.Light)}
      aria-label={`切换到${getThemeLabel(currentTheme === Theme.Light ? Theme.Dark : Theme.Light)}主题`}
    >
      {currentTheme === Theme.Light ? '🌙' : '☀️'}
    </button>
  );
};
