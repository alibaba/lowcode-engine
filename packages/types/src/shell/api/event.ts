import { IPublicTypeDisposable } from '../type';

export interface IPublicApiEvent {

  /**
   * 监听事件
   * add monitor to a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: string, listener: (...args: any[]) => void): IPublicTypeDisposable;

  /**
   * 监听事件，会在其他回调函数之前执行
   * add monitor to a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  prependListener(event: string, listener: (...args: any[]) => void): IPublicTypeDisposable;

  /**
   * 取消监听事件
   * cancel a monitor from a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: string, listener: (...args: any[]) => void): void;

  /**
   * 触发事件
   * emit a message for a event
   * @param event 事件名称
   * @param args 事件参数
   * @returns
   */
  emit(event: string, ...args: any[]): void;
}
