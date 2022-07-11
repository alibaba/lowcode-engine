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
  // testMatch: ['**/history/history.test.ts'],
  // testMatch: ['**/plugin/plugin-manager.test.ts'],
  // testMatch: ['(/tests?/.*(test))\\.[jt]s$'],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`,
  ],
  setupFiles: ['./tests/fixtures/unhandled-rejection.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/icons/**',
    '!src/locale/**',
    '!src/builtin-simulator/utils/**',
    '!src/plugin/sequencify.ts',
    '!src/document/node/exclusive-group.ts',
    '!src/document/node/props/value-to-source.ts',
    '!src/builtin-simulator/live-editing/live-editing.ts',
    '!src/designer/offset-observer.ts',
    '!src/designer/clipboard.ts',
    '!src/builtin-simulator/host.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};

// 只对本仓库内的 pkg 做 mapping
jestConfig.moduleNameMapper = {};
jestConfig.moduleNameMapper[`^@alilc/lowcode\\-(${pkgNames.join('|')})$`] = '<rootDir>/../$1/src';

module.exports = jestConfig;