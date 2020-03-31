import { createElement, ReactElement } from 'react';
import { Router } from '@ali/recore';
import app from '../../index';
import Provider from '..';
import LazyComponent from './lazy-component';

export default class ReactProvider extends Provider {
  // 定制构造根组件的逻辑，如切换路由机制
  createApp() {
    const routerConfig = this.getRouterConfig();
    if (!routerConfig) {
      return;
    }
    const routes: Array<{ path: string; children: any; exact: boolean; keepAlive: boolean }> = [];
    let homePageId = '';
    Object.keys(routerConfig).forEach((pageId: string, idx: number) => {
      if (!pageId) {
        return;
      }
      const path = routerConfig[pageId];
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
        components: this.getComponents(),
        utils: this.getUtils(),
        componentsMap: this.getComponentsMapObj(),
        ...props,
      });
    };
    let App;
    const layoutConfig = this.getLayoutConfig();
    if (!layoutConfig || !layoutConfig.componentName) {
      App = (props: any) => createElement(RouterView, { ...props });
      return App;
    }
    const { componentName: layoutName, props: layoutProps } = layoutConfig;
    const Layout = app.getLayout(layoutName);
    if (Layout) {
      App = (props: any) => createElement(Layout, layoutProps, RouterView({ props }));
    } else {
      App = (props: any) => createElement(RouterView, props);
    }
    return App;
  }

  getLazyComponent(pageId: string, props: any): ReactElement | null {
    if (!pageId) {
      return null;
    }
    if (this.getlazyElement(pageId)) {
      return this.getlazyElement(pageId);
    } else {
      const lazyElement = createElement(LazyComponent as any, {
        getPageData: async () => await this.getPageData(pageId),
        key: pageId,
        ...props,
      });
      this.setlazyElement(pageId, lazyElement);
      return lazyElement;
    }
  }
}
