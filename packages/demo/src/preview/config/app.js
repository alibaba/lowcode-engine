export default {
  sdkVersion: '1.0.3',
  historyMode: 'hash', // 浏览器路由：brower  哈希路由：hash
  constainerId: 'app',
  layout: {
    componentName: 'BasicLayout',
    props: {
      name: '低代码引擎预览 demo',
      logo: {
        src: 'https://img.alicdn.com/tfs/TB1kAfWyrY1gK0jSZTEXXXDQVXa-75-33.png',
        width: 40,
        height: 20,
      },
    },
  },
  theme: {
    package: '@alife/theme-fusion',
    version: '^0.1.0',
  },
  compDependencies: [],
};
