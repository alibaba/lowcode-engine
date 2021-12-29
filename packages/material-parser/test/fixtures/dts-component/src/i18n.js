/**
 * 组件内置的多语言文案
 */

const bundles = {
  'zh-CN': {
    dataSource: [
      {
        label: '+86',
        value: '86',
        country: '中国',
        rule: /(?=(\d{4})+$)/g,
      },
    ],
  },
  'en-US': {
    dataSource: [
      {
        label: '+86',
        value: '86',
        country: 'china',
        rule: /(?=(\d{4})+$)/g,
      },
    ],
  },
};
export default bundles;
