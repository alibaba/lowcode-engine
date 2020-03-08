import EventEmitter from 'events';
import Debug from 'debug';
import store from 'store';

import {
  unRegistShortCuts,
  registShortCuts,
  transformToPromise,
  generateI18n,
} from './utils';

// 根据url参数设置debug选项
const res = /_?debug=(.*?)(&|$)/.exec(location.search);
if (res && res[1]) {
  window.__isDebug = true;
  store.storage.write('debug', res[1] === 'true' ? '*' : res[1]);
} else {
  window.__isDebug = false;
  store.remove('debug');
}

//重要，用于矫正画布执行new Function的window对象上下文
window.__newFunc = funContext => {
  return new Function(funContext);
};

//关闭浏览器前提醒,只有产生过交互才会生效
window.onbeforeunload = function(e) {
  e = e || window.event;
  // 本地调试不生效
  if (location.href.indexOf('localhost') > 0) return;
  var msg = '您确定要离开此页面吗？';
  e.cancelBubble = true;
  e.returnValue = msg;
  if (e.stopPropagation) {
    e.stopPropagation();
    e.preventDefault();
  }
  return msg;
};

let instance = null;
const debug = Debug('editor');
EventEmitter.defaultMaxListeners = 100;


export default class Editor extends EventEmitter {
  static getInstance = () => {
    if (!instance) {
      instance = new Editor();
    }
    return instance;
  };

  constructor(config, utils, components) {
    super();
    instance = this;
    this.config = config;
    this.utils = utils;
    this.components = components;
    this.init();
  }

  init() {
    const { hooks, shortCuts, lifeCycles } = this.config || {};
    this.locale = store.get('lowcode-editor-locale') || 'zh-CN';
    // this.messages = this.messagesSet[this.locale];
    // this.i18n = generateI18n(this.locale, this.messages);
    this.pluginStatus = this.initPluginStatus();
    this.initHooks(hooks);

    this.emit('editor.beforeInit');
    const init = (lifeCycles && lifeCycles.init) || (() => {});
    // 用户可以通过设置extensions.init自定义初始化流程；
    return transformToPromise(init(this))
      .then(() => {
        // 注册快捷键
        registShortCuts(shortCuts, this);
        this.emit('editor.afterInit');
      })
      .catch(err => {
        console.error(err);
      });
  }

  destroy() {
    try {
      const { hooks = [], shortCuts = [], lifeCycles = {} } = this.config;
      unRegistShortCuts(shortCuts);
      this.destroyHooks(hooks);
      lifeCycles.destroy && lifeCycles.destroy();
    } catch (err) {
      console.warn(err);
      return;
    }
  }

  get(key: string): any {
    return this[key];
  }

  set(key: string | object, val: any): void {
    if (typeof key === 'string') {
      if (
        [
          'init',
          'destroy',
          'get',
          'set',
          'batchOn',
          'batchOff',
          'batchOnce',
        ].includes(key)
      ) {
        console.warning(
          'init, destroy, get, set, batchOn, batchOff, batchOnce is private attribute',
        );
        return;
      }
      this[key] = val;
    } else if (typeof key === 'object') {
      Object.keys(key).forEach(item => {
        this[item] = key[item];
      });
    }
  }

  batchOn(events: Array<string>, lisenter: function): void {
    if (!Array.isArray(events)) return;
    events.forEach(event => this.on(event, lisenter));
  }

  batchOnce(events: Array<string>, lisenter: function): void {
    if (!Array.isArray(events)) return;
    events.forEach(event => this.once(event, lisenter));
  }

  batchOff(events: Array<string>, lisenter: function): void {
    if (!Array.isArray(events)) return;
    events.forEach(event => this.off(event, lisenter));
  }

  //销毁hooks中的消息监听
  private destroyHooks(hooks = []) {
    hooks.forEach((item, idx) => {
      if (typeof this.__hooksFuncs[idx] === 'function') {
        this.off(item.message, this.__hooksFuncs[idx]);
      }
    });
    delete this.__hooksFuncs;
  }

  //初始化hooks中的消息监听
  private initHooks(hooks = []) {
    this.__hooksFuncs = hooks.map(item => {
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
    const res = {};
    pluginAreas.forEach(area => {
      (plugins[area] || []).forEach(plugin => {
        if (plugin.type === 'Divider') return;
        const { visible, disabled, dotted } = plugin.props || {};
        res[plugin.pluginKey] = {
          visible: typeof visible === 'boolean' ? visible : true,
          disabled: typeof disabled === 'boolean' ? disabled : false,
          dotted: typeof dotted === 'boolean' ? dotted : false,
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
