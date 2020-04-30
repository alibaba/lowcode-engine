import { createElement } from 'react';
import { Button } from '@alifd/next';
import Engine, { Panes } from '@ali/visualengine';
import getTrunkPane from '@ali/ve-trunk-pane';
import EventBindDialog from '@ali/lowcode-plugin-event-bind-dialog';
import loadUrls from './loader';
import { upgradeAssetsBundle } from './upgrade-assets';
import { isCSSUrl } from '@ali/lowcode-utils';
import { I18nSetter } from '@ali/visualengine-utils';
import VariableSetter from '@ali/vs-variable-setter';

const { editor, skeleton, context, HOOKS, Trunk } = Engine;

Trunk.registerSetter('I18nSetter', {
  component: I18nSetter,
  // todo: add icon
  title: {
    type: 'i18n',
    'zh-CN': '国际化输入',
    'en-US': 'International Input'
  },
  // TODO: below
  // condition?: (field: any) => boolean;
  // initialValue?: any | ((field: any) => any);
  recommend: true,
});
context.use(HOOKS.VE_SETTING_FIELD_VARIABLE_SETTER, VariableSetter);

// demo
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

skeleton.add({
  area: 'toolbar',
  type: 'Dock',
  name: 'preview2',
  props: {
    align: 'left',
  },
  content: 'aeawfeawe',
});

initTrunkPane();
Engine.init();

load();
Engine.Env.setEnv('RE_VERSION', '5.0.1');

async function load() {
  await loadAssets();

  loadSchema();
}

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
