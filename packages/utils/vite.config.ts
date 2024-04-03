import { defineConfig, LibraryFormats } from 'vite';
import { resolve } from 'node:path';
import { env } from 'node:process';
import react from '@vitejs/plugin-react';
import { devDependencies, peerDependencies } from './package.json';

const externals = [...Object.keys(peerDependencies), ...Object.keys(devDependencies)];
const formats = (env['FORMATS']?.split(',') ?? ['es']) as LibraryFormats[];

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodeUtils',
      formats,
      fileName: 'lowCodeUtils',
    },
    rollupOptions: {
      external: externals,
    },
  },
  plugins: [
    react(),
  ],
});
