import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint'
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config({
  files: ['packages/*/src/**/*.{ts?(x),js?(x)}'],
  ignores: ["**/*.test.ts"],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  plugins: {
    '@stylistic': stylistic,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh
  },
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/indent-binary-ops': ['error', 2],
    '@stylistic/max-len': ['error', { tabWidth: 2 }],
    '@stylistic/no-tabs': 'error',
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/jsx-pascal-case': [2],
    '@stylistic/jsx-indent': [2, 2, { checkAttributes: true, indentLogicalExpressions: true }],
    '@stylistic/semi': ['error', 'always'],

    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies

    'react-refresh/only-export-components': 'warn',
  },
})
