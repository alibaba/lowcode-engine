import { type Router, type RouterOptions, createRouter } from '@alilc/runtime-router';
import { createRouterProvider } from './components/router-view';
import RouteOutlet from './components/outlet';
import { type ReactRendererSetupContext } from './renderer';

declare module '@alilc/renderer-core' {
  interface AppBoosts {
    router: Router;
  }
}

const defaultRouterOptions: RouterOptions = {
  historyMode: 'browser',
  baseName: '/',
  routes: [],
};

export function initRouter(context: ReactRendererSetupContext) {
  const { schema, boosts, appScope, renderer } = context;
  const router = createRouter(schema.getByKey('router') ?? defaultRouterOptions);

  appScope.inject('router', router);
  boosts.add('router', router);

  const RouterProvider = createRouterProvider(router);

  renderer.addAppWrapper(RouterProvider);
  renderer.setOutlet(RouteOutlet);
}
