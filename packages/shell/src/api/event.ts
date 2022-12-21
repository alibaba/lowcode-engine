import { Editor as InnerEditor, globalContext } from '@alilc/lowcode-editor-core';
import { getLogger, isPublicEventName, isPluginEventName } from '@alilc/lowcode-utils';
import { editorSymbol } from '../symbols';
import { IPublicApiEvent, IPublicTypeDisposable } from '@alilc/lowcode-types';

const logger = getLogger({ level: 'warn', bizName: 'shell-event' });

type EventOptions = {
  prefix: string;
};

const innerEditorSymbol = Symbol('editor');

export class Event implements IPublicApiEvent {
  private readonly [editorSymbol]: InnerEditor;
  private readonly options: EventOptions;

  // TODO:
  /**
   * 内核触发的事件名
   */
  readonly names = [];

  constructor(editor: InnerEditor, options: EventOptions, public workspaceMode = false) {
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
  on(event: string, listener: (...args: any[]) => void): IPublicTypeDisposable {
    if (isPluginEventName(event) || isPublicEventName(event)) {
      return this[editorSymbol].eventBus.on(event, listener);
    } else {
      logger.warn(`fail to monitor on event ${event}, which is neither a engine public event nor a plugin event`);
      return () => {};
    }
  }

  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: string, listener: (...args: any[]) => void) {
    this[editorSymbol].eventBus.off(event, listener);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns
   */
  emit(event: string, ...args: any[]) {
    if (!this.options.prefix) {
      logger.warn('Event#emit has been forbidden while prefix is not specified');
      return;
    }
    this[editorSymbol].eventBus.emit(`${this.options.prefix}:${event}`, ...args);
  }

  /**
   * DO NOT USE if u fully understand what this method does.
   * @param event
   * @param args
   */
  __internalEmit__(event: string, ...args: unknown[]) {
    this[editorSymbol].emit(event, ...args);
  }
}

export function getEvent(editor: InnerEditor, options: any = { prefix: 'common' }) {
  return new Event(editor, options);
}
