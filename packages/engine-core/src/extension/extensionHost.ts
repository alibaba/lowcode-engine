import { ConfigurationRegistry, type IConfigurationNode } from '../configuration';
import { type ExtensionInitializer, type IExtensionInstance } from './extension';
import { invariant } from '@alilc/lowcode-shared';

export type ExtensionExportsAccessor = {
  [key: string]: any;
};

export class ExtensionHost {
  private isInited = false;

  private instance: IExtensionInstance;

  private configurationProperties: ReadonlySet<string>;

  constructor(
    public name: string,
    initializer: ExtensionInitializer,
    preferenceConfigurations: IConfigurationNode[],
  ) {
    this.configurationProperties =
      ConfigurationRegistry.registerConfigurations(preferenceConfigurations);

    this.instance = initializer({});
  }

  async init(): Promise<void> {
    if (this.isInited) return;

    await this.instance.init();

    this.isInited = true;
  }

  async destroy(): Promise<void> {
    if (!this.isInited) return;

    await this.instance.destroy();

    this.isInited = false;
  }

  toProxy(): ExtensionExportsAccessor | undefined {
    invariant(this.isInited, 'Could not call toProxy before init');

    const exports = this.instance.exports?.();

    if (!exports) return;

    return new Proxy(Object.create(null), {
      get(target, prop, receiver) {
        if (Reflect.has(exports, prop)) {
          return exports?.[prop as string];
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
