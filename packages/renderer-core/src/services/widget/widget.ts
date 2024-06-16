import { type Spec, uniqueId } from '@alilc/lowcode-shared';
import { clone } from 'lodash-es';
import { IComponentTreeModel } from '../model';

export interface IWidget<Component, ComponentInstance = unknown> {
  readonly key: string;

  readonly node: Spec.NodeType;

  model: IComponentTreeModel<Component, ComponentInstance>;

  children?: IWidget<Component, ComponentInstance>[];
}

export class Widget<Component, ComponentInstance = unknown>
  implements IWidget<Component, ComponentInstance>
{
  public __raw: Spec.NodeType;

  public node: Spec.NodeType;

  public key: string;

  public children?: IWidget<Component, ComponentInstance>[] | undefined;

  constructor(
    node: Spec.NodeType,
    public model: IComponentTreeModel<Component, ComponentInstance>,
  ) {
    this.node = clone(node);
    this.__raw = node;
    this.key = (node as Spec.ComponentNode)?.id ?? uniqueId();
  }
}
