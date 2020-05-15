import { Component as ReactComponent, ComponentType } from 'react';
import { ComponentMetadata } from '@ali/lowcode-types';
import { ISensor, Point, ScrollTarget, IScrollable } from './designer';
import { Node } from './document';

export type AutoFit = '100%';
export const AutoFit = '100%';

export interface IViewport extends IScrollable {
  /**
   * 视口大小
   */
  width: number;
  height: number;

  /**
   * 内容大小
   */
  contentWidth: number | AutoFit;
  contentHeight: number | AutoFit;

  /**
   * 内容缩放
   */
  scale: number;

  /**
   * 视口矩形维度
   */
  readonly bounds: DOMRect;
  /**
   * 内容矩形维度
   */
  readonly contentBounds: DOMRect;
  /**
   * 视口滚动对象
   */
  readonly scrollTarget?: ScrollTarget;
  /**
   * 是否滚动中
   */
  readonly scrolling: boolean;
  /**
   * 内容当前滚动 X
   */
  readonly scrollX: number;
  /**
   * 内容当前滚动 Y
   */
  readonly scrollY: number;

  /**
   * 全局坐标系转化为本地坐标系
   */
  toLocalPoint(point: Point): Point;

  /**
   * 本地坐标系转化为全局坐标系
   */
  toGlobalPoint(point: Point): Point;
}

/**
 * 模拟器控制进程协议
 */
export interface ISimulatorHost<P = object> extends ISensor {
  readonly isSimulator: true;
  /**
   * 获得边界维度等信息
   */
  readonly viewport: IViewport;
  readonly contentWindow?: Window;
  readonly contentDocument?: Document;

  // dependsAsset // like react jQuery lodash
  // themesAsset
  // componentsAsset
  // simulatorUrl //
  // utils, dataSource, constants 模拟
  //
  // later:
  // layout: ComponentName
  // 获取区块代码, 通过 components 传递，可异步获取
  // 设置 simulator Props
  setProps(props: P): void;
  // 设置单个 Prop
  set(key: string, value: any): void;

  setSuspense(suspensed: boolean): void;

  // #region ========= drag and drop helpers =============

  /**
   * 设置文字拖选
   */
  setNativeSelection(enableFlag: boolean): void;
  /**
   * 设置拖拽态
   */
  setDraggingState(state: boolean): void;
  /**
   * 设置拷贝态
   */
  setCopyState(state: boolean): void;
  /**
   * 清除所有态：拖拽态、拷贝态
   */
  clearState(): void;

  // #endregion

  /**
   * 滚动视口到节点
   */
  scrollToNode(node: Node, detail?: any): void;

  /**
   * 描述组件
   */
  generateComponentMetadata(componentName: string): ComponentMetadata;
  /**
   * 根据组件信息获取组件类
   */
  getComponent(componentName: string): Component | any;
  /**
   * 根据节点获取节点的组件实例
   */
  getComponentInstances(node: Node): ComponentInstance[] | null;
  /**
   * 根据节点获取节点的组件运行上下文
   */
  getComponentContext(node: Node): object | null;

  getClosestNodeInstance(from: ComponentInstance, specId?: string): NodeInstance | null;

  computeRect(node: Node): DOMRect | null;

  computeComponentInstanceRect(instance: ComponentInstance, selector?: string): DOMRect | null;

  findDOMNodes(instance: ComponentInstance, selector?: string): Array<Element | Text> | null;

  /**
   * 销毁
   */
  purge(): void;
}

export function isSimulatorHost(obj: any): obj is ISimulatorHost {
  return obj && obj.isSimulator;
}

export interface NodeInstance<T = ComponentInstance> {
  nodeId: string;
  instance: T;
  node?: Node | null;
}

/**
 * 组件类定义
 */
export type Component = ComponentType<any> | object;

/**
 * 组件实例定义
 */
export type ComponentInstance = Element | ReactComponent<any> | object;

export interface INodeSelector {
  node: Node;
  instance?: ComponentInstance;
}
