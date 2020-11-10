import { IAppConfig, IUtils, IComponents, HistoryMode } from './runApp';
import EventEmitter from '@ali/offline-events';

interface IConstants {
  [key: string]: any;
}

interface IComponentMap {
  componentName: string;
  package?: string;
  version?: string;
  destructuring?: boolean;
  exportName?: string;
  subName?: string;
}

interface ILayoutConfig {
  componentName: string;
  props: any;
}

interface IRouterConfig {
  [key: string]: string;
}

interface IHistoryConfig {
  mode: HistoryMode;
  basement?: string;
}

export interface IAppData {
  history?: HistoryMode;
  layout?: ILayoutConfig;
  routes?: IRouterConfig;
  containerId?: string;
  components?: IComponents;
  componentsMap?: IComponentMap[];
  requestHandlersMap?: any;
  utils?: IUtils;
  constants?: IConstants;
  i18n?: I18n;
}

export interface ComponentProps {
  [key: string]: any;
}

export interface JSExpression {
  type: string;
  value: string;
  [key: string]: string;
}

export interface DataSourceItem {
  id: string;
  isInit: boolean;
  type: string;
  options: {
    uri: string;
    params: Record<string, unknown>;
    method: string;
    shouldFetch?: string;
    willFetch?: string;
    fit?: string;
    didFetch?: string;
  };
  dataHandler: JSExpression;
}

export interface DataSource {
  list: DataSourceItem[];
  dataHandler: JSExpression;
}

export interface LifeCycles {
  [key: string]: JSExpression;
}

export interface Methods {
  [key: string]: JSExpression;
}

export interface ComponentModel {
  id?: string;
  componentName: string;
  fileName?: string;
  props?: ComponentProps;
  css?: string;
  dataSource?: DataSource;
  lifeCycles?: LifeCycles;
  methods?: Methods;
  children?: ComponentModel[] | string[];
  condition?: JSExpression | boolean;
  loop?: string[];
  loopArgs?: string[];
}

export interface I18n {
  'zh-CN': { [key: string]: string };
  'en-US': { [key: string]: string };
}

type Locale = 'zh-CN' | 'en-US';

export default class Provider {
  emitter: EventEmitter = new EventEmitter();

  components: IComponents = {};

  utils: IUtils = {};

  constants: IConstants = {};

  routes: IRouterConfig | null = null;

  layout: ILayoutConfig | null = null;

  componentsMap: IComponentMap[] = [];

  // @TODO 类型定义
  requestHandlersMap: any = null;

  history: HistoryMode = 'hash';

  containerId = '';

  i18n: I18n | null = null;

  homePage = '';

  lazyElementsMap: { [key: string]: any } = {};

  isSectionalRender = false;

  constructor() {
    this.init();
  }

  async(): Promise<IAppConfig> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const appData: IAppData = await this.getAppData();
        if (!appData) {
          return;
        }
        const {
          history,
          layout,
          routes,
          containerId,
          components,
          componentsMap,
          requestHandlersMap,
          utils,
          constants,
          i18n,
        } = appData;
        this.setHistory(history);
        this.setLayoutConfig(layout);
        this.setRouterConfig(routes);
        this.setContainerId(containerId);
        this.setI18n(i18n);
        this.registerComponents(components);
        this.registerComponentsMap(componentsMap);
        this.registerUtils(utils);
        this.registerContants(constants);
        this.registerRequestHandlersMap(requestHandlersMap);
        resolve({
          history: this.getHistory(),
          components: this.getComponents(),
          utils: this.getUtils(),
          containerId: this.getContainerId(),
          requestHandlersMap: this.getRequestHandlersMap(),
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  init() {
    // 默认 ready，当重载了init时需手动触发 this.ready()
    this.ready();
  }

  ready(params?: any) {
    if (params && typeof params === 'function') {
      params = params();
    }
    this.emitter.emit('ready', params || '');
  }

  onReady(cb: (params?: any) => void) {
    if (!cb || typeof cb !== 'function') {
      return;
    }
    this.emitter.on('ready', cb);
  }

  emitPageReady(data?: any) {
    this.emitter.emit('pageReady', data || '');
  }

  emitPageEnter(data?: any) {
    this.emitter.emit('pageEnter', data || '');
  }

  emitPageUpdate(data?: any) {
    this.emitter.emit('pageUpdate', data || '');
  }

  emitPageLeave(data?: any) {
    this.emitter.emit('pageLeave', data || '');
  }

  onPageReady(cb: (params?: any) => void) {
    this.emitter.on('pageReady', cb);
    return () => {
      this.emitter.removeListener('pageReady', cb);
    };
  }

  onPageEnter(cb: (params?: any) => void) {
    this.emitter.on('pageEnter', cb);
    return () => {
      this.emitter.removeListener('pageEnter', cb);
    };
  }

  onPageUpdate(cb: (params?: any) => void) {
    this.emitter.on('pageUpdate', cb);
    return () => {
      this.emitter.removeListener('pageUpdate', cb);
    };
  }

  onPageLeave(cb: (params?: any) => void) {
    this.emitter.on('pageLeave', cb);
    return () => {
      this.emitter.removeListener('pageLeave', cb);
    };
  }

  getAppData(): any {
    throw new Error('Method called "getAppData" not implemented.');
  }

  // eslint-disable-next-line
  getPageData(pageId: string): any {
    throw new Error('Method called "getPageData" not implemented.');
  }

  // eslint-disable-next-line
  getLazyComponent(pageId: string, props: any): any {
    throw new Error('Method called "getLazyComponent" not implemented.');
  }

  // 定制构造根组件的逻辑，如切换路由机制
  // eslint-disable-next-line
  createApp(params?: any) {
    throw new Error('Method called "createApp" not implemented.');
  }

  // eslint-disable-next-line
  runApp(App: any, config: IAppConfig) {
    throw new Error('Method called "runApp" not implemented.');
  }

  registerComponents(components: IComponents | undefined) {
    if (!components) {
      return;
    }
    this.components = components;
  }

  registerComponentsMap(componentsMap: IComponentMap[] | undefined) {
    if (!componentsMap) {
      return;
    }
    this.componentsMap = componentsMap;
  }

  registerUtils(utils: IUtils | undefined) {
    if (!utils) {
      return;
    }
    this.utils = utils;
  }

  registerContants(constants: IConstants | undefined) {
    if (!constants) {
      return;
    }
    this.constants = constants;
  }

  registerRequestHandlersMap(requestHandlersMap: any) {
    if (!requestHandlersMap) {
      return;
    }
    this.requestHandlersMap = requestHandlersMap;
  }

  setLayoutConfig(config: ILayoutConfig | undefined) {
    if (!config) {
      return;
    }
    this.layout = config;
  }

  setRouterConfig(config: IRouterConfig | undefined) {
    if (!config) {
      return;
    }
    this.routes = config;
  }

  setHistory(config: HistoryMode | undefined): any {
    if (!config) {
      return;
    }
    this.history = config;
  }

  setContainerId(id: string | undefined) {
    if (!id) {
      return;
    }
    this.containerId = id;
  }

  setI18n(i18n: I18n | undefined) {
    if (!i18n) {
      return;
    }
    this.i18n = i18n;
  }

  setLazyElement(pageId: string, cache: any) {
    if (!pageId || !cache) {
      return;
    }
    this.lazyElementsMap[pageId] = cache;
  }

  setHomePage(pageId: string) {
    if (pageId) {
      this.homePage = pageId;
    }
  }

  getComponents() {
    return this.components;
  }

  getComponent(name: string) {
    if (!name) {
      return;
    }
    return this.components[name];
  }

  getUtils() {
    return this.utils;
  }

  getConstants() {
    return this.constants;
  }

  getRequestHandlersMap() {
    return this.requestHandlersMap;
  }

  getComponentsMap() {
    return this.componentsMap;
  }

  getComponentsMapObj() {
    const compMapArr = this.getComponentsMap();
    if (!compMapArr || !Array.isArray(compMapArr)) {
      return;
    }
    const compMapObj: any = {};
    compMapArr.forEach((item: IComponentMap) => {
      if (!item || !item.componentName) {
        return;
      }
      compMapObj[item.componentName] = item;
    });
    return compMapObj;
  }

  getLayoutConfig() {
    return this.layout;
  }

  getRouterConfig() {
    return this.routes;
  }

  getHistory() {
    return this.history;
  }

  getContainerId() {
    return this.containerId || 'App';
  }

  getI18n(locale?: Locale) {
    if (!this.i18n) {
      return;
    }
    return locale ? this.i18n[locale] : this.i18n;
  }

  getHomePage() {
    return this.homePage;
  }

  getLazyElement(pageId: string) {
    if (!pageId) {
      return;
    }
    return this.lazyElementsMap[pageId];
  }
}
