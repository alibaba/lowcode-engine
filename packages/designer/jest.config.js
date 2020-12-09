const esModules = ['@recore/obx-react'].join('|');

module.exports = {
  // transform: {
  //   '^.+\\.[jt]sx?$': 'babel-jest',
  //   // '^.+\\.(ts|tsx)$': 'ts-jest',
  //   // '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  // testMatch: ['**/project.test.ts'],
  testMatch: ['(/tests?/.*(test))\\.[jt]s$'],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`,
  ],
  setupFiles: ['./tests/fixtures/unhandled-rejection.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/icons/**',
    '!src/locale/**',
    '!src/document/node/exclusive-group.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};
