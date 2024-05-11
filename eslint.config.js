import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config({
  files: ['packages/*/{src,__tests__}/**/*.{ts?(x),js?(x)}', 'scripts/*.js'],
  ignores: ['**/*.test.ts'],
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  plugins: {
    '@stylistic': stylistic,
    react,
    'react-hooks': reactHooks,
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
      ...globals.jest,
    },
  },
  rules: {
    '@stylistic/max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    '@stylistic/no-tabs': 'error',
    '@stylistic/quotes': ['error', 'single', { allowTemplateLiterals: true }],
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/jsx-pascal-case': [2],
    '@stylistic/jsx-indent': [2, 2, { checkAttributes: true, indentLogicalExpressions: true }],
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/eol-last': ['error', 'always'],
    '@stylistic/jsx-quotes': ['error', 'prefer-double'],

    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
    '@typescript-eslint/no-explicit-any': 'off',

    'react/jsx-no-undef': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
    'react/no-this-in-sfc': 'error',
    'react/require-render-return': 'warn',
    'react/no-children-prop': 'warn',

    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'off', // Checks effect dependencies

    'no-inner-declarations': 'off',
  },
});
