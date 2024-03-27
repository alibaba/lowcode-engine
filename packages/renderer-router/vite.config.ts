import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { devDependencies, peerDependencies } from './package.json';

const externals = [...Object.keys(peerDependencies), ...Object.keys(devDependencies)];

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodeRuntimeRouter',
      formats: ['es'],
      // the proper extensions will be added
      fileName: 'runtimeRouter',
    },
    rollupOptions: {
      external: externals,
    },
  },
});
