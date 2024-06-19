import { type Plugin } from '@alilc/lowcode-renderer-core';
import { type ComponentType, type PropsWithChildren } from 'react';

export type WrapperComponent = ComponentType<PropsWithChildren<any>>;

export interface OutletProps {
  [key: string]: any;
}

export type Outlet = ComponentType<OutletProps>;

export interface ReactRendererBoostsApi {
  addAppWrapper(appWrapper: WrapperComponent): void;

  setOutlet(outlet: Outlet): void;
}

class ReactRendererBoosts {
  private wrappers: WrapperComponent[] = [];

  private outlet: Outlet | null = null;

  getAppWrappers() {
    return this.wrappers;
  }

  getOutlet() {
    return this.outlet;
  }

  toExpose(): ReactRendererBoostsApi {
    return {
      addAppWrapper: (appWrapper) => {
        if (appWrapper) this.wrappers.push(appWrapper);
      },
      setOutlet: (outletComponent) => {
        if (outletComponent) this.outlet = outletComponent;
      },
    };
  }
}

export const boosts = new ReactRendererBoosts();

export function defineRendererPlugin(plugin: Plugin<ReactRendererBoostsApi>) {
  return plugin;
}
