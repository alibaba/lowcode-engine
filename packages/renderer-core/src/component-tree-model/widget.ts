import { type NodeType, uniqueId, type ComponentNode } from '@alilc/lowcode-shared';
import { IComponentTreeModel } from './componentTreeModel';

export interface IWidget<Component, ComponentInstance = unknown> {
  readonly key: string;

  readonly rawNode: NodeType;

  readonly model: IComponentTreeModel<Component, ComponentInstance>;

  children?: IWidget<Component, ComponentInstance>[];
}

export class Widget<Component, ComponentInstance = unknown>
  implements IWidget<Component, ComponentInstance>
{
  private _key: string;

  children?: IWidget<Component, ComponentInstance>[] | undefined;

  constructor(
    private _node: NodeType,
    private _model: IComponentTreeModel<Component, ComponentInstance>,
  ) {
    this._key = (_node as ComponentNode)?.id ?? uniqueId();
  }

  get rawNode(): NodeType {
    return this._node;
  }

  get key(): string {
    return this._key;
  }

  get model(): IComponentTreeModel<Component, ComponentInstance> {
    return this._model;
  }
}
