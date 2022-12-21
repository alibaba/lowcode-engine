import { Node as InnerNode } from '@alilc/lowcode-designer';
import { IPublicTypeNodeSchema, IPublicTypeNodeData, IPublicEnumTransformStage, IPublicModelNodeChildren, IPublicModelNode } from '@alilc/lowcode-types';
import { Node } from './node';
import { nodeSymbol, nodeChildrenSymbol } from '../symbols';

export class NodeChildren implements IPublicModelNodeChildren {
  private readonly [nodeChildrenSymbol]: IPublicModelNodeChildren;

  constructor(nodeChildren: IPublicModelNodeChildren) {
    this[nodeChildrenSymbol] = nodeChildren;
  }

  static create(nodeChildren: IPublicModelNodeChildren | null): IPublicModelNodeChildren | null {
    if (!nodeChildren) {
      return null;
    }
    return new NodeChildren(nodeChildren);
  }

  /**
   * 返回当前 children 实例所属的节点实例
   */
  get owner(): IPublicModelNode | null {
    return Node.create(this[nodeChildrenSymbol].owner);
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
    return this[nodeChildrenSymbol].isEmpty();
  }

  /**
   * 是否为空
   * @returns
   */
  get isEmptyNode(): boolean {
    return this[nodeChildrenSymbol].isEmpty();
  }

  /**
   * @deprecated
   * judge if it is not empty
   */
  get notEmpty(): boolean {
    return this[nodeChildrenSymbol].notEmpty();
  }

  /**
   * judge if it is not empty
   */
  get notEmptyNode(): boolean {
    return this[nodeChildrenSymbol].notEmpty();
  }

  /**
   * 删除指定节点
   * @param node
   * @returns
   */
  delete(node: IPublicModelNode): boolean {
    return this[nodeChildrenSymbol].delete((node as any));
  }

  /**
   * 插入一个节点
   * @param node 待插入节点
   * @param at 插入下标
   * @returns
   */
  insert(node: IPublicModelNode, at?: number | null): void {
    return this[nodeChildrenSymbol].insert((node as any), at, true);
  }

  /**
   * 返回指定节点的下标
   * @param node
   * @returns
   */
  indexOf(node: IPublicModelNode): number {
    return this[nodeChildrenSymbol].indexOf((node as any));
  }

  /**
   * 类似数组 splice 操作
   * @param start
   * @param deleteCount
   * @param node
   */
  splice(start: number, deleteCount: number, node?: IPublicModelNode): any {
    this[nodeChildrenSymbol].splice(start, deleteCount, (node as any)?.[nodeSymbol]);
  }

  /**
   * 返回指定下标的节点
   * @param index
   * @returns
   */
  get(index: number): any {
    return Node.create(this[nodeChildrenSymbol].get(index));
  }

  /**
   * 是否包含指定节点
   * @param node
   * @returns
   */
  has(node: IPublicModelNode): boolean {
    return this[nodeChildrenSymbol].has((node as any));
  }

  /**
   * 类似数组的 forEach
   * @param fn
   */
  forEach(fn: (node: IPublicModelNode, index: number) => void): void {
    this[nodeChildrenSymbol].forEach((item: InnerNode<IPublicTypeNodeSchema>, index: number) => {
      fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 map
   * @param fn
   */
  map<T>(fn: (node: IPublicModelNode, index: number) => T[]): any[] | null {
    return this[nodeChildrenSymbol].map((item: InnerNode<IPublicTypeNodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 every
   * @param fn
   */
  every(fn: (node: IPublicModelNode, index: number) => boolean): boolean {
    return this[nodeChildrenSymbol].every((item: InnerNode<IPublicTypeNodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 some
   * @param fn
   */
  some(fn: (node: IPublicModelNode, index: number) => boolean): boolean {
    return this[nodeChildrenSymbol].some((item: InnerNode<IPublicTypeNodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 filter
   * @param fn
   */
  filter(fn: (node: IPublicModelNode, index: number) => boolean): any {
    return this[nodeChildrenSymbol]
      .filter((item: InnerNode<IPublicTypeNodeSchema>, index: number) => {
        return fn(Node.create(item)!, index);
      })
      .map((item: InnerNode<IPublicTypeNodeSchema>) => Node.create(item)!);
  }

  /**
   * 类似数组的 find
   * @param fn
   */
  find(fn: (node: IPublicModelNode, index: number) => boolean): IPublicModelNode | null {
    return Node.create(
      this[nodeChildrenSymbol].find((item: InnerNode<IPublicTypeNodeSchema>, index: number) => {
        return fn(Node.create(item)!, index);
      }),
    );
  }

  /**
   * 类似数组的 reduce
   * @param fn
   */
  reduce(fn: (acc: any, cur: IPublicModelNode) => any, initialValue: any): void {
    return this[nodeChildrenSymbol].reduce((acc: any, cur: InnerNode) => {
      return fn(acc, Node.create(cur)!);
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
    sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number,
  ) {
    if (!sorter) {
      sorter = () => 0;
    }
    this[nodeChildrenSymbol].mergeChildren(
      (node: InnerNode, idx: number) => remover(Node.create(node)!, idx),
      (children: InnerNode[]) => adder(children.map((node) => Node.create(node)!)),
      (firstNode: InnerNode, secondNode: InnerNode) =>
        sorter(Node.create(firstNode)!, Node.create(secondNode)!),
    );
  }
}
