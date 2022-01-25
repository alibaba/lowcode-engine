/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const esbuild = require('esbuild');
const ignorePlugin = require('esbuild-plugin-ignore');

// 执行脚本
(async () => {
  try {
    console.log('building...');
    const result = await esbuild.build({
      entryPoints: ['src/cli/index.ts'],
      outfile: 'dist/cli.js',
      bundle: true,
      platform: 'node',
      target: ['node10'],
      format: 'cjs',
      sourcemap: true,
      sourcesContent: true,
      plugins: [
        ignorePlugin([
          // @alilc/lowcode-types 中误依赖了 react，这里忽略下
          {
            resourceRegExp: /^react$/,
            contextRegExp: /./,
          },
          {
            resourceRegExp: /setter-config/,
            contextRegExp: /lowcode-types/,
          },
        ]),
      ],
      define: {},
      treeShaking: true,
      minify: false,
      minifyWhitespace: false,
      minifyIdentifiers: false,
      minifySyntax: false,
      legalComments: 'external',
      external: Object.keys(require('../package.json').dependencies),
    });
    if (result.errors.length > 0) {
      throw result.errors;
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach((warnings) => {
        console.warn(warnings);
      });
    }

    console.log('done');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
