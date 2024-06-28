import { defineRendererPlugin } from '../app/boosts';
import { createRouter, type RouterOptions } from '@alilc/lowcode-renderer-router';
import { createRouterView } from './routerView';
import { RouteOutlet } from './route';

const defaultRouterOptions: RouterOptions = {
  historyMode: 'browser',
  baseName: '/',
  routes: [],
};

export const routerPlugin = defineRendererPlugin({
  name: 'rendererRouter',
  async setup(context) {
    const { schema, boosts } = context;

    let routerConfig = defaultRouterOptions;

    try {
      const routerSchema = schema.get('router');
      if (routerSchema) {
        routerConfig = boosts.codeRuntime.resolve(routerSchema);
      }
    } catch (e) {
      console.error(`schema's router config is resolve error: `, e);
    }

    const router = createRouter(routerConfig);
    const RouterView = createRouterView(router);

    boosts.addAppWrapper(RouterView);
    boosts.setOutlet(RouteOutlet);

    boosts.codeRuntime.getScope().set('router', router);
    boosts.temporaryUse('router', router);

    await router.isReady();
  },
});
