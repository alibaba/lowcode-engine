export default {
  version: '^1.0.2',
  theme: {
    fusion: {
      package: '@alife/dpl-iceluna',
      version: '^2.3.0'
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
          package: '@ali/lowcode-plugin-logo',
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
        pluginKey: 'save',
        type: 'Custom',
        props: {
          align: 'right',
          width: 64
        },
        config: {
          package: '@ali/lowcode-plugin-save',
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
      }
    ],
    rightArea: [
      {
        pluginKey: 'settings',
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
      }
    ]
  },
  hooks: [],
  shortCuts: [],
  lifeCycles: {
    init: async function init(editor) {
      const assets = await editor.utils.get('/assets.json');
      editor.set({
        assets,
        componentsMap: assets.components
      });

      editor.utils.get('/schema.json').then(res => {
        editor.emit('schema.reset', res);
      });
    }
  }
};
