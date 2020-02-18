import { Component as ReactComponent, ComponentType } from 'react';
import { LocateEvent, ISensor } from './dragon';
import { Point } from './location';
import Node from './document/node/node';
import { ScrollTarget, IScrollable } from './scroller';
import { ComponentDescriptionSpec } from './document/node/component-config';

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
  readonly scrollTarget?: ScrollTarget;
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
export interface ISimulator<P = object> extends ISensor {
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
  setProps(props: P): void;

  /**
   * 设置拖拽态
   */
  setDraggingState(state: boolean): void;

  /**
   * 是否拖拽态
   */
  isDraggingState(): boolean;

  /**
   * 设置拷贝态
   */
  setCopyState(state: boolean): void;

  /**
   * 是否拷贝态
   */
  isCopyState(): boolean;

  /**
   * 清除所有态：拖拽态、拷贝态
   */
  clearState(): void;

  /**
   * 在模拟器拖拽定位
   */
  locate(e: LocateEvent): any;

  /**
   * 滚动视口到节点
   */
  scrollToNode(node: Node, detail?: any): void;

  /**
   * 给 event 打补丁，添加 canvasX, globalX 等信息，用于拖拽
   */
  fixEvent(e: LocateEvent): LocateEvent;

  /**
   * 描述组件
   */
  describeComponent(component: Component): ComponentDescriptionSpec;
  /**
   * 根据组件信息获取组件类
   */
  getComponent(componentName: string): Component | any;
  /**
   * 根据节点获取节点的组件实例
   */
  getComponentInstance(node: Node): ComponentInstance[] | null;
  /**
   * 根据节点获取节点的组件运行上下文
   */
  getComponentContext(node: Node): object | null;

  getClosestNodeId(elem: Element): string | null;

  computeComponentInstanceRect(instance: ComponentInstance): DOMRect | null;

  findDOMNodes(instance: ComponentInstance): Array<Element | Text> | null;

  setSuspense(suspensed: boolean): void;
  /**
   * 销毁
   */
  purge(): void;
}

/**
 * 组件类定义
 */
export type Component = ComponentType<any> | object;

/**
 * 组件实例定义
 */
export type ComponentInstance = Element | ReactComponent<any> | object;

export interface INodeInstance {
  node: Node;
  instance?: ComponentInstance;
}
