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
  const nextLanguage = language === AppLanguage.ZhCN ? AppLanguage.En : AppLanguage.ZhCN;

  return (
    <button
      type="button"
      className={`${styles.languageToggle} ${compact ? styles.compact : ''}`}
      aria-label={t(
        nextLanguage === AppLanguage.ZhCN
          ? 'language_switch_to_chinese'
          : 'language_switch_to_english'
      )}
      onClick={() => onChange(nextLanguage)}
    >
      <span aria-hidden="true">🌐</span>
      <span>{language === AppLanguage.ZhCN ? '中' : 'EN'}</span>
    </button>
  );
};
