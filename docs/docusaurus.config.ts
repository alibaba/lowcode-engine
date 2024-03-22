import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import navbar from './config/navbar';

const config: Config = {
  title: 'Low-Code Engine',
  tagline: 'Low-Code Engine is awesome!',
  url: 'https://lowcode-engine.cn',
  baseUrl: '/site/',
  favicon:
    'https://img.alicdn.com/imgextra/i2/O1CN01TNJDDg20pKniPOkN4_!!6000000006898-2-tps-66-78.png',

  organizationName: 'alibaba', // Usually your GitHub org/user name.
  projectName: 'lowcode-engine', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './config/sidebars.ts',
          editUrl: 'https://github.com/alibaba/lowcode-engine/tree/develop/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: './config/sidebarsCommunity.ts',
      },
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar,
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} 阿里巴巴集团, Inc. Built with Docusaurus.`,
    },
    // 主题切换
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // 语雀文档导出的图片，会进行 referrer 校验，这里设置关闭，不然加载不了语雀的图片
    metadata: [{ name: 'referrer', content: 'no-referrer' }],
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 6,
    },
  } satisfies Preset.ThemeConfig,

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
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
