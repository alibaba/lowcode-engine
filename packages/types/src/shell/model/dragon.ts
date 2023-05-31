/* eslint-disable max-len */
import { IPublicTypeDisposable, IPublicTypeDragNodeDataObject, IPublicTypeDragObject } from '../type';
import { IPublicModelDragObject, IPublicModelLocateEvent, IPublicModelNode } from './';

export interface IPublicModelDragon<
  Node = IPublicModelNode,
  LocateEvent = IPublicModelLocateEvent
> {

  /**
   * 是否正在拖动
   * is dragging or not
   */
  get dragging(): boolean;

  /**
   * 绑定 dragstart 事件
   * bind a callback function which will be called on dragging start
   * @param func
   * @returns
   */
  onDragstart(func: (e: LocateEvent) => any): IPublicTypeDisposable;

  /**
   * 绑定 drag 事件
   * bind a callback function which will be called on dragging
   * @param func
   * @returns
   */
  onDrag(func: (e: LocateEvent) => any): IPublicTypeDisposable;

  /**
   * 绑定 dragend 事件
   * bind a callback function which will be called on dragging end
   * @param func
   * @returns
   */
  onDragend(func: (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => any): IPublicTypeDisposable;

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
  boost(dragObject: IPublicTypeDragObject, boostEvent: MouseEvent | DragEvent, fromRglNode?: Node): void;

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
