import { type NodeType, uniqueId, type ComponentNode } from '@alilc/lowcode-shared';
import { IComponentTreeModel } from '../services/model';

export interface IWidget<Component, ComponentInstance = unknown> {
  readonly key: string;

  readonly rawNode: NodeType;

  model: IComponentTreeModel<Component, ComponentInstance>;

  children?: IWidget<Component, ComponentInstance>[];
}

export class Widget<Component, ComponentInstance = unknown>
  implements IWidget<Component, ComponentInstance>
{
  public rawNode: NodeType;

  public key: string;

  public children?: IWidget<Component, ComponentInstance>[] | undefined;

  constructor(
    node: NodeType,
    public model: IComponentTreeModel<Component, ComponentInstance>,
  ) {
    this.rawNode = node;
    this.key = (node as ComponentNode)?.id ?? uniqueId();
  }
}
