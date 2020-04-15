import Debug from 'debug';
import { EventEmitter } from 'events';
import store from 'store';
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

declare global {
  interface Window {
    __isDebug?: boolean;
    __newFunc?: (funcStr: string) => (...args: any[]) => any;
  }
}

// 根据url参数设置debug选项
const debugRegRes = /_?debug=(.*?)(&|$)/.exec(location.search);
if (debugRegRes && debugRegRes[1]) {
  // eslint-disable-next-line no-underscore-dangle
  window.__isDebug = true;
  store.storage.write('debug', debugRegRes[1] === 'true' ? '*' : debugRegRes[1]);
} else {
  // eslint-disable-next-line no-underscore-dangle
  window.__isDebug = false;
  store.remove('debug');
}

// 重要，用于矫正画布执行new Function的window对象上下文
// eslint-disable-next-line no-underscore-dangle
window.__newFunc = (funContext: string): ((...args: any[]) => any) => {
  // eslint-disable-next-line no-new-func
  return new Function(funContext) as (...args: any[]) => any;
};

// 关闭浏览器前提醒,只有产生过交互才会生效
window.onbeforeunload = function(e: Event): string | void {
  const ev = e || window.event;
  // 本地调试不生效
  if (location.href.indexOf('localhost') > 0) {
    return;
  }
  const msg = '您确定要离开此页面吗？';
  ev.cancelBubble = true;
  ev.returnValue = true;
  if (e.stopPropagation) {
    e.stopPropagation();
    e.preventDefault();
  }
  return msg;
};

let instance: Editor;

const debug = Debug('editor');
EventEmitter.defaultMaxListeners = 100;

export interface HooksFuncs {
  [idx: number]: (msg: string, handler: (...args: []) => void) => void;
}

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

  pluginStatus?: PluginStatusSet;

  plugins?: PluginSet;

  locale?: LocaleType;

  hooksFuncs?: HooksFuncs;

  constructor(readonly config: EditorConfig = {}, readonly componentsMap: PluginClassSet = {}, utils?: Utils) {
    super();
    this.utils = ({ ...editorUtils, ...utils } as any);
    instance = this;
  }

  init(): Promise<any> {
    const { hooks, shortCuts = [], lifeCycles } = this.config || {};
    this.locale = store.get('lowcode-editor-locale') || 'zh-CN';
    // this.messages = this.messagesSet[this.locale];
    // this.i18n = generateI18n(this.locale, this.messages);
    this.pluginStatus = this.initPluginStatus();
    this.initHooks(hooks || []);

    this.emit('editor.beforeInit');
    const init = (lifeCycles && lifeCycles.init) || ((): void => {});
    // 用户可以通过设置extensions.init自定义初始化流程；
    return transformToPromise(init(this))
      .then((): boolean => {
        // 注册快捷键
        registShortCuts(shortCuts, this);
        this.emit('editor.afterInit');
        return true;
      })
      .catch((err): void => {
        console.error(err);
      });
  }

  destroy(): void {
    debug('destroy');
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

  get(key: string): any {
    return (this as any)[key];
  }

  set(key: string | object, val: any): void {
    if (typeof key === 'string') {
      if (['init', 'destroy', 'get', 'set', 'batchOn', 'batchOff', 'batchOnce'].includes(key)) {
        console.error('init, destroy, get, set, batchOn, batchOff, batchOnce is private attribute');
        return;
      }
      // FIXME! set to plugins, not to this
      (this as any)[key] = val;
    } else if (typeof key === 'object') {
      Object.keys(key).forEach((item): void => {
        (this as any)[item] = (key as any)[item];
      });
    }
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
