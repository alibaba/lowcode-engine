import { RequestHandlersMap } from '@alilc/lowcode-datasource-types';
import { ComponentType } from 'react';

export interface IPublicTypeEngineOptions {

  /**
   * 是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示
   * when this is true, node that configured as conditional not renderring
   * will not display in canvas.
   * @default false
   */
  enableCondition?: boolean;

  /**
   * TODO: designMode 无法映射到文档渲染模块
   *
   * 设计模式，live 模式将会实时展示变量值，默认值：'design'
   *
   * @default 'design'
   * @experimental
   */
  designMode?: 'design' | 'live';

  /**
   * 设备类型，默认值：'default'
   * @default 'default'
   */
  device?: 'default' | 'mobile' | string;

  /**
   * 指定初始化的 deviceClassName，挂载到画布的顶层节点上
   */
  deviceClassName?: string;

  /**
   * 语言，默认值：'zh-CN'
   * @default 'zh-CN'
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
   * 开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项
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
   * 容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效，默认值为：false
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
   * @deprecated this exists for some legacy reasons
   */
  visionSettings?: {
    // 是否禁用降级 reducer，默认值：false
    disableCompatibleReducer?: boolean;
    // 是否开启在 render 阶段开启 filter reducer，默认值：false
    enableFilterReducerInRenderStage?: boolean;
  };

  /**
   * 与 react-renderer 的 appHelper 一致，https://lowcode-engine.cn/site/docs/guide/expand/runtime/renderer#apphelper
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

  /**
   * 开启应用级设计模式
   */
  enableWorkspaceMode?: boolean;

  /**
   * @default true
   * 应用级设计模式下，自动打开第一个窗口
   */
  enableAutoOpenFirstWindow?: boolean;
}

/**
 * @deprecated use IPublicTypeEngineOptions instead
 */
export interface EngineOptions {

}