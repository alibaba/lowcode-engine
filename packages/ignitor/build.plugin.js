const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.resolve.plugin('tsconfigpaths').use(TsconfigPathsPlugin, [
      {
        configFile: './tsconfig.json',
      },
    ]);
    config.plugins.delete('hot');
    config.devServer.hot(false);
    if (context.command === 'start') {
      config.devtool('inline-source-map');
    }
  });
};
