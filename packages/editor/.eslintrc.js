const { eslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(eslint, {
  rules: {
    "global-require": 0,
    "interface-name" : [true, "never-prefix"]
  },
});
