// @ts-ignore
import { createElement } from 'react';
import { Button } from '@alifd/next';
import Engine, { Panes } from '@ali/visualengine';
import getTrunkPane from '@ali/ve-trunk-pane';
import DatapoolPane from '@ali/ve-datapool-pane';
// import I18nPane from '@ali/ve-i18n-pane';
import I18nManagePane from '@ali/ve-i18n-manage-pane';
import ActionPane from '@ali/ve-action-pane';
import fetchContext from '@ali/vu-legao-design-fetch-context';
import EventBindDialog from '@ali/lowcode-plugin-event-bind-dialog';
import loadUrls from './loader';
import { upgradeAssetsBundle } from './upgrade-assets';
import { isCSSUrl } from '@ali/lowcode-globals';

const { editor, skeleton } = Engine;

const externals = ['react', 'react-dom', 'prop-types', 'react-router', 'react-router-dom', '@ali/recore'];

async function loadAssets() {
  const legaoAssets = await editor.utils.get('./legao-assets.json');

  const assets = upgradeAssetsBundle(legaoAssets);

  if (assets.packages) {
    assets.packages.forEach((item: any) => {
      if (item.package.indexOf('@ali/vc-') === 0 && item.urls) {
        item.urls = item.urls.filter((url: string) => {
          return url.indexOf('view.mobile') < 0;
        });
      } else if (item.package && externals.indexOf(item.package) > -1) {
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
        urls: prototypeStyles
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
  skeleton.add({
    area: 'topArea',
    type: 'Dock',
    name: 'preview4',
    props: {
      align: 'center',
    },
    content: createElement('img', {
      src: 'https://img.alicdn.com/tfs/TB1WW.VC.z1gK0jSZLeXXb9kVXa-486-64.png',
      style: {
        height: 32,
      },
    }),
  });
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
  const props = {
    enableGlobalJS: false,
    enableVsCodeEdit: false,
    enableHeaderTip: true,
  };

  Panes.add(ActionPane, {
    props,
  });
}

async function init() {
  Engine.Env.setEnv('RE_VERSION', '7.2.0');
  await loadAssets();
  await loadSchema();
  await initTrunkPane();
  initDataPoolPane();
  initI18nPane();
  initActionPane();
  initDemoPanes();

  Engine.init();
}
init();
