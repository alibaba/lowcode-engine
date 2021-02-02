/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports  */
const { execSync } = require('child_process');
const { join } = require('path');
const fse = require('fs-extra');

const gitBranchName = process.env.BUILD_GIT_BRANCH || execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
const reBranchVersion = /^(?:[a-z]+\/)(\d+\.\d+\.\d+)$/im;

const match = reBranchVersion.exec(gitBranchName);
if (!match) {
  console.warn(`[engine] gitBranchName: ${gitBranchName}`);
  return;
}

const releaseVersion = match[1];

const distDir = join(__dirname, '../dist');

const distFileNames = ['engine.js', 'engine-core.js'];

distFileNames.forEach(name => {
  const distFile = join(distDir, 'js', name);
  if (!fse.existsSync(distFile)) {
    console.warn(`[engine] distFile: ${distFile} doesn\'t exist`);
    return;
  }

  const indexContent = fse.readFileSync(distFile, 'utf-8');

  fse.writeFileSync(distFile, indexContent.replace('{{VERSION_PLACEHOLDER}}', releaseVersion));
});

console.log('[engine] update engine version successfully!');
