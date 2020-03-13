const path = require('path');

module.exports = {
  entry: {
    'index': 'src/index.tsx',
    'simulator-renderer': '../designer/src/builtins/simulator/renderer/index.ts'
  },
  "vendor": false,
  publicPath: './',
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@alife/theme-lowcode-dark',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  externals: {
    'react': 'var window.React',
    'react-dom': 'var window.ReactDOM',
    'prop-types': 'var window.PropTypes',
    // '@recore/obx': 'var window.Recore',
    // '@recore/obx-react': 'var window.Recore',
    '@ali/lowcode-renderer': 'var window.LowCodeRenderer',
    '@alifd/next': 'var window.Next',
    'moment': 'var window.moment',
  },
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

