/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports  */
const { join } = require('path');
const fse = require('fs-extra');


const distDir = join(__dirname, '../dist');

const distFileNames = ['engine.js', 'engine-core.js'];

distFileNames.forEach(name => {
  const distFile = join(distDir, 'js', name);

  const indexContent = fse.readFileSync(distFile, 'utf-8') + '\n';

  fse.writeFileSync(distFile, indexContent);
});

console.log('[engine] add a blank line successfully!');
