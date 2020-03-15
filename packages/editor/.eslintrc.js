const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  rules: {
    "global-require": 0,
    "comma-dangle": 0,
    "react/sort-comp": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx", "ts"] }],
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-explicit-any": 0
  },
});
