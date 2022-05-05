import { StrictEventEmitter } from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import {
  IEditor,
  EditorConfig,
  PluginClassSet,
  KeyType,
  GetReturnType,
  HookConfig,
  ComponentDescription,
  RemoteComponentDescription,
  GlobalEvent,
} from '@alilc/lowcode-types';
import { engineConfig } from './config';
import { globalLocale } from './intl';
import * as utils from './utils';
import Preference from './utils/preference';
import { obx } from './utils';
import { AssetsJson, AssetLoader } from '@alilc/lowcode-utils';

EventEmitter.defaultMaxListeners = 100;

export declare interface Editor extends StrictEventEmitter<EventEmitter, GlobalEvent.EventConfig> {
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
  off(event: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  listeners(event: string | symbol): Function[];
  rawListeners(event: string | symbol): Function[];
  listenerCount(type: string | symbol): number;
  // Added in Node 6...
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
  eventNames(): Array<string | symbol>;
  getPreference(): Preference;
}

// eslint-disable-next-line no-redeclare
export class Editor extends (EventEmitter as any) implements IEditor {
  /**
   * Ioc Container
   */
  @obx.shallow private context = new Map<KeyType, any>();

  get locale() {
    return globalLocale.getLocale();
  }

  // readonly utils = utils;
  /**
   * used to store preferences
   *
   * @memberof Editor
   */
  readonly preference = new Preference();

  private hooks: HookConfig[] = [];

  get<T = undefined, KeyOrType = any>(keyOrType: KeyOrType): GetReturnType<T, KeyOrType> | undefined {
    return this.context.get(keyOrType as any);
  }

  has(keyOrType: KeyType): boolean {
    return this.context.has(keyOrType);
  }

  set(key: KeyType, data: any): void {
    if (key === 'assets') {
      this.setAssets(data);
      return;
    }
    // store the data to engineConfig while invoking editor.set()
    engineConfig.set(key as any, data);
    this.context.set(key, data);
    this.notifyGot(key);
  }

  async setAssets(assets: AssetsJson) {
    const { components } = assets;
    if (components && components.length) {
      const componentDescriptions: ComponentDescription[] = [];
      const remoteComponentDescriptions: RemoteComponentDescription[] = [];
      components.forEach((component: any) => {
        if (!component) {
          return;
        }
        if (component.exportName && component.url) {
          remoteComponentDescriptions.push(component);
        } else {
          componentDescriptions.push(component);
        }
      });
      assets.components = componentDescriptions;
      assets.componentList = assets.componentList || [];

      // 如果有远程组件描述协议，则自动加载并补充到资产包中，同时出发 designer.incrementalAssetsReady 通知组件面板更新数据
      if (remoteComponentDescriptions && remoteComponentDescriptions.length) {
        await Promise.all(
          remoteComponentDescriptions.map(async (component: any) => {
            const { exportName, url } = component;
            await (new AssetLoader()).load(url);
            if (window[exportName]) {
              assets.components = assets.components.concat(window[exportName].components || []);
              assets.componentList = assets.componentList.concat(window[exportName].componentList || []);
            }
            return window[exportName];
          }),
        );
      }
    }
    this.context.set('assets', assets);
    this.notifyGot('assets');
  }

  onceGot<T = undefined, KeyOrType extends KeyType = any>(keyOrType: KeyOrType): Promise<GetReturnType<T, KeyOrType>> {
    const x = this.context.get(keyOrType);
    if (x !== undefined) {
      return Promise.resolve(x);
    }
    return new Promise((resolve) => {
      this.setWait(keyOrType, resolve, true);
    });
  }

  onGot<T = undefined, KeyOrType extends KeyType = any>(
    keyOrType: KeyOrType,
    fn: (data: GetReturnType<T, KeyOrType>) => void,
  ): () => void {
    const x = this.context.get(keyOrType);
    if (x !== undefined) {
      fn(x);
      return () => {};
    } else {
      this.setWait(keyOrType, fn);
      return () => {
        this.delWait(keyOrType, fn);
      };
    }
  }

  register(data: any, key?: KeyType): void {
    this.context.set(key || data, data);
    this.notifyGot(key || data);
  }

  config?: EditorConfig;

  components?: PluginClassSet;

  async init(config?: EditorConfig, components?: PluginClassSet): Promise<any> {
    this.config = config || {};
    this.components = components || {};
    const { hooks = [], lifeCycles } = this.config;

    this.emit('editor.beforeInit');
    const init = (lifeCycles && lifeCycles.init) || ((): void => {});

    try {
      await init(this);
      // 注册快捷键
      // 注册 hooks
      this.registerHooks(hooks);
      this.emit('editor.afterInit');

      return true;
    } catch (err) {
      console.error(err);
    }
  }

  destroy(): void {
    if (!this.config) {
      return;
    }
    try {
      const { lifeCycles = {} } = this.config;

      this.unregisterHooks();

      if (lifeCycles.destroy) {
        lifeCycles.destroy(this);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getPreference() {
    return this.preference;
  }

  initHooks = (hooks: HookConfig[]) => {
    this.hooks = hooks.map((hook) => ({
      ...hook,
      // 指定第一个参数为 editor
      handler: hook.handler.bind(this, this),
    }));

    return this.hooks;
  };

  registerHooks = (hooks: HookConfig[]) => {
    this.initHooks(hooks).forEach(({ message, type, handler }) => {
      if (['on', 'once'].indexOf(type) !== -1) {
        this[type](message, handler);
      }
    });
  };

  unregisterHooks = () => {
    this.hooks.forEach(({ message, handler }) => {
      this.removeListener(message, handler);
    });
  };

  /* eslint-disable */
  private waits = new Map<
  KeyType,
  Array<{
    once?: boolean;
    resolve: (data: any) => void;
  }>
  >();
  /* eslint-enable */

  private notifyGot(key: KeyType) {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }

  private setWait(key: KeyType, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: KeyType, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
}
