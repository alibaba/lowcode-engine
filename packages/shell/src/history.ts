import { History as InnerHistory, DocumentModel as InnerDocumentModel } from '@ali/lowcode-designer';
import { documentSymbol, historySymbol } from './symbols';

export default class History {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [historySymbol]: InnerHistory;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[historySymbol] = this[documentSymbol].getHistory();
  }

  go(cursor: number) {
    this[historySymbol].go(cursor);
  }

  back() {
    this[historySymbol].back();
  }

  forward() {
    this[historySymbol].forward();
  }

  savePoint() {
    this[historySymbol].savePoint();
  }

  isSavePoint() {
    return this[historySymbol].isSavePoint();
  }

  getState() {
    return this[historySymbol].getState();
  }

  onChangeState(func: () => any) {
    return this[historySymbol].onStateChange(func);
  }

  onChangeCursor(func: () => any) {
    return this[historySymbol].onCursor(func);
  }
}
