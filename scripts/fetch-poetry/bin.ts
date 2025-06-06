import { existsSync } from 'fs';

import { TEMP_DIR } from './config';
import { downloadPoetryData } from './donwload';
import { processPoetry } from './poem-processing';
import { cleanup, savePoetryResult } from './utils';

/**
 * 运行脚本
 * @param args 命令行参数
 */
export const run = async (args: string[]) => {
  try {
    if (args.includes('download')) {
      downloadPoetryData();
    } else if (args.includes('cleanup')) {
      cleanup();
    } else if (args.includes('process')) {
      if (!existsSync(TEMP_DIR)) {
        console.log('临时目录不存在，正在下载数据...');
        downloadPoetryData();
      }
      const result = await processPoetry();
      savePoetryResult(result);
    }
  } catch (error) {
    console.error('脚本运行出错:', error);
  }
};
