import { NodeSchema, NodeData } from '../../schema';
import { TransformStage } from '../../transform-stage';
import { IPublicModelNode } from './node';

export interface IPublicModelNodeChildren {
  /**
   * 返回当前 children 实例所属的节点实例
   */
  get owner(): IPublicModelNode | null;

  /**
   * children 内的节点实例数
   */
  get size(): number;

  /**
   * 是否为空
   * @returns
   */
  get isEmpty(): boolean;

  /**
   * judge if it is not empty
   */
  get notEmpty(): boolean;

  /**
   * 删除指定节点
   * @param node
   * @returns
   */
  delete(node: IPublicModelNode): boolean;

  /**
   * 插入一个节点
   * @param node 待插入节点
   * @param at 插入下标
   * @returns
   */
  insert(node: IPublicModelNode, at?: number | null): void;

  /**
   * 返回指定节点的下标
   * @param node
   * @returns
   */
  indexOf(node: IPublicModelNode): number;

  /**
   * 类似数组 splice 操作
   * @param start
   * @param deleteCount
   * @param node
   */
  splice(start: number, deleteCount: number, node?: IPublicModelNode): any;

  /**
   * 返回指定下标的节点
   * @param index
   * @returns
   */
  get(index: number): any;

  /**
   * 是否包含指定节点
   * @param node
   * @returns
   */
  has(node: IPublicModelNode): boolean;

  /**
   * 类似数组的 forEach
   * @param fn
   */
  forEach(fn: (node: IPublicModelNode, index: number) => void): void;

  /**
   * 类似数组的 map
   * @param fn
   */
  map<T>(fn: (node: IPublicModelNode, index: number) => T[]): any[] | null;

  /**
   * 类似数组的 every
   * @param fn
   */
  every(fn: (node: IPublicModelNode, index: number) => boolean): boolean;

  /**
   * 类似数组的 some
   * @param fn
   */
  some(fn: (node: IPublicModelNode, index: number) => boolean): boolean;

  /**
   * 类似数组的 filter
   * @param fn
   */
  filter(fn: (node: IPublicModelNode, index: number) => boolean): any;

  /**
   * 类似数组的 find
   * @param fn
   */
  find(fn: (node: IPublicModelNode, index: number) => boolean): IPublicModelNode | null;

  reduce(fn: (acc: any, cur: IPublicModelNode) => any, initialValue: any): void;

  /**
   * 导入 schema
   * @param data
   */
  importSchema(data?: NodeData | NodeData[]): void;

  /**
   * 导出 schema
   * @param stage
   * @returns
   */
  exportSchema(stage: TransformStage): NodeSchema;

  mergeChildren(
    remover: (node: IPublicModelNode, idx: number) => boolean,
    adder: (children: IPublicModelNode[]) => NodeData[] | null,
    sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number
  ): any;

}
