import React from 'react';
import styles from './Content.module.scss';
import { DataType, Settings } from '@/types/app';
import { History } from './History';
import { PoetryComponent } from './Poetry';
import { English } from './English';

interface ContentProps {
  settings: Settings;
}

export const Content: React.FC<ContentProps> = (props) => {
  const { settings } = props;
  const { dataType, knowledge } = settings;
  const renderContent = () => {
    switch (dataType) {
      case DataType.History:
        return <History knowledgeMode={knowledge} />;
      case DataType.Poetry:
        return <PoetryComponent />;
      case DataType.English:
        return <English />;
      default:
        return null;
    }
  };

  return <div className={styles.content}>{renderContent()}</div>;
};
