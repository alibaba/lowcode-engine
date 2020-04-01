import { IAppConfig, IUtils, IComponents, HistoryMode } from '../run';

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
    params: object;
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

// export interface IProvider {
//   init?(): void;
//   getAppData?(appkey: string): Promise<IAppData | undefined>;
//   getPageData?(pageId: string): Promise<ComponentModel | undefined>;
//   getLazyComponent?(pageId: string, props: any): any;
//   createApp?(): void;
// }

export default class Provider {
  private components: IComponents = {};
  private utils: IUtils = {};
  private constants: IConstants = {};
  private routes: IRouterConfig | null = null;
  private layout: ILayoutConfig | null = null;
  private componentsMap: IComponentMap[] = [];
  private history: HistoryMode = 'hash';
  private containerId = '';
  private i18n: I18n | null = null;
  private lazyElementsMap: { [key: string]: any } = {};

  constructor() {
    this.init();
  }

  async(): Promise<IAppConfig> {
    return new Promise(async (resolve, reject) => {
      try {
        const appData: IAppData = await this.getAppData();
        if (!appData) {
          return;
        }
        const { history, layout, routes, containerId, components, componentsMap, utils, constants, i18n } = appData;
        this.setHistory(history);
        this.setLayoutConfig(layout);
        this.setRouterConfig(routes);
        this.setContainerId(containerId);
        this.setI18n(i18n);
        this.registerComponents(components);
        this.registerComponentsMap(componentsMap);
        this.registerUtils(utils);
        this.registerContants(constants);
        resolve({
          history,
          components,
          utils,
          containerId,
        });
      } catch (err) {
        reject(err.message);
      }
    });
  }

  async init() {
    console.log('init');
  }

  getAppData(): any {
    throw new Error('Method called "getPageData" not implemented.');
  }

  getPageData(pageId?: string): any {
    throw new Error('Method called "getPageData" not implemented.');
  }

  getLazyComponent(pageId: string, props: any): any {
    throw new Error('Method called "getLazyComponent" not implemented.');
  }

  // 定制构造根组件的逻辑，如切换路由机制
  createApp() {
    throw new Error('Method called "createApp" not implemented.');
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

  setHistory(config: HistoryMode | undefined) {
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

  setI18n(i18n: I18n) {
    if (!i18n) {
      return;
    }
    this.i18n = i18n;
  }

  setlazyElement(pageId: string, cache: any) {
    if (!pageId || !cache) {
      return;
    }
    this.lazyElementsMap[pageId] = cache;
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
    return this.containerId;
  }

  getI18n(locale?: Locale) {
    if (!this.i18n) {
      return;
    }
    return locale ? this.i18n[locale] : this.i18n;
  }

  getlazyElement(pageId: string) {
    if (!pageId) {
      return;
    }
    return this.lazyElementsMap[pageId];
  }
}
