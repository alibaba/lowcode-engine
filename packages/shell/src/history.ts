import { History as InnerHistory, DocumentModel as InnerDocumentModel } from '@alilc/lowcode-designer';
import { historySymbol } from './symbols';

export default class History {
  private readonly [historySymbol]: InnerHistory;

  constructor(history: InnerHistory) {
    this[historySymbol] = history;
  }

  /**
   * 历史记录跳转到指定位置
   * @param cursor
   */
  go(cursor: number) {
    this[historySymbol].go(cursor);
  }

  /**
   * 历史记录后退
   */
  back() {
    this[historySymbol].back();
  }

  /**
   * 历史记录前进
   */
  forward() {
    this[historySymbol].forward();
  }

  /**
   * 保存当前状态
   */
  savePoint() {
    this[historySymbol].savePoint();
  }

  /**
   * 当前是否是「保存点」，即是否有状态变更但未保存
   * @returns
   */
  isSavePoint() {
    return this[historySymbol].isSavePoint();
  }

  /**
   * 获取 state，判断当前是否为「可回退」、「可前进」的状态
   * @returns
   */
  getState() {
    return this[historySymbol].getState();
  }

  /**
   * 监听 state 变更事件
   * @param func
   * @returns
   */
  onChangeState(func: () => any) {
    return this[historySymbol].onStateChange(func);
  }

  /**
   * 监听历史记录游标位置变更事件
   * @param func
   * @returns
   */
  onChangeCursor(func: () => any) {
    return this[historySymbol].onCursor(func);
  }
}
