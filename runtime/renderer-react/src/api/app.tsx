import {
  type App,
  type AppBase,
  createAppFunction,
  type AppOptionsBase,
} from '@alilc/renderer-core';
import { type ComponentType } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { createRouter } from '@alilc/runtime-router';
import { createRenderer } from '../renderer';
import AppComponent from '../components/app';
import { createIntl } from '../runtime-api/intl';
import { createRuntimeUtils } from '../runtime-api/utils';

export interface AppOptions extends AppOptionsBase {
  dataSourceCreator: any;
  faultComponent?: ComponentType<any>;
}

export interface ReactRender extends AppBase {}

export type ReactApp = App<ReactRender>;

export const createApp = createAppFunction<AppOptions, ReactRender>(async (context, options) => {
  const { schema, packageManager, appScope, boosts } = context;

  // router
  // todo: transform config
  const router = createRouter(schema.getByKey('router') as any);

  appScope.inject('router', router);

  // i18n
  const i18nMessages = schema.getByKey('i18n') ?? {};
  const defaultLocale = schema.getByPath('config.defaultLocale') ?? 'zh-CN';
  const intl = createIntl(i18nMessages, defaultLocale);

  appScope.inject('intl', intl);

  // utils
  const runtimeUtils = createRuntimeUtils(schema.getByKey('utils') ?? [], packageManager);

  appScope.inject('utils', runtimeUtils.utils);
  boosts.add('runtimeUtils', runtimeUtils);

  // set config
  if (options.faultComponent) {
    context.config.set('faultComponent', options.faultComponent);
  }
  context.config.set('dataSourceCreator', options.dataSourceCreator);

  let root: Root | undefined;
  const renderer = createRenderer();
  const appContext = { ...context, renderer };

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
    appBase: reactRender,
    renderer,
  };
});
