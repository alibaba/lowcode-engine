const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  rules: {
    "global-require": 0,
    "@typescript-eslint/interface-name-prefix": 0
  },
});
