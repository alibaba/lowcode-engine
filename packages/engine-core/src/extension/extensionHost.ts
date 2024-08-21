import { type ExtensionStarter, type IExtensionInstance } from './extension';

export type ExtensionExportsAccessor = {
  [key: string]: any;
};

export class ExtensionHost {
  private _isInited = false;

  private _instance: IExtensionInstance;

  private _exports: ExtensionExportsAccessor | undefined;
  get exports(): ExtensionExportsAccessor | undefined {
    if (!this._isInited) return;

    if (!this._exports) {
      const exports = this._instance.exports?.();

      if (!exports) return;

      this._exports = new Proxy(Object.create(null), {
        get(target, prop, receiver) {
          if (Reflect.has(exports, prop)) {
            return exports?.[prop as string];
          }
          return Reflect.get(target, prop, receiver);
        },
      });
    }

    return this._exports;
  }

  constructor(
    public id: string,
    starter: ExtensionStarter,
  ) {
    // context will be provide in
    this._instance = starter({});
  }

  dispose(): void {
    this.destroy();
  }

  async init(): Promise<void> {
    if (this._isInited) return;

    await this._instance.init();
    this._isInited = true;
  }

  async destroy(): Promise<void> {
    if (!this._isInited) return;

    await this._instance.destroy();
    this._isInited = false;
  }
}
