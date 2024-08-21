import { CyclicDependencyError, Disposable, Graph, type Reference } from '@alilc/lowcode-shared';
import { type IFunctionExtension } from './extension';
import { type IConfigurationNode, type IConfigurationRegistry } from '../configuration';
import { ExtensionHost } from './extensionHost';
import { Registry, Extensions } from './registry';

export interface IExtensionGallery {
  id: string;
  name: string;
  version: string;
  reference: Reference | undefined;
  dependencies: string[] | undefined;
  engineVerison: string | undefined;
  preferenceConfigurations: IConfigurationNode[] | undefined;

  registerOptions: IExtensionRegisterOptions;
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

export class ExtensionManager extends Disposable {
  private _extensionGalleryMap: Map<string, IExtensionGallery> = new Map();
  private _extensionHosts: Map<string, ExtensionHost> = new Map();
  private _extensionStore: Map<string, IFunctionExtension> = new Map();
  private _extensionDependencyGraph = new Graph<string>((name) => name);

  constructor() {
    super();
  }

  async register(extension: IFunctionExtension, options: IExtensionRegisterOptions = {}): Promise<void> {
    extension.id = extension.id ?? extension.name;

    if (!this._validateExtension(extension, options.override)) return;

    this._extensionStore.set(extension.id!, extension);

    const metadata = extension.metadata ?? {};
    const gallery: IExtensionGallery = {
      id: extension.id!,
      name: extension.name,
      version: extension.version,
      reference: undefined,
      dependencies: metadata.dependencies,
      engineVerison: metadata.engineVerison,
      preferenceConfigurations: metadata.preferenceConfigurations?.map((config) => {
        return {
          ...config,
          extensionInfo: {
            id: extension.id!,
            version: extension.version,
          },
        };
      }),

      registerOptions: options,
    };

    this._extensionGalleryMap.set(gallery.id, gallery);

    await this._installExtension(extension);
  }

  private _validateExtension(extension: IFunctionExtension, override: boolean = false): boolean {
    if (!override && this.has(extension.id!)) return false;

    return true;
  }

  private async _installExtension(extension: IFunctionExtension): Promise<void> {
    const { dependencies = [] } = extension.metadata ?? {};

    this._extensionDependencyGraph.lookupOrInsertNode(extension.id!);

    if (dependencies.length > 0) {
      for (const dep of dependencies) {
        this._extensionDependencyGraph.insertEdge(extension.id!, dep);
      }
    }

    while (true) {
      const roots = this._extensionDependencyGraph.roots();

      if (roots.length === 0 || roots.every((node) => !this.isExtensionActivated(node.data))) {
        if (this._extensionDependencyGraph.isEmpty()) {
          throw new CyclicDependencyError(this._extensionDependencyGraph);
        }
        break;
      }

      for (const { data } of roots) {
        const extensionFunction = this.getExtension(data);
        const gallery = this.getExtensionGallery(data);

        if (extensionFunction) {
          const host = new ExtensionHost(data, extensionFunction);

          if (gallery!.preferenceConfigurations) {
            Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfigurations(
              gallery!.preferenceConfigurations,
            );
          }

          this._addDispose(host);
          this._extensionHosts.set(extension.name, host);
          this._extensionDependencyGraph.removeNode(extensionFunction.id!);

          try {
            if (gallery!.registerOptions.autoInit) {
              await host.init();
            }
          } catch (e) {
            console.log(`The extension [${data}] init failed: `, e);
          }
        }
      }
    }
  }

  async deregister(id: string): Promise<void> {
    if (this.has(id)) {
      const host = this._extensionHosts.get(id)!;
      await host.destroy();

      this._extensionGalleryMap.delete(id);
      this._extensionHosts.delete(id);
    }
  }

  has(id: string): boolean {
    return this._extensionGalleryMap.has(id);
  }

  getExtension(id: string): IFunctionExtension | undefined {
    return this._extensionStore.get(id);
  }

  getExtensionGallery(id: string): IExtensionGallery | undefined {
    return this._extensionGalleryMap.get(id);
  }

  getExtensionHost(id: string): ExtensionHost | undefined {
    return this._extensionHosts.get(id);
  }

  isExtensionActivated(id: string): boolean {
    return this._extensionHosts.has(id);
  }
}
