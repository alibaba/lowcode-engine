import Node, { comparePosition } from './node/node';
import { obx } from '@recore/obx';
import DocumentModel from './document-model';
import { EventEmitter } from 'events';

export class Selection {
  @obx.val private selected: string[] = [];
  private emitter = new EventEmitter();

  constructor(private doc: DocumentModel) {}

  /**
   * 选中
   */
  select(id: string) {
    if (this.selected.length === 1 && this.selected.indexOf(id) > -1) {
      // avoid cause reaction
      return;
    }

    this.selected = [id];
    this.emitter.emit('selectionchange');
  }

  /**
   * 批量选中
   */
  selectAll(ids: string[]) {
    this.selected = ids;
    this.emitter.emit('selectionchange');
  }

  /**
   * 清除选中
   */
  clear() {
    if (this.selected.length < 1) {
      return;
    }
    this.selected = [];
    this.emitter.emit('selectionchange');
  }

  /**
   * 整理选中
   */
  dispose() {
    const l = this.selected.length;
    let i = l;
    while (i-- > 0) {
      const id = this.selected[i];
      if (!this.doc.hasNode(id)) {
        this.selected.splice(i, 1);
      }
    }
    if (this.selected.length !== l) {
      this.emitter.emit('selectionchange');
    }
  }

  /**
   * 添加选中
   */
  add(id: string) {
    if (this.selected.indexOf(id) > -1) {
      return;
    }

    this.selected.push(id);
    this.emitter.emit('selectionchange');
  }

  /**
   * 是否选中
   */
  has(id: string) {
    return this.selected.indexOf(id) > -1;
  }

  /**
   * 移除选中
   */
  remove(id: string) {
    let i = this.selected.indexOf(id);
    if (i > -1) {
      this.selected.splice(i, 1);
      this.emitter.emit('selectionchange');
    }
  }

  /**
   * 选区是否包含节点
   */
  containsNode(node: Node) {
    for (const id of this.selected) {
      const parent = this.doc.getNode(id);
      if (parent?.contains(node)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取选中的节点
   */
  getNodes() {
    const nodes = [];
    for (const id of this.selected) {
      const node = this.doc.getNode(id);
      if (node) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  /**
   * 获取顶层选区节点, 场景：拖拽时，建立蒙层，只蒙在最上层
   */
  getTopNodes() {
    const nodes = [];
    for (const id of this.selected) {
      const node = this.doc.getNode(id);
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

  onSelectionChange(fn: () => void): () => void {
    this.emitter.addListener('selectionchange', fn);
    return () => {
      this.emitter.removeListener('selectionchange', fn);
    };
  }
}
