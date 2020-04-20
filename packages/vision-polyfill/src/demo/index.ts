// @ts-ignore
import Engine from '@ali/visualengine';
import loadUrls from './loader';

const { editor } = Engine;

Engine.init();

load();

async function load() {
  await loadAssets();

  loadSchema();
}

const externals = ['react', 'react-dom', 'prop-types', 'react-router', 'react-router-dom', '@ali/recore'];
async function loadAssets() {
  const assets = await editor.utils.get('./legao-assets.json');

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

  editor.set('assets', assets);
}

async function loadSchema() {
  const schema = await editor.utils.get('./schema.json');
  editor.set('schema', schema);
}
