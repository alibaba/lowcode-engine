import {
  type App,
  type RenderBase,
  createAppFunction,
  type AppOptionsBase,
} from '@alilc/runtime-core';
import { type DataSourceCreator } from '@alilc/runtime-shared';
import { type ComponentType } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { createRenderer } from '../renderer';
import AppComponent from '../components/app';
import { intlPlugin } from '../plugins/intl';
import { globalUtilsPlugin } from '../plugins/utils';
import { initRouter } from '../router';

export interface AppOptions extends AppOptionsBase {
  dataSourceCreator: DataSourceCreator;
  faultComponent?: ComponentType<any>;
}

export interface ReactRender extends RenderBase {}

export type ReactApp = App<ReactRender>;

export const createApp = createAppFunction<AppOptions, ReactRender>(
  async (context, options) => {
    const renderer = createRenderer();
    const appContext = { ...context, renderer };

    initRouter(appContext);

    options.plugins ??= [];
    options.plugins!.unshift(globalUtilsPlugin, intlPlugin);

    // set config
    if (options.faultComponent) {
      context.config.set('faultComponent', options.faultComponent);
    }
    context.config.set('dataSourceCreator', options.dataSourceCreator);

    let root: Root | undefined;

    const reactRender: ReactRender = {
      async mount(el) {
        if (root) {
          return;
        }

        root = createRoot(el);
        root.render(<AppComponent context={appContext} />);
      },
      unmount() {
        if (root) {
          root.unmount();
          root = undefined;
        }
      },
    };

    return {
      renderBase: reactRender,
      renderer,
    };
  }
);
