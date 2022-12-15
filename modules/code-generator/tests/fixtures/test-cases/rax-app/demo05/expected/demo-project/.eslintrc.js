const { getESLintConfig } = require('@iceworks/spec');

// https://www.npmjs.com/package/@iceworks/spec
module.exports = {
  ...getESLintConfig('rax'),
  rules: {
    'max-len': ['error', { code: 200 }],
    'function-paren-newline': 'off',
    '@typescript-eslint/indent': 'off',
    'prettier/prettier': 'off',
    'no-empty': 'off',
    'no-unused-vars': 'off',
    '@iceworks/best-practices/recommend-functional-component': 'off',
  },
};
