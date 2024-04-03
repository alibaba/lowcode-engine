import { defineConfig, LibraryFormats } from 'vite';
import { resolve } from 'node:path';
import { env } from 'node:process';

const formats = (env['FORMATS']?.split(',') ?? ['es']) as LibraryFormats[];

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'LowcodeTypes',
      formats,
      // the proper extensions will be added
      fileName: 'lowcodeTypes',
    },
  },
});
