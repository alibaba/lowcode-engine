import { ComponentType } from 'react';
import { get as lodashGet } from 'lodash';
import { isPlainObject } from '@alilc/lowcode-utils';

import { RequestHandlersMap } from '@alilc/lowcode-datasource-types';

import { getLogger } from './utils/logger';

const logger = getLogger({ level: 'log', bizName: 'config' });

// this default behavior will be different later
const STRICT_PLUGIN_MODE_DEFAULT = true;

// used in strict mode, when only options in this VALID_ENGINE_OPTIONS can be accepted
// type and description are only used for developer`s assistance, won`t affect runtime
const VALID_ENGINE_OPTIONS = {
  enableCondition: {
    type: 'boolean',
    description: '是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示',
  },
  designMode: {
    type: 'string',
    enum: ['design', 'live'],
    default: 'design',
    description: '设计模式，live 模式将会实时展示变量值',
  },
  device: {
    type: 'string',
    enum: ['default', 'mobile', 'any string value'],
    default: 'default',
    description: '设备类型',
  },
  deviceClassName: {
    type: 'string',
    default: undefined,
    description: '指定初始化的 deviceClassName，挂载到画布的顶层节点上',
  },
  locale: {
    type: 'string',
    default: 'zh_CN',
    description: '语言',
  },
  renderEnv: {
    type: 'string',
    enum: ['react', 'rax', 'any string value'],
    default: 'react',
    description: '渲染器类型',
  },
  deviceMapper: {
    type: 'object',
    description: '设备类型映射器，处理设计器与渲染器中 device 的映射',
  },
  enableStrictPluginMode: {
    type: 'boolean',
    default: STRICT_PLUGIN_MODE_DEFAULT,
    description: '开启严格插件模式，默认值: STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过engineOptions传递自定义配置项',
  },
  enableReactiveContainer: {
    type: 'boolean',
    default: false,
    description: '开启拖拽组件时，即将被放入的容器是否有视觉反馈',
  },
  disableAutoRender: {
    type: 'boolean',
    default: false,
    description: '关闭画布自动渲染，在资产包多重异步加载的场景有效',
  },
  disableDetecting: {
    type: 'boolean',
    default: false,
    description: '关闭拖拽组件时的虚线响应，性能考虑',
  },
  customizeIgnoreSelectors: {
    type: 'function',
    default: undefined,
    description: '定制画布中点击被忽略的 selectors, eg. (defaultIgnoreSelectors: string[], e: MouseEvent) => string[]',
  },
  disableDefaultSettingPanel: {
    type: 'boolean',
    default: false,
    description: '禁止默认的设置面板',
  },
  disableDefaultSetters: {
    type: 'boolean',
    default: false,
    description: '禁止默认的设置器',
  },
  enableCanvasLock: {
    type: 'boolean',
    default: false,
    description: '打开画布的锁定操作',
  },
  enableLockedNodeSetting: {
    type: 'boolean',
    default: false,
    description: '容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效',
  },
  stayOnTheSameSettingTab: {
    type: 'boolean',
    default: false,
    description: '当选中节点切换时，是否停留在相同的设置 tab 上',
  },
  hideSettingsTabsWhenOnlyOneItem: {
    type: 'boolean',
    description: '是否在只有一个 item 的时候隐藏设置 tabs',
  },
  loadingComponent: {
    type: 'ComponentType',
    default: undefined,
    description: '自定义 loading 组件',
  },
  supportVariableGlobally: {
    type: 'boolean',
    default: false,
    description: '设置所有属性支持变量配置',
  },
  visionSettings: {
    type: 'object',
    description: 'Vision-polyfill settings',
  },
  simulatorUrl: {
    type: 'array',
    description: '自定义 simulatorUrl 的地址',
  },
  /**
   * 与 react-renderer 的 appHelper 一致，  https://lowcode-engine.cn/docV2/nhilce#appHelper
   */
  appHelper: {
    type: 'object',
    description: '定义 utils 和 constants 等对象',
  },
  requestHandlersMap: {
    type: 'object',
    description: '数据源引擎的请求处理器映射',
  },
  thisRequiredInJSE: {
    type: 'boolean',
    description: 'JSExpression 是否只支持使用 this 来访问上下文变量',
  },
  enableStrictNotFoundMode: {
    type: 'boolean',
    description: '当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件',
  },
  focusNodeSelector: {
    type: 'function',
    description: '配置指定节点为根组件',
  },
};
export interface EngineOptions {
  /**
   * 是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示
   */
  enableCondition?: boolean;
  /**
   * @todo designMode 无法映射到文档渲染模块
   *
   * 设计模式，live 模式将会实时展示变量值，默认值：'design'
   */
  designMode?: 'design' | 'live';
  /**
   * 设备类型，默认值：'default'
   */
  device?: 'default' | 'mobile' | string;
  /**
   * 指定初始化的 deviceClassName，挂载到画布的顶层节点上
   */
  deviceClassName?: string;
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
   * 开启严格插件模式，默认值: STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过engineOptions传递自定义配置项
   * enable strict plugin mode, default value: false
   * under strict mode, customed engineOption is not accepted.
   */
   enableStrictPluginMode?: boolean;
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
  customizeIgnoreSelectors?: (defaultIgnoreSelectors: string[], e: MouseEvent) => string[];
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
   * 是否在只有一个 item 的时候隐藏设置 tabs，默认值：false
   */
  hideSettingsTabsWhenOnlyOneItem?: boolean;
  /**
   * 自定义 loading 组件
   */
  loadingComponent?: ComponentType;
  /**
   * 设置所有属性支持变量配置，默认值：false
   */
  supportVariableGlobally?: boolean;
  /**
   * 设置 simulator 相关的 url，默认值：undefined
   */
  simulatorUrl?: string[];
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

  /**
   * 数据源引擎的请求处理器映射
   */
  requestHandlersMap?: RequestHandlersMap;

  /**
   * @default true
   * JSExpression 是否只支持使用 this 来访问上下文变量，假如需要兼容原来的 'state.xxx'，则设置为 false
   */
  thisRequiredInJSE?: boolean;

  /**
   * @default false
   * 当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件
   */
  enableStrictNotFoundMode?: boolean;

  /**
   * 配置指定节点为根组件
   */
  focusNodeSelector?: (rootNode: Node) => Node;
}

const getStrictModeValue = (engineOptions: EngineOptions, defaultValue: boolean): boolean => {
  if (!engineOptions || !isPlainObject(engineOptions)) {
    return defaultValue;
  }
  if (engineOptions.enableStrictPluginMode === undefined
    || engineOptions.enableStrictPluginMode === null) {
    return defaultValue;
  }
  return engineOptions.enableStrictPluginMode;
};
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

  /**
   * 判断指定 key 是否有值
   * @param key
   * @returns
   */
  has(key: string): boolean {
    return this.config[key] !== undefined;
  }

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   * @returns
   */
  get(key: string, defaultValue?: any): any {
    return lodashGet(this.config, key, defaultValue);
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.config[key] = value;
    this.notifyGot(key);
  }

  /**
   * 批量设值，set 的对象版本
   * @param config
   */
  setConfig(config: { [key: string]: any }) {
    if (config) {
      Object.keys(config).forEach((key) => {
        this.set(key, config[key]);
      });
    }
  }

  /**
   * if engineOptions.strictPluginMode === true, only accept propertied predefined in EngineOptions.
   *
   * @param {EngineOptions} engineOptions
   * @memberof EngineConfig
   */
  setEngineOptions(engineOptions: EngineOptions) {
    if (!engineOptions || !isPlainObject(engineOptions)) {
      return;
    }
    const strictMode = getStrictModeValue(engineOptions, STRICT_PLUGIN_MODE_DEFAULT) === true;
    if (strictMode) {
      const isValidKey = (key: string) => {
        const result = (VALID_ENGINE_OPTIONS as any)[key];
        return !(result === undefined || result === null);
      };
      Object.keys(engineOptions).forEach((key) => {
        if (isValidKey(key)) {
          this.set(key, engineOptions[key]);
        } else {
          logger.warn(`failed to config ${key} to engineConfig, only predefined options can be set under strict mode, predefined options: `, VALID_ENGINE_OPTIONS);
        }
      });
    } else {
      this.setConfig(engineOptions as any);
    }
  }

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: string): Promise<any> {
    const val = this.config[key];
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise((resolve) => {
      this.setWait(key, resolve, true);
    });
  }

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
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
