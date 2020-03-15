const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  rules: {
    "global-require": 0,
    "comma-dangle": 0,
    "no-unused-expressions": 0,
    "object-shorthand": 0,
    "jsx-a11y/anchor-has-content": 0,
    "react/sort-comp": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx", "ts"] }],
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-member-accessibility": 0
  },
});
