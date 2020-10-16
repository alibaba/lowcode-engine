// jest.config.js
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):

const esModules = ['@recore/obx-react'].join('|');
// console.log('>>> compilerOptions', compilerOptions);
// console.log('>>> compilerOptions', pathsToModuleNameMapper(compilerOptions.paths));
module.exports = {
  /* transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    // '^.+\\.(ts|tsx)$': 'ts-jest',
    // '^.+\\.(js|jsx)$': 'babel-jest',
  }, */
  // testMatch: ['(/tests?/.*(test))\\.[jt]s$'],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`,
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};
