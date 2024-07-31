import { IPublicTypeNodeSchema, IPublicTypeNodeData } from '../type';
import { IPublicEnumTransformStage } from '../enum';
import { IPublicModelNode } from './';

export interface IPublicModelNodeChildren<
  Node = IPublicModelNode
> {

  /**
   * 返回当前 children 实例所属的节点实例
   * get owner node of this nodeChildren
   */
  get owner(): Node | null;

  /**
   * children 内的节点实例数
   * get count of child nodes
   */
  get size(): number;

  /**
   * @deprecated please use isEmptyNode
   * 是否为空
   * @returns
   */
  get isEmpty(): boolean;

  /**
   * 是否为空
   *
   * @returns
   */
  get isEmptyNode(): boolean;

  /**
   * @deprecated please use notEmptyNode
   * judge if it is not empty
   */
  get notEmpty(): boolean;

  /**
   * judge if it is not empty
   */
  get notEmptyNode(): boolean;

  /**
   * 删除指定节点
   *
   * delete the node
   * @param node
   */
  delete(node: Node): boolean;

  /**
   * 插入一个节点
   *
   * insert a node at specific position
   * @param node 待插入节点
   * @param at 插入下标
   * @returns
   */
  insert(node: Node, at?: number | null): void;

  /**
   * 返回指定节点的下标
   *
   * get index of node in current children
   * @param node
   * @returns
   */
  indexOf(node: Node): number;

  /**
   * 类似数组 splice 操作
   *
   * provide the same function with {Array.prototype.splice}
   * @param start
   * @param deleteCount
   * @param node
   */
  splice(start: number, deleteCount: number, node?: Node): Node[];

  /**
   * 返回指定下标的节点
   *
   * get node with index
   * @param index
   * @returns
   */
  get(index: number): Node | null;

  /**
   * 是否包含指定节点
   *
   * check if node exists in current children
   * @param node
   * @returns
   */
  has(node: Node): boolean;

  /**
   * 类似数组的 forEach
   *
   * provide the same function with {Array.prototype.forEach}
   * @param fn
   */
  forEach(fn: (node: Node, index: number) => void): void;

  /**
   * 类似数组的 reverse
   *
   * provide the same function with {Array.prototype.reverse}
   */
  reverse(): Node[];

  /**
   * 类似数组的 map
   *
   * provide the same function with {Array.prototype.map}
   * @param fn
   */
  map<T = any>(fn: (node: Node, index: number) => T): T[] | null;

  /**
   * 类似数组的 every
   * provide the same function with {Array.prototype.every}
   * @param fn
   */
  every(fn: (node: Node, index: number) => boolean): boolean;

  /**
   * 类似数组的 some
   * provide the same function with {Array.prototype.some}
   * @param fn
   */
  some(fn: (node: Node, index: number) => boolean): boolean;

  /**
   * 类似数组的 filter
   * provide the same function with {Array.prototype.filter}
   * @param fn
   */
  filter(fn: (node: Node, index: number) => boolean): any;

  /**
   * 类似数组的 find
   * provide the same function with {Array.prototype.find}
   * @param fn
   */
  find(fn: (node: Node, index: number) => boolean): Node | null | undefined;

  /**
   * 类似数组的 reduce
   *
   * provide the same function with {Array.prototype.reduce}
   * @param fn
   */
  reduce(fn: (acc: any, cur: Node) => any, initialValue: any): void;

  /**
   * 导入 schema
   *
   * import schema
   * @param data
   */
  importSchema(data?: IPublicTypeNodeData | IPublicTypeNodeData[]): void;

  /**
   * 导出 schema
   *
   * export schema
   * @param stage
   */
  exportSchema(stage: IPublicEnumTransformStage): IPublicTypeNodeSchema;

  /**
   * 执行新增、删除、排序等操作
   *
   * excute remove/add/sort operations
   * @param remover
   * @param adder
   * @param sorter
   */
  mergeChildren(
    remover: (node: Node, idx: number) => boolean,
    adder: (children: Node[]) => IPublicTypeNodeData[] | null,
    sorter: (firstNode: Node, secondNode: Node) => number
  ): any;

}
