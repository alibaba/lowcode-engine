import { Hookable, type HookKeys, type HookCallback } from 'hookable';

export type EventListener = HookCallback;
export type EventDisposable = () => void;

export interface IEventEmitter<
  HooksT extends Record<string, any> = Record<string, HookCallback>,
  HookNameT extends HookKeys<HooksT> = HookKeys<HooksT>,
> {
  /**
   * 监听事件
   * add monitor to a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: HookNameT, listener: HooksT[HookNameT]): EventDisposable;

  /**
   * 添加只运行一次的监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  once(event: HookNameT, listener: HooksT[HookNameT]): void;

  /**
   * 触发事件
   * emit a message for a event
   * @param event 事件名称
   * @param args 事件参数
   */
  emit(event: HookNameT, ...args: any): Promise<any>;

  /**
   * 取消监听事件
   * cancel a monitor from a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: HookNameT, listener: HooksT[HookNameT]): void;

  /**
   * 监听事件，会在其他回调函数之前执行
   * @param event 事件名称
   * @param listener 事件回调
   */
  prependListener(event: HookNameT, listener: HooksT[HookNameT]): EventDisposable;

  /**
   * 清除所有事件监听
   */
  removeAll(): void;
}

export class EventEmitter<
  HooksT extends Record<string, any> = Record<string, HookCallback>,
  HookNameT extends HookKeys<HooksT> = HookKeys<HooksT>,
> implements IEventEmitter<HooksT, HookNameT>
{
  private namespace: string | undefined;
  private hooks = new Hookable<HooksT, HookNameT>();

  constructor(namespace?: string) {
    this.namespace = namespace;
  }

  on(event: HookNameT, listener: HooksT[HookNameT]): EventDisposable {
    return this.hooks.hook(event, listener);
  }

  once(event: HookNameT, listener: HooksT[HookNameT]): void {
    this.hooks.hookOnce(event, listener);
  }

  async emit(event: HookNameT, ...args: any) {
    return this.hooks.callHook(event, ...args);
  }

  off(event: HookNameT, listener: HooksT[HookNameT]): void {
    this.hooks.removeHook(event, listener);
  }

  /**
   * 监听事件，会在其他回调函数之前执行
   * @param event 事件名称
   * @param listener 事件回调
   */
  prependListener(event: HookNameT, listener: HooksT[HookNameT]): EventDisposable {
    return this.hooks.hook(`${event}:before` as HookNameT, listener);
  }

  removeAll(): void {
    this.hooks.removeAllHooks();
  }
}

export function createEventEmitter<T extends Record<string, any>>(
  namespace?: string,
): EventEmitter<T> {
  return new EventEmitter<T>(namespace);
}
