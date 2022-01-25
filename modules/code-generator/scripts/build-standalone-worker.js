/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const esbuild = require('esbuild');
const { spawnSync } = require('child_process');
const ignorePlugin = require('esbuild-plugin-ignore');
const fs = require('fs');
const path = require('path');

const enableAnalyze = process.env.ANALYZE === 'true';
const buildConfig = {
  entryPoints: ['src/standalone-worker.ts'],
  outfile: 'dist/standalone-worker.js',
  metafile: enableAnalyze,
  bundle: true,
  target: ['chrome69'],
  format: 'iife',
  sourcemap: true,
  sourcesContent: true,
  plugins: [
    ignorePlugin([
      {
        resourceRegExp: /^fs$/,
        contextRegExp: /./,
      },
      // @alilc/lowcode-types 中误依赖了 react，这里忽略下
      {
        resourceRegExp: /^react$/,
        contextRegExp: /./,
      },
      {
        resourceRegExp: /setter-config/,
        contextRegExp: /lowcode-types|..[\\/]types/,
      },
    ]),
  ],
  define: {
    process: JSON.stringify({
      env: {
        NODE_ENV: 'production',
        STANDALONE: 'true',
      },
    }),
  },
  treeShaking: true,
};

// 执行脚本
(async () => {
  try {
    console.log('building...');
    const result = await esbuild.build({
      ...buildConfig,
      minify: false,
      minifyWhitespace: false,
      minifyIdentifiers: false,
      minifySyntax: false,
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

    if (enableAnalyze) {
      const metaFile = buildConfig.outfile.replace(/\.js/, '.meta.json');
      const statsFile = buildConfig.outfile.replace(/\.js/, '.stats.html');
      fs.writeFileSync(metaFile, JSON.stringify(result.metafile || {}), { encoding: 'utf-8' });
      spawnSync('npx', ['esbuild-visualizer', '--metadata', metaFile, '--filename', statsFile], {
        shell: true,
        stdio: 'inherit',
      });
      spawnSync('open', [statsFile], {
        shell: true,
        stdio: 'inherit',
      });
      return;
    }

    const outFileContent = fs.readFileSync(buildConfig.outfile, 'utf-8');

    console.log('minifying...');
    const minifiedOutFile = buildConfig.outfile.replace(/\.js$/, '.min.js');
    const minifiedResult = esbuild.transformSync(outFileContent, {
      minify: true,
      sourcemap: true,
      sourcesContent: true,
      sourcefile: path.basename(buildConfig.outfile),
    });

    fs.writeFileSync(minifiedOutFile, minifiedResult.code, { encoding: 'utf-8' });
    fs.writeFileSync(`${minifiedOutFile}.map`, minifiedResult.map, { encoding: 'utf-8' });

    minifiedResult.warnings.forEach((warnings) => {
      console.log(warnings);
    });

    console.log('done');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
