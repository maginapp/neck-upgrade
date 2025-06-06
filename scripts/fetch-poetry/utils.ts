import { execSync } from 'child_process';
import { readFileSync, existsSync, rmSync, readdirSync } from 'fs';
import path from 'path';

import {
  SONG_CI_CONFIG,
  SPECIAL_AUTHORS,
  TEMP_DIR,
  LAST_UPDATE_FILE,
  POETRY_FILE,
  TANG_SHI_CONFIG,
} from './config';

// 清理函数
export function cleanup() {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  if (existsSync(LAST_UPDATE_FILE)) {
    rmSync(LAST_UPDATE_FILE, { recursive: true, force: true });
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
    let lastCommit = readFileSync(LAST_UPDATE_FILE, 'utf-8').trim();
    lastCommit = lastCommit.split('\n')[0];
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

export function getPoemKey(title: string, author: string) {
  return title + '#' + author;
}

export function checkNeedUpdatePoem(hash: string): boolean {
  if (!existsSync(LAST_UPDATE_FILE)) {
    return true;
  }

  try {
    const lastHash = readFileSync(LAST_UPDATE_FILE, 'utf-8').trim().split('\n')[1];
    return lastHash !== hash;
  } catch (error) {
    console.log('检查更新时出错，将重新生成诗词数据', error);
    return true;
  }
}

function getPoemList<T>(basePath: string, prefix: string) {
  console.log(`开始处理目录：${basePath}`);
  // ✅ 获取符合条件的文件列表
  const files = readdirSync(basePath).filter(
    (file) => file.endsWith('.json') && file.startsWith(prefix)
  );

  console.log(`共找到 ${files.length} 个文件：`, files);

  // ✅ 合并 JSON 数据
  const mergedData: T[] = [];

  for (const file of files) {
    const filePath = path.join(basePath, file);
    try {
      const content = readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);

      if (Array.isArray(json)) {
        mergedData.push(...json);
      } else {
        mergedData.push(json);
      }
    } catch (err) {
      console.error(`❌ 处理失败: ${file}`, (err as Error).message);
    }
  }
  return mergedData || [];
}

export function filterPoemWithAuthor<T extends { author: string }>(
  basePath: string,
  prefix: string,
  authors: string[]
) {
  const list = getPoemList<T>(path.join(TEMP_DIR, basePath), prefix);
  return list.filter((item) => {
    return authors.includes(item.author);
  });
}

export function fetchSongCiWithAuthor() {
  return filterPoemWithAuthor(SONG_CI_CONFIG.basePath, SONG_CI_CONFIG.matches, SPECIAL_AUTHORS);
}

export function fetchTangshiWithAuthor() {
  return filterPoemWithAuthor(TANG_SHI_CONFIG.basePath, TANG_SHI_CONFIG.matches, SPECIAL_AUTHORS);
}

// getList(path.join(TEMP_DIR, '全唐诗'), 'poet.');
