import { execSync } from 'child_process';
import crypto from 'crypto';
import { readFileSync, existsSync, rmSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

import * as opencc from 'opencc';

import {
  SONG_CI_CONFIG,
  SPECIAL_AUTHORS,
  TEMP_DIR,
  LAST_UPDATE_FILE,
  POETRY_FILE,
  TANG_SHI_CONFIG,
  MAX_SPECIAL_ADD_COUNT,
  MAX_SPECIAL_THROTTLE_NUMERATOR,
} from './config';
import { SongciPoem, TangshiPoem, PoetryItem } from './types';

import type { OpenCC as OpenCCTypings } from 'opencc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OpenCC = (opencc as unknown as any).default.OpenCC as new (config: string) => OpenCCTypings;

// 清理函数
export function cleanup() {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  if (existsSync(LAST_UPDATE_FILE)) {
    rmSync(LAST_UPDATE_FILE, { recursive: true, force: true });
  }
}

// 获取远程仓库最新提交时间
export function getRemoteLastCommit(): string {
  const output = execSync(
    'git ls-remote --sort=-v:refname https://github.com/chinese-poetry/chinese-poetry.git HEAD'
  ).toString();
  console.log(output);
  return output.split('\t')[0];
}

// 检查是否需要更新git
export function checkNeedUpdateGit(): boolean {
  if (!existsSync(TEMP_DIR) || !existsSync(LAST_UPDATE_FILE)) {
    return true;
  }

  try {
    let lastCommit = readFileSync(LAST_UPDATE_FILE, 'utf-8').trim();
    lastCommit = lastCommit.split('\n')[0];
    console.log('lastCommit is', lastCommit);
    const remoteCommit = getRemoteLastCommit();
    console.log('remoteCommit is', remoteCommit);
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

// 繁体转简体
async function transFan2Jian(str: string) {
  const converter = new OpenCC('t2s.json');
  const result: string = await converter.convertPromise(str);
  return result;
}

// 获取诗词的key（繁体转简体）
export function getPoemKey(title: string, author: string) {
  return transFan2Jian(title + '#' + author);
}

// 检查是否需要更新
function checkNeedUpdatePoem(hash: string): boolean {
  // 无诗词结果文件，无更新文件，需要更新
  if (!existsSync(POETRY_FILE) || !existsSync(LAST_UPDATE_FILE)) {
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

// 合并 JSON 文件
function getPoemList<T>(basePath: string, prefix: string) {
  console.log(`开始处理目录：${basePath}`);
  // 获取符合条件的文件列表
  const files = readdirSync(basePath).filter(
    (file) => file.endsWith('.json') && file.startsWith(prefix)
  );

  console.log(`共找到 ${files.length} 个文件：`);

  // 合并 JSON 数据
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

// 根据作者过滤诗词
function filterPoemWithAuthor<T extends { author: string }>(
  basePath: string,
  prefix: string,
  authors: string[]
) {
  const authorMap = new Map();
  authors.forEach((author) => {
    authorMap.set(author, { count: 0 });
  });
  const list = getPoemList<T>(path.join(TEMP_DIR, basePath), prefix);
  return list.filter((item) => {
    if (!authors.includes(item.author)) return false;
    const data = authorMap.get(item.author)!;
    data.count++;
    if (data.count <= MAX_SPECIAL_ADD_COUNT) {
      return true;
    }
    if (
      !(
        data.count %
        (Math.ceil(data.count / MAX_SPECIAL_ADD_COUNT) * MAX_SPECIAL_THROTTLE_NUMERATOR)
      )
    ) {
      return true;
    }
  });
}

export function fetchSongCiWithAuthor() {
  return filterPoemWithAuthor<SongciPoem>(
    SONG_CI_CONFIG.basePath,
    SONG_CI_CONFIG.matches,
    SPECIAL_AUTHORS
  );
}

export function fetchTangshiWithAuthor() {
  return filterPoemWithAuthor<TangshiPoem>(
    TANG_SHI_CONFIG.basePath,
    TANG_SHI_CONFIG.matches,
    SPECIAL_AUTHORS
  );
}

/**
 * 保存诗词数据
 * @param data 诗词数据
 */
export function savePoetryResult(data: PoetryItem[]) {
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
    const first = readFileSync(LAST_UPDATE_FILE, 'utf8').split('\n')[0].trim();

    writeFileSync(LAST_UPDATE_FILE, first + '\n' + nameHash, 'utf8');
    writeFileSync(POETRY_FILE, JSON.stringify(data, null, 2));

    console.log('数据处理完成！');
  } catch (error) {
    console.error('保存数据时出错：', error);
  }
}
