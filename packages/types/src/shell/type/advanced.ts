import { ComponentType, ReactElement } from 'react';
import { IPublicTypeNodeData, IPublicTypeSnippet, IPublicTypeInitialItem, IPublicTypeFilterItem, IPublicTypeAutorunItem, IPublicTypeCallbacks, IPublicTypeLiveTextEditingConfig } from './';
import { IPublicModelSettingTarget } from '../model';

/**
 * 高级特性配置
 */

export interface IPublicTypeAdvanced {
  /**
   * @todo 待补充文档
   */
  context?: { [contextInfoName: string]: any };
  /**
   * @deprecated 使用组件 metadata 上的 snippets 字段即可
   */
  snippets?: IPublicTypeSnippet[];
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
  initials?: IPublicTypeInitialItem[];
  /**
   * @todo 待补充文档
   */
  filters?: IPublicTypeFilterItem[];
  /**
   * @todo 待补充文档
   */
  autoruns?: IPublicTypeAutorunItem[];
  /**
   * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
   */
  callbacks?: IPublicTypeCallbacks;
  /**
   * 拖入容器时，自动带入 children 列表
   */
  initialChildren?: IPublicTypeNodeData[] | ((target: IPublicModelSettingTarget) => IPublicTypeNodeData[]);
  /**
   * @todo 待补充文档
   */
  isAbsoluteLayoutContainer?: boolean;
  /**
   * @todo 待补充文档
   */
  hideSelectTools?: boolean;

  /**
   * 样式 及 位置，handle 上必须有明确的标识以便事件路由判断，或者主动设置事件独占模式
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
    currentNode: any
  ) => (Array<{
    type: 'N' | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SE' | 'SW';
    content?: ReactElement;
    propTarget?: string;
    appearOn?: 'mouse-enter' | 'mouse-hover' | 'selected' | 'always';
  }> |
    ReactElement[]);

  /**
   * Live Text Editing：如果 children 内容是纯文本，支持双击直接编辑
   */
  liveTextEditing?: IPublicTypeLiveTextEditingConfig[];

  /**
   * @deprecated 暂未使用
   */
  isTopFixed?: boolean;
}
