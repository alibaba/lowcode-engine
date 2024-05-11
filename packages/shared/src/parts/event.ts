import { Hookable, type HookKeys, type HookCallback } from 'hookable';

export type EventListener = HookCallback;
export type EventDisposable = () => void;

/**
 * todo: logger
 */
export class EventEmitter<
  HooksT extends Record<string, any> = Record<string, HookCallback>,
  HookNameT extends HookKeys<HooksT> = HookKeys<HooksT>,
> extends Hookable<HooksT, HookNameT> {
  #namespace: string | undefined;

  constructor(namespace?: string) {
    super();
    this.#namespace = namespace;
  }

  /**
   * 监听事件
   * add monitor to a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: HookNameT, listener: HooksT[HookNameT]): EventDisposable {
    return this.hook(event, listener);
  }

  /**
   * 触发事件
   * emit a message for a event
   * @param event 事件名称
   * @param args 事件参数
   */
  async emit(event: HookNameT, ...args: any) {
    return this.callHook(event, ...args);
  }

  /**
   * 取消监听事件
   * cancel a monitor from a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: HookNameT, listener: HooksT[HookNameT]): void {
    this.removeHook(event, listener);
  }

  /**
   * 监听事件，会在其他回调函数之前执行
   * @param event 事件名称
   * @param listener 事件回调
   */
  prependListener(event: HookNameT, listener: HooksT[HookNameT]): EventDisposable {
    const _hooks = (this as any)._hooks;
    const hooks = _hooks[event];

    if (Array.isArray(hooks)) {
      hooks.unshift(listener);
      return () => {
        if (listener) {
          this.removeHook(event, listener);
        }
      };
    } else {
      return this.hook(event, listener);
    }
  }
}

export function createEventBus<T extends Record<string, any>>(namespace?: string): EventBus<T> {
  return new EventBus<T>(namespace);
}
