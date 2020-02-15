import { NpmInfo } from './schema';
import { ComponentClass as ReactComponentClass, Component } from 'react';
import { LocateEvent, SensorInterface } from './dragon';
import { Point } from './document/location';

export interface SimulatorInterface<P = object> extends SensorInterface {
  /**
   * 获得边界维度等信息
   */
  readonly bounds: object;

  // containerAssets // like react jQuery lodash
  // vendorsAssets // antd/fusion
  // themeAssets
  // componentAssets
  // simulatorUrls //
  // layout: ComponentName
  // utils, dataSource, constants 模拟
  // 获取区块代码, 通过 components 传递，可异步获取
  setProps(props: P): void;

  /**
   * 设置编辑模式
   */
  setDesignMode(mode: "live" | "design" | string): void;

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
   * 全局坐标系转化为本地坐标系
   */
  toLocalPoint(point: Point): Point;

  /**
   * 本地坐标系转化为全局坐标系
   */
  toGlobalPoint(point: Point): Point;

  /**
   * 根据组件信息获取组件类
   */
  getComponent(npmInfo: NpmInfo): ComponentClass | any;
  /**
   * 根据节点获取节点的组件实例
   */
  getComponentInstance(node: Node): ComponentInstance[] | null;
  /**
   * 根据节点获取节点的组件运行上下文
   */
  getComponentContext(node: Node): object;

  /**
   * 设置挂起
   */
  setSuspense(suspended: boolean): void;

  /**
   * 销毁
   */
  purge(): void;
}

/**
 * 组件类定义
 */
export type ComponentClass = ReactComponentClass | object;
/**
 * 组件实例定义
 */
export type ComponentInstance = Element | Component<any, any> | object;
