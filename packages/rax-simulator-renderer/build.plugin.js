module.exports = ({ onGetWebpackConfig }) => {
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
    config.performance.hints(false);
  });
};
