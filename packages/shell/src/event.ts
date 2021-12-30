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

  on(event: string, listener: (...args: unknown[]) => void) {
    if (event.startsWith('designer')) {
      logger.warn('designer events are disabled');
      return;
    }
    this[editorSymbol].on(event, listener);
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.options.prefix) {
      logger.warn('Event#emit has been forbidden while prefix is not specified');
      return;
    }
    this[editorSymbol].emit(`${this.options.prefix}:${event}`, ...args);
  }
}
