/**
 * 此配置的修改，如未生效，可以重新启动下即可
 */
module.exports = {
  title: '',
  logo: {
    alt: 'LowCode-Engine',
    src: 'https://img.alicdn.com/imgextra/i2/O1CN01uv6vu822RBCSYLro2_!!6000000007116-55-tps-139-26.svg',
    srcDark: 'https://tianshu.alicdn.com/052a190e-c961-4afe-aa4c-49ee9722952d.svg',
  },
  items: [
    {
      type: 'doc',
      docId: 'guide/quickStart/intro',
      position: 'left',
      label: '文档',
    },
    {
      type: 'doc',
      docId: 'api/index',
      position: 'left',
      label: 'API',
    },
    {
      type: 'doc',
      docId: 'faq/index',
      position: 'left',
      label: 'FAQ',
    },
    {
      type: 'doc',
      docId: 'participate/index',
      position: 'left',
      label: '参与贡献',
    },
    {
      type: 'doc',
      docId: 'article/index',
      position: 'left',
      label: '文章',
    },
    {
      type: 'doc',
      docId: 'demoUsage/intro',
      position: 'left',
      label: 'Demo 使用文档',
    },
    {
      position: 'left',
      href: 'https://developer.aliyun.com/ebook/7507',
      label: '技术白皮书',
    },
    {
      position: 'left',
      href: 'https://github.com/alibaba/lowcode-engine/releases',
      label: '更新日志',
    },
    {
      to: '/community/issue',
      position: 'left',
      label: '社区',
      activeBaseRegex: '/community/',
    },
    // 版本切换，如需，这里开启即可
    // {
    //   type: 'docsVersionDropdown',
    //   position: 'right',
    //   dropdownActiveClassDisabled: true,
    // },
    // {
    {
      href: 'https://github.com/alibaba/lowcode-engine',
      position: 'right',
      className: 'header-github-link',
      'aria-label': 'GitHub repository',
    },
    {
      type: 'search',
      position: 'right',
    },
  ],
};
