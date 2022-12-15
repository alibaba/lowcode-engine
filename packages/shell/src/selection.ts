import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  Selection as InnerSelection,
  Designer as InnerDesigner,
} from '@alilc/lowcode-designer';
import Node from './node';
import { documentSymbol, selectionSymbol, designerSymbol, nodeSymbol } from './symbols';

export default class Selection {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [selectionSymbol]: InnerSelection;
  private readonly [designerSymbol]: InnerDesigner;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
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
  get node(): Node {
    return this.getNodes()[0];
  }

  /**
   * 选中指定节点（覆盖方式）
   * @param id
   */
  select(id: string) {
    this[selectionSymbol].select(id);
  }

  /**
   * 批量选中指定节点们
   * @param ids
   */
  selectAll(ids: string[]) {
    this[selectionSymbol].selectAll(ids);
  }

  /**
   * 移除选中的指定节点
   * @param id
   */
  remove(id: string) {
    this[selectionSymbol].remove(id);
  }

  /**
   * 清除所有选中节点
   */
  clear() {
    this[selectionSymbol].clear();
  }

  /**
   * 判断是否选中了指定节点
   * @param id
   * @returns
   */
  has(id: string) {
    return this[selectionSymbol].has(id);
  }

  /**
   * 选中指定节点（增量方式）
   * @param id
   */
  add(id: string) {
    this[selectionSymbol].add(id);
  }

  /**
   * 获取选中的节点实例
   * @returns
   */
  getNodes(): Node[] {
    return this[selectionSymbol].getNodes().map((node: InnerNode) => Node.create(node));
  }

  /**
   * 获取选区的顶层节点
   * for example:
   *  getNodes() returns [A, subA, B], then
   *  getTopNodes() will return [A, B], subA will be removed
   * @returns
   */
  getTopNodes(): Node[] {
    return this[selectionSymbol].getTopNodes().map((node: InnerNode) => Node.create(node));
  }

  /**
   * 定位节点在大纲树中的位置
   */
  focusNodeOnOutlinePosition(node: Node): void {
    this[designerSymbol].activeTracker.track(node[nodeSymbol]);
  }
}