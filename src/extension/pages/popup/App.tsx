import { Popup } from '@/components/Popup';
import { useSettings } from '@/components/Settings/hooks';
import { ThemeContainer } from '@/components/Theme/ThemeContainer';
import { LanguageProvider } from '@/i18n';
export function App() {
  // 状态管理：主题、颈椎模式和内容类型
  const { settings, setSettings, currentTheme } = useSettings();

  return (
    <LanguageProvider language={settings.language}>
      <ThemeContainer currentTheme={currentTheme}>
        <Popup
          language={settings.language}
          theme={settings.theme}
          onLanguageChange={(language) => setSettings((prev) => ({ ...prev, language }))}
          onThemeChange={(theme) => setSettings((prev) => ({ ...prev, theme }))}
        />
      </ThemeContainer>
    </LanguageProvider>
  );
}
