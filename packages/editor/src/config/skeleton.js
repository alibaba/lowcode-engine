export default {
  version: '^1.0.2',
  theme: {
    dpl: {
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
        pluginKey: 'topBalloonIcon',
        type: 'BalloonIcon',
        props: {
          align: 'left',
          title: 'balloon',
          icon: 'dengpao',
          balloonProps: {
            triggerType: 'click'
          }
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'divider',
        type: 'Divider',
        props: {
          align: 'left'
        }
      },
      {
        pluginKey: 'topDialogIcon',
        type: 'DialogIcon',
        props: {
          align: 'left',
          title: 'dialog',
          icon: 'dengpao'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'topLinkIcon',
        type: 'LinkIcon',
        props: {
          align: 'right',
          title: 'link',
          icon: 'dengpao',
          linkProps: {
            href: '//www.taobao.com',
            target: 'blank'
          }
        },
        config: {},
        pluginProps: {}
      },
      {
        pluginKey: 'topIcon',
        type: 'Icon',
        props: {
          align: 'right',
          title: 'icon',
          icon: 'dengpao',
          onClick: function(editor) {
            alert('icon addon invoke, current activeKey: ' + editor.activeKey);
          }
        },
        config: {},
        pluginProps: {}
      }
    ],
    leftArea: [
      {
        pluginKey: 'leftPanelIcon',
        type: 'PanelIcon',
        props: {
          align: 'top',
          title: 'panel',
          icon: 'dengpao'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'leftBalloonIcon',
        type: 'BalloonIcon',
        props: {
          align: 'top',
          title: 'balloon',
          icon: 'dengpao'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'leftDialogIcon',
        type: 'DialogIcon',
        props: {
          align: 'bottom',
          title: 'dialog',
          icon: 'dengpao'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'leftLinkIcon',
        type: 'LinkIcon',
        props: {
          align: 'bottom',
          title: 'link',
          icon: 'dengpao',
          linkProps: {
            href: '//www.taobao.com',
            target: 'blank'
          }
        },
        config: {},
        pluginProps: {}
      },
      {
        pluginKey: 'leftIcon',
        type: 'Icon',
        props: {
          align: 'bottom',
          title: 'icon',
          icon: 'dengpao',
          onClick: function(editor) {
            alert('icon addon invoke, current activeKey: ' + editor.activeKey);
          }
        },
        config: {},
        pluginProps: {}
      }
    ],
    rightArea: [
      {
        pluginKey: 'rightPanel1',
        type: 'Panel',
        props: {
          title: '样式'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'rightPanel2',
        type: 'Panel',
        props: {
          title: '属性',
          icon: 'dengpao'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'rightPanel3',
        type: 'Panel',
        props: {
          title: '事件'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      },
      {
        pluginKey: 'rightPanel4',
        type: 'Panel',
        props: {
          title: '数据'
        },
        config: {
          package: '@ali/iceluna-addon-2',
          version: '^1.0.0'
        },
        pluginProps: {}
      }
    ],
    centerArea: []
  },
  hooks: [],
  shortCuts: []
};
