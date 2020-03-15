import assets from './assets';

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
          onClick(editor) {
            alert(`icon addon invoke, current activeKey: ${editor.activeKey}`);
          }
        },
        config: {},
        pluginProps: {}
      }
    ],
    leftArea: [
      {
        pluginKey: 'componentList',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'zujianku',
          title: '组件库'
        },
        config: {
          package: '@ali/iceluna-addon-component-list',
          version: '^1.0.4'
        },
        pluginProps: {
          disableAppComponent: true
        }
      },
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
        pluginKey: 'leftPanelIcon2',
        type: 'PanelIcon',
        props: {
          align: 'top',
          title: 'panel2',
          icon: 'dengpao',
          panelProps: {
            defaultWidth: 400,
            floatable: true
          }
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
          onClick(editor) {
            alert(`icon addon invoke, current activeKey: ${editor.activeKey}`);
          }
        },
        config: {},
        pluginProps: {}
      }
    ],
    rightArea: [
      {
        pluginKey: 'settings',
        type: 'Panel',
        props: {},
        config: {
          version: '^1.0.0'
        },
        pluginProps: {}
      }
      // {
      //   pluginKey: 'rightPanel1',
      //   type: 'TabPanel',
      //   props: {
      //     title: '样式'
      //   },
      //   config: {
      //     version: '^1.0.0'
      //   },
      //   pluginProps: {}
      // },
      // {
      //   pluginKey: 'rightPanel2',
      //   type: 'TabPanel',
      //   props: {
      //     title: '属性',
      //     icon: 'dengpao'
      //   },
      //   config: {
      //     version: '^1.0.0'
      //   },
      //   pluginProps: {}
      // },
      // {
      //   pluginKey: 'rightPanel3',
      //   type: 'TabPanel',
      //   props: {
      //     title: '事件'
      //   },
      //   config: {
      //     version: '^1.0.0'
      //   },
      //   pluginProps: {}
      // },
      // {
      //   pluginKey: 'rightPanel4',
      //   type: 'TabPanel',
      //   props: {
      //     title: '数据'
      //   },
      //   config: {
      //     version: '^1.0.0'
      //   },
      //   pluginProps: {}
      // }
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
    init: function init(editor) {
      const transformMaterial = componentList => {
        return componentList.map(category => {
          return {
            name: category.title,
            items: category.children.map(comp => {
              return {
                ...comp,
                name: comp.componentName,
                libraryId: 1,
                snippets: comp.snippets.map(snippet => {
                  return {
                    name: snippet.title,
                    screenshort: snippet.screenshort,
                    code: JSON.stringify(snippet.schema)
                  };
                })
              };
            })
          };
        });
      };

      const list = transformMaterial(assets.componentList);
      editor.set({
        componentsMap: assets.components,
        componentMaterial: {
          library: [
            {
              name: 'Fusion组件库',
              id: 1
            }
          ],
          list
        }
      });

      editor.set('dndHelper', {
        handleResourceDragStart: function(ev, tagName, schema) {
          // 物料面板中组件snippet的dragStart回调
          // ev: 原始的domEvent；tagName: 组件的描述文案；schema: snippet的schema
          if (editor.designer) {
            editor.designer.dragon.boost({
              type: 'nodedata',
              data: schema
            }, ev.nativeEvent);
          }
        }
      });
    }
  }
};
