const babelJest = require('babel-jest');
const getBabelConfig = require('build-scripts-config/lib/config/babel/index.js');
const formatWinPath = require('build-scripts-config/lib/config/jest/formatWinPath');
const babelConfig = getBabelConfig();

babelConfig.plugins.push(['@babel/plugin-proposal-class-properties', { loose: true }]);

const jestBabelConfig = {
  ...babelConfig,
  presets: babelConfig.presets.map((preset) => {
    if (Array.isArray(preset) && formatWinPath(preset[0]).indexOf('@babel/preset-env') > -1) {
      return [preset[0], {
        targets: {
          node: 'current',
        },
      }];
    }
    return preset;
  }),
};

module.exports = babelJest.createTransformer(jestBabelConfig);