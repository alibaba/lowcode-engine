// 仅使用类型
import { Node } from '@ali/lowcode-designer';

export const getClosestNode = (node: Node, until: (node: Node) => boolean): Node | undefined => {
  if (!node) {
    return undefined;
  }
  if (until(node)) {
    return node;
  } else {
    // @ts-ignore
    return getClosestNode(node.getParent(), until);
  }
};
