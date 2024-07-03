import { defineConfig, mergeConfig } from 'vite';
import baseConfigFn from '../../vite.base.config';

export default defineConfig(async () => {
  const baseConfig = await baseConfigFn({
    name: 'AliLowCodeEngine',
    defaultFormats: ['es', 'cjs'],
  });

  return mergeConfig(
    baseConfig,
    defineConfig({
      build: {
        rollupOptions: {
          output: {
            // for UMD
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    }),
  );
});
