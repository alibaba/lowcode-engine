import { History as InnerHistory, DocumentModel as InnerDocumentModel } from '@ali/lowcode-designer';
import { historySymbol } from './symbols';

export default class History {
  private readonly [historySymbol]: InnerHistory;

  constructor(history: InnerHistory) {
    this[historySymbol] = history;
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
