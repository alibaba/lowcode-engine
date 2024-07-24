import { createDecorator, Provide } from '@alilc/lowcode-shared';
import { ExtensionManagement, type IExtensionRegisterOptions } from './extensionManagement';
import { type IFunctionExtension } from './extension';
import { ExtensionHost } from './extensionHost';

export interface IExtensionService {
  register(extension: IFunctionExtension, options?: IExtensionRegisterOptions): Promise<void>;

  deregister(name: string): Promise<void>;

  has(name: string): boolean;

  getExtensionHost(name: string): ExtensionHost | undefined;
}

export const IExtensionService = createDecorator<IExtensionService>('extensionService');

@Provide(IExtensionService)
export class ExtensionService implements IExtensionService {
  private extensionManagement = new ExtensionManagement();

  register(extension: IFunctionExtension, options?: IExtensionRegisterOptions): Promise<void> {
    return this.extensionManagement.register(extension, options);
  }

  deregister(name: string): Promise<void> {
    return this.extensionManagement.deregister(name);
  }

  has(name: string): boolean {
    return this.extensionManagement.has(name);
  }

  getExtensionHost(name: string): ExtensionHost | undefined {
    return this.extensionManagement.getExtensionHost(name);
  }
}
