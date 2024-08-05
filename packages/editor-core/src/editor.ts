/* eslint-disable no-console */
/* eslint-disable max-len */
import { StrictEventEmitter } from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { EventBus, IEventBus } from './event-bus';
import {
  IPublicModelEditor,
  EditorConfig,
  PluginClassSet,
  IPublicTypeEditorValueKey,
  IPublicTypeEditorGetResult,
  HookConfig,
  IPublicTypeComponentDescription,
  IPublicTypeRemoteComponentDescription,
  GlobalEvent,
} from '@alilc/lowcode-types';
import { engineConfig } from './config';
import { globalLocale } from './intl';
import { obx } from './utils';
import { IPublicTypeAssetsJson, AssetLoader } from '@alilc/lowcode-utils';
import { assetsTransform } from './utils/assets-transform';

EventEmitter.defaultMaxListeners = 100;

// inner instance keys which should not be stored in config
const keyBlacklist = [
  'designer',
  'skeleton',
  'currentDocument',
  'simulator',
  'plugins',
  'setters',
  'material',
  'innerHotkey',
  'innerPlugins',
];

const AssetsCache: {
  [key: string]: IPublicTypeRemoteComponentDescription;
} = {};

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
}

export interface IEditor extends IPublicModelEditor {
  config?: EditorConfig;

  components?: PluginClassSet;

  eventBus: IEventBus;

  init(config?: EditorConfig, components?: PluginClassSet): Promise<any>;
}

// eslint-disable-next-line no-redeclare
export class Editor extends EventEmitter implements IEditor {

  /**
   * Ioc Container
   */
  @obx.shallow private context = new Map<IPublicTypeEditorValueKey, any>();

  get locale() {
    return globalLocale.getLocale();
  }

  config?: EditorConfig;

  eventBus: EventBus;

  components?: PluginClassSet;

  // readonly utils = utils;

  private hooks: HookConfig[] = [];

  private waits = new Map<
    IPublicTypeEditorValueKey,
    Array<{
      once?: boolean;
      resolve: (data: any) => void;
    }>
  >();

  constructor(readonly viewName: string = 'global', readonly workspaceMode: boolean = false) {
    // eslint-disable-next-line constructor-super
    super();
    // set global emitter maxListeners
    this.setMaxListeners(200);
    this.eventBus = new EventBus(this);
  }

  get<T = undefined, KeyOrType = any>(
      keyOrType: KeyOrType,
    ): IPublicTypeEditorGetResult<T, KeyOrType> | undefined {
    return this.context.get(keyOrType as any);
  }

  has(keyOrType: IPublicTypeEditorValueKey): boolean {
    return this.context.has(keyOrType);
  }

  set(key: IPublicTypeEditorValueKey, data: any): void | Promise<void> {
    if (key === 'assets') {
      return this.setAssets(data);
    }
    // store the data to engineConfig while invoking editor.set()
    if (!keyBlacklist.includes(key as string)) {
      engineConfig.set(key as any, data);
    }
    this.context.set(key, data);
    this.notifyGot(key);
  }

  async setAssets(assets: IPublicTypeAssetsJson) {
    const { components } = assets;
    if (components && components.length) {
      const componentDescriptions: IPublicTypeComponentDescription[] = [];
      const remoteComponentDescriptions: IPublicTypeRemoteComponentDescription[] = [];
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
          remoteComponentDescriptions.map(async (component: IPublicTypeRemoteComponentDescription) => {
            const { exportName, url, npm } = component;
            if (!url || !exportName) {
              return;
            }
            if (!AssetsCache[exportName] || !npm?.version || AssetsCache[exportName].npm?.version !== npm?.version) {
              await (new AssetLoader()).load(url);
            }
            AssetsCache[exportName] = component;
            function setAssetsComponent(component: any, extraNpmInfo: any = {}) {
              const components = component.components;
              assets.componentList = assets.componentList?.concat(component.componentList || []);
              if (Array.isArray(components)) {
                components.forEach(d => {
                  assets.components = assets.components.concat({
                    npm: {
                      ...npm,
                      ...extraNpmInfo,
                    },
                    ...d,
                  } || []);
                });
                return;
              }
              if (component.components) {
                assets.components = assets.components.concat({
                  npm: {
                    ...npm,
                    ...extraNpmInfo,
                  },
                  ...component.components,
                } || []);
              }
            }
            function setArrayAssets(value: any[], preExportName: string = '', preSubName: string = '') {
              value.forEach((d: any, i: number) => {
                const exportName = [preExportName, i.toString()].filter(d => !!d).join('.');
                const subName = [preSubName, i.toString()].filter(d => !!d).join('.');
                Array.isArray(d) ? setArrayAssets(d, exportName, subName) : setAssetsComponent(d, {
                  exportName,
                  subName,
                });
              });
            }
            if ((window as any)[exportName]) {
              if (Array.isArray((window as any)[exportName])) {
                setArrayAssets((window as any)[exportName] as any);
              } else {
                setAssetsComponent((window as any)[exportName] as any);
              }
            }
            return (window as any)[exportName];
          }),
        );
      }
    }
    const innerAssets = assetsTransform(assets);
    this.context.set('assets', innerAssets);
    this.notifyGot('assets');
  }

  onceGot<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(keyOrType: KeyOrType): Promise<IPublicTypeEditorGetResult<T, KeyOrType>> {
    const x = this.context.get(keyOrType);
    if (x !== undefined) {
      return Promise.resolve(x);
    }
    return new Promise((resolve) => {
      this.setWait(keyOrType, resolve, true);
    });
  }

  onGot<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
    fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void,
  ): () => void {
    const x = this.context.get(keyOrType);
    if (x !== undefined) {
      fn(x);
    }
    this.setWait(keyOrType, fn);
    return () => {
      this.delWait(keyOrType, fn);
    };
  }

  onChange<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
    fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void,
  ): () => void {
    this.setWait(keyOrType, fn);
    return () => {
      this.delWait(keyOrType, fn);
    };
  }

  register(data: any, key?: IPublicTypeEditorValueKey): void {
    this.context.set(key || data, data);
    this.notifyGot(key || data);
  }

  async init(config?: EditorConfig, components?: PluginClassSet): Promise<any> {
    this.config = config || {};
    this.components = components || {};
    const { hooks = [], lifeCycles } = this.config;

    this.emit('editor.beforeInit');
    const init = (lifeCycles && lifeCycles.init) || ((): void => { });

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
        this[type]((message as any), handler);
      }
    });
  };

  unregisterHooks = () => {
    this.hooks.forEach(({ message, handler }) => {
      this.removeListener(message, handler);
    });
  };

  private notifyGot(key: IPublicTypeEditorValueKey) {
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

  private setWait(key: IPublicTypeEditorValueKey, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: IPublicTypeEditorValueKey, fn: any) {
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

export const commonEvent = new EventBus(new EventEmitter());
