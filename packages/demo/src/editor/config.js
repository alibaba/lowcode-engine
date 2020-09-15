import { DataSourceImportPluginCode } from '@ali/lowcode-plugin-datasource-pane';

export default {
  plugins: {
    topArea: [
      {
        pluginKey: 'logo',
        type: 'Custom',
        props: {
          align: 'left',
          width: 100,
        },
        pluginProps: {
          logo: 'https://img.alicdn.com/tfs/TB1_SocGkT2gK0jSZFkXXcIQFXa-66-66.png',
          href: '/',
        },
      },
      {
        pluginKey: 'undoRedo',
        type: 'Custom',
        props: {
          align: 'right',
          width: 88,
        },
      },
      /*
      {
        pluginKey: 'divider',
        type: 'Divider',
        props: {
          align: 'right',
        },
      }, */
      {
        pluginKey: 'samplePreview',
        type: 'Custom',
        props: {
          align: 'right',
          width: 64,
        },
      },
      {
        pluginKey: 'codeout',
        type: 'Custom',
        props: {
          align: 'right',
          width: 64,
        },
      },
      {
        pluginKey: 'saveload',
        type: 'Custom',
        props: {
          align: 'right',
          width: 128,
        },
      },
    ],
    leftArea: [
      {
        pluginKey: 'outline',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'shuxingkongjian',
          description: '大纲树',
          panelProps: {
            area: 'leftFixedArea',
          },
        },
        pluginProps: {},
      },
      {
        pluginKey: 'componentsPane',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'zujianku',
          description: '组件库',
        },
        pluginProps: {},
      },
      {
        pluginKey: 'sourceEditor',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'wenjian',
          description: 'JS面板',
          panelProps: {
            floatable: true,
            height: 300,
            help: undefined,
            hideTitleBar: false,
            maxHeight: 800,
            maxWidth: 1200,
            title: 'JS面板',
            width: 600,
          },
        },
      },
      {
        pluginKey: 'dataSourcePane',
        pluginProps: {
          importPlugins: [
            {
              name: 'code2',
              title: '源码2',
              content: DataSourceImportPluginCode,
            },
          ],
          dataSourceTypes: [
            {
              type: 'mopen',
              schema: {
                type: 'object',
                properties: {
                  options: {
                    type: 'object',
                    properties: {
                      uri: {
                        title: 'api',
                      },
                      v: {
                        title: 'v',
                        type: 'string',
                      },
                      appKey: {
                        title: 'appKey',
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'wenjian',
          description: '数据源面板',
          panelProps: {
            floatable: true,
            height: 300,
            help: undefined,
            hideTitleBar: false,
            maxHeight: 800,
            maxWidth: 1200,
            title: '数据源面板',
            width: 600,
          },
        },
      },
      {
        pluginKey: 'zhEn',
        type: 'Custom',
        props: {
          align: 'bottom',
        },
        pluginProps: {},
      },
    ],
    centerArea: [
      {
        pluginKey: 'eventBindDialog',
      },
      {
        pluginKey: 'variableBindDialog',
      },
    ],
  },
  shortCuts: [],
  lifeCycles: {
    init: async function init(editor) {
      const assets = await editor.utils.get('./assets.json');
      editor.set('assets', assets);
      const simulatorUrl = [
        'https://dev.g.alicdn.com/ali-lowcode/ali-lowcode-engine/0.9.50/react-simulator-renderer.css',
        'https://dev.g.alicdn.com/ali-lowcode/ali-lowcode-engine/0.9.50/react-simulator-renderer.js',
      ];
      editor.set('simulatorUrl', simulatorUrl);
      // editor.set('renderEnv', 'rax');

      const schema = await editor.utils.get('./schema.json');
      editor.set('schema', schema);
    },
  },
};
