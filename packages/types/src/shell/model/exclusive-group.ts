import { IPublicModelNode, IPublicTypeTitleContent } from '..';

export interface IPublicModelExclusiveGroup<
  Node = IPublicModelNode,
> {
  readonly id: string | undefined;
  readonly title: IPublicTypeTitleContent | undefined;
  get firstNode(): Node | null;
  setVisible(node: Node): void;
}
