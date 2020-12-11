import { obx, computed } from '@ali/lowcode-editor-core';
import { Node, ParentalNode } from './node';
import { TransformStage } from './transform-stage';
import { NodeData, isNodeSchema } from '@ali/lowcode-types';
import { shallowEqual } from '@ali/lowcode-utils';
import { EventEmitter } from 'events';
import { foreachReverse } from '../../utils/tree';

export class NodeChildren {
  @obx.val private children: Node[];

  private emitter = new EventEmitter();

  constructor(readonly owner: ParentalNode, data: NodeData | NodeData[], options: any = {}) {
    this.children = (Array.isArray(data) ? data : [data]).map(child => {
      return this.owner.document.createNode(child, options.checkId);
    });
  }

  internalInitParent() {
    this.children.forEach(child => child.internalSetParent(this.owner));
  }

  /**
   * 导出 schema
   */
  export(stage: TransformStage = TransformStage.Save): NodeData[] {
    return this.children.map(node => {
      const data = node.export(stage);
      if (node.isLeaf() && TransformStage.Save === stage) {
        // FIXME: filter empty
        return data.children as NodeData;
      }
      return data;
    });
  }

  import(data?: NodeData | NodeData[], checkId = false) {
    data = data ? (Array.isArray(data) ? data : [data]) : [];

    const originChildren = this.children.slice();
    this.children.forEach(child => child.internalSetParent(null));

    const children = new Array<Node>(data.length);
    for (let i = 0, l = data.length; i < l; i++) {
      const child = originChildren[i];
      const item = data[i];

      let node: Node | undefined;
      if (isNodeSchema(item) && !checkId && child && child.componentName === item.componentName) {
        node = child;
        node.import(item);
      } else {
        node = this.owner.document.createNode(item, checkId);
      }
      children[i] = node;
    }

    this.children = children;
    this.internalInitParent();
    if (!shallowEqual(children, originChildren)) {
      this.emitter.emit('change');
    }
  }

  /**
   * @deprecated
   * @param nodes
   */
  concat(nodes: Node[]) {
    return this.children.concat(nodes);
  }

  /**
   * 元素个数
   */
  @computed get size(): number {
    return this.children.length;
  }

  /**
   * 是否空
   */
  @computed isEmpty() {
    return this.size < 1;
  }

  @computed notEmpty() {
    return this.size > 0;
  }

  @computed get length(): number {
    return this.children.length;
  }

  private purged = false;

  /**
   * 回收销毁
   */
  purge(useMutator = true) {
    if (this.purged) {
      return;
    }
    this.purged = true;
    this.children.forEach((child) => {
      child.purge(useMutator);
    });
  }

  unlinkChild(node: Node) {
    const i = this.children.indexOf(node);
    if (i < 0) {
      return false;
    }
    this.children.splice(i, 1);
  }

  /**
   * 删除一个节点
   */
  delete(node: Node, purge = false, useMutator = true): boolean {
    if (node.isParental()) {
      foreachReverse(node.children, (subNode: Node) => {
        subNode.remove(useMutator, purge);
      }, (iterable, idx) => (iterable as NodeChildren).get(idx));
      foreachReverse(node.slots, (slotNode: Node) => {
        slotNode.remove(useMutator, purge);
      }, (iterable, idx) => (iterable as [])[idx]);
    }
    if (purge) {
      // should set parent null
      node.internalSetParent(null, useMutator);
      try {
        node.purge();
      } catch (err) {
        console.error(err);
      }
    }
    const { document } = node;
    document.unlinkNode(node);
    document.selection.remove(node.id);
    document.destroyNode(node);
    this.emitter.emit('change');
    const i = this.children.indexOf(node);
    if (useMutator) {
      this.reportModified(node, this.owner, { type: 'remove', removeIndex: i, removeNode: node });
    }
    if (i < 0) {
      return false;
    }
    this.children.splice(i, 1);
    return false;
  }

  /**
   * 插入一个节点，返回新长度
   */
  insert(node: Node, at?: number | null, useMutator = true): void {
    const { children } = this;
    let index = at == null || at === -1 ? children.length : at;

    const i = children.indexOf(node);

    if (i < 0) {
      if (index < children.length) {
        children.splice(index, 0, node);
      } else {
        children.push(node);
      }
      node.internalSetParent(this.owner, useMutator);
    } else {
      if (index > i) {
        index -= 1;
      }

      if (index === i) {
        return;
      }

      children.splice(i, 1);
      children.splice(index, 0, node);
    }

    this.emitter.emit('change');
    this.emitter.emit('insert', node);
    // this.reportModified(node, this.owner, { type: 'insert' });

    // check condition group
    if (node.conditionGroup) {
      if (
        !(
          // just sort at condition group
          (
            (node.prevSibling && node.prevSibling.conditionGroup === node.conditionGroup) ||
            (node.nextSibling && node.nextSibling.conditionGroup === node.conditionGroup)
          )
        )
      ) {
        node.setConditionGroup(null);
      }
    }
    if (node.prevSibling && node.nextSibling) {
      const { conditionGroup } = node.prevSibling;
      // insert at condition group
      if (conditionGroup && conditionGroup === node.nextSibling.conditionGroup) {
        node.setConditionGroup(conditionGroup);
      }
    }
  }

  /**
   * 取得节点索引编号
   */
  indexOf(node: Node): number {
    return this.children.indexOf(node);
  }

  /**
   *
   */
  splice(start: number, deleteCount: number, node?: Node): Node[] {
    if (node) {
      return this.children.splice(start, deleteCount, node);
    }
    return this.children.splice(start, deleteCount);
  }

  /**
   * 根据索引获得节点
   */
  get(index: number): Node | null {
    return this.children[index] || null;
  }

  /**
   * 是否存在节点
   */
  has(node: Node) {
    return this.indexOf(node) > -1;
  }

  /**
   * 迭代器
   */
  [Symbol.iterator](): { next(): { value: Node } } {
    let index = 0;
    const { children } = this;
    const length = children.length || 0;
    return {
      next() {
        if (index < length) {
          return {
            value: children[index++],
            done: false,
          };
        }
        return {
          value: undefined as any,
          done: true,
        };
      },
    };
  }

  /**
   * 遍历
   */
  forEach(fn: (item: Node, index: number) => void): void {
    this.children.forEach((child, index) => {
      return fn(child, index);
    });
  }

  /**
   * 遍历
   */
  map<T>(fn: (item: Node, index: number) => T): T[] | null {
    return this.children.map((child, index) => {
      return fn(child, index);
    });
  }

  every(fn: (item: Node, index: number) => any): boolean {
    return this.children.every((child, index) => fn(child, index));
  }

  some(fn: (item: Node, index: number) => any): boolean {
    return this.children.some((child, index) => fn(child, index));
  }

  filter(fn: (item: Node, index: number) => any) {
    return this.children.filter(fn);
  }

  find(fn: (item: Node, index: number) => Node) {
    return this.children.find(fn);
  }

  mergeChildren(remover: () => any, adder: (children: Node[]) => NodeData[] | null, sorter: () => any) {
    let changed = false;
    if (remover) {
      const willRemove = this.children.filter(remover);
      if (willRemove.length > 0) {
        willRemove.forEach((node) => {
          const i = this.children.indexOf(node);
          if (i > -1) {
            this.children.splice(i, 1);
            node.remove(false);
          }
        });
        changed = true;
      }
    }
    if (adder) {
      const items = adder(this.children);
      if (items && items.length > 0) {
        items.forEach((child: NodeData) => {
          const node = this.owner.document.createNode(child);
          this.children.push(node);
          node.internalSetParent(this.owner);
        });
        changed = true;
      }
    }
    if (sorter) {
      this.children = this.children.sort(sorter);
      changed = true;
    }
    if (changed) {
      this.emitter.emit('change');
    }
  }

  onChange(fn: () => void) {
    this.emitter.on('change', fn);
    return () => {
      this.emitter.removeListener('change', fn);
    };
  }

  onInsert(fn: (node: Node) => void) {
    this.emitter.on('insert', fn);
    return () => {
      this.emitter.removeListener('insert', fn);
    };
  }

  get [Symbol.toStringTag]() {
    // 保证向前兼容性
    return 'Array';
  }

  // /**
  //  * @deprecated
  //  * 为了兼容vision体系存量api
  //  */
  // getChildrenArray() {
  //   return this.children;
  // }

  private reportModified(node: Node, owner: Node, options = {}) {
    if (!node) {
      return;
    }
    if (node.isRoot()) {
      return;
    }
    const callbacks = owner.componentMeta.getMetadata().experimental?.callbacks;
    if (callbacks?.onSubtreeModified) {
      try {
        callbacks?.onSubtreeModified.call(node, owner, options);
      } catch (e) {
        console.error('error when excute experimental.callbacks.onSubtreeModified', e);
      }
    }

    if (owner.parent && !owner.parent.isRoot()) {
      this.reportModified(node, owner.parent, options);
    }
  }
}
