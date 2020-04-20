import { EventEmitter } from 'events';
import store from 'store';
import { IocContext, RegisterOptions } from '@ali/lowcode-globals';
import {
  EditorConfig,
  HooksConfig,
  LocaleType,
  PluginStatusSet,
  Utils,
  PluginClassSet,
  PluginSet,
} from './definitions';

import pluginFactory from './pluginFactory';

import * as editorUtils from './utils';

const { registShortCuts, transformToPromise, unRegistShortCuts } = editorUtils;

let instance: Editor;

EventEmitter.defaultMaxListeners = 100;

export interface HooksFuncs {
  [idx: number]: (msg: string, handler: (...args: []) => void) => void;
}

export type KeyType = Function | symbol | string;
export type ClassType = Function | (new (...args: any[]) => any);
export interface GetOptions {
  forceNew?: boolean;
  sourceCls?: ClassType;
}
export type GetReturnType<T, ClsType> = T extends undefined
  ? ClsType extends {
      prototype: infer R;
    }
    ? R
    : any
  : T;

const NOT_FOUND = Symbol.for('not_found');

export default class Editor extends EventEmitter {
  static getInstance = (config: EditorConfig, components: PluginClassSet, utils?: Utils): Editor => {
    if (!instance) {
      instance = new Editor(config, components, utils);
    }
    return instance;
  };

  private _components?: PluginClassSet;
  get components(): PluginClassSet {
    if (!this._components) {
      this._components = {};
      Object.keys(this.componentsMap).forEach((key) => {
        (this._components as any)[key] = pluginFactory(this.componentsMap[key]);
      });
    }
    return this._components;
  }

  readonly utils: Utils;
  /**
   * Ioc Container
   */
  private context = new IocContext({
    notFoundHandler: (type: KeyType) => NOT_FOUND,
  });

  pluginStatus?: PluginStatusSet;

  plugins?: PluginSet;

  locale?: LocaleType;

  hooksFuncs?: HooksFuncs;

  constructor(readonly config: EditorConfig = {}, readonly componentsMap: PluginClassSet = {}, utils?: Utils) {
    super();
    this.utils = { ...editorUtils, ...utils } as any;
    instance = this;
  }

  async init(): Promise<any> {
    const { hooks, shortCuts = [], lifeCycles } = this.config || {};
    this.locale = store.get('lowcode-editor-locale') || 'zh-CN';
    this.pluginStatus = this.initPluginStatus();
    this.initHooks(hooks || []);

    this.emit('editor.beforeInit');
    const init = (lifeCycles && lifeCycles.init) || ((): void => {});
    // 用户可以通过设置extensions.init自定义初始化流程；
    try {
      await transformToPromise(init(this));
      // 注册快捷键
      registShortCuts(shortCuts, this);
      this.emit('editor.afterInit');
      return true;
    } catch (err) {
      console.error(err);
    }
  }

  destroy(): void {
    try {
      const { hooks = [], shortCuts = [], lifeCycles = {} } = this.config;
      unRegistShortCuts(shortCuts);
      this.destroyHooks(hooks);
      if (lifeCycles.destroy) {
        lifeCycles.destroy(this);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  get<T = undefined, KeyOrType = any>(keyOrType: KeyOrType, opt?: GetOptions): GetReturnType<T, KeyOrType> | undefined {
    const x = this.context.get<T, KeyOrType>(keyOrType, opt);
    if (x === NOT_FOUND) {
      return undefined;
    }
    return x;
  }

  has(keyOrType: KeyType): boolean {
    return this.context.has(keyOrType);
  }

  set(key: KeyType, data: any): void {
    if (this.context.has(key)) {
      this.context.replace(key, data, undefined, true);
    } else {
      this.context.register(data, key);
    }
    this.notifyGot(key);
  }

  private waits = new Map<
    KeyType,
    Array<{
      once?: boolean;
      resolve: (data: any) => void;
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

  onceGot<T = undefined, KeyOrType extends KeyType = any>(keyOrType: KeyOrType): Promise<GetReturnType<T, KeyOrType>> {
    const x = this.context.get<T, KeyOrType>(keyOrType);
    if (x !== NOT_FOUND) {
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
    const x = this.context.get<T, KeyOrType>(keyOrType);
    if (x !== NOT_FOUND) {
      fn(x);
      return () => {};
    } else {
      this.setWait(keyOrType, fn);
      return () => {

      };
    }
  }

  register(data: any, key?: KeyType, options?: RegisterOptions): void {
    this.context.register(data, key, options);
    this.notifyGot(key || data);
  }

  batchOn(events: string[], lisenter: (...args: any[]) => void): void {
    if (!Array.isArray(events)) {
      return;
    }
    events.forEach((event): void => {
      this.on(event, lisenter);
    });
  }

  batchOnce(events: string[], lisenter: (...args: any[]) => void): void {
    if (!Array.isArray(events)) {
      return;
    }
    events.forEach((event): void => {
      this.once(event, lisenter);
    });
  }

  batchOff(events: string[], lisenter: (...args: any[]) => void): void {
    if (!Array.isArray(events)) {
      return;
    }
    events.forEach((event): void => {
      this.off(event, lisenter);
    });
  }

  // 销毁hooks中的消息监听
  private destroyHooks(hooks: HooksConfig = []): void {
    hooks.forEach((item, idx): void => {
      if (typeof this.hooksFuncs?.[idx] === 'function') {
        this.off(item.message, this.hooksFuncs[idx]);
      }
    });
    delete this.hooksFuncs;
  }

  // 初始化hooks中的消息监听
  private initHooks(hooks: HooksConfig = []): void {
    this.hooksFuncs = hooks.map((item): ((...arg: any[]) => void) => {
      const func = (...args: any[]): void => {
        item.handler(this, ...args);
      };
      this[item.type](item.message, func);
      return func;
    });
  }

  private initPluginStatus(): PluginStatusSet {
    const { plugins = {} } = this.config;
    const pluginAreas = Object.keys(plugins);
    const res: PluginStatusSet = {};
    pluginAreas.forEach((area): void => {
      (plugins[area] || []).forEach((plugin): void => {
        if (plugin.type === 'Divider') {
          return;
        }
        const { visible, disabled, marked } = plugin.props || {};
        res[plugin.pluginKey] = {
          visible: typeof visible === 'boolean' ? visible : true,
          disabled: typeof disabled === 'boolean' ? disabled : false,
          marked: typeof marked === 'boolean' ? marked : false,
        };
        const pluginClass = this.components[plugin.pluginKey];
        // 判断如果编辑器插件有init静态方法，则在此执行init方法
        if (pluginClass && pluginClass.init) {
          pluginClass.init(this);
        }
      });
    });
    return res;
  }
}
