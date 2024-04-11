import { defineConfig, LibraryFormats } from 'vite';
import { env, cwd } from 'node:process';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises'
import react from '@vitejs/plugin-react';

interface Options {
  name: string;
  entry?: string;
  defaultFormats?: LibraryFormats[];
  externalDeps?: boolean;
}

const resolvePath = (path: string) => resolve(cwd(), path)
const isProduction = !!env['PROD']

export default async ({ name, entry = 'src/index.ts', defaultFormats = ['es'], externalDeps = true }: Options) => {
  const formats = (env['FORMATS']?.split(',') ?? defaultFormats) as LibraryFormats[];

  let externals: string[] = [];

  if (externalDeps) {
    const { peerDependencies = {}, devDependencies = {} } = await getPackageJson(resolvePath('package.json'));
    externals = [...Object.keys(peerDependencies), ...Object.keys(devDependencies)];
  }

  return defineConfig({
    build: {
      lib: {
        entry: resolvePath(entry),
        name,
        fileName: camelCaseToKebabCase(name),
        formats,
      },
      minify: isProduction,
      sourcemap: isProduction ? false : 'inline',
      rollupOptions: {
        external: externals
      }
    },
    plugins: [react()],
  });
};

function camelCaseToKebabCase(str: string) {
  // 使用正则表达式匹配大写字母
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

async function getPackageJson(path: string) {
  const content = await readFile(path, 'utf-8');
  return JSON.parse(content);
}
