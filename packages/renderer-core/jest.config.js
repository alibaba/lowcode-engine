const esModules = [
  '@alilc/lowcode-datasource-engine',
].join('|');

module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|ts|tsx|jsx)$': 'babel-jest',
    '^.+\\.(css|less|scss)$': './test/mock/styleMock.js',
  },
  // testMatch: ['**/bugs/*.test.ts'],
  // testMatch: ['(/tests?/.*(test))\\.[jt]s$'],
  // transformIgnorePatterns: [
  //   `/node_modules/(?!${esModules})/`,
  // ],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  setupFilesAfterEnv: [
    './test/setup.ts',
  ],
};
