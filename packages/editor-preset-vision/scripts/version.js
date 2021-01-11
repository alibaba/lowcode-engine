/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports  */
const { execSync } = require('child_process');
const { join } = require('path');
const fse = require('fs-extra');

const gitBranchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
const reBranchVersion = /^(?:[a-z]+\/)(\d+\.\d+\.\d+)$/im;

const match = reBranchVersion.exec(gitBranchName);
if (!match) {
  console.warn(`[checkversion] gitBranchName: ${gitBranchName}`);
  return;
}

const releaseVersion = match[1];

const distDir = join(__dirname, '../dist');

const distFile = join(distDir, 'editor-preset-vision.js');

if (!fse.existsSync(distFile)) {
  console.warn('dist dir doesn\'t exists');
  return;
}

const indexContent = fse.readFileSync(distFile, 'utf-8');

fse.writeFileSync(distFile, indexContent.replace('{{VERSION_PLACEHOLDER}}', releaseVersion));
