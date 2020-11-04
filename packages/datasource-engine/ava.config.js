export default {
  babel: {
    compileEnhancements: false,
  },
  files: ['./test/core/*.ts', './test/scenes/**/*.test.ts'],
  require: ['ts-node/register/transpile-only'],
  extensions: ['ts'],
};
