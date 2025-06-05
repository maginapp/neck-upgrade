import fs from 'fs';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, PluginOption } from 'vite';
import svgr from 'vite-plugin-svgr';

import { version } from './package.json';

// 读取并处理 manifest.json
const manifestPath = resolve(__dirname, 'src/extension/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifest.version = version;

// 创建移除 console.log 的插件
const removeConsolePlugin = (removeConsole: boolean) => ({
  name: 'remove-console',
  transform(code: string) {
    if (!removeConsole) return code;
    // 改进的正则表达式，可以处理嵌套括号
    return code.replace(/console\.log\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\);?/g, '');
  },
});

// 复制目录的辅助函数
const copyDir = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// 更新 manifest.json
const updateManifestConfig: PluginOption = {
  name: 'manifest',
  apply: 'build',
  closeBundle() {
    // 确保 dist 目录存在
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    // 写入处理后的 manifest.json
    fs.writeFileSync(resolve(__dirname, 'dist/manifest.json'), JSON.stringify(manifest, null, 2));

    // 移动 entries 目录到正确的位置
    const sourceDir = resolve(__dirname, 'dist/src');
    const sourceDirEntries = resolve(__dirname, 'dist/src/extension/entries');
    const targetDir = resolve(__dirname, 'dist/entries');

    if (fs.existsSync(sourceDirEntries)) {
      // 确保目标目录存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 移动文件
      fs.readdirSync(sourceDirEntries).forEach((file) => {
        const sourcePath = resolve(sourceDirEntries, file);
        const targetPath = resolve(targetDir, file);
        fs.copyFileSync(sourcePath, targetPath);
      });

      // 删除源目录
      fs.rmSync(sourceDir, { recursive: true, force: true });
    }

    // 复制 _locales 目录到 dist
    const localesSrc = resolve(__dirname, 'src/extension/_locales');
    const localesDest = resolve(__dirname, 'dist/_locales');
    if (fs.existsSync(localesSrc)) {
      copyDir(localesSrc, localesDest);
    }
  },
};

// 移动 html 文件到正确的位置
// dist/src/extension/pages/[name]/index.html -> dist/pages/[name].html
const transHtmlConfig: PluginOption = {
  name: 'trans-html',
  apply: 'build',
  closeBundle() {
    // 确保 dist 目录存在
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    // 移动 entries 目录到正确的位置
    const sourceDir = resolve(__dirname, 'dist/src');
    const sourceDirEntries = resolve(__dirname, 'dist/src/extension/pages');
    const targetDir = resolve(__dirname, 'dist/pages');

    if (fs.existsSync(sourceDirEntries)) {
      // 确保目标目录存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 移动文件
      fs.readdirSync(sourceDirEntries).forEach((file) => {
        const sourcePath = resolve(sourceDirEntries, file, 'index.html');
        const targetPath = resolve(targetDir, `${file}.html`);
        fs.copyFileSync(sourcePath, targetPath);
      });

      // 删除源目录
      fs.rmSync(sourceDir, { recursive: true, force: true });
    }
  },
};

export default defineConfig((_) => {
  // const isProd = mode === 'production';
  const removeConsole = process.env.REMOVE_CONSOLE === 'true';

  return {
    plugins: [
      react(),
      removeConsolePlugin(removeConsole),
      updateManifestConfig,
      transHtmlConfig,
      svgr(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/extension/pages/popup/index.html'),
          newtab: resolve(__dirname, 'src/extension/pages/newtab/index.html'),
          background: resolve(__dirname, 'src/extension/background/index.ts'),
          // content: resolve(__dirname, 'src/extension/content/index.ts'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'background' || chunkInfo.name === 'content'
              ? 'assets/[name].js'
              : 'assets/[name]-[hash].js';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      emptyOutDir: true,
    },
  };
});
