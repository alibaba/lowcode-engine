import { obx, makeObservable, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import { INode, comparePosition, PositionNO } from './node/node';
import { DocumentModel } from './document-model';
import { IPublicModelSelection } from '@alilc/lowcode-types';

export interface ISelection extends Omit<IPublicModelSelection<INode>, 'node'> {
  containsNode(node: INode, excludeRoot: boolean): boolean;
}

export class Selection implements ISelection {
  private emitter: IEventBus = createModuleEventBus('Selection');

  @obx.shallow private _selected: string[] = [];

  constructor(readonly doc: DocumentModel) {
    makeObservable(this);
  }

  /**
   * 选中的节点 id
   */
  get selected(): string[] {
    return this._selected;
  }

  /**
   * 选中
   */
  select(id: string) {
    if (this._selected.length === 1 && this._selected.indexOf(id) > -1) {
      // avoid cause reaction
      return;
    }

    const node = this.doc.getNode(id);

    if (!node?.canSelect()) {
      return;
    }

    this._selected = [id];
    this.emitter.emit('selectionchange', this._selected);
  }

  /**
   * 批量选中
   */
  selectAll(ids: string[]) {
    const selectIds: string[] = [];

    ids.forEach(d => {
      const node = this.doc.getNode(d);

      if (node?.canSelect()) {
        selectIds.push(d);
      }
    });

    this._selected = selectIds;

    this.emitter.emit('selectionchange', this._selected);
  }

  /**
   * 清除选中
   */
  clear() {
    if (this._selected.length < 1) {
      return;
    }
    this._selected = [];
    this.emitter.emit('selectionchange', this._selected);
  }

  /**
   * 整理选中
   */
  dispose() {
    const l = this._selected.length;
    let i = l;
    while (i-- > 0) {
      const id = this._selected[i];
      if (!this.doc.hasNode(id)) {
        this._selected.splice(i, 1);
      }
    }
    if (this._selected.length !== l) {
      this.emitter.emit('selectionchange', this._selected);
    }
  }

  /**
   * 添加选中
   */
  add(id: string) {
    if (this._selected.indexOf(id) > -1) {
      return;
    }

    this._selected.push(id);
    this.emitter.emit('selectionchange', this._selected);
  }

  /**
   * 是否选中
   */
  has(id: string) {
    return this._selected.indexOf(id) > -1;
  }

  /**
   * 移除选中
   */
  remove(id: string) {
    const i = this._selected.indexOf(id);
    if (i > -1) {
      this._selected.splice(i, 1);
      this.emitter.emit('selectionchange', this._selected);
    }
  }

  /**
   * 选区是否包含节点
   */
  containsNode(node: INode, excludeRoot = false) {
    for (const id of this._selected) {
      const parent = this.doc.getNode(id);
      if (excludeRoot && parent?.contains(this.doc.focusNode)) {
        continue;
      }
      if (parent?.contains(node)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取选中的节点
   */
  getNodes(): INode[] {
    const nodes: INode[] = [];
    for (const id of this._selected) {
      const node = this.doc.getNode(id);
      if (node) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  /**
   * 获取顶层选区节点，场景：拖拽时，建立蒙层，只蒙在最上层
   */
  getTopNodes(includeRoot = false) {
    const nodes = [];
    for (const id of this._selected) {
      const node = this.doc.getNode(id);
      // 排除根节点
      if (!node || (!includeRoot && node.contains(this.doc.focusNode))) {
        continue;
      }
      let i = nodes.length;
      let isTop = true;
      while (i-- > 0) {
        const n = comparePosition(nodes[i], node);
        // nodes[i] contains node
        if (n === PositionNO.Contains || n === PositionNO.TheSame) {
          isTop = false;
          break;
        } else if (n === PositionNO.ContainedBy) {
          // node contains nodes[i], delete nodes[i]
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

  onSelectionChange(fn: (ids: string[]) => void): () => void {
    this.emitter.on('selectionchange', fn);
    return () => {
      this.emitter.removeListener('selectionchange', fn);
    };
  }
}
