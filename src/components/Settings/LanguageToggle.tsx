import { useEffect, useRef, useState } from 'react';

import { useI18n } from '@/i18n';
import { APP_LANGUAGE_SEQUENCE, getNextAppLanguage } from '@/i18n/languages';
import { AppLanguage } from '@/types/app';

import styles from './LanguageToggle.module.scss';

interface LanguageToggleProps {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
  compact?: boolean;
}

const LANGUAGE_SHORT_LABELS: Record<AppLanguage, string> = {
  [AppLanguage.ZhCN]: '简',
  [AppLanguage.ZhTW]: '繁',
  [AppLanguage.En]: 'EN',
  [AppLanguage.Ru]: 'RU',
  [AppLanguage.Fr]: 'FR',
};

const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  [AppLanguage.ZhCN]: '简体中文',
  [AppLanguage.ZhTW]: '繁體中文',
  [AppLanguage.En]: 'English',
  [AppLanguage.Ru]: 'Русский',
  [AppLanguage.Fr]: 'Français',
};

const SWITCH_LABEL_KEYS: Record<AppLanguage, string> = {
  [AppLanguage.ZhCN]: 'language_switch_to_simplified_chinese',
  [AppLanguage.ZhTW]: 'language_switch_to_traditional_chinese',
  [AppLanguage.En]: 'language_switch_to_english',
  [AppLanguage.Ru]: 'language_switch_to_russian',
  [AppLanguage.Fr]: 'language_switch_to_french',
};

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onChange,
  compact = false,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const nextLanguage = getNextAppLanguage(language);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        controlRef.current &&
        event.target instanceof Node &&
        !controlRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={controlRef} className={`${styles.languageControl} ${compact ? styles.compact : ''}`}>
      <button
        type="button"
        className={styles.languageToggle}
        aria-label={t(SWITCH_LABEL_KEYS[nextLanguage])}
        onClick={() => {
          onChange(nextLanguage);
          setIsOpen(false);
        }}
      >
        <span aria-hidden="true">🌐</span>
        <span>{LANGUAGE_SHORT_LABELS[language]}</span>
      </button>
      <button
        type="button"
        className={styles.languageMenuToggle}
        aria-label={t('language_select')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span aria-hidden="true" className={styles.languageMenuArrow}>
          ▾
        </span>
      </button>
      {isOpen ? (
        <div className={styles.languageMenu} role="menu" aria-label={t('language_select')}>
          {APP_LANGUAGE_SEQUENCE.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={language === option}
              className={`${styles.languageMenuItem} ${language === option ? styles.active : ''}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span>{LANGUAGE_NAMES[option]}</span>
              {language === option ? <span aria-hidden="true">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
