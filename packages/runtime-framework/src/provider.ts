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

export default abstract class Provider {
  public globalComponents: any = {};
  public globalUtils: any = {};
  public routerConfig: { [key: string]: string } = {};
  public layout: { componentName: string; props: any } | null = null;

  constructor() {
    this.init();
  }

  public create(appkey: string): Promise<IAppData> {
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

  public async init() {
    console.log('init');
  }

  public async getAppData(appkey: string, restOptions?: any): Promise<object> {
    console.log('getAppData');
    return {};
  }

  public async getPageData(pageId: string, restOptions?: any): Promise<any> {
    console.log('getPageData');
    return;
  }

  public getLazyComponent(pageId: string, props: any): ReactElement | null {
    if (!pageId) {
      return null;
    }
    return createElement(LazyComponent as any, { getPageData: async () => await this.getPageData(pageId), ...props });
  }

  public createApp() {
    console.log('createApp');
    return;
  }
}
