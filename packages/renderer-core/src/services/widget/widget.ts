import { type Spec, uniqueId } from '@alilc/lowcode-shared';
import { IComponentTreeModel } from '../model';

export interface IWidget<Component, ComponentInstance = unknown> {
  readonly key: string;

  readonly rawNode: Spec.NodeType;

  model: IComponentTreeModel<Component, ComponentInstance>;

  children?: IWidget<Component, ComponentInstance>[];
}

export class Widget<Component, ComponentInstance = unknown>
  implements IWidget<Component, ComponentInstance>
{
  public rawNode: Spec.NodeType;

  public key: string;

  public children?: IWidget<Component, ComponentInstance>[] | undefined;

  constructor(
    node: Spec.NodeType,
    public model: IComponentTreeModel<Component, ComponentInstance>,
  ) {
    this.rawNode = node;
    this.key = (node as Spec.ComponentNode)?.id ?? uniqueId();
  }
}
