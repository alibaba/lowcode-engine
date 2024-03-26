import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import { devDependencies, peerDependencies } from './package.json';

const externals = [...Object.keys(peerDependencies), ...Object.keys(devDependencies)];

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodeUtils',
      formats: ['es'],
      fileName: 'lowCodeUtils',
    },
    rollupOptions: {
      external: externals,
    },
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.declaration.json'),
      compilerOptions: {
        stripInternal: true,
        paths: {},
      },
    }),
  ],
});
