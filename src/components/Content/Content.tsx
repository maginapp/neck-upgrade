import { DataType, Settings } from '@/types/app';

import { English } from './English';
import { History } from './History';
import { News } from './News';
import { PoetryComponent } from './Poetry';

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
      case DataType.News:
        return <News />;
      default:
        return null;
    }
  };

  return renderContent();
};
