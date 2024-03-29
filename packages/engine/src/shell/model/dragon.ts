import {
  IDragon,
  ILocateEvent as InnerLocateEvent,
  INode,
} from '@alilc/lowcode-designer';
import { dragonSymbol, nodeSymbol } from '../symbols';
import LocateEvent from './locate-event';
import { DragObject } from './drag-object';
import { globalContext } from '@alilc/lowcode-editor-core';
import {
  IPublicModelDragon,
  IPublicModelLocateEvent,
  IPublicModelDragObject,
  IPublicTypeDragNodeDataObject,
  IPublicModelNode,
  IPublicTypeDragObject,
} from '@alilc/lowcode-types';

export const innerDragonSymbol = Symbol('innerDragonSymbol');

export class Dragon implements IPublicModelDragon {
  private readonly [innerDragonSymbol]: IDragon;

  constructor(innerDragon: IDragon, readonly workspaceMode: boolean) {
    this[innerDragonSymbol] = innerDragon;
  }

  get [dragonSymbol](): IDragon {
    if (this.workspaceMode) {
      return this[innerDragonSymbol];
    }
    const workspace = globalContext.get('workspace');
    let editor = globalContext.get('editor');

    if (workspace.isActive) {
      editor = workspace.window.editor;
    }

    const designer = editor.get('designer');
    return designer.dragon;
  }

  static create(
      dragon: IDragon | null,
      workspaceMode: boolean,
    ): IPublicModelDragon | null {
    if (!dragon) {
      return null;
    }
    return new Dragon(dragon, workspaceMode);
  }

  /**
   * is dragging or not
   */
  get dragging(): boolean {
    return this[dragonSymbol].dragging;
  }

  /**
   * 绑定 dragstart 事件
   * @param func
   * @returns
   */
  onDragstart(func: (e: IPublicModelLocateEvent) => any): () => void {
    return this[dragonSymbol].onDragstart((e: InnerLocateEvent) => func(LocateEvent.create(e)!));
  }

  /**
   * 绑定 drag 事件
   * @param func
   * @returns
   */
  onDrag(func: (e: IPublicModelLocateEvent) => any): () => void {
    return this[dragonSymbol].onDrag((e: InnerLocateEvent) => func(LocateEvent.create(e)!));
  }

  /**
   * 绑定 dragend 事件
   * @param func
   * @returns
   */
  onDragend(func: (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => any): () => void {
    return this[dragonSymbol].onDragend(
      (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => {
        const dragObject = DragObject.create(o.dragObject);
        const { copy } = o;
        return func({ dragObject: dragObject!, copy });
      },
    );
  }

  /**
   * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
   * @param shell 拖拽监听的区域
   * @param boost 拖拽转换函数
   */
  from(shell: Element, boost: (e: MouseEvent) => IPublicTypeDragNodeDataObject | null): any {
    return this[dragonSymbol].from(shell, boost as any);
  }

  /**
   * boost your dragObject for dragging(flying) 发射拖拽对象
   *
   * @param dragObject 拖拽对象
   * @param boostEvent 拖拽初始时事件
   */
  boost(dragObject: IPublicTypeDragObject, boostEvent: MouseEvent | DragEvent, fromRglNode?: IPublicModelNode & {
    [nodeSymbol]: INode;
  }): void {
    return this[dragonSymbol].boost({
      ...dragObject,
      nodes: dragObject.nodes.map((node: any) => node[nodeSymbol]),
    } as any, boostEvent, fromRglNode?.[nodeSymbol]);
  }

  /**
   * 添加投放感应区
   */
  addSensor(sensor: any): void {
    return this[dragonSymbol].addSensor(sensor);
  }

  /**
   * 移除投放感应
   */
  removeSensor(sensor: any): void {
    return this[dragonSymbol].removeSensor(sensor);
  }
}
