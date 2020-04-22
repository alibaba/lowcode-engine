
import ResultFile from '../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'index',
    'ts',
    `
import { app } from '@ali/lowcode-runtime';
import { ReactProvider } from '@ali/lowcode-runtime';
import Shell from '@ali/vc-shell';
import StaticRender from './plugins/provider';
import Router from '@/router';
import appConfig from '@/config/app';
import components from '@/config/components';
import utils from '@/config/utils';

// 定制加载应用配置的逻辑
class StaticRender extends ReactProvider {
  // 初始化时调用，如可以在这里注入全局API
  init() {
    const gConfig = (window as any).g_config || {};
    const LeGao = {
      __ctx__: {},
      createContext: (cfg: any) => {
        const { schema } = cfg || {};
        // 1. 根据参数拉取schema
        if (schema && typeof schema === 'string') {
          this.setHomePage(schema);
        }
        const { isSectionalRender, autoRender } = gConfig || {};
        if (isSectionalRender && !autoRender) {
          // 2. 渲染
          this.setSectionalRender();
          this.ready();
        }
        const provider = this;
        class Context {
          get utils() {
            return provider.getUtils();
          }
          get components() {
            return provider.getComponents();
          }
        }
        const ctx = new Context();
        (LeGao.__ctx__ as any)[this.getContainerId()] = ctx;
        return ctx;
      },
      getContext: (id: string) => {
        if (!id) {
          for (id in LeGao.__ctx__) {
            return (LeGao.__ctx__ as any)[id];
          }
        }
        return (LeGao.__ctx__ as any)[id];
      }
    };
    (window as any).LeGao = LeGao;
    if (gConfig.index) {
      this.setHomePage(gConfig.index);
    }
    if (gConfig.isSectionalRender) {
      this.setSectionalRender();
      if (!gConfig.autoRender) {
        return;
      }
    }
    this.ready();
  }

  // 定制获取、处理应用配置（组件、插件、路由模式、布局等）的逻辑
  getAppData() {
    return {
      ...appConfig,
      components,
      utils: utils,
    }
  }

  getRouterView() {
    return Router;
  }
}

// 注册布局组件，可注册多个
app.registerLayout(Shell, {
  componentName: 'BasicLayout',
});

app.registerProvider(StaticRender);

app.run();

    `,
  );

  return [['src'], file];
}
  