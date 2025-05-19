import React from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  return (
    <button
      className={styles.themeToggle}
      onClick={() => onThemeChange(currentTheme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {currentTheme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}; 