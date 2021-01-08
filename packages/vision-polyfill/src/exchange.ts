import { Node } from '@ali/lowcode-designer';
import { designer } from '@ali/lowcode-engine';

export default {
  select: (node: Node) => {
    if (!node) {
      return designer.currentSelection?.clear();
    }
    designer.currentSelection?.select(node.id);
  },
  getSelected: () => {
    const nodes = designer.currentSelection?.getNodes();
    return nodes?.[0];
  },
  /**
   * TODO dirty fix
   */
  onIntoView(func: (node: any, insertion: any) => any) {
    // this.emitter.on('intoview', func);
    return () => {
      // this.emitter.removeListener('intoview', func);
    };
  },
};
