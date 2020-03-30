export default {
  version: '^1.0.2',
  theme: {
    fusion: {
      package: '@alife/theme-lowcode-light',
      version: '^0.1.0'
    },
    scss: ''
  },
  constants: {
    namespace: 'page'
  },
  utils: [],
  plugins: {
    topArea: [
      {
        pluginKey: 'logo',
        type: 'Custom',
        props: {
          align: 'left',
          width: 100
        },
        config: {
          package: '@ali/lowcode-plugin-sample-logo',
          version: '1.0.0'
        },
        pluginProps: {
          logo: 'https://img.alicdn.com/tfs/TB1hoI9x1H2gK0jSZFEXXcqMpXa-146-40.png',
          href: '/'
        }
      },
      {
        pluginKey: 'undoRedo',
        type: 'Custom',
        props: {
          align: 'right',
          width: 88
        },
        config: {
          package: '@ali/lowcode-plugin-undo-redo',
          version: '1.0.0'
        }
      },
      {
        pluginKey: 'divider',
        type: 'Divider',
        props: {
          align: 'right'
        }
      },
      {
        pluginKey: 'samplePreview',
        type: 'Custom',
        props: {
          align: 'right',
          width: 64
        },
        config: {
          package: '@ali/lowcode-plugin-sample-preview',
          version: '1.0.0'
        }
      }
    ],
    leftArea: [
      {
        pluginKey: 'componentsPane',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'zujianku',
          title: '组件库'
        },
        config: {
          package: '@ali/iceluna-plugin-components-pane',
          version: '0.0.1'
        },
        pluginProps: {
          disableAppComponent: true
        }
      },
      {
        pluginKey: 'outlinePane',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'dengpao',
          title: '大纲树'
        },
        config: {
          package: '@ali/lowcode-plugin-outline-pane',
          version: '^1.0.0'
        },
        pluginProps: {}
      }
    ],
    rightArea: [
      {
        pluginKey: 'settingsPane',
        type: 'Panel',
        props: {},
        config: {
          package: '@ali/lowcode-plugin-settings-pane',
          version: '^1.0.0'
        },
        pluginProps: {}
      }
    ],
    centerArea: [
      {
        pluginKey: 'designer',
        config: {
          package: '@ali/lowcode-plugin-designer',
          version: '1.0.0'
        }
      },
      {
        pluginKey: 'eventBindDialog',
        config: {
          package: '@ali/lowcode-plugin-event-bind-dialog',
          version: '1.0.0'
        }
      }
    ]
  },
  hooks: [],
  shortCuts: [],
  lifeCycles: {
    init: async function init(editor) {
      const assets = await editor.utils.get('./assets.json');
      editor.set('assets', assets);
      editor.emit('assets.loaded', assets);

      const schema = await editor.utils.get('./schema.json');
      editor.set('schema', schema);
      editor.emit('schema.loaded', schema);
    }
  }
};
