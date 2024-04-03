import { defineConfig, LibraryFormats } from 'vite';
import { env } from 'node:process';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { devDependencies, peerDependencies } from './package.json';

const externals = [...Object.keys(devDependencies), ...Object.keys(peerDependencies)];
const formats = (env['FORMATS']?.split(',') ?? ['es', 'cjs', 'iife']) as LibraryFormats[];

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodeSimulatorReactRenderer',
      formats,
      // the proper extensions will be added
      fileName: 'SimulatorReactRenderer',
    },
    rollupOptions: {
      external: externals,
      output: {
        // for UMD
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [react()],
});
