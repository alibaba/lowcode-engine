import { createRenderer, type AppOptions, type IRender } from '@alilc/lowcode-renderer-core';
import { type ComponentType } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { createRouter, type RouterOptions } from '@alilc/lowcode-renderer-router';
import AppComponent from '../components/app';
import { RendererContext } from '../context/render';
import { createRouterProvider } from '../components/routerView';
import { rendererExtends } from '../plugin';

export interface ReactAppOptions extends AppOptions {
  faultComponent?: ComponentType<any>;
}

const defaultRouterOptions: RouterOptions = {
  historyMode: 'browser',
  baseName: '/',
  routes: [],
};

export const createApp = async (options: ReactAppOptions) => {
  const creator = createRenderer<IRender>(async (context) => {
    const { schema, boostsManager } = context;
    const boosts = boostsManager.toExpose();

    // router
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

    boosts.codeRuntime.getScope().inject('router', router);

    // set config
    // if (options.faultComponent) {
    //   context.config.set('faultComponent', options.faultComponent);
    // }

    // extends boosts
    boostsManager.extend(rendererExtends);

    const RouterProvider = createRouterProvider(router);

    let root: Root | undefined;

    return {
      async mount(el) {
        if (root) {
          return;
        }

        root = createRoot(el);
        root.render(
          <RendererContext.Provider value={context}>
            <RouterProvider>
              <AppComponent />
            </RouterProvider>
          </RendererContext.Provider>,
        );
      },
      unmount() {
        if (root) {
          root.unmount();
          root = undefined;
        }
      },
    };
  });

  return creator(options);
};
