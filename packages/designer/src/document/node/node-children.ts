import { obx, computed, makeObservable, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import { Node, INode } from './node';
import { IPublicTypeNodeData, IPublicModelNodeChildren, IPublicEnumTransformStage, IPublicTypeDisposable } from '@alilc/lowcode-types';
import { shallowEqual, compatStage, isNodeSchema } from '@alilc/lowcode-utils';
import { foreachReverse } from '../../utils/tree';
import { NodeRemoveOptions } from '../../types';

export interface IOnChangeOptions {
  type: string;
  node: Node;
}

export interface INodeChildren extends Omit<IPublicModelNodeChildren<INode>,
  'importSchema' |
  'exportSchema' |
  'isEmpty' |
  'notEmpty'
> {
  children: INode[];

  get owner(): INode;

  get length(): number;

  unlinkChild(node: INode): void;

  /**
   * 删除一个节点
   */
  internalDelete(
      node: INode,
      purge: boolean,
      useMutator: boolean,
      options: NodeRemoveOptions
    ): boolean;

  /**
   * 插入一个节点，返回新长度
   */
  internalInsert(node: INode, at?: number | null, useMutator?: boolean): void;

  import(data?: IPublicTypeNodeData | IPublicTypeNodeData[], checkId?: boolean): void;

  /**
   * 导出 schema
   */
  export(stage: IPublicEnumTransformStage): IPublicTypeNodeData[];

  /** following methods are overriding super interface, using different param types */
  /** overriding methods start */

  forEach(fn: (item: INode, index: number) => void): void;

  /**
   * 根据索引获得节点
   */
  get(index: number): INode | null;

  isEmpty(): boolean;

  notEmpty(): boolean;

  internalInitParent(): void;

  onChange(fn: (info?: IOnChangeOptions) => void): IPublicTypeDisposable;

  /** overriding methods end */
}
export class NodeChildren implements INodeChildren {
  @obx.shallow children: INode[];

  private emitter: IEventBus = createModuleEventBus('NodeChildren');

  /**
   * 元素个数
   */
  @computed get size(): number {
    return this.children.length;
  }

  get isEmptyNode(): boolean {
    return this.size < 1;
  }
  get notEmptyNode(): boolean {
    return this.size > 0;
  }

  @computed get length(): number {
    return this.children.length;
  }

  private purged = false;

  get [Symbol.toStringTag]() {
    // 保证向前兼容性
    return 'Array';
  }

  constructor(
      readonly owner: INode,
      data: IPublicTypeNodeData | IPublicTypeNodeData[],
      options: any = {},
    ) {
    makeObservable(this);
    this.children = (Array.isArray(data) ? data : [data]).filter(child => !!child).map((child) => {
      return this.owner.document?.createNode(child, options.checkId);
    });
  }

  internalInitParent() {
    this.children.forEach((child) => child.internalSetParent(this.owner));
  }

  /**
   * 导出 schema
   */
  export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save): IPublicTypeNodeData[] {
    stage = compatStage(stage);
    return this.children.map((node) => {
      const data = node.export(stage);
      if (node.isLeafNode && IPublicEnumTransformStage.Save === stage) {
        // FIXME: filter empty
        return data.children as IPublicTypeNodeData;
      }
      return data;
    });
  }

  import(data?: IPublicTypeNodeData | IPublicTypeNodeData[], checkId = false) {
    data = (data ? (Array.isArray(data) ? data : [data]) : []).filter(d => !!d);

    const originChildren = this.children.slice();
    this.children.forEach((child) => child.internalSetParent(null));

    const children = new Array<Node>(data.length);
    for (let i = 0, l = data.length; i < l; i++) {
      const child = originChildren[i];
      const item = data[i];

      let node: INode | undefined | null;
      if (isNodeSchema(item) && !checkId && child && child.componentName === item.componentName) {
        node = child;
        node.import(item);
      } else {
        node = this.owner.document?.createNode(item, checkId);
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
  concat(nodes: INode[]) {
    return this.children.concat(nodes);
  }

  /**
   *
   */
  isEmpty() {
    return this.isEmptyNode;
  }

  notEmpty() {
    return this.notEmptyNode;
  }

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

  unlinkChild(node: INode) {
    const i = this.children.map(d => d.id).indexOf(node.id);
    if (i < 0) {
      return false;
    }
    this.children.splice(i, 1);
    this.emitter.emit('change', {
      type: 'unlink',
      node,
    });
  }

  /**
   * 删除一个节点
   */
  delete(node: INode): boolean {
    return this.internalDelete(node);
  }

  /**
   * 删除一个节点
   */
  internalDelete(node: INode, purge = false, useMutator = true, options: NodeRemoveOptions = {}): boolean {
    node.internalPurgeStart();
    if (node.isParentalNode) {
      foreachReverse(
        node.children,
        (subNode: Node) => {
          subNode.remove(useMutator, purge, options);
        },
        (iterable, idx) => (iterable as NodeChildren).get(idx),
      );
      foreachReverse(
        node.slots,
        (slotNode: Node) => {
          slotNode.remove(useMutator, purge);
        },
        (iterable, idx) => (iterable as [])[idx],
      );
    }
    // 需要在从 children 中删除 node 前记录下 index，internalSetParent 中会执行删除 (unlink) 操作
    const i = this.children.map(d => d.id).indexOf(node.id);
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
    /* istanbul ignore next */
    const editor = node.document?.designer.editor;
    editor?.eventBus.emit('node.remove', { node, index: i });
    document?.unlinkNode(node);
    document?.selection.remove(node.id);
    document?.destroyNode(node);
    this.emitter.emit('change', {
      type: 'delete',
      node,
    });
    if (useMutator) {
      this.reportModified(node, this.owner, {
        type: 'remove',
        propagated: false,
        isSubDeleting: this.owner.isPurging,
        removeIndex: i,
        removeNode: node,
      });
    }
    // purge 为 true 时，已在 internalSetParent 中删除了子节点
    if (i > -1 && !purge) {
      this.children.splice(i, 1);
    }
    return false;
  }

  insert(node: INode, at?: number | null): void {
    this.internalInsert(node, at, true);
  }

  /**
   * 插入一个节点，返回新长度
   */
  internalInsert(node: INode, at?: number | null, useMutator = true): void {
    const { children } = this;
    let index = at == null || at === -1 ? children.length : at;

    const i = children.map(d => d.id).indexOf(node.id);

    if (node.parent) {
      const editor = node.document?.designer.editor;
      editor?.eventBus.emit('node.remove.topLevel', {
        node,
        index: node.index,
      });
    }

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

    this.emitter.emit('change', {
      type: 'insert',
      node,
    });
    this.emitter.emit('insert', node);
    /* istanbul ignore next */
    const editor = node.document?.designer.editor;
    editor?.eventBus.emit('node.add', { node });
    if (useMutator) {
      this.reportModified(node, this.owner, { type: 'insert' });
    }

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
  indexOf(node: INode): number {
    return this.children.map(d => d.id).indexOf(node.id);
  }

  /**
   *
   */
  splice(start: number, deleteCount: number, node?: INode): INode[] {
    if (node) {
      return this.children.splice(start, deleteCount, node);
    }
    return this.children.splice(start, deleteCount);
  }

  /**
   * 根据索引获得节点
   */
  get(index: number): INode | null {
    return this.children.length > index ? this.children[index] : null;
  }

  /**
   * 是否存在节点
   */
  has(node: INode) {
    return this.indexOf(node) > -1;
  }

  /**
   * 迭代器
   */
  [Symbol.iterator](): { next(): { value: INode } } {
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
  forEach(fn: (item: INode, index: number) => void): void {
    this.children.forEach((child, index) => {
      return fn(child, index);
    });
  }

  /**
   * 遍历
   */
  map<T>(fn: (item: INode, index: number) => T): T[] | null {
    return this.children.map((child, index) => {
      return fn(child, index);
    });
  }

  every(fn: (item: INode, index: number) => any): boolean {
    return this.children.every((child, index) => fn(child, index));
  }

  some(fn: (item: INode, index: number) => any): boolean {
    return this.children.some((child, index) => fn(child, index));
  }

  filter(fn: (item: INode, index: number) => any): any {
    return this.children.filter(fn);
  }

  find(fn: (item: INode, index: number) => boolean): INode | undefined {
    return this.children.find(fn);
  }

  reduce(fn: (acc: any, cur: INode) => any, initialValue: any): void {
    return this.children.reduce(fn, initialValue);
  }

  reverse() {
    return this.children.reverse();
  }

  mergeChildren(
    remover: (node: INode, idx: number) => boolean,
    adder: (children: INode[]) => IPublicTypeNodeData[] | null,
    sorter: (firstNode: INode, secondNode: INode) => number,
  ): any {
    let changed = false;
    if (remover) {
      const willRemove = this.children.filter(remover);
      if (willRemove.length > 0) {
        willRemove.forEach((node) => {
          const i = this.children.map(d => d.id).indexOf(node.id);
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
        items.forEach((child: IPublicTypeNodeData) => {
          const node: INode = this.owner.document?.createNode(child);
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

  onChange(fn: (info?: IOnChangeOptions) => void): IPublicTypeDisposable {
    this.emitter.on('change', fn);
    return () => {
      this.emitter.removeListener('change', fn);
    };
  }

  onInsert(fn: (node: INode) => void) {
    this.emitter.on('insert', fn);
    return () => {
      this.emitter.removeListener('insert', fn);
    };
  }

  private reportModified(node: INode, owner: INode, options = {}) {
    if (!node) {
      return;
    }
    if (node.isRootNode) {
      return;
    }
    const callbacks = owner.componentMeta?.advanced.callbacks;
    if (callbacks?.onSubtreeModified) {
      try {
        callbacks?.onSubtreeModified.call(
          node.internalToShellNode(),
          owner.internalToShellNode(),
          options,
        );
      } catch (e) {
        console.error('error when execute advanced.callbacks.onSubtreeModified', e);
      }
    }

    if (owner.parent && !owner.parent.isRootNode) {
      this.reportModified(node, owner.parent, { ...options, propagated: true });
    }
  }
}
