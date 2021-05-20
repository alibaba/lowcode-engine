import logger from '@ali/vu-logger';
import { EventEmitter } from 'events';
import { editor } from '@ali/lowcode-engine';
import { isJSExpression } from '@ali/lowcode-types';

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

const bus = new Bus();

editor?.on('hotkey.callback.call', (data) => {
  bus.emit('ve.hotkey.callback.call', data);
});

editor?.on('history.back', (data) => {
  bus.emit('ve.history.back', data);
});

editor?.on('history.forward', (data) => {
  bus.emit('ve.history.forward', data);
});

function triggerUseVariableChange(data: any) {
  const { node, prop, oldValue, newValue } = data;
  const propConfig = node.componentMeta.prototype?.options.configure.find((o: any) => o.name === prop.getKey());
  if (!propConfig?.useVariableChange) return;
  if (isJSExpression(oldValue) && !isJSExpression(newValue)) {
    propConfig.useVariableChange.call(prop, { isUseVariable: false });
  } else if (isJSExpression(newValue) && !isJSExpression(oldValue)) {
    propConfig.useVariableChange.call(prop, { isUseVariable: true });
  }
}
editor?.on('node.prop.change', (data) => {
  bus.emit('node.prop.change', data);

  triggerUseVariableChange(data);
});

export default bus;
