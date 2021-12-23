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

  constructor(editor: InnerEditor, options: EventOptions) {
    this[editorSymbol] = editor;
    this.options = options;
    if (!this.options.prefix) {
      logger.warn('prefix is required while initializing Event');
    }
  }

  on(event: string, listener: (...args: unknown[]) => void) {
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
