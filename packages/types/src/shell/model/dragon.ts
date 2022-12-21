/* eslint-disable max-len */
import { IPublicTypeDragNodeDataObject, IPublicTypeDragObject } from '../type';
import { IPublicModelDragObject, IPublicModelLocateEvent, IPublicModelNode } from './';

export interface IPublicModelDragon {
  /**
   * is dragging or not
   */
  get dragging(): boolean;

  /**
   * 绑定 dragstart 事件
   * @param func
   * @returns
   */
  onDragstart(func: (e: IPublicModelLocateEvent) => any): () => void;

  /**
   * 绑定 drag 事件
   * @param func
   * @returns
   */
  onDrag(func: (e: IPublicModelLocateEvent) => any): () => void;

  /**
   * 绑定 dragend 事件
   * @param func
   * @returns
   */
  onDragend(func: (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => any): () => void;


  /**
   * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
   * @param shell 拖拽监听的区域
   * @param boost 拖拽转换函数
   */
  from(shell: Element, boost: (e: MouseEvent) => IPublicTypeDragNodeDataObject | null): any;

  /**
   * boost your dragObject for dragging(flying) 发射拖拽对象
   *
   * @param dragObject 拖拽对象
   * @param boostEvent 拖拽初始时事件
   */
  boost(dragObject: IPublicTypeDragObject, boostEvent: MouseEvent | DragEvent, fromRglNode?: Node | IPublicModelNode): void;

  /**
   * 添加投放感应区
   */
  addSensor(sensor: any): void;

  /**
   * 移除投放感应
   */
  removeSensor(sensor: any): void;
}
