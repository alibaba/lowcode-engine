const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const fse = require('fs-extra');
// read from lerna
const lernaConfig = JSON.parse(fse.readFileSync('../../lerna.json', 'utf8'));
const { version } = lernaConfig;

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    ['jsx', 'tsx'].forEach((rule) => {
      config.module
      .rule(rule)
      .exclude.clear()
      .add(/node_modules(?!(.+_component_demo|.+build-plugin-component))/)
      .end()
      .use('babel-loader')
      .tap((options) => {
        const { plugins = [] } = options;
        console.log('plugins', plugins);
        return {
          ...options,
          plugins: [
            ...plugins,
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        };
      });
    });

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
