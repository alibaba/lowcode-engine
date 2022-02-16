const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const fse = require('fs-extra');
// read from lerna
const lernaConfig = JSON.parse(fse.readFileSync('../../lerna.json', 'utf8'));
const { version } = lernaConfig;

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.resolve.plugin('tsconfigpaths').use(TsconfigPathsPlugin, [
      {
        configFile: './tsconfig.json',
      },
    ]);
    config
      .plugin('define')
      .use(context.webpack.DefinePlugin, [{
        VERSION_PLACEHOLDER: JSON.stringify(version),
      }]);
    config.plugins.delete('hot');
    config.devServer.hot(false);
    if (context.command === 'start') {
      config.devtool('inline-source-map');
    }
  });
};
