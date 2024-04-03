import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { argv } from 'node:process';
import { URL } from 'node:url'
import minimist from 'minimist';
import { execa } from 'execa';

const args = minimist(argv.slice(2));
const targets = args['_'][0].split(',');
const formatArgs = args['format'];
const prod = args['prod'] || args['p'];

const packagesUrl = new URL('../packages', import.meta.url);

async function run() {
  const packageDirs = await readdir(packagesUrl.pathname);
  const targetPackages = packageDirs
    .filter((dir) => targets.includes(dir))
    .filter((dir) => existsSync(resolve(packagesUrl.pathname, dir)));

  await execa('pnpm', ['--filter', `@alilc/lowcode-${targetPackages[0]}`, 'build:target'], {
    stdio: 'inherit',
    env: {
      FORMATS: !prod ? formatArgs : undefined,
    },
  });
}

run();
