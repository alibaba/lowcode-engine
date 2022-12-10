/* eslint-disable @typescript-eslint/no-require-imports */
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const navbar = require('./config/navbar');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Low-Code Engine',
  tagline: 'Low-Code Engine is awesome!',
  url: 'https://lowcode-engine.cn',
  baseUrl: '/site/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon:
    'https://img.alicdn.com/imgextra/i2/O1CN01TNJDDg20pKniPOkN4_!!6000000006898-2-tps-66-78.png',

  organizationName: 'alibaba', // Usually your GitHub org/user name.
  projectName: 'lowcode-engine', // Usually your repo name.

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: require.resolve('./config/sidebarsCommunity.js'),
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./config/sidebars.js'),
          // lastVersion: 'current',
          editUrl:
            'https://github.com/alibaba/lowcode-engine/tree/develop/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar,
      footer: {
        // style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} 阿里巴巴集团, Inc. Built with Docusaurus.`,
      },
      // 主题切换
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      // 语雀文档导出的图片，会进行 referrer 校验，这里设置关闭，不然加载不了语雀的图片
      metadata: [{ name: 'referrer', content: 'no-referrer' }],
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
    }),

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        language: ['en', 'zh'],
        // ```
      },
    ],
  ],
};

module.exports = config;
