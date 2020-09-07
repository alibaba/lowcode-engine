import { createElement, render } from 'rax';
import UniversalDriver from 'driver-universal';
import { app, Provider } from '@ali/lowcode-runtime';
import LazyComponent from './lazy-component';
import getRouter from './router';

export default class RaxProvider extends Provider {
  // 定制构造根组件的逻辑，如切换路由机制
  createApp() {
    const RouterView = this.getRouterView();
    let App;
    const layoutConfig = this.getLayoutConfig();
    if (!layoutConfig || !layoutConfig.componentName) {
      App = (props) => (RouterView ? createElement(RouterView, { ...props }) : null);
      return App;
    }
    const { componentName: layoutName, props: layoutProps } = layoutConfig;
    const { content: Layout, props: extraLayoutProps } = app.getLayout(layoutName) || {};
    const sectionalRender = this.isSectionalRender();
    if (!sectionalRender && Layout) {
      App = (props) =>
        createElement(
          Layout,
          { ...layoutProps, ...extraLayoutProps },
          RouterView ? createElement(RouterView, props) : null,
        );
    } else {
      App = (props) => (RouterView ? createElement(RouterView, props) : null);
    }
    return App;
  }

  runApp(App, config) {
    render(createElement(App), document.getElementById(config?.containerId || 'App'), { driver: UniversalDriver });
  }

  // 内置实现 for 动态化渲染
  getRouterView() {
    const routerConfig = this.getRouterConfig();
    if (!routerConfig) {
      return null;
    }
    const routes = [];
    let homePageId = this.getHomePage();
    Object.keys(routerConfig).forEach((pageId, idx) => {
      if (!pageId) {
        return;
      }
      const path = routerConfig[pageId];
      routes.push({
        path,
        component: (props: any) =>
          this.getLazyComponent(pageId, {
            components: this.getComponents(),
            utils: this.getUtils(),
            componentsMap: this.getComponentsMapObj(),
            ...props,
          }),
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
        component: (props) =>
          this.getLazyComponent(homePageId, {
            components: this.getComponents(),
            utils: this.getUtils(),
            componentsMap: this.getComponentsMapObj(),
            ...props,
          }),
      });
    }
    const Router = getRouter({
      history: this.getHistory(),
      routes,
    });
    const RouterView = (props) => createElement(Router, props);
    return RouterView;
  }

  getLazyComponent(pageId, props) {
    if (!pageId) {
      return null;
    }
    if (this.getlazyElement(pageId)) {
      return this.getlazyElement(pageId);
    }
    const lazyElement = createElement(LazyComponent, {
      // eslint-disable-next-line no-return-await
      getPageData: async () => await this.getPageData(pageId),
      key: pageId,
      ...props,
    });
    this.setlazyElement(pageId, lazyElement);
    return lazyElement;
  }
}
