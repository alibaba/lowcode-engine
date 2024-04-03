import { defineConfig, LibraryFormats } from 'vite';
import { env } from 'node:process';
import { resolve } from 'node:path';
import { devDependencies, peerDependencies } from './package.json';

const externals = [...Object.keys(peerDependencies), ...Object.keys(devDependencies)];
const formats = (env['FORMATS']?.split(',') ?? ['es', 'cjs']) as LibraryFormats[];

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodeRuntimeRouter',
      formats,
      // the proper extensions will be added
      fileName: 'runtimeRouter',
    },
    rollupOptions: {
      external: externals,
    },
  },
});
