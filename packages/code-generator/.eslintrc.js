module.exports = {
  extends: 'eslint-config-ali/typescript/react',
  rules: {
    'max-len': ['error', { code: 200 }],
    'function-paren-newline': 'off',
    '@typescript-eslint/indent': 'off',
  },
};
