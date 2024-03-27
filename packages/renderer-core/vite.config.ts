import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowCodeRendererCore',
      formats: ['es'],
      // the proper extensions will be added
      fileName: 'rendererCore',
    },
  },
});
