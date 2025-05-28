// 发布插件：打包，创建zip包，生成tag
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

interface Manifest {
  version: string;
  [key: string]: unknown;
}

// 构建项目
console.log('Building project...');
execSync('pnpm build:prod', { stdio: 'inherit' });

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 读取构建后的 manifest.json
const manifestJson: Manifest = JSON.parse(
  readFileSync(resolve(__dirname, '../dist/manifest.json'), 'utf-8')
);

// 创建 zip 文件
console.log('Creating zip file...');
const zipFileName = `neck-upgrade-v${manifestJson.version}.zip`;
try {
  execSync(`cd dist && zip -r ../${zipFileName} .`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error creating zip file:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}

// 创建 git tag
console.log('Creating git tag...');
const tagName = `v${manifestJson.version}`;
try {
  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  console.log(`Created tag: ${tagName}`);
} catch (error) {
  console.error('Error creating git tag:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}

console.log(`\n发布准备完成！`);
console.log(`1. 版本号已更新到: ${manifestJson.version}`);
console.log(`2. Git tag 已创建: ${tagName}`);
console.log(`3. 构建文件已生成在: dist/`);
console.log(`4. 打包文件已生成: ${zipFileName}`);
console.log('\n请按以下步骤发布到 Chrome 商店：');
console.log('1. 访问 https://chrome.google.com/webstore/devconsole');
console.log('2. 选择 neck-upgrade 扩展');
console.log('3. 点击"Package"标签');
console.log('4. 上传新生成的 zip 文件');
console.log('5. 填写更新说明');
console.log('6. 提交审核');
console.log('\n完成后，请执行以下命令推送 tag：');
console.log(`git push origin ${tagName}`);
