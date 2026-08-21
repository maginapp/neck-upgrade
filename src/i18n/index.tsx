import { createContext, useContext, useEffect, useMemo } from 'react';

import en from '@/extension/_locales/en/messages.json';
import zhCN from '@/extension/_locales/zh_CN/messages.json';
import { AppLanguage } from '@/types/app';

type MessageCatalog = Record<string, { message: string }>;

interface I18nContextValue {
  language: AppLanguage;
  t: (key: string) => string;
}

const catalogs: Record<AppLanguage, MessageCatalog> = {
  [AppLanguage.ZhCN]: zhCN,
  [AppLanguage.En]: en,
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
    document.documentElement.lang = language === AppLanguage.ZhCN ? 'zh-CN' : 'en';
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      t: (key) => catalogs[language][key]?.message ?? key,
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
