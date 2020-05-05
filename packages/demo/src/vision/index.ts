/* eslint-disable */
import { createElement } from 'react';
import { Button } from '@alifd/next';
import Engine, { Panes, Prototype } from '@ali/visualengine';
import { ActionUtil as actionUtil } from '@ali/visualengine-utils';
import getTrunkPane from '@ali/ve-trunk-pane';
import DatapoolPane from '@ali/ve-datapool-pane';
import PageHistoryManager from '@ali/ve-page-history';
import HistoryPane from '@ali/ve-history-pane';
import PageHistoryPane from '@ali/ve-page-history-pane';
// import I18nPane from '@ali/ve-i18n-pane';
import I18nManagePane from '@ali/ve-i18n-manage-pane';
import ActionPane from '@ali/ve-action-pane';
import fetchContext from '@ali/vu-legao-design-fetch-context';
import EventBindDialog from '@ali/lowcode-plugin-event-bind-dialog';
import loadUrls from './loader';
import { upgradeAssetsBundle } from './upgrade-assets';
import { isCSSUrl } from '@ali/lowcode-utils';
import { I18nSetter } from '@ali/visualengine-utils';
import VariableSetter from '@ali/vs-variable-setter';
import _isArray from "lodash/isArray";
import _isObject from "lodash/isObject";
import _get from 'lodash/get';
import funcParser from '@ali/vu-function-parser';
import cv from 'compare-versions';


const { editor, skeleton, context, HOOKS, Trunk } = Engine;

Trunk.registerSetter('I18nSetter', {
  component: I18nSetter,
  // todo: add icon
  title: {
    type: 'i18n',
    'zh-CN': '国际化输入',
    'en-US': 'International Input'
  },
  recommend: true,
});
context.use(HOOKS.VE_SETTING_FIELD_VARIABLE_SETTER, VariableSetter);

const externals = ['react', 'react-dom', 'prop-types', 'react-router', 'react-router-dom', '@ali/recore'];

async function loadAssets() {
  const legaoAssets = await editor.utils.get('./legao-assets.json');

  const assets = upgradeAssetsBundle(legaoAssets);

  if (assets.packages) {
    assets.packages.forEach((item: any) => {
      if (item.package && externals.indexOf(item.package) > -1) {
        item.urls = null;
      }
    });
  }

  if (assets['x-prototypes']) {
    const tasks: Array<Promise<any>> = [];
    const prototypeStyles: string[] = [];
    assets['x-prototypes'].forEach((pkg: any) => {
      if (pkg?.urls) {
        const urls = Array.isArray(pkg.urls) ? pkg.urls : [pkg.urls];
        urls.forEach((url: string) => {
          if (isCSSUrl(url)) {
            prototypeStyles.push(url);
          }
        });
        tasks.push(loadUrls(urls));
      }
    });
    if (prototypeStyles.length > 0) {
      assets.packages.push({
        library: '_prototypesStyle',
        package: '_prototypes-style',
        urls: prototypeStyles,
      });
    }
    await Promise.all(tasks);
    // proccess snippets
  }

  editor.set('legao-assets', legaoAssets);
  editor.set('assets', assets);
}

async function loadSchema() {
  const schema = await editor.utils.get('./schema.json');
  editor.set('schema', schema);
}

// demo
function initDemoPanes() {
  skeleton.add({
    name: 'eventBindDialog',
    type: 'Widget',
    content: EventBindDialog,
  });
  skeleton.add({
    area: 'leftArea',
    name: 'icon1',
    type: 'Dock',
    props: {
      align: 'bottom',
      icon: 'set',
      description: '设置',
      // onClick:()=>{
      //   Engine.Pages.currentPage.root.select();
      // }
    },
  });
  skeleton.add({
    area: 'leftArea',
    name: 'icon2',
    type: 'Dock',
    props: {
      align: 'bottom',
      icon: 'help',
      description: '帮助',
      onClick:()=>{
        const linkConfig = getDesignerModuleConfigs({}, 'helpLink');
        const reVersion = getConfig('RE_VERSION');
        let defaultLink = 'https://go.alibaba-inc.com/help/';
        if (cv(reVersion, '7.0.0') >= 0) {
          defaultLink = 'https://go.alibaba-inc.com/help3/';
        }
        window.open(linkConfig.url ? linkConfig.url : defaultLink, '_blank');
      }
    },
  });

  skeleton.add({
    area: 'topArea',
    type: 'Dock',
    name: 'publish',
    props: {
      align: 'right',
    },
    content: createElement(Button, {
      size: 'small',
      type: 'secondary',
      children: '发布',
    }),
  });
  skeleton.add({
    area: 'topArea',
    type: 'Dock',
    name: 'save',
    props: {
      align: 'right',
    },
    content: createElement(Button, {
      size: 'small',
      type: 'primary',
      children: '保存',
    }),
  });
  // skeleton.add({
  //   area: 'topArea',
  //   type: 'Dock',
  //   name: 'preview4',
  //   props: {
  //     align: 'center',
  //   },
  //   content: createElement('img', {
  //     src: 'https://img.alicdn.com/tfs/TB1WW.VC.z1gK0jSZLeXXb9kVXa-486-64.png',
  //     style: {
  //       height: 32,
  //     },
  //   }),
  // });
  skeleton.add({
    area: 'topArea',
    type: 'Dock',
    name: 'preview1',
    props: {
      align: 'left',
    },
    content: createElement('img', {
      src: 'https://img.alicdn.com/tfs/TB1zqBfDlr0gK0jSZFnXXbRRXXa-440-64.png',
      style: {
        height: 32,
      },
    }),
  });
}

async function initTrunkPane() {
  const assets = await editor.onceGot('legao-assets');
  const config = {
    disableLowCodeComponent: true,
    disableComponentStore: true,
    app: {
      getAssetsData() {
        return assets;
        // return data;
      },
    },
  };
  const TrunkPane = getTrunkPane(config);
  Panes.add(TrunkPane);
}

// 帮助面板
function getDesignerModuleConfigs(source?:any, moduleName?:any) {
  return _get(source, ['modules', moduleName], {});
}
function getConfig(name: any) {
  const { g_config, pageConfig } = window as any;
  return (
    window[name]
    || (g_config || {})[name]
    || (pageConfig || {})[name]
  );
}
// 数据源面板
function initDataPoolPane() {
  const dpConfigs = {};

  if (!dpConfigs) {
    return;
  }

  fetchContext.create('DataPoolPaneAPI', {
    saveGlobalConfig: {
      url: 'query/appConfig/saveGlobalConfig.json',
      method: 'POST',
    },
    saveOrUpdateAppDataPool: {
      url: 'query/appDataPool/saveOrUpdateAppDataPool.json',
      method: 'POST',
    },
    batchSaveOrUpdateAppDataPool: {
      url: 'query/appDataPool/batchSaveOrUpdateAppDataPool.json',
      method: 'POST'
    },
    listAppDataPool: {
      url: 'query/appDataPool/listAppDataPool.json',
      method: 'GET',
    },
    getAppDataPool: {
      url: 'query/appDataPool/getAppDataPool.json',
      method: 'POST',
    },
    getEpaasApiInApp: {
      url: 'query/formdesign/getEpaasApiInApp.jsonp',
      method: 'GET',
    },
    getFormListOrder: {
      url: 'query/formdesign/getFormListOrder.json',
      method: 'GET',
    },
    // 实时修改 effectForm
    operateAppDpBind: {
      url: 'query/appDataPool/operateAppDpBind.json',
      method: 'POST',
    },
    // 校验全局数据源是否被其他页面修改
    checkAppDataPoolModified: {
      url: 'query/appDataPool/checkAppDataPoolModified.json',
      method: 'POST',
    },
  });

  const props = {
    enableGateService: true,
    enableGlobalFitConfig: true,
    enableOneAPIService: true,
    formUuid: 'xxx',
    api: fetchContext.api.DataPoolPaneAPI,
  };

  Panes.add(DatapoolPane, {
    props,
  });
}

// 国际化面板
function initI18nPane() {
  fetchContext.create('I18nManagePaneAPI', {
    // 绑定美杜莎
    bindMedusa: {
      url: 'query/app/createMedusa.json',
    },

    // 解除绑定
    unbindMedusa: {
      url: 'query/app/removeMedusa.json',
    },

    // 同步美杜莎
    syncMedusa: {
      url: 'query/formi18n/syncI18n.json',
    },
  });

  Panes.add(I18nManagePane, {
    props: {
      enableMedusa: true,
      api: fetchContext.api.I18nManagePaneAPI,
    },
  });
}

// 动作面板
function initActionPane() {
  actionUtil.setActions({
    module: {
      compiled: "'use strict';\n\nexports.__esModule = true;\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nexports.submit = submit;\nexports.onLoadData = onLoadData;\nexports.add = add;\nexports.edit = edit;\nexports.del = del;\nexports.search = search;\nexports.reset = reset;\n/**\n* 点击弹框的“确认”\n*/\nfunction submit() {\n  var _this = this;\n\n  this.$('form').submit(function (data, error) {\n    if (data) {\n      _this.dataSourceMap['table_submit'].load(data).then(function (res) {\n        _this.utils.toast({\n          type: 'success',\n          title: '提交成功'\n        });\n        _this.$('dialog').hide();\n        _this.dataSourceMap['table_list'].load();\n      }).catch(function () {\n        _this.utils.toast({\n          type: 'error',\n          title: '提交失败'\n        });\n      });\n    }\n  });\n}\n\n/**\n* tablePc onLoadData\n* @param currentPage 当前页码\n* @param pageSize 每页显示条数\n* @param searchKey 搜索关键字\n* @param orderColumn 排序列\n* @param orderType 排序方式（desc,asc）\n* @param from 触发来源（order,search,pagination）\n*/\nfunction onLoadData(currentPage, pageSize, searchKey, orderColumn, orderType, from) {\n  var tableParams = {\n    currentPage: from === 'search' ? 1 : currentPage,\n    pageSize: pageSize,\n    searchKey: searchKey,\n    orderColumn: orderColumn,\n    orderType: orderType\n  };\n  this.setState({ tableParams: tableParams });\n}\n\n// 点击新增\nfunction add() {\n  this.setState({\n    formData: null\n  });\n  this.$('dialog').show();\n}\n\n// 点击编辑\nfunction edit(rowData) {\n  this.setState({\n    formData: rowData\n  });\n  this.$('dialog').show();\n}\n\n// 点击删除\nfunction del(rowData) {\n  var _this2 = this;\n\n  this.utils.dialog({\n    method: 'confirm',\n    title: '提示',\n    content: '确认删除该条目吗？',\n    onOk: function onOk() {\n      _this2.dataSourceMap['table_delete'].load({ id: rowData.id }).then(function () {\n        _this2.utils.toast({\n          type: 'success',\n          title: '删除成功'\n        });\n        _this2.dataSourceMap['table_list'].load();\n      }).catch(function () {\n        _this2.utils.toast({\n          type: 'error',\n          title: '删除失败'\n        });\n      });\n    }\n  });\n}\n\n/**\n* button onClick\n*/\nfunction search() {\n  var filterData = this.$('filter').getValue();\n  this.setState({\n    filterData: filterData,\n    tableParams: _extends({}, this.state.tableParams, {\n      time: Date.now(),\n      currentPage: 1\n    })\n  });\n}\n\n/**\n* button onClick\n*/\nfunction reset() {\n  this.$('filter').reset();\n  this.setState({\n    filterData: {},\n    tableParams: _extends({}, this.state.tableParams, {\n      time: Date.now(),\n      currentPage: 1\n    })\n  });\n}",
      source: "/**\n* 点击弹框的“确认”\n*/\nexport function submit() {\n  this.$('form').submit((data, error) => {\n    if (data) {\n      this.dataSourceMap['table_submit'].load(data).then((res) => {\n        this.utils.toast({\n          type: 'success',\n          title: '提交成功'\n        });\n        this.$('dialog').hide();\n        this.dataSourceMap['table_list'].load();\n      }).catch(()=>{\n        this.utils.toast({\n          type: 'error',\n          title: '提交失败'\n        });\n      })\n    }\n  })\n}\n\n/**\n* tablePc onLoadData\n* @param currentPage 当前页码\n* @param pageSize 每页显示条数\n* @param searchKey 搜索关键字\n* @param orderColumn 排序列\n* @param orderType 排序方式（desc,asc）\n* @param from 触发来源（order,search,pagination）\n*/\nexport function onLoadData(currentPage, pageSize, searchKey, orderColumn, orderType, from) {\n  const tableParams = {\n    currentPage: from === 'search' ? 1 : currentPage,\n    pageSize,\n    searchKey,\n    orderColumn,\n    orderType\n  };\n  this.setState({ tableParams });\n}\n\n// 点击新增\nexport function add() {\n  this.setState({\n    formData: null,\n  });\n  this.$('dialog').show();\n}\n\n\n// 点击编辑\nexport function edit(rowData) {\n  this.setState({\n    formData: rowData\n  });\n  this.$('dialog').show();\n}\n\n// 点击删除\nexport function del(rowData) {\n  this.utils.dialog({\n    method: 'confirm',\n    title: '提示',\n    content: '确认删除该条目吗？',\n    onOk: () => {\n      this.dataSourceMap['table_delete'].load({ id: rowData.id }).then(() => {\n        this.utils.toast({\n          type: 'success',\n          title: '删除成功'\n        });\n        this.dataSourceMap['table_list'].load();\n      }).catch(()=>{\n        this.utils.toast({\n          type: 'error',\n          title: '删除失败'\n        });\n      })\n    }\n  })\n}\n\n/**\n* button onClick\n*/\nexport function search(){\n  const filterData = this.$('filter').getValue();\n  this.setState({\n    filterData,\n    tableParams: {\n      ...this.state.tableParams,\n      time: Date.now(),\n      currentPage: 1\n    }\n  });\n}\n\n/**\n* button onClick\n*/\nexport function reset(){\n  this.$('filter').reset();\n  this.setState({\n    filterData: {},\n    tableParams: {\n      ...this.state.tableParams,\n      time: Date.now(),\n      currentPage: 1\n    }\n  });\n}"
    },
    type: "FUNCTION",
    list: [
      {
        "id": "submit",
        "title": "submit"
      },
      {
        "id": "onLoadData",
        "title": "onLoadData"
      },
      {
        "id": "add",
        "title": "add"
      },
      {
        "id": "edit",
        "title": "edit"
      },
      {
        "id": "del",
        "title": "del"
      },
      {
        "id": "search",
        "title": "search"
      },
      {
        "id": "reset",
        "title": "reset"
      }
    ]
  });
  const props = {
    enableGlobalJS: false,
    enableVsCodeEdit: false,
    enableHeaderTip: true,
  };

  Panes.add(ActionPane, {
    props,
  });
}
function replaceFuncProp(props?: any){
  const replaceProps = {};
  for (const name in props) {
    const prop = props[name];
    if (!prop) {
      continue;
    }
    if ((prop.compiled && prop.source) || prop.type === 'actionRef' || prop.type === 'js') {
      replaceProps[name] = funcParser(prop);
    } else if (_isObject(prop)) {
      replaceFuncProp(prop);
    } else if (_isArray(prop)) {
      prop.map((propItem) => {
        replaceFuncProp(propItem);
      });
    }
  }

  for (const name in replaceProps) {
    props[name] = replaceProps[name];
  }
  return props;
};

// 操作历史与页面历史面板
function initHistoryPane() {
  // let historyConfigs = {getDesignerModuleConfigs(
  //   this.designerConfigs,
  //   'history',
  // )};
  let historyConfigs = {
    enableRedoAndUndo: true,
    enablePageHistory: true,
  };;

  const isDemoMode = false;
  const isEnvSupportsHistoryPane = true;
  const historyManager = PageHistoryManager.getManager();

  console.log('PageHistoryManager', historyManager);
  console.log('PageHistoryManager.onOpenPane', historyManager.onOpenPane);
  // 历史撤销、重做以及唤起页面历史按钮
  if (typeof HistoryPane === 'function') {
    Panes.add(HistoryPane, {
      props : {
        showPageHistory:
          isEnvSupportsHistoryPane
          // && this.app.isForm()
          && !isDemoMode,
        historyManager,
        historyConfigs,
        index: -940,
      }
    });
  } else {
    Panes.add(HistoryPane, {
      index: -940,
    });
  }

  // 页面历史 UI 面板
  if (
    PageHistoryPane
    && !isDemoMode
    && isEnvSupportsHistoryPane
  ) {
    Panes.add(PageHistoryPane, {
      props : {
        historyManager: {
          historyManager,
          app: {

          }
        },
        index: -940,
      },
    });
  }
}


async function init() {
  Engine.Env.setEnv('RE_VERSION', '7.2.0');
  Engine.Env.setSupportFeatures({
    subview: true,
    i18nPane: true,
  });
  Prototype.addGlobalPropsReducer(replaceFuncProp);
  await loadAssets();
  await loadSchema();
  await initTrunkPane();
  initDataPoolPane();
  initI18nPane();
  initActionPane();
  initDemoPanes();
  initHistoryPane();
  Engine.init();
}
init();
