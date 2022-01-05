import { Editor as InnerEditor } from '@ali/lowcode-editor-core';
import { getLogger } from '@ali/lowcode-utils';
import { editorSymbol } from './symbols';

const logger = getLogger({ level: 'warn', bizName: 'shell:event' });

type EventOptions = {
  prefix: string;
};

export default class Event {
  private readonly [editorSymbol]: InnerEditor;
  private readonly options: EventOptions;

  /**
   * 内核触发的事件名
   */
  readonly names = [];

  constructor(editor: InnerEditor, options: EventOptions) {
    this[editorSymbol] = editor;
    this.options = options;
    if (!this.options.prefix) {
      logger.warn('prefix is required while initializing Event');
    }
  }

  /**
   * 监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: string, listener: (...args: unknown[]) => void) {
    this[editorSymbol].on(event, listener);
  }

  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: string, listener: (...args: unknown[]) => void) {
    this[editorSymbol].off(event, listener);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns
   */
  emit(event: string, ...args: unknown[]) {
    if (!this.options.prefix) {
      logger.warn('Event#emit has been forbidden while prefix is not specified');
      return;
    }
    this[editorSymbol].emit(`${this.options.prefix}:${event}`, ...args);
  }
}
