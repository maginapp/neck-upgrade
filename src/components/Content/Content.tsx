import React from 'react';
import styles from './Content.module.scss';
import { DataType } from '@/types/app';
import { History } from './History';
import { PoetryComponent } from './Poetry';
import { English } from './English';

interface ContentProps {
  type: DataType;
}

export const Content: React.FC<ContentProps> = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case DataType.History:
        return <History />;
      case DataType.Poetry:
        return <PoetryComponent />;
      case DataType.English:
        return <English />;
      default:
        return null;
    }
  };

  return <main className={styles.content}>{renderContent()}</main>;
};
