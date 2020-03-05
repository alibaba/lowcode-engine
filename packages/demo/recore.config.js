module.exports = {
  '[start]': {
    writeToDisk: true,
  },
  '[build]': {},
  deep: {
    themeConfig: {},
  },
  externals: {
    '@ali/iceluna-sdk': 'var window.LowCodeRenderer',
    '@recore/obx': 'var window.Recore',
    '@recore/core-obx': 'var window.Recore',
    // '@alifd/next': 'var window.Next',
    'moment': 'var window.moment',
  },
  extraEntry: {
    'simulator-renderer': '../designer/src/builtins/simulator/renderer/index.ts',
  },
  vendors: false,
};
