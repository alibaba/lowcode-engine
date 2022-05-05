import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  Selection as InnerSelection,
} from '@alilc/lowcode-designer';
import Node from './node';
import { documentSymbol, selectionSymbol } from './symbols';

export default class Selection {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [selectionSymbol]: InnerSelection;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[selectionSymbol] = document.selection;
  }

  /**
   * 返回选中的节点 id
   */
  get selected() {
    return this[selectionSymbol].selected;
  }

  /**
   * return selected Node instance
   */
  get node() {
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
  getNodes() {
    return this[selectionSymbol].getNodes().map((node: InnerNode) => Node.create(node));
  }
}
