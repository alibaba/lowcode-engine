import { dragObjectSymbol } from '../symbols';
import { IPublicModelDragObject, IPublicModelDragObject as InnerDragObject, IPublicTypeDragNodeDataObject, IPublicTypeNodeSchema } from '@alilc/lowcode-types';
import { Node } from './node';

export class DragObject implements IPublicModelDragObject {
  private readonly [dragObjectSymbol]: InnerDragObject;

  constructor(dragObject: InnerDragObject) {
    this[dragObjectSymbol] = dragObject;
  }

  static create(dragObject: InnerDragObject | null): IPublicModelDragObject | null {
    if (!dragObject) {
      return null;
    }
    return new DragObject(dragObject);
  }

  get type() {
    return this[dragObjectSymbol].type;
  }

  get nodes() {
    const { nodes } = this[dragObjectSymbol];
    if (!nodes) {
      return null;
    }
    return nodes.map(Node.create);
  }

  get data(): IPublicTypeNodeSchema | IPublicTypeNodeSchema[] {
    return (this[dragObjectSymbol] as IPublicTypeDragNodeDataObject).data;
  }
}
