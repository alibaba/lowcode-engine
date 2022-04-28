const fs = require('fs');
const { join } = require('path');
const esModules = ['zen-logger'].join('|');
const pkgNames = fs.readdirSync(join('..')).filter(pkgName => !pkgName.startsWith('.'));

const jestConfig = {
  // transform: {
  //   '^.+\\.[jt]sx?$': 'babel-jest',
  //   // '^.+\\.(ts|tsx)$': 'ts-jest',
  //   // '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  // testMatch: ['**/document/node/node.test.ts'],
  // testMatch: ['**/designer/builtin-hotkey.test.ts'],
  // testMatch: ['**/plugin/plugin-manager.test.ts'],
  // testMatch: ['(/tests?/.*(test))\\.[jt]s$'],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`,
  ],
  setupFiles: ['./test/utils/host.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
  ],
};

// 只对本仓库内的 pkg 做 mapping
jestConfig.moduleNameMapper = {};
jestConfig.moduleNameMapper[`^@alilc/lowcode\\-(${pkgNames.join('|')})$`] = '<rootDir>/../$1/src';

module.exports = jestConfig;