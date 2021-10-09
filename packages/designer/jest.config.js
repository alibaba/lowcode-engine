const esModules = ['@recore/obx-react'].join('|');

module.exports = {
  // transform: {
  //   '^.+\\.[jt]sx?$': 'babel-jest',
  //   // '^.+\\.(ts|tsx)$': 'ts-jest',
  //   // '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  testMatch: ['**/bugs/*.test.ts'],
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
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};
