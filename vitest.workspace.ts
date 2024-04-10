import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*/vitest.config.{e2e,unit}.ts',
  {
    test: {
      include: ['**/__tests__/**/*.spec.{ts?(x),js?(x)}'],
      name: 'unit test',
      environment: 'jsdom',
      globals: true
    }
  },
])
