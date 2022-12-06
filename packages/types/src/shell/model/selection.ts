import { IPublicModelNode } from './node';

export interface IPublicModelSelection {

  /**
   * 返回选中的节点 id
   */
  get selected(): string[];

  /**
   * return selected Node instance
   */
  get node(): IPublicModelNode | null;

  /**
   * 选中指定节点（覆盖方式）
   * @param id
   */
  select(id: string): void;

  /**
   * 批量选中指定节点们
   * @param ids
   */
  selectAll(ids: string[]): void;

  /**
   * 移除选中的指定节点
   * @param id
   */
  remove(id: string): void;

  /**
   * 清除所有选中节点
   */
  clear(): void;

  /**
   * 判断是否选中了指定节点
   * @param id
   * @returns
   */
  has(id: string): boolean;

  /**
   * 选中指定节点（增量方式）
   * @param id
   */
  add(id: string): void;

  /**
   * 获取选中的节点实例
   * @returns
   */
  getNodes(): Array<IPublicModelNode | null>;

  /**
   * 获取选区的顶层节点
   * for example:
   *  getNodes() returns [A, subA, B], then
   *  getTopNodes() will return [A, B], subA will be removed
   * @returns
   */
  getTopNodes(): Array<IPublicModelNode | null>;
}
