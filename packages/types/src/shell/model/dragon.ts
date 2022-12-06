import { DragNodeDataObject } from '../../dragon';
import { IPublicModelDragObject } from './drag-object';
import { IPublicModelLocateEvent } from './locate-event';

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
  from(shell: Element, boost: (e: MouseEvent) => DragNodeDataObject | null): any;
}
