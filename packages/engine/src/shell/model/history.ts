import type { IDocumentModel as InnerDocumentModel, IHistory as InnerHistory } from '@alilc/lowcode-designer';
import { historySymbol, documentSymbol } from '../symbols';
import { IPublicModelHistory, IPublicTypeDisposable } from '@alilc/lowcode-types';

export class History implements IPublicModelHistory {
  private readonly [documentSymbol]: InnerDocumentModel;

  private get [historySymbol](): InnerHistory {
    return this[documentSymbol].getHistory();
  }

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
  }

  /**
   * 历史记录跳转到指定位置
   * @param cursor
   */
  go(cursor: number): void {
    this[historySymbol].go(cursor);
  }

  /**
   * 历史记录后退
   */
  back(): void {
    this[historySymbol].back();
  }

  /**
   * 历史记录前进
   */
  forward(): void {
    this[historySymbol].forward();
  }

  /**
   * 保存当前状态
   */
  savePoint(): void {
    this[historySymbol].savePoint();
  }

  /**
   * 当前是否是「保存点」，即是否有状态变更但未保存
   * @returns
   */
  isSavePoint(): boolean {
    return this[historySymbol].isSavePoint();
  }

  /**
   * 获取 state，判断当前是否为「可回退」、「可前进」的状态
   * @returns
   */
  getState(): number {
    return this[historySymbol].getState();
  }

  /**
   * 监听 state 变更事件
   * @param func
   * @returns
   */
  onChangeState(func: () => any): IPublicTypeDisposable {
    return this[historySymbol].onChangeState(func);
  }

  /**
   * 监听历史记录游标位置变更事件
   * @param func
   * @returns
   */
  onChangeCursor(func: () => any): IPublicTypeDisposable {
    return this[historySymbol].onChangeCursor(func);
  }
}
