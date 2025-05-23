import { Header } from './components/Header/Header';
import { Content } from './components/Content/Content';
import { Settings } from './components/Settings/Settings';
import styles from './App.module.scss';
import { useSettings } from './components/Settings/useSettings';
import { FamousSaying } from './components/FamousSaying/FamousSaying';

function App() {
  // 状态管理：主题、颈椎模式和内容类型
  const { settings, setSettings, currentTheme } = useSettings();

  return (
    <div className={`${styles.app} ${styles[currentTheme]}`}>
      <Header />
      <FamousSaying />
      <Content type={settings.dataType} />
      <Settings setSettings={setSettings} settings={settings} />
    </div>
  );
}

export default App;
