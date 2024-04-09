import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { argv, cwd } from 'node:process';
import minimist from 'minimist';
import { execa } from 'execa';
import { findWorkspacePackages } from '@pnpm/workspace.find-packages'

const args = minimist(argv.slice(2));
const targets = args['_'][0];
const formatArgs = args['formats'];
const prod = args['prod'] || args['p'];

async function run() {
  const packages = await findWorkspacePackages(cwd());
  const targetPackageName = `@alilc/lowcode-${targets[0]}`

  const finalName = packages
    .filter((item) => item.manifest.name.includes(targetPackageName))
    .filter((dir) => existsSync(resolve(packagesUrl.pathname, dir)));

  await execa('pnpm', ['--filter', finalName, 'build:target'], {
    stdio: 'inherit',
    env: {
      FORMATS: !prod ? formatArgs : undefined,
    },
  });
}

run();
