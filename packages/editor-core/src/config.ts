import { ComponentType } from 'react';
import { get as lodashGet } from 'lodash';

export interface EngineOptions {
  /**
   * 是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示
   */
  enableCondition?: boolean;
  /**
   * 设计模式，live 模式将会实时展示变量值，默认值：'design'
   */
  designMode?: 'design' | 'live';
  /**
   * 设备类型，默认值：'default'
   */
  device?: 'default' | 'mobile' | string;
  /**
   * 语言，默认值：'zh_CN'
   */
  locale?: string;
  /**
   * 渲染器类型，默认值：'react'
   */
  renderEnv?: 'react' | 'rax' | string;
  /**
   * 设备类型映射器，处理设计器与渲染器中 device 的映射
   */
  deviceMapper?: {
    transform: (originalDevice: string) => string;
  };
  /**
   * 开启拖拽组件时，即将被放入的容器是否有视觉反馈，默认值：false
   */
  enableReactiveContainer?: boolean;
  /**
   * 关闭画布自动渲染，在资产包多重异步加载的场景有效，默认值：false
   */
  disableAutoRender?: boolean;
  /**
   * 关闭拖拽组件时的虚线响应，性能考虑，默认值：false
   */
  disableDetecting?: boolean;
  /**
   * 定制画布中点击被忽略的 selectors，默认值：undefined
   */
  customizeIgnoreSelectors?: (defaultIgnoreSelectors: string[]) => string[];
  /**
   * 禁止默认的设置面板，默认值：false
   */
  disableDefaultSettingPanel?: boolean;
  /**
   * 禁止默认的设置器，默认值：false
   */
  disableDefaultSetters?: boolean;
  /**
   * 打开画布的锁定操作，默认值：false
   */
  enableCanvasLock?: boolean;
  /**
   * 容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效， 默认值为：false
   */
  enableLockedNodeSetting?: boolean;
  /**
   * 当选中节点切换时，是否停留在相同的设置 tab 上，默认值：false
   */
  stayOnTheSameSettingTab?: boolean;
  /**
   * 自定义 loading 组件
   */
  loadingComponent?: ComponentType;
  /**
   * 设置所有属性支持变量配置，默认值：false
   */
  supportVariableGlobally?: boolean;
  /**
   * Vision-polyfill settings
   */
  visionSettings?: {
    // 是否禁用降级 reducer，默认值：false
    disableCompatibleReducer?: boolean;
    // 是否开启在 render 阶段开启 filter reducer，默认值：false
    enableFilterReducerInRenderStage?: boolean;
  };

  /**
   * 与 react-renderer 的 appHelper 一致，  https://lowcode-engine.cn/docV2/nhilce#appHelper
   */
  appHelper?: {
    /** 全局公共函数 */
    utils?: Record<string, any>;
    /** 全局常量 */
    constants?: Record<string, any>;
  };

  [key: string]: any;
}

export class EngineConfig {
  private config: { [key: string]: any } = {};

  private waits = new Map<
  string,
  Array<{
    once?: boolean;
    resolve: (data: any) => void;
  }>
  >();

  constructor(config?: { [key: string]: any }) {
    this.config = config || {};
  }

  has(key: string): boolean {
    return this.config[key] !== undefined;
  }

  get(key: string, defaultValue?: any): any {
    return lodashGet(this.config, key, defaultValue);
  }

  set(key: string, value: any) {
    this.config[key] = value;
    this.notifyGot(key);
  }

  setConfig(config: { [key: string]: any }) {
    if (config) {
      Object.keys(config).forEach((key) => {
        this.set(key, config[key]);
      });
    }
  }

  onceGot(key: string): Promise<any> {
    const val = this.config[key];
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise((resolve) => {
      this.setWait(key, resolve, true);
    });
  }

  onGot(key: string, fn: (data: any) => void): () => void {
    const val = this.config?.[key];
    if (val !== undefined) {
      fn(val);
      return () => {};
    } else {
      this.setWait(key, fn);
      return () => {
        this.delWait(key, fn);
      };
    }
  }

  private notifyGot(key: string) {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }

  private setWait(key: string, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: string, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
}

export const engineConfig = new EngineConfig();
