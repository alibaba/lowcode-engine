import { createElement, ReactElement, ReactType } from 'react';
import LazyComponent from './lazyComponent';

export interface IAppData {
  App: any;
  config: object;
}

interface IComponentsMap {
  [key: string]: ReactType;
}

interface IUtilsMap {
  [key: string]: any;
}

type HistoryMode = 'browser' | 'hash';

export interface IAppConfig {
  history?: HistoryMode;
  globalComponents?: IComponentsMap;
  globalUtils?: IUtilsMap;
  containerId?: string;
}

export default class Provider {
  globalComponents: any = {};
  globalUtils: any = {};
  routerConfig: { [key: string]: string } = {};
  layout: { componentName: string; props: any } | null = null;
  componentsMap: any = null;
  private lazyElementsMap: { [key: string]: any } = {};

  constructor() {
    this.init();
  }

  create(appkey: string): Promise<IAppData> {
    return new Promise(async (resolve, reject) => {
      try {
        const config = await this.getAppData(appkey);
        const App = this.createApp();
        resolve({
          App,
          config,
        });
      } catch (err) {
        reject(err.message);
      }
    });
  }

  async init() {
    console.log('init');
  }

  async getAppData(appkey: string, restOptions?: any): Promise<object> {
    console.log('getAppData');
    return {};
  }

  async getPageData(pageId: string, restOptions?: any): Promise<any> {
    console.log('getPageData');
    return;
  }

  getLazyComponent(pageId: string, props: any): ReactElement | null {
    if (!pageId) {
      return null;
    }
    if (this.lazyElementsMap[pageId]) {
      console.log('缓存');
      return this.lazyElementsMap[pageId];
    } else {
      const lazyElement = createElement(LazyComponent as any, {
        getPageData: async () => await this.getPageData(pageId),
        key: pageId,
        ...props,
      });
      this.lazyElementsMap[pageId] = lazyElement;
      console.log('新组件');
      return lazyElement;
    }
  }

  createApp() {
    console.log('createApp');
    return;
  }
}
