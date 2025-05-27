import { Theme } from '@/types/app';
import { getThemeLabel } from '@/utils/labels';

import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  const getNextTheme = (current: Theme): Theme => {
    switch (current) {
      case Theme.System:
        return Theme.Light;
      case Theme.Light:
        return Theme.Dark;
      case Theme.Dark:
        return Theme.System;
      default:
        return Theme.System;
    }
  };

  const getThemeIcon = (theme: Theme): string => {
    switch (theme) {
      case Theme.System:
        return '💻';
      case Theme.Light:
        return '☀️';
      case Theme.Dark:
        return '🌙';
      default:
        return '💻';
    }
  };

  return (
    <div className={styles.themeToggleContainer}>
      <button
        className={styles.themeToggle}
        onClick={() => onThemeChange(getNextTheme(currentTheme))}
        aria-label={`切换到${getThemeLabel(getNextTheme(currentTheme))}主题`}
      >
        {getThemeIcon(currentTheme)}
      </button>
      <span className={styles.themeLabel}>{getThemeLabel(currentTheme)}</span>
    </div>
  );
};
