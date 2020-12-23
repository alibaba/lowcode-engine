import { EventEmitter } from 'events';
import {
  IEditor,
  EditorConfig,
  PluginClassSet,
  KeyType,
  GetReturnType,
  HookConfig
} from '@ali/lowcode-types';
import { globalLocale } from './intl';
import * as utils from './utils';
import { obx } from './utils';
// import { tipHandler } from './widgets/tip/tip-handler';

EventEmitter.defaultMaxListeners = 100;

export class Editor extends EventEmitter implements IEditor {
  /**
   * Ioc Container
   */
  @obx.val private context = new Map<KeyType, any>();

  get locale() {
    return globalLocale.getLocale();
  }

  readonly utils = utils;

  private hooks: HookConfig[] = [];

  get<T = undefined, KeyOrType = any>(keyOrType: KeyOrType): GetReturnType<T, KeyOrType> | undefined {
    return this.context.get(keyOrType as any);
  }

  has(keyOrType: KeyType): boolean {
    return this.context.has(keyOrType);
  }

  set(key: KeyType, data: any): void {
    this.context.set(key, data);
    this.notifyGot(key);
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
      // registShortCuts(shortCuts, this);
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
      // unRegistShortCuts(shortCuts);

      this.unregisterHooks();

      if (lifeCycles.destroy) {
        lifeCycles.destroy(this);
      }
    } catch (err) {
      console.warn(err);
    }
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

  private waits = new Map<
  KeyType,
  Array<{
    once?: boolean;
    resolve:(data: any) => void;
  }>
  >();

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
