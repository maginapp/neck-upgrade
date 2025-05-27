import { useEffect } from 'react';

import { Settings } from '@/types/app';

import { Content } from '../Content';
import { FamousSaying } from '../FamousSaying/FamousSaying';
import { Header } from '../Header';

import styles from './MainView.module.scss';

interface MainViewProps {
  settings: Settings;
}
export function MainView(props: MainViewProps) {
  // 状态管理：主题、颈椎模式和内容类型

  const { settings } = props;

  const { neck: neckConfig } = settings;
  const { mode, rotate } = neckConfig;

  useEffect(() => {
    function updateScale() {
      // Math.SQRT2 * 600 -> 848
      const ratio = Math.min(window.innerWidth / 900, 1, window.innerHeight / 900);
      document.documentElement &&
        document.documentElement.style.setProperty('--scale-main-view-ratio', String(ratio));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div className={styles.mainViewContainer}>
      <div
        className={`${styles.mainView} ${styles[mode]}`}
        style={{
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <header className={styles.header}>
          <Header />
        </header>
        <aside className={styles.side}>
          <FamousSaying />
        </aside>
        <main className={styles.content}>
          <Content settings={settings} />
        </main>
      </div>
    </div>
  );
}
