import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*/vitest.config.{e2e,unit}.ts',
  {
    test: {
      include: ['**/__tests__/**/*.spec.{ts?(x),js?(x)}'],
      alias: {
        '@alilc/lowcode-shared': 'packages/shared',
      },
      name: 'unit test',
      environmentMatchGlobs: [['packages/**', 'jsdom']],
      globals: true,
    },
  },
]);
