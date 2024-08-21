import { createDecorator } from '@alilc/lowcode-shared';
import { ExtensionManager, type IExtensionRegisterOptions } from './extensionManager';
import { type IFunctionExtension } from './extension';
import { ExtensionHost } from './extensionHost';

export interface IExtensionService {
  register(extension: IFunctionExtension, options?: IExtensionRegisterOptions): Promise<void>;

  deregister(name: string): Promise<void>;

  has(name: string): boolean;

  getExtensionHost(name: string): ExtensionHost | undefined;

  dispose(): void;
}

export const IExtensionService = createDecorator<IExtensionService>('extensionService');

export class ExtensionService implements IExtensionService {
  private _manager = new ExtensionManager();

  dispose(): void {
    this._manager.dispose();
  }

  register(extension: IFunctionExtension, options?: IExtensionRegisterOptions): Promise<void> {
    return this._manager.register(extension, options);
  }

  deregister(name: string): Promise<void> {
    return this._manager.deregister(name);
  }

  has(name: string): boolean {
    return this._manager.has(name);
  }

  getExtensionHost(name: string): ExtensionHost | undefined {
    return this._manager.getExtensionHost(name);
  }
}
