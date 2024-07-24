import { Hookable, type HookKeys } from 'hookable';

type ArrayT<T> = T extends any[] ? T : [T];

export type Event<T = any> = (listener: EventListener<T>) => EventDisposable;
export type EventListener<T = any> = (...arguments_: ArrayT<T>) => Promise<void> | void;
export type EventDisposable = () => void;

export interface IEmitter<T = any> {
  on: Event<T>;
  emit(...args: ArrayT<T>): void;
  emitAsync(...args: ArrayT<T>): Promise<void>;
  clear(): void;
}

export class Emitter<T = any[]> implements IEmitter<T> {
  private events: EventListener<T>[] = [];

  on(fn: EventListener<T>): EventDisposable {
    this.events.push(fn);

    return () => {
      this.events = this.events.filter((e) => e !== fn);
    };
  }

  emit(...args: ArrayT<T>) {
    for (const event of this.events) {
      event.call(null, ...args);
    }
  }

  async emitAsync(...args: ArrayT<T>) {
    for (const event of this.events) {
      await event.call(null, ...args);
    }
  }

  clear() {
    this.events.length = 0;
  }
}

export interface IEventEmitter<
  EventT extends Record<string, any> = Record<string, EventListener>,
  EventNameT extends HookKeys<EventT> = HookKeys<EventT>,
> {
  /**
   * 监听事件
   * add monitor to a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: EventNameT, listener: EventT[EventNameT]): EventDisposable;

  /**
   * 添加只运行一次的监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  once(event: EventNameT, listener: EventT[EventNameT]): void;

  /**
   * 触发事件
   * emit a message for a event
   * @param event 事件名称
   * @param args 事件参数
   */
  emit(event: EventNameT, ...args: any): Promise<any>;

  /**
   * 取消监听事件
   * cancel a monitor from a event
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: EventNameT, listener: EventT[EventNameT]): void;

  /**
   * 监听事件，会在其他回调函数之前执行
   * @param event 事件名称
   * @param listener 事件回调
   */
  prependListener(event: EventNameT, listener: EventT[EventNameT]): EventDisposable;

  /**
   * 清除所有事件监听
   */
  removeAll(): void;
}

export class EventEmitter<
  EventT extends Record<string, any> = Record<string, EventListener<any[]>>,
  EventNameT extends HookKeys<EventT> = HookKeys<EventT>,
> implements IEventEmitter<EventT, EventNameT>
{
  private namespace: string | undefined;
  private hooks = new Hookable<EventT, EventNameT>();

  constructor(namespace?: string) {
    this.namespace = namespace;
  }

  on(event: EventNameT, listener: EventT[EventNameT]): EventDisposable {
    return this.hooks.hook(event, listener);
  }

  once(event: EventNameT, listener: EventT[EventNameT]): void {
    this.hooks.hookOnce(event, listener);
  }

  async emit(event: EventNameT, ...args: any) {
    return this.hooks.callHook(event, ...args);
  }

  off(event: EventNameT, listener: EventT[EventNameT]): void {
    this.hooks.removeHook(event, listener);
  }

  /**
   * 监听事件，会在其他回调函数之前执行
   * @param event 事件名称
   * @param listener 事件回调
   */
  prependListener(event: EventNameT, listener: EventT[EventNameT]): EventDisposable {
    return this.hooks.hook(`${event}:before` as EventNameT, listener);
  }

  removeAll(): void {
    this.hooks.removeAllHooks();
  }
}
