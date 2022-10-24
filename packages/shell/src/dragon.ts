import {
  Dragon as InnerDragon,
  DragObject as InnerDragObject,
  DragNodeDataObject,
  LocateEvent as InnerLocateEvent,
  isDragNodeObject,
} from '@alilc/lowcode-designer';
import Node from './node';
import { dragonSymbol, nodeSymbol } from './symbols';
import LocateEvent from './locate-event';
import DragObject from './drag-object';

export default class Dragon {
  private readonly [dragonSymbol]: InnerDragon;

  constructor(dragon: InnerDragon) {
    this[dragonSymbol] = dragon;
  }

  static create(dragon: InnerDragon | null) {
    if (!dragon) return null;
    return new Dragon(dragon);
  }

  /**
   * is dragging or not
   */
  get dragging() {
    return this[dragonSymbol].dragging;
  }

  /**
   * 绑定 dragstart 事件
   * @param func
   * @returns
   */
  onDragstart(func: (e: LocateEvent) => any) {
    return this[dragonSymbol].onDragstart((e: InnerLocateEvent) => func(LocateEvent.create(e)!));
  }

  /**
   * 绑定 drag 事件
   * @param func
   * @returns
   */
  onDrag(func: (e: LocateEvent) => any) {
    return this[dragonSymbol].onDrag((e: InnerLocateEvent) => func(LocateEvent.create(e)!));
  }

  /**
   * 绑定 dragend 事件
   * @param func
   * @returns
   */
  onDragend(func: (o: { dragObject: DragObject; copy?: boolean }) => any) {
    return this[dragonSymbol].onDragend(
      (o: { dragObject: InnerDragObject; copy?: boolean }) => func({
        dragObject: DragObject.create(o.dragObject)!,
        copy: o.copy,
      }),
    );
  }

  /**
   * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
   * @param shell 拖拽监听的区域
   * @param boost 拖拽转换函数
   */
  from(shell: Element, boost: (e: MouseEvent) => DragNodeDataObject | null) {
    return this[dragonSymbol].from(shell, boost);
  }

  /**
   * boost a drag event
   * @param dragObject
   * @param boostEvent
   * @returns
   */
  boost(dragObject: DragObject, boostEvent: MouseEvent | DragEvent) {
    let innerDragObject: InnerDragObject = dragObject;
    if (isDragNodeObject(dragObject)) {
      innerDragObject.nodes = innerDragObject.nodes.map((node: Node) => (node[nodeSymbol] || node));
    }
    return this[dragonSymbol].boost(dragObject, boostEvent);
  }

  addSensor(sensor: any) {
    this[dragonSymbol].addSensor(sensor);
  }

  removeSensor(sensor: any) {
    this[dragonSymbol].removeSensor(sensor);
  }
}
