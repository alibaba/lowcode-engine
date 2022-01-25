/* eslint-disable @typescript-eslint/no-require-imports */
if (process.env.NODE_ENV !== 'development') {
  module.exports = require('../dist/standalone.min');
} else {
  module.exports = require('../dist/standalone');
}
