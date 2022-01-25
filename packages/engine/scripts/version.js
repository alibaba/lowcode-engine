/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports  */
const { join } = require('path');
const fse = require('fs-extra');
// read from lerna
const lernaConfig = JSON.parse(fse.readFileSync('../../lerna.json', 'utf8'));
const { version } = lernaConfig;

let releaseVersion = version;

const distDir = join(__dirname, '../dist');

const distFileNames = ['engine-core.js'];

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
