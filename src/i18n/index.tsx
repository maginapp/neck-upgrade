import { createContext, useContext, useEffect, useMemo } from 'react';

import en from '@/extension/_locales/en/messages.json';
import fr from '@/extension/_locales/fr/messages.json';
import ja from '@/extension/_locales/ja/messages.json';
import ru from '@/extension/_locales/ru/messages.json';
import zhCN from '@/extension/_locales/zh_CN/messages.json';
import zhTW from '@/extension/_locales/zh_TW/messages.json';
import { AppLanguage } from '@/types/app';

type MessageCatalog = Record<string, { message: string }>;

interface I18nContextValue {
  language: AppLanguage;
  t: (key: string) => string;
}

const catalogs: Record<AppLanguage, MessageCatalog> = {
  [AppLanguage.ZhCN]: zhCN,
  [AppLanguage.ZhTW]: zhTW,
  [AppLanguage.En]: en,
  [AppLanguage.Ru]: ru,
  [AppLanguage.Fr]: fr,
  [AppLanguage.Ja]: ja,
};

const I18nContext = createContext<I18nContextValue>({
  language: AppLanguage.ZhCN,
  t: (key) => key,
});

interface LanguageProviderProps {
  language: AppLanguage;
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ language, children }) => {
  useEffect(() => {
    const htmlLanguage = {
      [AppLanguage.ZhCN]: 'zh-CN',
      [AppLanguage.ZhTW]: 'zh-TW',
      [AppLanguage.En]: 'en',
      [AppLanguage.Ru]: 'ru',
      [AppLanguage.Fr]: 'fr',
      [AppLanguage.Ja]: 'ja',
    }[language];
    document.documentElement.lang = htmlLanguage;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      // Keep untranslated data labels readable while a locale is being expanded.
      t: (key) => catalogs[language][key]?.message ?? (en as MessageCatalog)[key]?.message ?? key,
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
