import logger from '@ali/vu-logger';
import { EventEmitter } from 'events';

/**
 * Bus class as an EventEmitter
 */
export class Bus {
  private emitter = new EventEmitter();

  getEmitter() {
    return this.emitter;
  }

  // alias to sub
  on(event: string | symbol, func: (...args: any[]) => any): any {
    return this.sub(event, func);
  }

  // alias to unsub
  off(event: string, func: (...args: any[]) => any) {
    this.unsub(event, func);

  }

  // alias to pub
  emit(event: string, ...args: any[]): boolean {
    return this.pub(event, ...args);
  }

  sub(event: string | symbol, func: (...args: any[]) => any) {
    this.emitter.on(event, func);
    return () => {
      this.emitter.removeListener(event, func);
    };
  }

  once(event: string, func: (...args: any[]) => any) {
    this.emitter.once(event, func);
    return () => {
      this.emitter.removeListener(event, func);
    };
  }

  unsub(event: string, func: (...args: any[]) => any) {
    if (func) {
      this.emitter.removeListener(event, func);
    } else {
      this.emitter.removeAllListeners(event);
    }
  }

  /**
   * Release & Publish Events
   */
  pub(event: string, ...args: any[]): boolean {
    logger.info('INFO:', 'eventData:', event, ...args);
    return this.emitter.emit(event, ...args);
  }

  removeListener(eventName: string | symbol, callback: () => any) {
    return this.emitter.removeListener(eventName, callback);
  }
}

export default new Bus();
