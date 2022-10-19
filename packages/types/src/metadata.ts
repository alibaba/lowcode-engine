import { ReactNode, ComponentType, ReactElement } from 'react';
import { IconType } from './icon';
import { TipContent } from './tip';
import { TitleContent } from './title';
import { PropConfig, PropType } from './prop-config';
import { NpmInfo } from './npm';
import { FieldConfig } from './field-config';
import { NodeSchema, NodeData, ComponentSchema } from './schema';
import { SettingTarget } from './setting-target';
import { I18nData } from './i18n';

/**
 * 嵌套控制函数
 */
export type NestingFilter = (testNode: any, currentNode: any) => boolean;
/**
 * 嵌套控制
 * 防止错误的节点嵌套，比如 a 嵌套 a, FormField 只能在 Form 容器下，Column 只能在 Table 下等
 */
export interface NestingRule {
  /**
   * 子级白名单
   */
  childWhitelist?: string[] | string | RegExp | NestingFilter;
  /**
   * 父级白名单
   */
  parentWhitelist?: string[] | string | RegExp | NestingFilter;
  /**
   * 后裔白名单
   */
  descendantWhitelist?: string[] | string | RegExp | NestingFilter;
  /**
   * 后裔黑名单
   */
  descendantBlacklist?: string[] | string | RegExp | NestingFilter;
  /**
   * 祖先白名单 可用来做区域高亮
   */
  ancestorWhitelist?: string[] | string | RegExp | NestingFilter;
}

/**
 * 组件能力配置
 */
export interface ComponentConfigure {
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
  nestingRule?: NestingRule;

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
  actions?: ComponentAction[];
}

/**
 * 可用片段
 *
 * 内容为组件不同状态下的低代码 schema (可以有多个)，用户从组件面板拖入组件到设计器时会向页面 schema 中插入 snippets 中定义的组件低代码 schema
 */
export interface Snippet {
  /**
   * 组件分类title
   */
  title?: string;
  /**
   * snippet 截图
   */
  screenshot?: string;
  /**
   * snippet 打标
   *
   * @deprecated 暂未使用
   */
  label?: string;
  /**
   * 待插入的 schema
   */
  schema?: NodeSchema;
}

export interface InitialItem {
  name: string;
  initial: (target: SettingTarget, currentValue: any) => any;
}
export interface FilterItem {
  name: string;
  filter: (target: SettingTarget | null, currentValue: any) => any;
}
export interface AutorunItem {
  name: string;
  autorun: (target: SettingTarget) => any;
}

/**
 * 高级特性配置
 */
export interface Advanced {
  /**
   * @todo 待补充文档
   */
  context?: { [contextInfoName: string]: any };
  /**
   * @deprecated 使用组件 metadata 上的 snippets 字段即可
   */
  snippets?: Snippet[];
  /**
   * @todo 待补充文档
   */
  view?: ComponentType<any>;
  /**
   * @todo 待补充文档
   */
  transducers?: any;
  /**
   * @deprecated 用于动态初始化拖拽到设计器里的组件的 prop 的值
   */
  initials?: InitialItem[];
  /**
   * @todo 待补充文档
   */
  filters?: FilterItem[];
  /**
   * @todo 待补充文档
   */
  autoruns?: AutorunItem[];
  /**
   * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
   */
  callbacks?: Callbacks;
  /**
   * 拖入容器时，自动带入 children 列表
   */
  initialChildren?: NodeData[] | ((target: SettingTarget) => NodeData[]);
  /**
   * @todo 待补充文档
   */
  isAbsoluteLayoutContainer?: boolean;
  /**
   * @todo 待补充文档
   */
  hideSelectTools?: boolean;

  /**
   * 样式 及 位置，handle上必须有明确的标识以便事件路由判断，或者主动设置事件独占模式
   * NWSE 是交给引擎计算放置位置，ReactElement 必须自己控制初始位置
   */
  /**
   * 用于配置设计器中组件 resize 操作工具的样式和内容
   * - hover 时控制柄高亮
   * - mousedown 时请求独占
   * - dragstart 请求通用 resizing 控制 请求 hud 显示
   * - drag 时 计算并设置效果，更新控制柄位置
   */
  getResizingHandlers?: (
    currentNode: any,
  ) => (
    | Array<{
      type: 'N' | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SE' | 'SW';
      content?: ReactElement;
      propTarget?: string;
      appearOn?: 'mouse-enter' | 'mouse-hover' | 'selected' | 'always';
    }>
    | ReactElement[]
  );

  /**
   * Live Text Editing：如果 children 内容是纯文本，支持双击直接编辑
   */
  liveTextEditing?: LiveTextEditingConfig[];

  /**
   * @deprecated 暂未使用
   */
  isTopFixed?: boolean;
}

// thinkof Array
/**
 * Live Text Editing（如果 children 内容是纯文本，支持双击直接编辑）的可配置项目
 */
export interface LiveTextEditingConfig {
  /**
   * @todo 待补充文档
   */
  propTarget: string;
  /**
   * @todo 待补充文档
   */
  selector?: string;
  /**
   * 编辑模式 纯文本|段落编辑|文章编辑（默认纯文本，无跟随工具条）
   * @default 'plaintext'
   */
  mode?: 'plaintext' | 'paragraph' | 'article';
  /**
   * 从 contentEditable 获取内容并设置到属性
   */
  onSaveContent?: (content: string, prop: any) => any;
}

export type ConfigureSupportEvent = string | {
  name: string;
  propType?: PropType;
  description?: string;
};

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
 * 编辑体验配置
 */
export interface Configure {
  /**
   * 属性面板配置
   */
  props?: FieldConfig[];
  /**
   * 组件能力配置
   */
  component?: ComponentConfigure;
  /**
   * 通用扩展面板支持性配置
   */
  supports?: ConfigureSupport;
  /**
   * 高级特性配置
   */
  advanced?: Advanced;
}

/**
 * 动作描述
 */
export interface ActionContentObject {
  /**
   * 图标
   */
  icon?: IconType;
  /**
   * 描述
   */
  title?: TipContent;
  /**
   * 执行动作
   */
  action?: (currentNode: any) => void;
}

/**
 * @todo 工具条动作
 */
export interface ComponentAction {
  /**
   * behaviorName
   */
  name: string;
  /**
   * 菜单名称
   */
  content: string | ReactNode | ActionContentObject;
  /**
   * 子集
   */
  items?: ComponentAction[];
  /**
   * 显示与否
   * always: 无法禁用
   */
  condition?: boolean | ((currentNode: any) => boolean) | 'always';
  /**
   * 显示在工具条上
   */
  important?: boolean;
}

export function isActionContentObject(obj: any): obj is ActionContentObject {
  return obj && typeof obj === 'object';
}

/**
 * 组件 meta 配置
 */
export interface ComponentMetadata {
  /**
   * 组件名
   */
  componentName: string;
  /**
   * unique id
   */
  uri?: string;
  /**
   * title or description
   */
  title?: TitleContent;
  /**
   * svg icon for component
   */
  icon?: IconType;
  /**
   * 组件标签
   */
  tags?: string[];
  /**
   * 组件描述
   */
  description?: string;
  /**
   * 组件文档链接
   */
  docUrl?: string;
  /**
   * 组件快照
   */
  screenshot?: string;
  /**
   * 组件研发模式
   */
  devMode?: 'proCode' | 'lowCode';
  /**
   * npm 源引入完整描述对象
   */
  npm?: NpmInfo;
  /**
   * 组件属性信息
   */
  props?: PropConfig[];
  /**
   * 编辑体验增强
   */
  configure?: FieldConfig[] | Configure;
  /**
   * @deprecated, use advanced instead
   */
  experimental?: Advanced;
  /**
   * @todo 待补充文档
   */
  schema?: ComponentSchema;
  /**
   * 可用片段
   */
  snippets?: Snippet[];
  /**
   * 一级分组
   */
  group?: string | I18nData;
  /**
   * 二级分组
   */
  category?: string | I18nData;
  /**
   * 组件优先级排序
   */
  priority?: number;
}

/**
 * @todo 待补充文档
 */
export interface TransformedComponentMetadata extends ComponentMetadata {
  configure: Configure & { combined?: FieldConfig[] };
}

/**
 * handleResizing
 */

/**
 * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
 */
export interface Callbacks {
  // hooks
  onMouseDownHook?: (e: MouseEvent, currentNode: any) => any;
  onDblClickHook?: (e: MouseEvent, currentNode: any) => any;
  onClickHook?: (e: MouseEvent, currentNode: any) => any;
  // onLocateHook?: (e: any, currentNode: any) => any;
  // onAcceptHook?: (currentNode: any, locationData: any) => any;
  onMoveHook?: (currentNode: any) => boolean;
  // thinkof 限制性拖拽
  onHoverHook?: (currentNode: any) => boolean;
  onChildMoveHook?: (childNode: any, currentNode: any) => boolean;

  // events
  onNodeRemove?: (removedNode: any, currentNode: any) => void;
  onNodeAdd?: (addedNode: any, currentNode: any) => void;
  onSubtreeModified?: (currentNode: any, options: any) => void;
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
    currentNode: any,
  ) => void;
}
