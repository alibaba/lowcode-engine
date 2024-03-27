import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodePluginCommand',
      formats: ['es', 'cjs'],
      // the proper extensions will be added
      fileName: 'plugin-command',
    },
  },
});
