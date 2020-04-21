// @ts-ignore
import Engine, { Panes } from '@ali/visualengine';
import getTrunkPane from '@ali/ve-trunk-pane';
import loadUrls from './loader';
import { upgradeAssetsBundle } from './upgrade-assets';

const { editor } = Engine;

initTrunkPane();
Engine.init();

load();
Engine.Env.setEnv('RE_VERSION', "5.0.1");

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
    assets['x-prototypes'].forEach((pkg: any) => {
      tasks.push(loadUrls(pkg?.urls));
    });
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
