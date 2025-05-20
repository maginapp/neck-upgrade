import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import { version } from './package.json';

// 读取并处理 manifest.json
const manifestPath = resolve(__dirname, 'src/extension/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifest.version = version;

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'manifest',
      apply: 'build',
      closeBundle() {
        // 确保 dist 目录存在
        if (!fs.existsSync('dist')) {
          fs.mkdirSync('dist');
        }
        // 写入处理后的 manifest.json
        fs.writeFileSync(
          resolve(__dirname, 'dist/manifest.json'),
          JSON.stringify(manifest, null, 2)
        );
      },
    },
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
        index: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/extension/background/index.ts'),
        content: resolve(__dirname, 'src/extension/content/index.ts'),
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
  },
}); 