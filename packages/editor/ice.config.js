const path = require('path');

module.exports = {
  entry: 'src/index.tsx',
  publicPath: './',
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  chainWebpack: (config) => {
    // 修改对应 css module的 loader，默认修改 scss-module 同理可以修改 css-module 和 less-module 规则
    ['scss-module'].forEach((rule) => {
      if (config.module.rules.get(rule)) {
        config.module.rule(rule).use('ts-css-module-loader')
          .loader(require.resolve('css-modules-typescript-loader'))
          .options({ modules: true, sass: true });
        // 指定应用loader的位置
        config.module.rule(rule).use('ts-css-module-loader').before('css-loader');
      }
    });
  },
};

