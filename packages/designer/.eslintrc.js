module.exports = {
  extends: 'eslint-config-ali/typescript/react',
  ignorePatterns: [ 'tests/* '],
  rules: {
    'react/no-multi-comp': 0,
    'no-unused-expressions': 0,
    'implicit-arrow-linebreak': 1,
    'no-nested-ternary': 1,
    'no-mixed-operators': 1,
    '@typescript-eslint/no-parameter-properties': 1,
    '@typescript-eslint/ban-types': 1,
    'no-shadow': 1,
    'no-prototype-builtins': 1,
    'no-useless-constructor': 1,
    'no-empty-function': 1,
    '@typescript-eslint/member-ordering': 0,
    'lines-between-class-members': 0
  }
}