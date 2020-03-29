import { createElement } from 'react';
import { Provider, Boot, Router, navigator } from '@ali/lowcode-runtime';
import appConfig from '../config/app';
import builtInComps from '../config/components';
import componentsMap from '../config/componentsMap';
import util from '../config/utils';
import { buildComponents } from './utils';

// 定制加载应用配置的逻辑
class PreviewProvider extends Provider {
  // 定制获取、处理应用配置（组件、插件、路由模式、布局等）的逻辑
  async getAppData(appkey: string, restOptions?: any): Promise<any> {
    const { historyMode, layout, constainerId } = appConfig;
    const appSchemaStr: any = localStorage.getItem('lce-dev-store');
    const appSchema = JSON.parse(appSchemaStr || '');
    const history = {
      mode: historyMode || 'hash',
      basement: '/',
    };
    this.layout = layout;
    const routes: any = {};
    appSchema.componentsTree.forEach((page: any, idx: number) => {
      if (!page.fileName) {
        return;
      }
      const pageId = page.fileName;
      routes[pageId] = `/${pageId}`;
    });
    this.routerConfig = routes;
    this.componentsMap = componentsMap;
    this.globalComponents = { ...builtInComps, ...buildComponents({ '@alifd/next': 'Next' }, componentsMap) };
    this.globalUtils = util;
    return {
      history,
      globalComponents: this.globalComponents,
      globalUtils: this.globalUtils,
      constainerId,
    };
  }

  // 定制获取、处理页面 schema 的逻辑
  async getPageData(pageId: string, restOptions?: any) {
    const appSchemaStr = localStorage.getItem('lce-dev-store');
    const appSchema = JSON.parse(appSchemaStr || '');
    const idx = appSchema.componentsTree.findIndex(
      (page: any, idx: number) => (page.fileName || `page${idx}`) === pageId,
    );
    const schema = appSchema.componentsTree[idx];
    return schema;
  }

  // 定制构造根组件的逻辑，如切换路由机制
  createApp() {
    if (!this.routerConfig) {
      return;
    }
    const routes: Array<{ path: string; children: any; exact: boolean; keepAlive: boolean }> = [];
    let homePageId = '';
    Object.keys(this.routerConfig).forEach((pageId: string, idx: number) => {
      if (!pageId) {
        return;
      }
      const path = this.routerConfig[pageId];
      if (idx === 0 || path === '/') {
        homePageId = pageId;
      }
      routes.push({
        path,
        children: (props: any) => this.getLazyComponent(pageId, props),
        exact: true,
        keepAlive: true,
      });
    });
    if (homePageId) {
      routes.push({
        path: '**',
        children: (props: any) => this.getLazyComponent(homePageId, { ...props }),
        exact: true,
        keepAlive: true,
      });
    }
    const RouterView = (props: any) => {
      return createElement(Router as any, {
        routes,
        components: this.globalComponents,
        utils: this.globalUtils,
        componentsMap: this.componentsMap,
        ...props,
      });
    };
    let App;
    if (!this.layout || !(this.layout as any).componentName) {
      App = (props: any) => createElement(RouterView, { ...props });
      return App;
    }
    const { componentName: layoutName, props: layoutProps } = this.layout as any;
    const Layout = Boot.getLayout(layoutName);
    if (Layout) {
      App = (props: any) =>
        createElement(
          Layout,
          {
            ...layoutProps,
            onNavChange: ({ selectedKey }: any) => {
              navigator.goto(`/${selectedKey}`);
            },
          },
          RouterView({ props }),
        );
    } else {
      App = (props: any) => createElement(RouterView, props);
    }
    return App;
  }
}

export default new PreviewProvider();
