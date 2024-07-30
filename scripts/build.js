import { argv, cwd } from 'node:process';
import minimist from 'minimist';
import { execa } from 'execa';
import { findWorkspacePackages } from '@pnpm/workspace.find-packages';

const args = minimist(argv.slice(2));
const targets = args['_'];
const formatArgs = args['formats'];
const prod = args['prod'] || args['p'];
const buildTypes = args['types'] || args['t'];

async function run() {
  const packages = await findWorkspacePackages(cwd());
  const targetPackageName = `@alilc/lowcode-${targets[0]}`;
  const manifest = packages.filter((item) => item.manifest.name === targetPackageName)[0].manifest;

  await execa('pnpm', ['--filter', manifest.name, 'build:target'], {
    stdio: 'inherit',
    env: {
      PROD: prod,
      FORMATS: formatArgs ? formatArgs : !prod ? 'es' : undefined,
      VERSION: manifest.version,
    },
  });

  if (buildTypes) {
    await execa('pnpm', ['--filter', finalName[0], 'build:dts'], {
      stdio: 'inherit',
    });
  }
}

run();
