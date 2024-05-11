/**
 *  refactor thinking from https://medium.com/@alexandereardon/rethinking-drag-and-drop-d9f5770b4e6b
 */

import { EventDisposable } from '@alilc/lowcode-shared';

export interface Dragon<Node, LocateEvent> {
  /**
   * 是否正在拖动
   * is dragging or not
   */
  readonly dragging: boolean;

  /**
   * 绑定 dragstart 事件
   * bind a callback function which will be called on dragging start
   * @param func
   * @returns
   */
  onDragstart(func: (e: LocateEvent) => any): EventDisposable;

  /**
   * 绑定 drag 事件
   * bind a callback function which will be called on dragging
   * @param func
   * @returns
   */
  onDrag(func: (e: LocateEvent) => any): EventDisposable;

  /**
   * 绑定 dragend 事件
   * bind a callback function which will be called on dragging end
   * @param func
   * @returns
   */
  onDragend(
    func: (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => any,
  ): EventDisposable;

  /**
   * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
   * set a html element as shell to dragon as monitoring target, and
   * set boost function which is used to transform a MouseEvent to type
   * IPublicTypeDragNodeDataObject.
   * @param shell 拖拽监听的区域
   * @param boost 拖拽转换函数
   */
  from(shell: Element, boost: (e: MouseEvent) => IPublicTypeDragNodeDataObject | null): any;

  /**
   * 发射拖拽对象
   * boost your dragObject for dragging(flying)
   *
   * @param dragObject 拖拽对象
   * @param boostEvent 拖拽初始时事件
   */
  boost(
    dragObject: IPublicTypeDragObject,
    boostEvent: MouseEvent | DragEvent,
    fromRglNode?: Node,
  ): void;

  /**
   * 添加投放感应区
   * add sensor area
   */
  addSensor(sensor: any): void;

  /**
   * 移除投放感应
   * remove sensor area
   */
  removeSensor(sensor: any): void;
}

export function createDragon<Node, LocateEvent>(): Dragon<Node, LocateEvent> {
  let dragging = false;
  let activeSensor = undefined;

  const dragon: Dragon<Node, LocateEvent> = {
    get dragging() {
      return dragging;
    },
  };

  return dragon;
}
