import { createElement, ReactType, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@recore/router';
import { app, Provider } from '@ali/lowcode-runtime';
import LazyComponent from './lazy-component';

export default class ReactProvider extends Provider {
  // 定制构造根组件的逻辑，如切换路由机制
  createApp() {
    const RouterView = this.getRouterView();
    let App;
    const layoutConfig = this.getLayoutConfig();
    if (!layoutConfig || !layoutConfig.componentName) {
      App = (props: any) => (RouterView ? createElement(RouterView, { ...props }) : null);
      return App;
    }
    const { componentName: layoutName, props: layoutProps } = layoutConfig;
    const { content: Layout, props: extraLayoutProps } = app.getLayout(layoutName) || {};
    const sectionalRender = this.isSectionalRender();
    if (!sectionalRender && Layout) {
      App = (props: any) =>
        createElement(
          Layout,
          { ...layoutProps, ...extraLayoutProps },
          RouterView ? createElement(RouterView, props) : null,
        );
    } else {
      App = (props: any) => (RouterView ? createElement(RouterView, props) : null);
    }
    return App;
  }

  runApp(App: any, config: any) {
    ReactDOM.render(<App />, document.getElementById(config?.containerId || 'App'));
  }

  // 内置实现 for 动态化渲染
  getRouterView(): ReactType | null {
    const routerConfig = this.getRouterConfig();
    if (!routerConfig) {
      return null;
    }
    const routes: Array<{
      path: string;
      children: any;
      exact: boolean;
      defined: { keepAlive: boolean; [key: string]: any };
    }> = [];
    let homePageId = this.getHomePage();
    Object.keys(routerConfig).forEach((pageId: string, idx: number) => {
      if (!pageId) {
        return;
      }
      const path = routerConfig[pageId];
      routes.push({
        path,
        children: (props: any) => this.getLazyComponent(pageId, props),
        exact: true,
        defined: { keepAlive: true },
      });
      if (homePageId) {
        return;
      }
      if (idx === 0 || path === '/') {
        homePageId = pageId;
      }
    });
    if (homePageId) {
      routes.push({
        path: '**',
        children: (props: any) => this.getLazyComponent(homePageId, { ...props }),
        exact: true,
        defined: { keepAlive: true },
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
    return RouterView;
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
