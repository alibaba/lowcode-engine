module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': './babelTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': 'build-scripts-config/lib/config/jest/fileTransform.js',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!core-js)/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/vendor/**'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFiles: ['./jest.setup.js'],
};
