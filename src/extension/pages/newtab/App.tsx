import { Settings } from '@/components/Settings';
import styles from './App.module.scss';
import { MainView } from '@/components/MainView';
import { useSettings } from '@/components/Settings/hooks';
import { ThemeContainer } from '@/components/Theme/ThemeContainer';
export function App() {
  // 状态管理：主题、颈椎模式和内容类型
  const { settings, setSettings, currentTheme } = useSettings();
  return (
    <ThemeContainer currentTheme={currentTheme}>
      <div className={styles.app}>
        <MainView settings={settings} />
        <Settings setSettings={setSettings} settings={settings} />
      </div>
    </ThemeContainer>
  );
}
