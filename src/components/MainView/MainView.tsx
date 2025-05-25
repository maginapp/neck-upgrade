import { Header } from '../Header';
import { Content } from '../Content';
import { FamousSaying } from '../FamousSaying/FamousSaying';
import styles from './MainView.module.scss';
import { Settings } from '@/types/app';

interface MainViewProps {
  settings: Settings;
}
export function MainView(props: MainViewProps) {
  // 状态管理：主题、颈椎模式和内容类型

  const { settings } = props;

  const { neck: neckConfig } = settings;
  const { mode, rotate } = neckConfig;

  return (
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
  );
}
