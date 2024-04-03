import { defineConfig, type LibraryFormats } from 'vite';
import { resolve } from 'node:path';
import { env } from 'node:process'
import react from '@vitejs/plugin-react';
import { devDependencies, peerDependencies } from './package.json';

const externals = [...Object.keys(peerDependencies), ...Object.keys(devDependencies)];
const formats = (env['FORMATS']?.split(',') ?? ['es', 'cjs']) as LibraryFormats[];

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodeEditorSkeleton',
      formats,
      // the proper extensions will be added
      fileName: 'editorSkeleton',
    },
    rollupOptions: {
      external: externals,
    },
  },
  plugins: [react()],
});
