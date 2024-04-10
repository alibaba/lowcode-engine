import { argv, cwd } from 'node:process';
import minimist from 'minimist';
import { execa } from 'execa';
import { findWorkspacePackages } from '@pnpm/workspace.find-packages'

const args = minimist(argv.slice(2));
const targets = args['_'];
const formatArgs = args['formats'];
const prod = args['prod'] || args['p'];
const buildTypes = args['types'] || args['t']

async function run() {
  const packages = await findWorkspacePackages(cwd());
  const targetPackageName = `@alilc/lowcode-${targets[0]}`
  const finalName = packages
    .filter((item) => item.manifest.name === targetPackageName)
    .map(item => item.manifest.name);

  await execa('pnpm', ['--filter', finalName[0], 'build:target'], {
    stdio: 'inherit',
    env: {
      FORMATS: formatArgs ? formatArgs : !prod ? 'es' : undefined,
    },
  });

  if (buildTypes) {
    await execa('pnpm', ['--filter', finalName[0], 'build:dts'], {
      stdio: 'inherit',
    });
  }
}

run();
