const esModules = ['@recore/obx-react'].join('|');

module.exports = {
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})/`,
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};
