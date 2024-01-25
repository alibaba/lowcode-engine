const fs = require('fs');
const { join } = require('path');
const esModules = [].join('|');
const pkgNames = fs.readdirSync(join('..')).filter(pkgName => !pkgName.startsWith('.'));

const jestConfig = {
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`,
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/icons/**',
    '!src/locale/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};

// 只对本仓库内的 pkg 做 mapping
jestConfig.moduleNameMapper = {};
jestConfig.moduleNameMapper[`^@alilc/lowcode\\-(${pkgNames.join('|')})$`] = '<rootDir>/../$1/src';

module.exports = jestConfig;