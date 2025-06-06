import { execSync } from 'child_process';
import crypto from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

import { TEMP_DIR, LAST_UPDATE_FILE, POETRY_FILE, TARGET_DIR } from './config';
import { PoetryItem } from './types';
import {
  cleanup,
  getRemoteLastCommit,
  checkNeedUpdateGit,
  checkNeedUpdate,
  ensureTargetDir,
  checkNeedUpdatePoem,
} from './utils';

/**
 * 下载诗词数据
 * @param targetDir 目标目录
 */
export async function downloadPoetryData() {
  try {
    // 确保目标目录存在
    ensureTargetDir(TARGET_DIR);

    console.log('校验git...');
    // 检查是否需要更新
    if (!checkNeedUpdate()) {
      console.log('本地数据已是最新，无需更新');
      return false;
    } else if (checkNeedUpdateGit()) {
      console.log('检测到新版本，开始更新数据...');
      // 清理之前的临时文件
      cleanup();
      // 克隆仓库
      console.log('正在下载诗词数据...');
      execSync(`git clone https://github.com/chinese-poetry/chinese-poetry.git ${TEMP_DIR}`);

      // 保存最后更新时间
      const lastCommit = getRemoteLastCommit();
      writeFileSync(LAST_UPDATE_FILE, lastCommit);
      return true;
    }
    return false;
  } catch (error) {
    console.error('下载数据时出错：', error);
    return false;
  }
}

/**
 * 保存诗词数据
 * @param data 诗词数据
 */
export async function savePoetryData(data: PoetryItem[]) {
  try {
    console.log('生成诗词hash...');
    const nameStr = data.map((item) => item.title).join('');
    const nameHash = crypto.createHash('md5').update(nameStr).digest('hex');

    if (!checkNeedUpdatePoem(nameHash)) {
      console.log('本地诗词数据已是最新，无需更新', data.length);
      return;
    }

    // 保存处理后的数据
    console.log('正在保存处理后的数据...', data.length, nameHash, nameStr.length);
    const first = readFileSync(LAST_UPDATE_FILE, 'utf8').split('\n');
    writeFileSync(LAST_UPDATE_FILE, first + '\n' + nameHash, 'utf8');
    writeFileSync(POETRY_FILE, JSON.stringify(data, null, 2));

    console.log('数据处理完成！');
  } catch (error) {
    console.error('保存数据时出错：', error);
  }
}
