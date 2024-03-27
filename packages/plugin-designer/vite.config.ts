import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { devDependencies, peerDependencies } from './package.json';

const externals = [...Object.keys(peerDependencies), ...Object.keys(devDependencies)];

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.tsx'),
      name: 'LowCodePluginDesigner',
      formats: ['es', 'cjs'],
      // the proper extensions will be added
      fileName: 'plugin-designer',
    },
    rollupOptions: {
      external: externals,
    },
  },
  plugins: [react()],
});
