import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

import { TEMP_DIR, LAST_UPDATE_FILE, TARGET_DIR } from './config';
import { cleanup, getRemoteLastCommit, checkNeedUpdateGit, ensureTargetDir } from './utils';

/**
 * 下载诗词数据
 * @param targetDir 目标目录
 */
export function downloadPoetryData() {
  try {
    console.log('校验git...');
    // 确保目标目录存在
    ensureTargetDir(TARGET_DIR);

    if (checkNeedUpdateGit()) {
      console.log('检测到新版本，开始更新数据...');
      // 清理之前的临时文件;
      cleanup();
      // 克隆仓库
      console.log('正在下载诗词数据...');
      execSync(`git clone https://github.com/chinese-poetry/chinese-poetry.git ${TEMP_DIR}`);

      // 保存最后更新时间
      const lastCommit = getRemoteLastCommit();
      writeFileSync(LAST_UPDATE_FILE, lastCommit);
    }
  } catch (error) {
    console.error('下载数据时出错：', error);
  }
}
