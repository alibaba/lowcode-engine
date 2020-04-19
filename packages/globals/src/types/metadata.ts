import { ReactNode, ComponentType, ReactElement } from 'react';
import { IconType } from './icon';
import { TipContent } from './tip';
import { TitleContent } from './title';
import { PropConfig } from './prop-config';
import { NpmInfo } from './npm';
import { FieldConfig } from './field-config';
import { NodeSchema } from './schema';

export type NestingFilter = (testNode: any, currentNode: any) => boolean;
export interface NestingRule {
  // 子级白名单
  childWhitelist?: string[] | string | RegExp | NestingFilter;
  // 父级白名单
  parentWhitelist?: string[] | string | RegExp | NestingFilter;
  // 后裔白名单
  descendantWhitelist?: string[] | string | RegExp | NestingFilter;
  // 后裔黑名单
  descendantBlacklist?: string[] | string | RegExp | NestingFilter;
  // 祖先白名单 可用来做区域高亮
  ancestorWhitelist?: string[] | string | RegExp | NestingFilter;
}

export interface ComponentConfigure {
  isContainer?: boolean;
  isModal?: boolean;
  isNullNode?: boolean;
  descriptor?: string;
  nestingRule?: NestingRule;

  rectSelector?: string;
  // copy,move,delete | *
  disableBehaviors?: string[] | string;
  actions?: ComponentAction[];
}

export interface Snippet {
  screenshot: string;
  label: string;
  schema: NodeSchema;
}

export interface Experimental {
  context?: { [contextInfoName: string]: any };
  snippets?: Snippet[];
  view?: ComponentType<any>;
  transducers?: any; // ? should support
  callbacks?: Callbacks;

  // 样式 及 位置，handle上必须有明确的标识以便事件路由判断，或者主动设置事件独占模式
  // NWSE 是交给引擎计算放置位置，ReactElement 必须自己控制初始位置
  getResizingHandlers?: (
    currentNode: any,
  ) =>
    | Array<{
        type: 'N' | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SE' | 'SW';
        content?: ReactElement;
        propTarget?: string;
        appearOn?: 'mouse-enter' | 'mouse-hover' | 'selected' | 'always';
      }>
    | ReactElement[];
  // hover时 控制柄高亮
  // mousedown 时请求独占
  // dragstart 请求 通用 resizing 控制
  //           请求 hud 显示
  // drag 时 计算 并 设置效果
  //     更新控制柄位置
}

export interface Configure {
  props?: FieldConfig[];
  styles?: object;
  events?: object;
  component?: ComponentConfigure;
}

export interface ActionContentObject {
  // 图标
  icon?: IconType;
  // 描述
  title?: TipContent;
  // 执行动作
  action?: (currentNode: any) => void;
}

export interface ComponentAction {
  // behaviorName
  name: string;
  // 菜单名称
  content: string | ReactNode | ActionContentObject;
  // 子集
  items?: ComponentAction[];
  // 显示与否，always: 无法禁用
  condition?: boolean | ((currentNode: any) => boolean) | 'always';
  // 显示在工具条上
  important?: boolean;
}

export function isActionContentObject(obj: any): obj is ActionContentObject {
  return obj && typeof obj === 'object';
}

export interface ComponentMetadata {
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
  tags?: string[];
  description?: string;
  docUrl?: string;
  screenshot?: string;
  devMode?: 'procode' | 'lowcode';
  npm?: NpmInfo;
  props?: PropConfig[];
  configure?: FieldConfig[] | Configure;
  experimental?: Experimental;
}

export interface TransformedComponentMetadata extends ComponentMetadata {
  configure: Configure & { combined?: FieldConfig[] };
}

// handleResizing

// hooks & events
export interface Callbacks {
  // hooks
  onMouseDownHook?: (e: MouseEvent, currentNode: any) => any;
  onDblClickHook?: (e: MouseEvent, currentNode: any) => any;
  onClickHook?: (e: MouseEvent, currentNode: any) => any;
  onLocateHook?: (e: any, currentNode: any) => any;
  onAcceptHook?: (currentNode: any, locationData: any) => any;
  onMoveHook?: (currentNode: any) => boolean; // thinkof 限制性拖拽
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
