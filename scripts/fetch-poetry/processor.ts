import { downloadPoetryData, savePoetryData } from './file-processing';
import { processPoetry } from './poem-processing';

export async function processor() {
  try {
    // 从https://github.com/chinese-poetry/chinese-poetry.git读取诗词数据
    downloadPoetryData();
    // 读取诗词数据
    const result = await processPoetry();
    // 存储处理后的数据
    savePoetryData(result);
  } catch (error) {
    console.error('处理过程中出现错误：', error);
  }
}
