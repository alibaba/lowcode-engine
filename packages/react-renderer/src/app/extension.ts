import { type Plugin, type IBoostsService } from '@alilc/lowcode-renderer-core';
import { type ComponentType, type PropsWithChildren } from 'react';

export type WrapperComponent = ComponentType<PropsWithChildren<any>>;

export interface OutletProps {
  [key: string]: any;
}

export type Outlet = ComponentType<OutletProps>;

export interface ReactRendererExtensionApi {
  addAppWrapper(appWrapper: WrapperComponent): void;

  setOutlet(outlet: Outlet): void;
}

class ReactRendererExtension {
  private wrappers: WrapperComponent[] = [];

  private outlet: Outlet | null = null;

  getAppWrappers() {
    return this.wrappers;
  }

  getOutlet() {
    return this.outlet;
  }

  toExpose(): ReactRendererExtensionApi {
    return {
      addAppWrapper: (appWrapper) => {
        if (appWrapper) this.wrappers.push(appWrapper);
      },
      setOutlet: (outletComponent) => {
        if (outletComponent) this.outlet = outletComponent;
      },
    };
  }

  install(boostsService: IBoostsService) {
    boostsService.extend(this.toExpose());
  }
}

export const extension = new ReactRendererExtension();

export function defineRendererPlugin(plugin: Plugin<ReactRendererExtensionApi>) {
  return plugin;
}
