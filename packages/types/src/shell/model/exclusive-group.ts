import { IPublicModelNode } from '..';

export interface IPublicModelExclusiveGroup {
  readonly id: string;
  readonly title: string;
  get firstNode(): IPublicModelNode;
  setVisible(node: Node): void;
}
