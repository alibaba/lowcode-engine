import { DragObject as InnerDragObject, DragNodeDataObject } from '@alilc/lowcode-designer';
import { dragObjectSymbol } from './symbols';
import Node from './node';

export default class DragObject {
  private readonly [dragObjectSymbol]: InnerDragObject;

  constructor(dragObject: InnerDragObject) {
    this[dragObjectSymbol] = dragObject;
  }

  static create(dragObject: InnerDragObject) {
    if (!dragObject) return null;
    return new DragObject(dragObject);
  }

  get type() {
    return this[dragObjectSymbol].type;
  }

  get nodes() {
    const { nodes } = this[dragObjectSymbol];
    if (!nodes) return null;
    return nodes.map(Node.create);
  }

  get data() {
    return (this[dragObjectSymbol] as DragNodeDataObject).data;
  }
}