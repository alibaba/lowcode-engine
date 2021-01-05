#!/usr/bin/env node
const fs = require('fs');
const { join } = require('path');

const packagesDir = join(__dirname, '../packages');

const dirs = fs.readdirSync(packagesDir);
dirs
  .filter(dir => !dir.startsWith('.'))
  .forEach(dir => {
    const pkgDir = join(packagesDir, dir);
    const pkg = JSON.parse(fs.readFileSync(join(pkgDir, 'package.json'), 'utf-8'));
    if (pkg.private) return;
    const { files } = pkg;
    files.forEach(file => {
      const fileDir = join(pkgDir, file);
      if (!fs.existsSync(fileDir)) {
        throw new Error(`${fileDir} not exists, plz run build`);
      }
    });
  });
