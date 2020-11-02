const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.resolve.plugin('tsconfigpaths').use(TsconfigPathsPlugin, [
      {
        configFile: './tsconfig.json',
      },
    ]);

    config
      // 定义插件名称
      .plugin('MonacoWebpackPlugin')
      // 第一项为具体插件，第二项为插件参数
      .use(
        new MonacoWebpackPlugin({
          languages: ['typescript', 'css', 'json'],
          features: ['!gotoSymbol'],
        }),
        [],
      );

    config.plugins.delete('hot');
    config.devServer.hot(false);
    if (context.command === 'start') {
      config.devtool('inline-source-map');
    }
  });
};
