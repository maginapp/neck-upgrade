import { execSync } from 'child_process';
import { readFileSync, existsSync, rmSync } from 'fs';

// import { join } from 'path';
import { TEMP_DIR, LAST_UPDATE_FILE, POETRY_FILE } from './config';

// 清理函数
export function cleanup() {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

// 检查是否需要更新
export function checkNeedUpdate(): boolean {
  if (!existsSync(POETRY_FILE) || checkNeedUpdateGit()) {
    return true;
  }

  return false;
}

// 获取远程仓库最新提交时间
export function getRemoteLastCommit(): string {
  const output = execSync(
    'git ls-remote --sort=-v:refname https://github.com/chinese-poetry/chinese-poetry.git HEAD'
  ).toString();
  return output.split('\t')[0];
}

// 检查是否需要更新git
export function checkNeedUpdateGit(): boolean {
  if (!existsSync(LAST_UPDATE_FILE)) {
    return true;
  }

  try {
    const lastCommit = readFileSync(LAST_UPDATE_FILE, 'utf-8').trim();
    const remoteCommit = getRemoteLastCommit();
    return lastCommit !== remoteCommit;
  } catch (error) {
    console.log('检查更新时出错，将重新下载数据', error);
    return true;
  }
}

// 确保目标目录存在
export function ensureTargetDir(targetDir: string) {
  if (!existsSync(targetDir)) {
    execSync(`mkdir -p ${targetDir}`);
  }
}
