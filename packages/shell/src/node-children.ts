import { NodeChildren as InnerNodeChildren, Node as InnerNode } from '@alilc/lowcode-designer';
import { NodeSchema, NodeData, TransformStage } from '@alilc/lowcode-types';
import Node from './node';
import { nodeSymbol, nodeChildrenSymbol } from './symbols';

export default class NodeChildren {
  private readonly [nodeChildrenSymbol]: InnerNodeChildren;

  constructor(nodeChildren: InnerNodeChildren) {
    this[nodeChildrenSymbol] = nodeChildren;
  }

  static create(nodeChldren: InnerNodeChildren | null) {
    if (!nodeChldren) return null;
    return new NodeChildren(nodeChldren);
  }

  /**
   * 返回当前 children 实例所属的节点实例
   */
  get owner(): Node | null {
    return Node.create(this[nodeChildrenSymbol].owner);
  }

  /**
   * children 内的节点实例数
   */
  get size() {
    return this[nodeChildrenSymbol].size;
  }

  /**
   * 是否为空
   * @returns
   */
  get isEmpty() {
    return this[nodeChildrenSymbol].isEmpty();
  }

  /**
   * judge if it is not empty
   */
  get notEmpty() {
    return !this.isEmpty;
  }

  /**
   * 删除指定节点
   * @param node
   * @returns
   */
  delete(node: Node) {
    return this[nodeChildrenSymbol].delete(node[nodeSymbol]);
  }

  /**
   * 插入一个节点
   * @param node 待插入节点
   * @param at 插入下标
   * @returns
   */
  insert(node: Node, at?: number | null) {
    return this[nodeChildrenSymbol].insert(node[nodeSymbol], at, true);
  }

  /**
   * 返回指定节点的下标
   * @param node
   * @returns
   */
  indexOf(node: Node) {
    return this[nodeChildrenSymbol].indexOf(node[nodeSymbol]);
  }

  /**
   * 类似数组 splice 操作
   * @param start
   * @param deleteCount
   * @param node
   */
  splice(start: number, deleteCount: number, node?: Node) {
    this[nodeChildrenSymbol].splice(start, deleteCount, node?.[nodeSymbol]);
  }

  /**
   * 返回指定下标的节点
   * @param index
   * @returns
   */
  get(index: number) {
    return Node.create(this[nodeChildrenSymbol].get(index));
  }

  /**
   * 是否包含指定节点
   * @param node
   * @returns
   */
  has(node: Node) {
    return this[nodeChildrenSymbol].has(node[nodeSymbol]);
  }

  /**
   * 类似数组的 forEach
   * @param fn
   */
  forEach(fn: (node: Node, index: number) => void) {
    this[nodeChildrenSymbol].forEach((item: InnerNode<NodeSchema>, index: number) => {
      fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 map
   * @param fn
   */
  map<T>(fn: (node: Node, index: number) => T[]) {
    return this[nodeChildrenSymbol].map((item: InnerNode<NodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 every
   * @param fn
   */
  every(fn: (node: Node, index: number) => boolean) {
    return this[nodeChildrenSymbol].every((item: InnerNode<NodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 some
   * @param fn
   */
  some(fn: (node: Node, index: number) => boolean) {
    return this[nodeChildrenSymbol].some((item: InnerNode<NodeSchema>, index: number) => {
      return fn(Node.create(item)!, index);
    });
  }

  /**
   * 类似数组的 filter
   * @param fn
   */
  filter(fn: (node: Node, index: number) => boolean) {
    return this[nodeChildrenSymbol]
      .filter((item: InnerNode<NodeSchema>, index: number) => {
        return fn(Node.create(item)!, index);
      })
      .map((item: InnerNode<NodeSchema>) => Node.create(item)!);
  }

  /**
   * 类似数组的 find
   * @param fn
   */
  find(fn: (node: Node, index: number) => boolean) {
    return Node.create(
      this[nodeChildrenSymbol].find((item: InnerNode<NodeSchema>, index: number) => {
        return fn(Node.create(item)!, index);
      }),
    );
  }

  /**
   * 类似数组的 reduce
   * @param fn
   */
  reduce(fn: (acc: any, cur: Node) => any, initialValue: any) {
    return this[nodeChildrenSymbol].reduce((acc: any, cur: InnerNode) => {
      return fn(acc, Node.create(cur)!);
    }, initialValue);
  }

  /**
   * 导入 schema
   * @param data
   */
  importSchema(data?: NodeData | NodeData[]) {
    this[nodeChildrenSymbol].import(data);
  }

  /**
   * 导出 schema
   * @param stage
   * @returns
   */
  exportSchema(stage: TransformStage = TransformStage.Render) {
    return this[nodeChildrenSymbol].export(stage);
  }

  /**
   * 执行新增、删除、排序等操作
   * @param remover
   * @param adder
   * @param sorter
   */
  mergeChildren(
    remover: (node: Node, idx: number) => boolean,
    adder: (children: Node[]) => any,
    sorter: (firstNode: Node, secondNode: Node) => number,
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
