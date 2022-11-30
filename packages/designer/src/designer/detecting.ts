import { makeObservable, obx } from '@alilc/lowcode-editor-core';
import { EventEmitter } from 'events';
import { Node, DocumentModel } from '../document';

const DETECTING_CHANGE_EVENT = 'detectingChange';

export class Detecting {
  @obx.ref private _enable = true;

  /**
   * 控制大纲树 hover 时是否出现悬停效果
   * TODO: 将该逻辑从设计器中抽离出来
   */
  get enable() {
    return this._enable;
  }

  set enable(flag: boolean) {
    this._enable = flag;
    if (!flag) {
      this._current = null;
    }
  }

  @obx.ref xRayMode = false;

  @obx.ref private _current: Node | null = null;

  private emitter: EventEmitter = new EventEmitter();

  constructor() {
    makeObservable(this);
  }

  get current() {
    return this._current;
  }

  capture(node: Node | null) {
    if (this._current !== node) {
      this._current = node;
      this.emitter.emit(DETECTING_CHANGE_EVENT, this.current);
    }
  }

  release(node: Node | null) {
    if (this._current === node) {
      this._current = null;
      this.emitter.emit(DETECTING_CHANGE_EVENT, this.current);
    }
  }

  leave(document: DocumentModel | undefined) {
    if (this.current && this.current.document === document) {
      this._current = null;
    }
  }

  onDetectingChange(fn: (node: Node) => void) {
    this.emitter.on(DETECTING_CHANGE_EVENT, fn);
    return () => {
      this.emitter.off(DETECTING_CHANGE_EVENT, fn);
    };
  }
}
