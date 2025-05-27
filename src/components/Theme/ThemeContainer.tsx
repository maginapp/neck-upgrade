import { Theme } from '@/types/app';

import styles from './ThemeContainer.module.scss';

interface ThemeContainerProps {
  children: React.ReactNode;
  currentTheme: Theme;
}

export function ThemeContainer(props: ThemeContainerProps) {
  const { currentTheme, children } = props;
  // 状态管理：主题、颈椎模式和内容类型
  return <div className={`${styles.themeContainer} ${styles[currentTheme]}`}>{children}</div>;
}
