import { Plugin } from '@alilc/lowcode-renderer-core';
import { type ComponentType, type PropsWithChildren } from 'react';
import { type OutletProps } from './components/route';

export type WrapperComponent = ComponentType<PropsWithChildren<any>>;

export type Outlet = ComponentType<OutletProps>;

export interface RendererExtends {
  addAppWrapper(appWrapper: WrapperComponent): void;
  getAppWrappers(): WrapperComponent[];

  addRouteWrapper(wrapper: WrapperComponent): void;
  getRouteWrappers(): WrapperComponent[];

  setOutlet(outlet: Outlet): void;
  getOutlet(): Outlet | null;
}

const appWrappers: WrapperComponent[] = [];
const wrappers: WrapperComponent[] = [];

let outlet: Outlet | null = null;

export const rendererExtends: RendererExtends = {
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

export function defineRendererPlugin(plugin: Plugin<RendererExtends>) {
  return plugin;
}
