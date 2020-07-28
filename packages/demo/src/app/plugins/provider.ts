import { ReactProvider } from '@ali/lowcode-runtime';
import { buildComponents } from '@ali/lowcode-utils';
import appConfig from '../config/app';
import builtInComps from '../config/components';
import componentsMap from '../config/componentsMap';
import constants from '../config/constants';
import utils from '../config/utils';

// 定制加载应用配置的逻辑
export default class Preview extends ReactProvider {
  // 定制获取、处理应用配置（组件、插件、路由模式、布局等）的逻辑
  async getAppData(): Promise<any> {
    const { history, layout, containerId } = appConfig;
    const appSchemaStr: any = localStorage.getItem('lce-dev-store');
    if (!appSchemaStr) {
      return;
    }
    const appSchema = JSON.parse(appSchemaStr);
    if (!appSchema) {
      return;
    }
    const routes: any = {};
    appSchema.componentsTree.forEach((page: any) => {
      if (!page.fileName) {
        return;
      }
      const pageId = page.fileName;
      routes[pageId] = `/${pageId}`;
    });
    return {
      history,
      layout,
      routes,
      containerId,
      components: { ...builtInComps, ...buildComponents({ '@alifd/next': 'Next' }, componentsMap) },
      componentsMap,
      utils: utils,
      constants,
    };
  }

  // 定制获取、处理页面 schema 的逻辑
  async getPageData(pageId: string) {
    const appSchemaStr = localStorage.getItem('lce-dev-store');
    const appSchema = JSON.parse(appSchemaStr || '');
    const idx = appSchema.componentsTree.findIndex(
      (page: any, idx: number) => (page.fileName || `page${idx}`) === pageId,
    );
    const schema = appSchema.componentsTree[idx];
    return schema;
  }
}
