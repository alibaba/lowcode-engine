import { IProjectSchema } from '../types';

const demoData: IProjectSchema = {
  version: '1.0.0',
  componentsMap: [
    {
      componentName: 'Button',
      package: '@alifd/next',
      version: '1.19.18',
      destructuring: true,
      exportName: 'Button',
    },
    {
      componentName: 'Button.Group',
      package: '@alifd/next',
      version: '1.19.18',
      destructuring: true,
      exportName: 'Button',
      subName: 'Group',
    },
    {
      componentName: 'Input',
      package: '@alifd/next',
      version: '1.19.18',
      destructuring: true,
      exportName: 'Input',
    },
    {
      componentName: 'Form',
      package: '@alifd/next',
      version: '1.19.18',
      destructuring: true,
      exportName: 'Form',
    },
    {
      componentName: 'Form.Item',
      package: '@alifd/next',
      version: '1.19.18',
      destructuring: true,
      exportName: 'Form',
      subName: 'Item',
    },
    {
      componentName: 'NumberPicker',
      package: '@alifd/next',
      version: '1.19.18',
      destructuring: true,
      exportName: 'NumberPicker',
    },
    {
      componentName: 'Select',
      package: '@alifd/next',
      version: '1.19.18',
      destructuring: true,
      exportName: 'Select',
    },
  ],
  componentsTree: [
    {
      componentName: 'Page',
      id: 'node_1',
      meta: {
        title: '测试',
        router: '/',
      },
      props: {
        ref: 'outterView',
        autoLoading: true,
      },
      fileName: 'test',
      state: {
        text: 'outter',
      },
      children: [
        {
          componentName: 'Form',
          id: 'node_2',
          props: {
            labelCol: 4,
            style: {},
            ref: 'testForm',
          },
          children: [
            {
              componentName: 'Form.Item',
              id: 'node_3',
              props: {
                label: '姓名：',
                name: 'name',
                initValue: '李雷',
              },
              children: [
                {
                  componentName: 'Input',
                  id: 'node_4',
                  props: {
                    placeholder: '请输入',
                    size: 'medium',
                    style: {
                      width: 320,
                    },
                  },
                },
              ],
            },
            {
              componentName: 'Form.Item',
              id: 'node_5',
              props: {
                label: '年龄：',
                name: 'age',
                initValue: '22',
              },
              children: [
                {
                  componentName: 'NumberPicker',
                  id: 'node_6',
                  props: {
                    size: 'medium',
                    type: 'normal',
                  },
                },
              ],
            },
            {
              componentName: 'Form.Item',
              id: 'node_7',
              props: {
                label: '职业：',
                name: 'profession',
              },
              children: [
                {
                  componentName: 'Select',
                  id: 'node_8',
                  props: {
                    dataSource: [
                      {
                        label: '教师',
                        value: 't',
                      },
                      {
                        label: '医生',
                        value: 'd',
                      },
                      {
                        label: '歌手',
                        value: 's',
                      },
                    ],
                  },
                },
              ],
            },
            {
              componentName: 'Div',
              id: 'node_9',
              props: {
                style: {
                  textAlign: 'center',
                },
              },
              children: [
                {
                  componentName: 'Button.Group',
                  id: 'node_a',
                  props: {},
                  children: [
                    {
                      componentName: 'Button',
                      id: 'node_b',
                      props: {
                        type: 'primary',
                        style: {
                          margin: '0 5px 0 5px',
                        },
                        htmlType: 'submit',
                      },
                      children: ['提交'],
                    },
                    {
                      componentName: 'Button',
                      id: 'node_d',
                      props: {
                        type: 'normal',
                        style: {
                          margin: '0 5px 0 5px',
                        },
                        htmlType: 'reset',
                      },
                      children: ['重置'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
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
        logo: '...',
        name: '测试网站',
      },
    },
    theme: {
      package: '@alife/theme-fusion',
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
  },
};

export default demoData;
