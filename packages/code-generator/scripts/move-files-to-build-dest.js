/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const { spawnSync } = require('child_process');

const BUILD_DEST = process.env.BUILD_DEST || '.package';

fs.mkdirSync(BUILD_DEST, { recursive: true });

const distFiles = [...require('../package.json').files, 'package.json'];

distFiles.forEach((file) => {
  console.log('mv %s', file);
  if (file === BUILD_DEST) {
    fs.mkdirSync(`${BUILD_DEST}/${file}`, { recursive: true });
    spawnSync('mv', [`${file}/*`, `${BUILD_DEST}/${file}/`], { shell: true, stdio: 'inherit' });
  }
});

distFiles.forEach((file) => {
  console.log('mv %s', file);
  if (file !== BUILD_DEST) {
    spawnSync('mv', [file, `${BUILD_DEST}/${file}`], { shell: true, stdio: 'inherit' });
  }
});
