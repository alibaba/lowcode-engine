import { type Spec, uniqueId, EventDisposable, createCallback } from '@alilc/lowcode-shared';
import { clone } from 'lodash-es';
import { IComponentTreeModel } from '../component-tree-model';

export interface WidgetBuildContext<Component, ComponentInstance = unknown> {
  key: string;

  node: Spec.NodeType;

  model: IComponentTreeModel<Component, ComponentInstance>;

  children?: IWidget<Component, ComponentInstance>[];
}

export interface IWidget<Component, ComponentInstance = unknown> {
  readonly key: string;

  readonly node: Spec.NodeType;

  children?: IWidget<Component, ComponentInstance>[];

  beforeBuild<T extends Spec.NodeType>(beforeGuard: (node: T) => T): EventDisposable;

  build<Element>(
    builder: (context: WidgetBuildContext<Component, ComponentInstance>) => Element,
  ): Element;
}

export class Widget<Component, ComponentInstance = unknown>
  implements IWidget<Component, ComponentInstance>
{
  private beforeGuardCallbacks = createCallback();

  public __raw: Spec.NodeType;

  public node: Spec.NodeType;

  public key: string;

  public children?: IWidget<Component, ComponentInstance>[] | undefined;

  constructor(
    node: Spec.NodeType,
    private model: IComponentTreeModel<Component, ComponentInstance>,
  ) {
    this.node = clone(node);
    this.__raw = node;
    this.key = (node as Spec.ComponentNode)?.id ?? uniqueId();
  }

  beforeBuild<T extends Spec.NodeType>(beforeGuard: (node: T) => T): EventDisposable {
    return this.beforeGuardCallbacks.add(beforeGuard);
  }

  build<Element>(
    builder: (context: WidgetBuildContext<Component, ComponentInstance>) => Element,
  ): Element {
    const beforeGuards = this.beforeGuardCallbacks.list();
    const finalNode = beforeGuards.reduce((prev, cb) => cb(prev), this.node);

    return builder({
      key: this.key,
      node: finalNode,
      model: this.model,
      children: this.children,
    });
  }
}
