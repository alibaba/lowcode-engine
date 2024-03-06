import { INode as InnerNode, INodeChildren } from '@alilc/lowcode-designer';
import { IPublicTypeNodeData, IPublicEnumTransformStage, IPublicModelNodeChildren, IPublicModelNode } from '@alilc/lowcode-types';
import { Node as ShellNode } from './node';
import { nodeSymbol, nodeChildrenSymbol } from '../symbols';

export class NodeChildren implements IPublicModelNodeChildren {
  private readonly [nodeChildrenSymbol]: INodeChildren;

  constructor(nodeChildren: INodeChildren) {
    this[nodeChildrenSymbol] = nodeChildren;
  }

  static create(nodeChildren: INodeChildren | null): IPublicModelNodeChildren | null {
    if (!nodeChildren) {
      return null;
    }
    return new NodeChildren(nodeChildren);
  }

  /**
   * 返回当前 children 实例所属的节点实例
   */
  get owner(): IPublicModelNode | null {
    return ShellNode.create(this[nodeChildrenSymbol].owner);
  }

  /**
   * children 内的节点实例数
   */
  get size(): number {
    return this[nodeChildrenSymbol].size;
  }

  /**
   * @deprecated
   * 是否为空
   * @returns
   */
  get isEmpty(): boolean {
    return this[nodeChildrenSymbol].isEmptyNode;
  }

  /**
   * 是否为空
   * @returns
   */
  get isEmptyNode(): boolean {
    return this[nodeChildrenSymbol].isEmptyNode;
  }

  /**
   * @deprecated
   * judge if it is not empty
   */
  get notEmpty(): boolean {
    return this[nodeChildrenSymbol].notEmptyNode;
  }

  /**
   * judge if it is not empty
   */
  get notEmptyNode(): boolean {
    return this[nodeChildrenSymbol].notEmptyNode;
  }

  /**
   * 删除指定节点
   * delete the node
   * @param node
   */
  delete(node: IPublicModelNode): boolean {
    return this[nodeChildrenSymbol].delete((node as any)?.[nodeSymbol]);
  }

  /**
   * 插入一个节点
   * @param node 待插入节点
   * @param at 插入下标
   * @returns
   */
  insert(node: IPublicModelNode, at?: number | null): void {
    return this[nodeChildrenSymbol].insert((node as any)?.[nodeSymbol], at);
  }

  /**
   * 返回指定节点的下标
   * @param node
   * @returns
   */
  indexOf(node: IPublicModelNode): number {
    return this[nodeChildrenSymbol].indexOf((node as any)?.[nodeSymbol]);
  }

  /**
   * 类似数组 splice 操作
   * @param start
   * @param deleteCount
   * @param node
   */
  splice(start: number, deleteCount: number, node?: IPublicModelNode): IPublicModelNode[] {
    const removedNode = this[nodeChildrenSymbol].splice(start, deleteCount, (node as any)?.[nodeSymbol]);
    return removedNode.map((item: InnerNode) => ShellNode.create(item)!);
  }

  /**
   * 返回指定下标的节点
   * @param index
   * @returns
   */
  get(index: number): IPublicModelNode | null {
    return ShellNode.create(this[nodeChildrenSymbol].get(index));
  }

  /**
   * 是否包含指定节点
   * @param node
   * @returns
   */
  has(node: IPublicModelNode): boolean {
    return this[nodeChildrenSymbol].has((node as any)?.[nodeSymbol]);
  }

  /**
   * 类似数组的 forEach
   * @param fn
   */
  forEach(fn: (node: IPublicModelNode, index: number) => void): void {
    this[nodeChildrenSymbol].forEach((item: InnerNode, index: number) => {
      fn(ShellNode.create(item)!, index);
    });
  }

  /**
   * 类似数组的 reverse
   */
  reverse(): IPublicModelNode[] {
    return this[nodeChildrenSymbol].reverse().map(d => {
      return ShellNode.create(d)!;
    });
  }

  /**
   * 类似数组的 map
   * @param fn
   */
  map<T = any>(fn: (node: IPublicModelNode, index: number) => T): T[] | null {
    return this[nodeChildrenSymbol].map<T>((item: InnerNode, index: number): T => {
      return fn(ShellNode.create(item)!, index);
    });
  }

  /**
   * 类似数组的 every
   * @param fn
   */
  every(fn: (node: IPublicModelNode, index: number) => boolean): boolean {
    return this[nodeChildrenSymbol].every((item: InnerNode, index: number) => {
      return fn(ShellNode.create(item)!, index);
    });
  }

  /**
   * 类似数组的 some
   * @param fn
   */
  some(fn: (node: IPublicModelNode, index: number) => boolean): boolean {
    return this[nodeChildrenSymbol].some((item: InnerNode, index: number) => {
      return fn(ShellNode.create(item)!, index);
    });
  }

  /**
   * 类似数组的 filter
   * @param fn
   */
  filter(fn: (node: IPublicModelNode, index: number) => boolean): any {
    return this[nodeChildrenSymbol]
      .filter((item: InnerNode, index: number) => {
        return fn(ShellNode.create(item)!, index);
      })
      .map((item: InnerNode) => ShellNode.create(item)!);
  }

  /**
   * 类似数组的 find
   * @param fn
   */
  find(fn: (node: IPublicModelNode, index: number) => boolean): IPublicModelNode | null {
    return ShellNode.create(
      this[nodeChildrenSymbol].find((item: InnerNode, index: number) => {
        return fn(ShellNode.create(item)!, index);
      }),
    );
  }

  /**
   * 类似数组的 reduce
   * @param fn
   */
  reduce(fn: (acc: any, cur: IPublicModelNode) => any, initialValue: any): void {
    return this[nodeChildrenSymbol].reduce((acc: any, cur: InnerNode) => {
      return fn(acc, ShellNode.create(cur)!);
    }, initialValue);
  }

  /**
   * 导入 schema
   * @param data
   */
  importSchema(data?: IPublicTypeNodeData | IPublicTypeNodeData[]): void {
    this[nodeChildrenSymbol].import(data);
  }

  /**
   * 导出 schema
   * @param stage
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render): any {
    return this[nodeChildrenSymbol].export(stage);
  }

  /**
   * 执行新增、删除、排序等操作
   * @param remover
   * @param adder
   * @param sorter
   */
  mergeChildren(
    remover: (node: IPublicModelNode, idx: number) => boolean,
    adder: (children: IPublicModelNode[]) => any,
    originalSorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number,
  ) {
    let sorter = originalSorter;
    if (!sorter) {
      sorter = () => 0;
    }
    this[nodeChildrenSymbol].mergeChildren(
      (node: InnerNode, idx: number) => remover(ShellNode.create(node)!, idx),
      (children: InnerNode[]) => adder(children.map((node) => ShellNode.create(node)!)),
      (firstNode: InnerNode, secondNode: InnerNode) => {
        return sorter(ShellNode.create(firstNode)!, ShellNode.create(secondNode)!);
      },
    );
  }
}
