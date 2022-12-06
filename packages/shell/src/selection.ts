import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  Selection as InnerSelection,
  Designer as InnerDesigner,
} from '@alilc/lowcode-designer';
import Node from './node';
import { selectionSymbol, designerSymbol, nodeSymbol } from './symbols';
import { IPublicModelSelection, IPublicModelNode } from '@alilc/lowcode-types';

export default class Selection implements IPublicModelSelection {
  private readonly [selectionSymbol]: InnerSelection;
  private readonly [designerSymbol]: InnerDesigner;

  constructor(document: InnerDocumentModel) {
    this[selectionSymbol] = document.selection;
    this[designerSymbol] = document.designer;
  }

  /**
   * 返回选中的节点 id
   */
  get selected(): string[] {
    return this[selectionSymbol].selected;
  }

  /**
   * return selected Node instance
   */
  get node(): IPublicModelNode | null {
    const nodes = this.getNodes();
    return nodes && nodes.length > 0 ? nodes[0] : null;
  }

  /**
   * 选中指定节点（覆盖方式）
   * @param id
   */
  select(id: string): void {
    this[selectionSymbol].select(id);
  }

  /**
   * 批量选中指定节点们
   * @param ids
   */
  selectAll(ids: string[]): void {
    this[selectionSymbol].selectAll(ids);
  }

  /**
   * 移除选中的指定节点
   * @param id
   */
  remove(id: string): void {
    this[selectionSymbol].remove(id);
  }

  /**
   * 清除所有选中节点
   */
  clear(): void {
    this[selectionSymbol].clear();
  }

  /**
   * 判断是否选中了指定节点
   * @param id
   * @returns
   */
  has(id: string): boolean {
    return this[selectionSymbol].has(id);
  }

  /**
   * 选中指定节点（增量方式）
   * @param id
   */
  add(id: string): void {
    this[selectionSymbol].add(id);
  }

  /**
   * 获取选中的节点实例
   * @returns
   */
  getNodes(): Array<IPublicModelNode | null> {
    return this[selectionSymbol].getNodes().map((node: InnerNode) => Node.create(node));
  }

  /**
   * 获取选区的顶层节点
   * for example:
   *  getNodes() returns [A, subA, B], then
   *  getTopNodes() will return [A, B], subA will be removed
   * @returns
   */
  getTopNodes(): Array<IPublicModelNode | null> {
    return this[selectionSymbol].getTopNodes().map((node: InnerNode) => Node.create(node));
  }

  /**
   * 定位节点在大纲树中的位置
   */
  focusNodeOnOutlinePosition(node: Node): void {
    this[designerSymbol].activeTracker.track(node[nodeSymbol]);
  }
}
