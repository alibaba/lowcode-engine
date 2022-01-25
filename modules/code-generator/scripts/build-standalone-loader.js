/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const esbuild = require('esbuild');

const packageVersion = require('../package.json').version;
console.log('build standalone-loader: packageVersion=%s', packageVersion);

const enableAnalyze = process.env.ANALYZE === 'true';
const buildConfig = {
  entryPoints: ['src/standalone-loader.ts'],
  outfile: 'dist/standalone-loader.js',
  metafile: enableAnalyze,
  bundle: true,
  target: ['chrome69'],
  format: 'cjs',
  sourcemap: true,
  sourcesContent: true,
  external: Object.keys(require('../package.json').dependencies),
  define: {
    process: JSON.stringify({
      env: {
        NODE_ENV: 'production',
        STANDALONE: 'true',
      },
    }),
    __PACKAGE_VERSION__: JSON.stringify(packageVersion),
  },
  minify: false,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  minifySyntax: false,
  legalComments: 'external',
  treeShaking: true,
};

// 执行脚本
(async () => {
  try {
    console.log('building cjs...');
    const result = await esbuild.build({
      ...buildConfig,
    });
    if (result.errors.length > 0) {
      throw result.errors;
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach((warnings) => {
        console.warn(warnings);
      });
    }

    const result2 = await esbuild.build({
      ...buildConfig,
      outfile: buildConfig.outfile.replace(/\.js$/, '.esm.js'),
      format: 'esm',
    });
    if (result2.errors.length > 0) {
      throw result2.errors;
    }

    if (result2.warnings.length > 0) {
      result2.warnings.forEach((warnings) => {
        console.warn(warnings);
      });
    }

    console.log('done');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
