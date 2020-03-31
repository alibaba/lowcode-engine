export default {
  sdkVersion: '1.0.3',
  history: 'hash', // 浏览器路由：brower  哈希路由：hash
  containerId: 'lce-container',
  layout: {
    componentName: 'BasicLayout',
    props: {
      name: '低代码引擎预览 demo',
      logo: {
        src: 'https://img.alicdn.com/tfs/TB1L.1QAeL2gK0jSZFmXXc7iXXa-90-90.png',
        width: 25,
        height: 25,
      },
    },
  },
  theme: {
    package: '@alife/theme-fusion',
    version: '^0.1.0',
  },
  compDependencies: [],
};
