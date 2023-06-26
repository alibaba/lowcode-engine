import { MouseEvent } from 'react';
import { IPublicTypePropType, IPublicTypeComponentAction } from './';
import { IPublicModelNode, IPublicModelSettingField } from '../model';

/**
 * 嵌套控制函数
 */
export type IPublicTypeNestingFilter = (testNode: any, currentNode: any) => boolean;

/**
 * 嵌套控制
 * 防止错误的节点嵌套，比如 a 嵌套 a, FormField 只能在 Form 容器下，Column 只能在 Table 下等
 */
export interface IPublicTypeNestingRule {

  /**
   * 子级白名单
   */
  childWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;

  /**
   * 父级白名单
   */
  parentWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;

  /**
   * 后裔白名单
   */
  descendantWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;

  /**
   * 后裔黑名单
   */
  descendantBlacklist?: string[] | string | RegExp | IPublicTypeNestingFilter;

  /**
   * 祖先白名单 可用来做区域高亮
   */
  ancestorWhitelist?: string[] | string | RegExp | IPublicTypeNestingFilter;
}

/**
 * 组件能力配置
 */
export interface IPublicTypeComponentConfigure {

  /**
   * 是否容器组件
   */
  isContainer?: boolean;

  /**
   * 组件是否带浮层，浮层组件拖入设计器时会遮挡画布区域，此时应当辅助一些交互以防止阻挡
   */
  isModal?: boolean;

  /**
   * 是否存在渲染的根节点
   */
  isNullNode?: boolean;

  /**
   * 组件树描述信息
   */
  descriptor?: string;

  /**
   * 嵌套控制：防止错误的节点嵌套
   * 比如 a 嵌套 a, FormField 只能在 Form 容器下，Column 只能在 Table 下等
   */
  nestingRule?: IPublicTypeNestingRule;

  /**
   * 是否是最小渲染单元
   * 最小渲染单元下的组件渲染和更新都从单元的根节点开始渲染和更新。如果嵌套了多层最小渲染单元，渲染会从最外层的最小渲染单元开始渲染。
   */
  isMinimalRenderUnit?: boolean;

  /**
   * 组件选中框的 cssSelector
   */
  rootSelector?: string;

  /**
   * 禁用的行为，可以为 `'copy'`, `'move'`, `'remove'` 或它们组成的数组
   */
  disableBehaviors?: string[] | string;

  /**
   * 用于详细配置上述操作项的内容
   */
  actions?: IPublicTypeComponentAction[];
}

export interface IPublicTypeInitialItem {
  name: string;
  initial: (target: IPublicModelSettingField, currentValue: any) => any;
}
export interface IPublicTypeFilterItem {
  name: string;
  filter: (target: IPublicModelSettingField | null, currentValue: any) => any;
}
export interface IPublicTypeAutorunItem {
  name: string;
  autorun: (target: IPublicModelSettingField | null) => any;
}

// thinkof Array
/**
 * Live Text Editing（如果 children 内容是纯文本，支持双击直接编辑）的可配置项目
 */
export interface IPublicTypeLiveTextEditingConfig {

  /**
   * @todo 待补充文档
   */
  propTarget: string;

  /**
   * @todo 待补充文档
   */
  selector?: string;

  /**
   * 编辑模式 纯文本 | 段落编辑 | 文章编辑（默认纯文本，无跟随工具条）
   * @default 'plaintext'
   */
  mode?: 'plaintext' | 'paragraph' | 'article';

  /**
   * 从 contentEditable 获取内容并设置到属性
   */
  onSaveContent?: (content: string, prop: any) => any;
}

export type ConfigureSupportEvent = string | ConfigureSupportEventConfig;

export interface ConfigureSupportEventConfig {
  name: string;
  propType?: IPublicTypePropType;
  description?: string;
  template?: string;
}

/**
 * 通用扩展面板支持性配置
 */
export interface ConfigureSupport {

  /**
   * 支持事件列表
   */
  events?: ConfigureSupportEvent[];

  /**
   * 支持 className 设置
   */
  className?: boolean;

  /**
   * 支持样式设置
   */
  style?: boolean;

  /**
   * 支持生命周期设置
   */
  lifecycles?: any[];

  // general?: boolean;
  /**
   * 支持循环设置
   */
  loop?: boolean;

  /**
   * 支持条件式渲染设置
   */
  condition?: boolean;
}

/**
 * handleResizing
 */

/**
 * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
 */
export interface IPublicTypeCallbacks {
  // hooks
  onMouseDownHook?: (e: MouseEvent, currentNode: IPublicModelNode | null) => any;
  onDblClickHook?: (e: MouseEvent, currentNode: IPublicModelNode | null) => any;
  onClickHook?: (e: MouseEvent, currentNode: IPublicModelNode | null) => any;
  // onLocateHook?: (e: any, currentNode: any) => any;
  // onAcceptHook?: (currentNode: any, locationData: any) => any;
  onMoveHook?: (currentNode: IPublicModelNode) => boolean;
  // thinkof 限制性拖拽
  onHoverHook?: (currentNode: IPublicModelNode) => boolean;

  /** 选中 hook，如果返回值是 false，可以控制组件不可被选中 */
  onSelectHook?: (currentNode: IPublicModelNode) => boolean;
  onChildMoveHook?: (childNode: IPublicModelNode, currentNode: IPublicModelNode) => boolean;

  // events
  onNodeRemove?: (removedNode: IPublicModelNode | null, currentNode: IPublicModelNode | null) => void;
  onNodeAdd?: (addedNode: IPublicModelNode | null, currentNode: IPublicModelNode | null) => void;
  onSubtreeModified?: (currentNode: IPublicModelNode, options: any) => void;
  onResize?: (
    e: MouseEvent & {
      trigger: string;
      deltaX?: number;
      deltaY?: number;
    },
    currentNode: any,
  ) => void;
  onResizeStart?: (
    e: MouseEvent & {
      trigger: string;
      deltaX?: number;
      deltaY?: number;
    },
    currentNode: any,
  ) => void;
  onResizeEnd?: (
    e: MouseEvent & {
      trigger: string;
      deltaX?: number;
      deltaY?: number;
    },
    currentNode: IPublicModelNode,
  ) => void;
}
