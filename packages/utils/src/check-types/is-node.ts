import { IPublicModelNode } from '@alilc/lowcode-types';

export function isNode<Node = IPublicModelNode>(node: any): node is Node {
  return node && node.isNode;
}