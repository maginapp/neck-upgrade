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
    <main
      className={`${styles.mainView} ${styles[mode]}`}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.side}>
        <FamousSaying />
      </div>
      <div className={styles.content}>
        <Content type={settings.dataType} />
      </div>
    </main>
  );
}
