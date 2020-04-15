import { Node } from '@ali/lowcode-designer';
import { designer } from './editor';

export default {
  select: (node: Node) => {
    if (!node) {
      return designer.currentSelection?.clear();
    }
    designer.currentSelection?.select(node.id);
  },
  getSelected: () => {
    const nodes = designer.currentSelection?.getNodes();
    return nodes;
  },
}
