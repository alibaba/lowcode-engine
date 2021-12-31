
module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  testEnvironment: 'node',
  // testMatch: ['(/tests?/.*(test))\\.[jt]s$'],
  testTimeout: 1000000,
  testPathIgnorePatterns: [
    '/node_modules/',
    'test/fixtures',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};