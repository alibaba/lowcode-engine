import { IPublicModelNode } from './';
import { IPublicTypeDisposable } from '../type';

export interface IPublicModelSelection<
  Node = IPublicModelNode
> {

  /**
   * 返回选中的节点 id
   * get ids of selected nodes
   */
  get selected(): string[];

  /**
   * 返回选中的节点（如多个节点只返回第一个）
   * return selected Node instance，return the first one if multiple nodes are selected
   * @since v1.1.0
   */
  get node(): Node | null;

  /**
   * 选中指定节点（覆盖方式）
   * select node with id, this will override current selection
   * @param id
   */
  select(id: string): void;

  /**
   * 选中指定属性Tab
   * select tab of props with tabKey
   * @param tabKey
   */
  selectPropsTab(tabKey: string): void;

  /**
   * 批量选中指定节点们
   * select node with ids, this will override current selection
   *
   * @param ids
   */
  selectAll(ids: string[]): void;

  /**
   * 移除选中的指定节点
   * remove node from selection with node id
   * @param id
   */
  remove(id: string): void;

  /**
   * 清除所有选中节点
   * clear current selection
   */
  clear(): void;

  /**
   * 判断是否选中了指定节点
   * check if node with specific id is selected
   * @param id
   */
  has(id: string): boolean;

  /**
   * 选中指定节点（增量方式）
   * add node with specific id to selection
   * @param id
   */
  add(id: string): void;

  /**
   * 获取选中的节点实例
   * get selected nodes
   */
  getNodes(): Node[];

  /**
   * 获取选区的顶层节点
   * get seleted top nodes
   * for example:
   *  getNodes() returns [A, subA, B], then
   *  getTopNodes() will return [A, B], subA will be removed
   * @since v1.0.16
   */
  getTopNodes(includeRoot?: boolean): Node[];

  /**
   * 注册 selection 变化事件回调
   * set callback which will be called when selection is changed
   * @since v1.1.0
   */
  onSelectionChange(fn: (ids: string[]) => void): IPublicTypeDisposable;

  /**
   * 注册 selection 选中属性tab的事件回调
   * set callback which will be called when selection is changed
   * @since v1.1.0
   */
  onSelectionPropsTabChange(fn: (tabKey: string) => void): IPublicTypeDisposable;
}
