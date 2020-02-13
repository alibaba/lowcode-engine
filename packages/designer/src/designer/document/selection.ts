import { INode, contains, isNode, comparePosition } from './node';
import { obx } from '@ali/recore';
import DocumentContext from './document-context';

export class Selection {
  @obx.val private selected: string[] = [];

  constructor(private doc: DocumentContext) {}

  select(id: string) {
    if (this.selected.length === 1 && this.selected.indexOf(id) > -1) {
      // avoid cause reaction
      return;
    }

    this.selected = [id];
  }

  selectAll(ids: string[]) {
    this.selected = ids;
  }

  clear() {
    this.selected = [];
  }

  dispose() {
    let i = this.selected.length;
    while (i-- > 0) {
      const id = this.selected[i];
      const node = this.doc.getNode(id, true);
      if (!node) {
        this.selected.splice(i, 1);
      } else if (node.id !== id) {
        this.selected[i] = id;
      }
    }
  }

  add(id: string) {
    if (this.selected.indexOf(id) > -1) {
      return;
    }

    const i = this.findIndex(id);
    if (i > -1) {
      this.selected.splice(i, 1);
    }

    this.selected.push(id);
  }

  private findIndex(id: string): number {
    const ns = getNamespace(id);
    const nsx = `${ns}:`;
    return this.selected.findIndex(idx => {
      return idx === ns || idx.startsWith(nsx);
    });
  }

  has(id: string, variant = false) {
    return this.selected.indexOf(id) > -1 || (variant && this.findIndex(id) > -1);
  }

  del(id: string, variant = false) {
    let i = this.selected.indexOf(id);
    if (i > -1) {
      this.selected.splice(i, 1);
    } else if (variant) {
      i = this.findIndex(id);
      this.selected.splice(i, 1);
    }
  }

  containsNode(node: INode) {
    for (const id of this.selected) {
      const parent = this.doc.getNode(id);
      if (parent && contains(parent, node)) {
        return true;
      }
    }
    return false;
  }

  getNodes() {
    const nodes = [];
    for (const id of this.selected) {
      const node = this.doc.getNode(id, true);
      if (node) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  getOriginNodes(): INode[] {
    const nodes: any[] = [];
    for (const id of this.selected) {
      const node = this.doc.getOriginNode(id);
      if (node && !nodes.includes(node)) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  /**
   * get union items that at top level
   */
  getTopNodes(origin?: boolean) {
    const nodes = [];
    for (const id of this.selected) {
      const node = origin ? this.doc.getOriginNode(id) : this.doc.getNode(id);
      if (!node) {
        continue;
      }
      let i = nodes.length;
      let isTop = true;
      while (i-- > 0) {
        const n = comparePosition(nodes[i], node);
        // nodes[i] contains node
        if (n === 16 || n === 0) {
          isTop = false;
          break;
        }
        // node contains nodes[i], delete nodes[i]
        if (n === 8) {
          nodes.splice(i, 1);
        }
      }
      // node is top item, push to nodes
      if (isTop) {
        nodes.push(node);
      }
    }
    return nodes;
  }
}

function getNamespace(id: string) {
  const i = id.indexOf(':');
  if (i < 0) {
    return id;
  }

  return id.substring(0, i);
}

export function isSelectable(obj: any): obj is INode {
  return isNode(obj);
}
