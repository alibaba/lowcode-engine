import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  js.configs.recommended,
  {
    files: ['**/src/**/*.{ts?(x),js?(x)}'],
    plugins: {
      '@stylistic': stylistic,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      "@stylistic/indent-binary-ops": ["error", 2],
      '@stylistic/max-len': ["error", { "tabWidth": 2 }],
      '@stylistic/no-tabs': "error",
      '@stylistic/quotes': ["error", "single"],
      "@stylistic/jsx-pascal-case": [2],
      "@stylistic/jsx-indent": [2, 2, { checkAttributes: true, indentLogicalExpressions: true }],

      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
  },
  {
    files: ['**/src/**/*.{tsx,jsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
];
