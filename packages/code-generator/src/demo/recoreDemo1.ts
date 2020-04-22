import { IProjectSchema } from '../types';

const demoData: IProjectSchema = {
  version: '1.0.0',
  componentsMap: [
    {
      componentName: 'Button',
      'package': 'alife/next',
      version: '1.0.0',
      destructuring: true,
      exportName: 'Select',
      subName: 'Button',
    },
  ],
  componentsTree: [{
    componentName: 'Page',
    id: 'node$1',
    props: {
      ref: 'outterView',
      autoLoading: true,
      style: {
        padding: 20,
      },
    },
    fileName: 'test',
    dataSource: {
      list: [],
    },
    state: {
      text: 'outter',
    },
    children: [
      {
        componentName: 'Button',
        id: 'node$l',
        props: {},
      },
      {
        componentName: 'Button',
        id: 'node$n',
        props: {
          type: 'secondary',
          baseIcon: 'set',
        },
      },
      {
        componentName: 'Calendar',
        id: 'node$p',
        props: {
          shape: 'card',
        },
      },
    ],
  }],
  utils: [
    {
      name: 'clone',
      type: 'npm',
      content: {
        'package': 'lodash',
        version: '0.0.1',
        exportName: 'clone',
        subName: '',
        destructuring: false,
        main: '/lib/clone',
      },
    },
    {
      name: 'beforeRequestHandler',
      type: 'function',
      content: {
        type: 'JSExpression',
        value: 'function(){\n ... \n}',
      },
    },
  ],
  constants: {
    ENV: 'prod',
    DOMAIN: 'xxx.alibaba-inc.com',
  },
  css: 'body {font-size: 12px;} .table { width: 100px;}',
  config: {
    sdkVersion: '1.0.3',
    historyMode: 'hash',
    targetRootID: 'J_Container',
    layout: {
      componentName: 'BasicLayout',
      props: {
        navConfig: {
          showLanguageChange: true,
          data: [
            {
              hidden: false,
              navUuid: 'FORM-CP5669B1-3AW9DCLHZAY8EIY6WE6X1-GFZM3V1K-6',
              children: [],
              icon: '',
              targetNew: false,
              title: '测试基础表格',
              inner: true,
              relateUuid: 'FORM-CP5669B1-3AW9DCLHZAY8EIY6WE6X1-GFZM3V1K-6',
              slug: 'qihfg',
            },
            {
              hidden: false,
              navUuid: 'FORM-CP5669B1-8AW9XCUT4PCH15SMDWUM3-ZPQP3V1K-1',
              children: [],
              icon: '',
              targetNew: false,
              title: '测试查询表格',
              inner: true,
              relateUuid: 'zqhej',
              slug: 'zqhej',
            },
          ],
          systemLink: '/my_dev_center_code/0.1.0',
          appName: '乐高转码测试',
          isFoldHorizontal: 'n',
          showAppTitle: true,
          isFold: 'n',
          searchBarType: 'icon',
          singletons: {},
          navTheme: 'default',
          type: 'top_side_fold',
          navStyle: 'orange',
          layout: 'auto',
          bgColor: 'white',
          languageChangeUrl: '/common/account/changeAccountLanguage.json',
          showSearch: 'n',
          openSubMode: false,
          showCrumb: true,
          isFixed: 'y',
          showIcon: false,
          showNav: true,
        },
      },
    },
    theme: {
      'package': '@alife/theme-fusion',
      version: '^0.1.0',
      primary: '#ff9966',
    },
  },
  meta: {
    name: 'demo应用',
    git_group: 'appGroup',
    project_name: 'app_demo',
    description: '这是一个测试应用',
    spma: 'spa23d',
    creator: '月飞',
    gmt_create: '2020-02-11 00:00:00',
    gmt_modified: '2020-02-11 00:00:00',
  },
  i18n: {
    'zh-CN': {
      'i18n-jwg27yo4': '你好',
      'i18n-jwg27yo3': '中国',
    },
    'en-US': {
      'i18n-jwg27yo4': 'Hello',
      'i18n-jwg27yo3': 'China',
    },
  },
};

export default demoData;
