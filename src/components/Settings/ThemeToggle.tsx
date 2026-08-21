import { useI18n } from '@/i18n';
import { Theme } from '@/types/app';
import { getThemeLabel } from '@/utils/labels';

import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentTheme,
  onThemeChange,
  compact = false,
}) => {
  const { language, t } = useI18n();
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
    <div className={`${styles.themeToggleContainer} ${compact ? styles.compact : ''}`}>
      <button
        className={styles.themeToggle}
        onClick={() => onThemeChange(getNextTheme(currentTheme))}
        aria-label={`${t('settings_switch_to')} ${getThemeLabel(
          getNextTheme(currentTheme),
          language
        )}`}
      >
        {getThemeIcon(currentTheme)}
      </button>
      {!compact && (
        <span className={styles.themeLabel}>{getThemeLabel(currentTheme, language)}</span>
      )}
    </div>
  );
};
