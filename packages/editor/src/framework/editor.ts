import Debug from 'debug';
import EventEmitter from 'events';
import store from 'store';
import { EditorConfig, HooksConfig, LocaleType, PluginComponents, PluginStatus, Utils } from './definitions';

import { registShortCuts, transformToPromise, unRegistShortCuts } from './utils';

// 根据url参数设置debug选项
const res = /_?debug=(.*?)(&|$)/.exec(location.search);
if (res && res[1]) {
  window.__isDebug = true;
  store.storage.write('debug', res[1] === 'true' ? '*' : res[1]);
} else {
  window.__isDebug = false;
  store.remove('debug');
}

// 重要，用于矫正画布执行new Function的window对象上下文
window.__newFunc = funContext => {
return new Function(funContext);
};



// 关闭浏览器前提醒,只有产生过交互才会生效
window.onbeforeunload = function(e) {
  e = e || window.event;
  // 本地调试不生效
  if (location.href.indexOf('localhost') > 0) {
    return;
  }
  const msg = '您确定要离开此页面吗？';
  e.cancelBubble = true;
  e.returnValue = msg;
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
  [idx: number]: (msg: string, handler: (...args) => void) => void;
}

export default class Editor extends EventEmitter {
  public static getInstance = (config: EditorConfig, components: PluginComponents, utils?: Utils): Editor => {
    if (!instance) {
      instance = new Editor(config, components, utils);
    }
    return instance;
  };

  public pluginStatus: PluginStatus;
  public plugins: PluginComponents;
  public locale: LocaleType;

  public emit: (msg: string, ...args) => void;
  public on: (msg: string, handler: (...args) => void) => void;
  public once: (msg: string, handler: (...args) => void) => void;
  public off: (msg: string, handler: (...args) => void) => void;

  private hooksFuncs: HooksFuncs;

  constructor(public config: EditorConfig, public components: PluginComponents, public utils?: Utils) {
    super();
    instance = this;
    this.init();
  }

  public init(): Promise<any> {
    const { hooks, shortCuts = [], lifeCycles } = this.config || {};
    this.locale = store.get('lowcode-editor-locale') || 'zh-CN';
    // this.messages = this.messagesSet[this.locale];
    // this.i18n = generateI18n(this.locale, this.messages);
    this.pluginStatus = this.initPluginStatus();
    this.initHooks(hooks || []);

    this.emit('editor.beforeInit');
    const init = (lifeCycles && lifeCycles.init) || (() => {});
    // 用户可以通过设置extensions.init自定义初始化流程；
    return transformToPromise(init(this))
      .then(() => {
        // 注册快捷键
        registShortCuts(shortCuts, this);
        this.emit('editor.afterInit');
        return true;
      })
      .catch(err => {
        console.error(err);
      });
  }

  public destroy() {
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
      return;
    }
  }

  public get(key: string): any {
    return this[key];
  }

  public set(key: string | object, val: any): void {
    if (typeof key === 'string') {
      if (['init', 'destroy', 'get', 'set', 'batchOn', 'batchOff', 'batchOnce'].includes(key)) {
        console.error('init, destroy, get, set, batchOn, batchOff, batchOnce is private attribute');
        return;
      }
      this[key] = val;
    } else if (typeof key === 'object') {
      Object.keys(key).forEach(item => {
        this[item] = key[item];
      });
    }
  }

  public batchOn(events: string[], lisenter: (...args) => void): void {
    if (!Array.isArray(events)) {
      return;
    }
    events.forEach(event => this.on(event, lisenter));
  }

  public batchOnce(events: string[], lisenter: (...args) => void): void {
    if (!Array.isArray(events)) {
      return;
    }
    events.forEach(event => this.once(event, lisenter));
  }

  public batchOff(events: string[], lisenter: (...args) => void): void {
    if (!Array.isArray(events)) {
      return;
    }
    events.forEach(event => this.off(event, lisenter));
  }

  // 销毁hooks中的消息监听
  private destroyHooks(hooks: HooksConfig = []) {
    hooks.forEach((item, idx) => {
      if (typeof this.hooksFuncs[idx] === 'function') {
        this.off(item.message, this.hooksFuncs[idx]);
      }
    });
    delete this.hooksFuncs;
  }

  // 初始化hooks中的消息监听
  private initHooks(hooks: HooksConfig = []): void {
    this.hooksFuncs = hooks.map(item => {
      const func = (...args) => {
        item.handler(this, ...args);
      };
      this[item.type](item.message, func);
      return func;
    });
  }

  private initPluginStatus() {
    const { plugins = {} } = this.config;
    const pluginAreas = Object.keys(plugins);
    const res: PluginStatus = {};
    pluginAreas.forEach(area => {
      (plugins[area] || []).forEach(plugin => {
        if (plugin.type === 'Divider') {
          return;
        }
        const { visible, disabled, marked } = plugin.props || {};
        res[plugin.pluginKey] = {
          visible: typeof visible === 'boolean' ? visible : true,
          disabled: typeof disabled === 'boolean' ? disabled : false,
          marked: typeof marked === 'boolean' ? marked : false
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
