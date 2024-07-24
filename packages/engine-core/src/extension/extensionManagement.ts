import { type Reference } from '@alilc/lowcode-shared';
import { type IFunctionExtension } from './extension';
import { type IConfigurationNode } from '../configuration';
import { ExtensionHost } from './extensionHost';

export interface IExtensionGallery {
  name: string;
  version: string;
  reference: Reference | undefined;
  dependencies: string[] | undefined;
  engineVerison: string | undefined;
  preferenceConfigurations: IConfigurationNode[] | undefined;
}

export interface IExtensionRegisterOptions {
  /**
   * Will enable plugin registered with auto-initialization immediately
   * other than plugin-manager init all plugins at certain time.
   * It is helpful when plugin register is later than plugin-manager initialization.
   */
  autoInit?: boolean;
  /**
   * allow overriding existing plugin with same name when override === true
   */
  override?: boolean;
}

export class ExtensionManagement {
  private extensionGalleryMap: Map<string, IExtensionGallery> = new Map();
  private extensionHosts: Map<string, ExtensionHost> = new Map();

  constructor() {}

  async register(
    extension: IFunctionExtension,
    { autoInit = false, override = false }: IExtensionRegisterOptions = {},
  ): Promise<void> {
    if (!this.validateExtension(extension, override)) return;

    const metadata = extension.meta ?? {};
    const host = new ExtensionHost(
      extension.name,
      extension,
      metadata.preferenceConfigurations ?? [],
    );

    if (autoInit) {
      await host.init();
    }

    this.extensionHosts.set(extension.name, host);

    const gallery: IExtensionGallery = {
      name: extension.name,
      version: extension.version,
      reference: undefined,
      dependencies: metadata.dependencies,
      engineVerison: metadata.engineVerison,
      preferenceConfigurations: metadata.preferenceConfigurations,
    };

    this.extensionGalleryMap.set(gallery.name, gallery);
  }

  private validateExtension(extension: IFunctionExtension, override: boolean): boolean {
    if (!override && this.has(extension.name)) return false;

    return true;
  }

  async deregister(name: string): Promise<void> {
    if (this.has(name)) {
      const host = this.extensionHosts.get(name)!;
      await host.destroy();

      this.extensionGalleryMap.delete(name);
      this.extensionHosts.delete(name);
    }
  }

  has(name: string): boolean {
    return this.extensionGalleryMap.has(name);
  }

  getExtensionGallery(name: string): IExtensionGallery | undefined {
    return this.extensionGalleryMap.get(name);
  }

  getExtensionHost(name: string): ExtensionHost | undefined {
    return this.extensionHosts.get(name);
  }
}
