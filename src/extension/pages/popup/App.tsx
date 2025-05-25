import { useSettings } from '@/components/Settings/hooks';
import { ThemeContainer } from '@/components/Theme/ThemeContainer';
import { Popup } from '@/components/Popup';
export function App() {
  // 状态管理：主题、颈椎模式和内容类型
  const { currentTheme } = useSettings();

  return (
    <ThemeContainer currentTheme={currentTheme}>
      <Popup />
    </ThemeContainer>
  );
}
