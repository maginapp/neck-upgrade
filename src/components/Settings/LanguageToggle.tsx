import { useI18n } from '@/i18n';
import { AppLanguage } from '@/types/app';

import styles from './LanguageToggle.module.scss';

interface LanguageToggleProps {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
  compact?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onChange,
  compact = false,
}) => {
  const { t } = useI18n();
  const languageSequence = [AppLanguage.ZhCN, AppLanguage.ZhTW, AppLanguage.En];
  const currentIndex = languageSequence.indexOf(language);
  const nextLanguage = languageSequence[(currentIndex + 1) % languageSequence.length];
  const switchLabelKey = {
    [AppLanguage.ZhCN]: 'language_switch_to_simplified_chinese',
    [AppLanguage.ZhTW]: 'language_switch_to_traditional_chinese',
    [AppLanguage.En]: 'language_switch_to_english',
  }[nextLanguage];
  const languageLabel = {
    [AppLanguage.ZhCN]: '简',
    [AppLanguage.ZhTW]: '繁',
    [AppLanguage.En]: 'EN',
  }[language];

  return (
    <button
      type="button"
      className={`${styles.languageToggle} ${compact ? styles.compact : ''}`}
      aria-label={t(switchLabelKey)}
      onClick={() => onChange(nextLanguage)}
    >
      <span aria-hidden="true">🌐</span>
      <span>{languageLabel}</span>
    </button>
  );
};
