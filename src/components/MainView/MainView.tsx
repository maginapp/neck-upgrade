import { useEffect, useRef, useState } from 'react';

import { ContentPanelConfig, Settings } from '@/types/app';

import { Content } from '../Content';
import { FamousSaying } from '../FamousSaying/FamousSaying';
import { Header } from '../Header';

import styles from './MainView.module.scss';

interface MainViewProps {
  settings: Settings;
}

const getPanelTransform = (rotate: number, panelCount: number, width: number, height: number) => {
  if (panelCount === 1 || width <= 0 || height <= 0) {
    return `rotate(${rotate}deg)`;
  }

  const radians = ((Math.abs(rotate) % 180) * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const aspectRatio = width / height;
  const widthScale = 1 / (cos + sin / aspectRatio);
  const heightScale = 1 / (cos + sin * aspectRatio);
  const scale = Math.min(1, widthScale, heightScale) * 0.96;
  return `rotate(${rotate}deg) scale(${scale.toFixed(3)})`;
};

interface PanelViewProps {
  panel: ContentPanelConfig;
  panelCount: number;
}

const PanelView: React.FC<PanelViewProps> = ({ panel, panelCount }) => {
  const slotRef = useRef<HTMLDivElement>(null);
  const [slotSize, setSlotSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) {
      return;
    }

    const updateSize = (width: number, height: number) => {
      const nextSize = { width: Math.round(width), height: Math.round(height) };
      setSlotSize((currentSize) =>
        currentSize.width === nextSize.width && currentSize.height === nextSize.height
          ? currentSize
          : nextSize
      );
    };
    const observer = new ResizeObserver(([entry]) => {
      updateSize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(slot);
    updateSize(slot.clientWidth, slot.clientHeight);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={slotRef} className={styles.panelSlot}>
      <section
        className={`${styles.panel} ${styles[panel.neck.mode]}`}
        style={{
          transform: getPanelTransform(
            panel.neck.rotate,
            panelCount,
            slotSize.width,
            slotSize.height
          ),
        }}
      >
        <div className={styles.content}>
          <Content settings={panel} />
        </div>
        <aside className={styles.panelSide}>
          <FamousSaying />
        </aside>
      </section>
    </div>
  );
};

export function MainView(props: MainViewProps) {
  // 状态管理：主题、颈椎模式和内容类型

  const { settings } = props;
  const visiblePanels = settings.panels.slice(0, settings.columns);
  const isSinglePanel = visiblePanels.length === 1;

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

  if (isSinglePanel) {
    const { mode, rotate } = settings.neck;
    const modeClassName = styles[mode] ?? '';

    return (
      <div className={`${styles.mainViewContainer} ${styles.columns1}`}>
        <div
          className={`${styles.singleMainView} ${modeClassName}`}
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <header className={styles.singleHeader}>
            <Header />
          </header>
          <aside className={styles.singleSide}>
            <FamousSaying />
          </aside>
          <main className={styles.singleContent}>
            <Content settings={visiblePanels[0]} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.mainViewContainer} ${styles[`columns${settings.columns}`]}`}>
      <div className={styles.mainView}>
        <header className={styles.header}>
          <Header />
        </header>
        <main className={styles.panelGrid}>
          {visiblePanels.map((panel) => (
            <PanelView key={panel.id} panel={panel} panelCount={visiblePanels.length} />
          ))}
        </main>
      </div>
    </div>
  );
}
