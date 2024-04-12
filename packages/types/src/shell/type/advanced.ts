import { ComponentType, ReactElement } from 'react';
import { IPublicTypeNodeData, IPublicTypeSnippet, IPublicTypeInitialItem, IPublicTypeCallbacks, IPublicTypeLiveTextEditingConfig } from './';
import { IPublicModelNode } from '../model';

/**
 * 高级特性配置
 */
export interface IPublicTypeAdvanced {

  /**
   * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
   * callbacks/hooks which can be used to do
   * things on some special ocations like onNodeAdd or onResize
   */
  callbacks?: IPublicTypeCallbacks;

  /**
   * 拖入容器时，自动带入 children 列表
   */
  initialChildren?: IPublicTypeNodeData[] | ((target: IPublicModelNode) => IPublicTypeNodeData[]);

  /**
   * 样式 及 位置，handle 上必须有明确的标识以便事件路由判断，或者主动设置事件独占模式
   * NWSE 是交给引擎计算放置位置，ReactElement 必须自己控制初始位置
   *
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
   * 是否绝对布局容器，还未进入协议
   * @experimental not in spec yet
   */
  isAbsoluteLayoutContainer?: boolean;

  /**
   * hide bem tools when selected
   * @experimental not in spec yet
   */
  hideSelectTools?: boolean;

  /**
   * Live Text Editing：如果 children 内容是纯文本，支持双击直接编辑
   * @experimental not in spec yet
   */
  liveTextEditing?: IPublicTypeLiveTextEditingConfig[];

  /**
   * TODO: 补充文档
   * @experimental not in spec yet
   */
  view?: ComponentType<any>;
}
