/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const _ = require('lodash');
const esbuild = require('esbuild');
const concurrently = require('concurrently');
const argv = require('yargs-parser')(process.argv.slice(2));
const packageJson = require('../package.json');

if (!argv.format) {
  buildAll();
} else {
  buildFormat(argv.format, argv.out || 'dist');
}

function buildAll() {
  concurrently(
    [
      { name: 'build:types', command: 'sh scripts/build-types' },
      { name: 'build:cjs', command: 'node scripts/build --format=cjs --out=lib' },
      { name: 'build:esm', command: 'node scripts/build --format=esm --out=es' },
      { name: 'build:standalone', command: 'node scripts/build-standalone' },
      { name: 'build:standalone-worker', command: 'node scripts/build-standalone-worker' },
      { name: 'build:standalone-loader', command: 'node scripts/build-standalone-loader' },
      { name: 'build:cli', command: 'node scripts/build-cli' },
    ],
    {
      prefix: 'name',
      killOthers: ['failure'],
      restartTries: 0,
    },
  ).then(
    () => {
      console.log('all done.');
    },
    () => {
      process.exit(1);
    },
  );
}

function buildFormat(format, outDir) {
  try {
    console.log('building %s...', format);
    const startTime = Date.now();
    const result = esbuild.buildSync({
      entryPoints: ['src/index.ts'],
      outfile: `${outDir}/index.js`,
      bundle: true,
      platform: 'node',
      target: ['node10'],
      format,
      sourcemap: true,
      sourcesContent: true,
      define: {},
      treeShaking: true,
      external: _.keys(packageJson.dependencies),
      minify: false,
      legalComments: 'external',
    });
    if (result.errors.length > 0) {
      throw result.errors;
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach((warnings) => {
        console.warn(warnings);
      });
    }

    console.log('built %s in %ds', format, ((Date.now() - startTime) / 1000).toFixed(2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
