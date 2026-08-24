import { AppLanguage } from '@/types/app';

export const APP_LANGUAGE_SEQUENCE = [
  AppLanguage.ZhCN,
  AppLanguage.ZhTW,
  AppLanguage.En,
  AppLanguage.Ru,
  AppLanguage.Fr,
  AppLanguage.Ja,
] as const;

export const getNextAppLanguage = (language: AppLanguage): AppLanguage => {
  const currentIndex = APP_LANGUAGE_SEQUENCE.indexOf(language);
  return APP_LANGUAGE_SEQUENCE[(currentIndex + 1) % APP_LANGUAGE_SEQUENCE.length];
};
