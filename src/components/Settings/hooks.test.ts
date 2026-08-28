import { describe, expect, it } from 'vitest';

import { PoetrySource } from '@/constants/poetry';
import { DataType, NeckMode } from '@/types/app';

import {
  createContentPanelConfig,
  createNextContentPanelConfig,
  duplicateContentPanelConfig,
} from './hooks';

describe('createNextContentPanelConfig', () => {
  it('按设置页内容类型显示顺序跳过已使用类型', () => {
    const poetryPanel = { ...createContentPanelConfig(0), id: 'poetry', dataType: DataType.Poetry };
    const historyPanel = {
      ...createContentPanelConfig(1),
      id: 'history',
      dataType: DataType.History,
    };

    const nextPanel = createNextContentPanelConfig([poetryPanel, historyPanel], 'history');

    expect(nextPanel.dataType).toBe(DataType.English);
  });

  it('复制当前栏目的完整旋转配置', () => {
    const firstPanel = createContentPanelConfig(0);
    firstPanel.id = 'first';
    firstPanel.neck = {
      mode: NeckMode.Custom,
      rotate: 32,
      duration: 9,
      cusDuration: 18,
      cusMaxRotate: 75,
    };
    const secondPanel = { ...createContentPanelConfig(1), id: 'second' };

    const nextPanel = createNextContentPanelConfig([firstPanel, secondPanel], firstPanel.id);

    expect(nextPanel.neck).toEqual(firstPanel.neck);
    expect(nextPanel.neck).not.toBe(firstPanel.neck);
  });

  it('全部内容类型已使用时，第 6 栏回到设置页显示的第一个类型', () => {
    const panels = Object.values(DataType).map((dataType, index) => ({
      ...createContentPanelConfig(index),
      id: `panel-${index}`,
      dataType,
    }));

    const nextPanel = createNextContentPanelConfig(panels, panels[panels.length - 1].id);

    expect(nextPanel.dataType).toBe(Object.values(DataType)[0]);
  });
});

describe('duplicateContentPanelConfig', () => {
  it('复制视图配置并生成独立 id 和嵌套对象', () => {
    const source = createContentPanelConfig(0);
    source.poetry.sources = [PoetrySource.Qianziwen];

    const duplicated = duplicateContentPanelConfig(source, 1);

    expect(duplicated).toEqual({ ...source, id: duplicated.id });
    expect(duplicated.id).not.toBe(source.id);
    expect(duplicated.neck).not.toBe(source.neck);
    expect(duplicated.poetry).not.toBe(source.poetry);
    expect(duplicated.poetry.sources).not.toBe(source.poetry.sources);
    expect(duplicated.chineseBasics).not.toBe(source.chineseBasics);
  });
});
