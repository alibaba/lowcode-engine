import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint'
import js from '@eslint/js';
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals'

export default tseslint.config({
  files: ['packages/*/src/**/*.{ts?(x),js?(x)}'],
  ignores: ["**/*.test.ts"],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  plugins: {
    '@stylistic': stylistic,
    react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
      ...globals.nodeBuiltin,
      ...globals.jest
    },
  },
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/indent-binary-ops': ['error', 2],
    '@stylistic/max-len': ['error', { tabWidth: 2, "ignoreStrings": true }],
    '@stylistic/no-tabs': 'error',
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/jsx-pascal-case': [2],
    '@stylistic/jsx-indent': [2, 2, { checkAttributes: true, indentLogicalExpressions: true }],
    '@stylistic/semi': ['error', 'always'],

    'react/jsx-no-undef': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
    'react/no-this-in-sfc': 'error',
    'react/require-render-return': 'warn',
    'react/no-children-prop': 'warn',

    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies

    'react-refresh/only-export-components': 'warn',
  },
})
