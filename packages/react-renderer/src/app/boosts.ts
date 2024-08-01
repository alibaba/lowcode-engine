import { IExtensionHostService } from '@alilc/lowcode-renderer-core';
import { createDecorator } from '@alilc/lowcode-shared';
import { type ComponentType, type PropsWithChildren } from 'react';

export type WrapperComponent = ComponentType<PropsWithChildren<any>>;

export interface OutletProps {
  [key: string]: any;
}

export type Outlet = ComponentType<OutletProps>;

export interface IReactRendererBoostsService {
  addAppWrapper(appWrapper: WrapperComponent): void;

  getAppWrappers(): WrapperComponent[];

  setOutlet(outlet: Outlet): void;

  getOutlet(): Outlet | null;
}

export const IReactRendererBoostsService = createDecorator<IReactRendererBoostsService>(
  'reactRendererBoostsService',
);

export type ReactRendererBoostsApi = Pick<
  IReactRendererBoostsService,
  'addAppWrapper' | 'setOutlet'
>;

export class ReactRendererBoostsService implements IReactRendererBoostsService {
  private _wrappers: WrapperComponent[] = [];

  private _outlet: Outlet | null = null;

  constructor(@IExtensionHostService private extensionHostService: IExtensionHostService) {
    this.extensionHostService.boostsManager.extend(this._toExpose());
  }

  getAppWrappers(): WrapperComponent[] {
    return this._wrappers;
  }

  addAppWrapper(appWrapper: WrapperComponent): void {
    if (appWrapper) this._wrappers.push(appWrapper);
  }

  setOutlet(outletComponent: Outlet): void {
    if (outletComponent) this._outlet = outletComponent;
  }

  getOutlet(): Outlet | null {
    return this._outlet;
  }

  private _toExpose(): ReactRendererBoostsApi {
    return {
      addAppWrapper: (appWrapper) => {
        this.addAppWrapper(appWrapper);
      },
      setOutlet: (outletComponent) => {
        this.setOutlet(outletComponent);
      },
    };
  }
}
