import {
  definePlugin as definePluginFn,
  type Plugin,
  type PluginSetupContext,
} from '@alilc/runtime-core';
import { type ComponentType, type PropsWithChildren } from 'react';
import { type OutletProps } from './components/outlet';

export type WrapperComponent = ComponentType<PropsWithChildren<{}>>;

export type Outlet = ComponentType<OutletProps>;

export interface ReactRenderer {
  addAppWrapper(appWrapper: WrapperComponent): void;
  getAppWrappers(): WrapperComponent[];

  addRouteWrapper(wrapper: WrapperComponent): void;
  getRouteWrappers(): WrapperComponent[];

  setOutlet(outlet: Outlet): void;
  getOutlet(): Outlet | null;
}

export function createRenderer(): ReactRenderer {
  const appWrappers: WrapperComponent[] = [];
  const wrappers: WrapperComponent[] = [];

  let outlet: Outlet | null = null;

  return {
    addAppWrapper(appWrapper) {
      if (appWrapper) appWrappers.push(appWrapper);
    },
    getAppWrappers() {
      return appWrappers;
    },

    addRouteWrapper(wrapper) {
      if (wrapper) wrappers.push(wrapper);
    },
    getRouteWrappers() {
      return wrappers;
    },

    setOutlet(outletComponent) {
      if (outletComponent) outlet = outletComponent;
    },
    getOutlet() {
      return outlet;
    },
  };
}

export interface ReactRendererSetupContext extends PluginSetupContext {
  renderer: ReactRenderer;
}

export function definePlugin(plugin: Plugin<ReactRendererSetupContext>) {
  return definePluginFn(plugin);
}
