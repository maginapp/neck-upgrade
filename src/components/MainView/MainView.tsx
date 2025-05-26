import { Header } from '../Header';
import { Content } from '../Content';
import { FamousSaying } from '../FamousSaying/FamousSaying';
import styles from './MainView.module.scss';
import { Settings } from '@/types/app';
import { useEffect, useRef } from 'react';

interface MainViewProps {
  settings: Settings;
}
export function MainView(props: MainViewProps) {
  // 状态管理：主题、颈椎模式和内容类型

  const { settings } = props;

  const { neck: neckConfig } = settings;
  const { mode, rotate } = neckConfig;
  const mainViewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateScale() {
      // Math.SQRT2 * 600 -> 848
      const ratio = Math.min(window.innerWidth / 900, 1, window.innerHeight / 900);
      mainViewContainerRef.current &&
        mainViewContainerRef.current.style.setProperty('--scale-main-view-ratio', String(ratio));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div className={styles.mainViewContainer} ref={mainViewContainerRef}>
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
