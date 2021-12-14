import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  Selection as InnerSelection,
} from '@ali/lowcode-designer';
import Node from './node';
import { documentSymbol, selectionSymbol } from './symbols';

export default class Selection {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [selectionSymbol]: InnerSelection;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[selectionSymbol] = document.selection;
  }

  select(id: string) {
    this[selectionSymbol].select(id);
  }

  selectAll(ids: string[]) {
    this[selectionSymbol].selectAll(ids);
  }

  getSelected() {
    return this[selectionSymbol].selected;
  }

  remove(id: string) {
    this[selectionSymbol].remove(id);
  }

  clear() {
    this[selectionSymbol].clear();
  }

  has(id: string) {
    return this[selectionSymbol].has(id);
  }

  add(id: string) {
    this[selectionSymbol].add(id);
  }

  getNodes() {
    return this[selectionSymbol].getNodes().map((node: InnerNode) => Node.create(node));
  }
}
