const fs = require('fs');
const { join } = require('path');
const esModules = [].join('|');
const pkgNames = fs.readdirSync(join('..')).filter(pkgName => !pkgName.startsWith('.'));

const jestConfig = {
  // transform: {
  //   // '^.+\\.[jt]sx?$': 'babel-jest',
  //   '^.+\\.(ts|tsx)$': 'ts-jest',
  //   // '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  // testMatch: ['(/tests?/.*(test))\\.[jt]s$'],
  // testMatch: ['**/*/base.test.tsx'],
  // testMatch: ['**/utils/common.test.ts'],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`,
  ],
  setupFiles: [
    './tests/fixtures/unhandled-rejection.ts',
    './tests/setup.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/utils/logger.ts',
    '!src/types/index.ts',
  ],
};

// 只对本仓库内的 pkg 做 mapping
jestConfig.moduleNameMapper = {};
jestConfig.moduleNameMapper[`^@alilc/lowcode\\-(${pkgNames.join('|')})$`] = '<rootDir>/../$1/src';

module.exports = jestConfig;