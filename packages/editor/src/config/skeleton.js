export default {
  "skeleton": {
    "config": {
     "package": "@ali/lowcode-skeleton",
     "version": "0.0.1" 
    },
  },
  "theme": {
    "fusion": {
      "package": "@alife/dpl-iceluna",
      "version": "^2.3.0"
    },
    "scss": ""
  },
  "constants": {
    "namespace": "page"
  },
  "utils": [],
  "plugins": {
    "topArea": [{
      "pluginKey": "logo",
      "type": "Custom",
      "props": {
        "width": 110,
        "align": "left"
      },
      "config": {
        "package": "@ali/iceluna-addon-logo",
        "version": "^1.0.2"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "divider",
      "type": "Divider",
      "props": {
        "align": "left"
      }
    }, {
      "pluginKey": "pageList",
      "type": "Custom",
      "props": {
        "align": "left",
        "width": 360
      },
      "config": {
        "package": "@ali/iceluna-addon-page-list",
        "version": "^1.0.11"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "partner",
      "type": "Custom",
      "props": {
        "align": "right",
        "width": 200
      },
      "config": {
        "package": "@ali/iceluna-addon-partner",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "divider",
      "type": "Divider",
      "props": {
        "align": "right"
      }
    }, {
      "pluginKey": "designMode",
      "type": "Custom",
      "props": {
        "align": "right",
        "width": 144
      },
      "config": {
        "package": "@ali/iceluna-addon-design-mode",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "divider",
      "type": "Divider",
      "props": {
        "align": "right"
      }
    }, {
      "pluginKey": "undoRedo",
      "type": "Custom",
      "props": {
        "align": "right",
        "width": 88
      },
      "config": {
        "package": "@ali/iceluna-addon-undo-redo",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "d2c",
      "type": "Custom",
      "props": {
        "align": "right",
        "width": 44
      },
      "config": {
        "package": "@ali/iceluna-addon-d2c",
        "version": "^1.0.1"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "history",
      "type": "DialogIcon",
      "props": {
        "align": "right",
        "icon": "lishijilu1",
        "title": "历史",
        "dialogProps": {
          "title": "历史记录",
          "footer": false,
          "shouldUpdatePosition": true
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-history",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "refresh",
      "type": "Icon",
      "props": {
        "align": "right",
        "icon": "shuaxin",
        "title": "刷新",
        "onClick": function(appHelper) {
          appHelper.emit('ide.reset');
        }
      }
    }, {
      "pluginKey": "divider",
      "type": "Divider",
      "props": {
        "align": "right"
      }
    }, {
      "pluginKey": "save",
      "type": "Custom",
      "props": {
        "align": "right",
        "width": 86
      },
      "config": {
        "package": "@ali/iceluna-addon-save",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "preview",
      "type": "Custom",
      "props": {
        "align": "right",
        "width": 86
      },
      "config": {
        "package": "@ali/iceluna-addon-preview",
        "version": "^1.0.1"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "publish",
      "type": "Custom",
      "props": {
        "align": "right",
        "width": 104
      },
      "config": {
        "package": "@ali/iceluna-addon-publish",
        "version": "^1.0.1"
      },
      "pluginProps": {}
    }],
    "leftArea": [{
      "pluginKey": "componentTree",
      "type": "PanelIcon",
      "props": {
        "align": "top",
        "icon": "shuxingkongjian",
        "title": "组件树",
        "panelProps": {
          "minWidth": 100,
          "maxWidth": 500
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-component-tree",
        "version": "^1.0.5"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "componentList",
      "type": "PanelIcon",
      "props": {
        "align": "top",
        "icon": "zujianku",
        "title": "组件库"
      },
      "config": {
        "package": "@ali/iceluna-addon-component-list",
        "version": "^1.0.4"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "blockList",
      "type": "PanelIcon",
      "props": {
        "align": "top",
        "icon": "jihe",
        "title": "区块库"
      },
      "config": {
        "package": "@ali/iceluna-addon-block-list",
        "version": "^1.0.2"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "schema",
      "type": "PanelIcon",
      "props": {
        "align": "bottom",
        "icon": "ceshi",
        "title": "schema 源码开发",
        "panelProps": {
          "defaultWidth": 480
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-schema",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "style",
      "type": "PanelIcon",
      "props": {
        "align": "bottom",
        "icon": "SCSS",
        "title": "scss 全局样式设置",
        "panelProps": {
          "defaultWidth": 480
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-style",
        "version": "^1.0.2"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "utils",
      "type": "PanelIcon",
      "props": {
        "align": "bottom",
        "icon": "funcsgaiban",
        "title": "utils 全局公共函数设置",
        "panelProps": {
          "defaultWidth": 540
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-utils",
        "version": "^1.0.7"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "constants",
      "type": "PanelIcon",
      "props": {
        "align": "bottom",
        "icon": "constgaiban",
        "title": "constants 全局常量设置",
        "panelProps": {
          "defaultWidth": 480
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-constants",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "package",
      "type": "PanelIcon",
      "props": {
        "align": "bottom",
        "icon": "packagegaiban",
        "title": "package.json 应用设置",
        "panelProps": {
          "defaultWidth": 480
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-package",
        "version": "^1.0.2"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "canvasSetting",
      "type": "PanelIcon",
      "props": {
        "align": "bottom",
        "icon": "huabushezhi",
        "title": "canvas 画布配置",
        "panelProps": {
          "defaultWidth": 300
        }
      },
      "config": {
        "package": "@ali/iceluna-addon-canvas-setting",
        "version": "^1.0.2"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "issue",
      "type": "LinkIcon",
      "props": {
        "align": "bottom",
        "icon": "chongzi",
        "title": "issue 问题反馈",
        "linkProps": {
          "href": "//work.aone.alibaba-inc.com/project/860698/issue/new",
          "target": "blank"
        }
      }
    }, {
      "pluginKey": "document",
      "type": "LinkIcon",
      "props": {
        "align": "bottom",
        "icon": "wendangzhongxin",
        "title": "docs 文档中心",
        "linkProps": {
          "href": "https://iceluna.alibaba-inc.com/#/document",
          "target": "blank"
        }
      }
    }],
    "rightArea": [{
      "pluginKey": "componentStyle",
      "props": {
        "title": "样式"
      },
      "config": {
        "package": "@ali/iceluna-addon-component-style",
        "version": "^1.0.8"
      }
    }, {
      "pluginKey": "componentAttr",
      "props": {
        "title": "属性"
      },
      "config": {
        "package": "@ali/iceluna-addon-component-attr",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "componentEvent",
      "props": {
        "title": "事件"
      },
      "config": {
        "package": "@ali/iceluna-addon-component-event",
        "version": "^1.0.4"
      },
      "pluginProps": {}
    }, {
      "pluginKey": "componentData",
      "props": {
        "title": "数据"
      },
      "config": {
        "package": "@ali/iceluna-addon-component-data",
        "version": "^1.0.3"
      },
      "pluginProps": {}
    }],
    "centerArea": [{
      "pluginKey": "canvas",
      "config": {
        "package": "@ali/iceluna-addon-canvas",
        "version": "^1.0.8"
      }
    }, {
      "pluginKey": "guide",
      "config": {
        "package": "@ali/iceluna-addon-guide",
        "version": "^1.0.1"
      }
    }]
  },
  "hooks": [{
    "message": "wsHelper.result.updateInfo",
    "type": "on",
    "handler": function(appHelper, data) {
      const pageInfo = appHelper.pageInfo;
      if (data && data.code > 0 && pageInfo) {
        const {
          clientLocks,
          entityLocks,
          entityUsers,
          entityPubInfo
        } = data.data;
        if (JSON.stringify(clientLocks || {}) !== JSON.stringify(appHelper.clientLocks || {})) {
          clientLocks.schema = clientLocks[pageInfo.id];
          appHelper.set('clientLocks', clientLocks);
          appHelper.emit('wsHelper.update.clientLocks', clientLocks);
        }
        if (JSON.stringify(entityLocks || {}) !== JSON.stringify(appHelper.entityLocks || {})) {
          entityLocks.schema = entityLocks[pageInfo.id];
          appHelper.set('entityLocks', entityLocks);
          appHelper.emit('wsHelper.update.entityLocks', entityLocks);
        }
        if (JSON.stringify(entityUsers || {}) !== JSON.stringify(appHelper.entityUsers || {})) {
          appHelper.set('entityUsers', entityUsers);
          appHelper.emit('wsHelper.update.entityUsers', entityUsers);
        }
        if (JSON.stringify(entityPubInfo || {}) !== JSON.stringify(appHelper.entityPubInfo || {})) {
          appHelper.set('entityPubInfo', entityPubInfo);
          appHelper.emit('wsHelper.update.entityPubInfo', entityPubInfo);
        }
      }
    }
  }],
  "shortCuts": [],
  "lifeCycles": {}
};