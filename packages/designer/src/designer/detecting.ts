import { obx } from '@ali/lowcode-editor-core';
import { Node, DocumentModel } from '../document';

export class Detecting {
  @obx.ref private _enable = true;

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

  get current() {
    return this._current;
  }

  capture(node: Node | null) {
    this._current = node;
  }

  release(node: Node) {
    if (this._current === node) {
      this._current = null;
    }
  }

  leave(document: DocumentModel | undefined) {
    if (this.current && this.current.document === document) {
      this._current = null;
    }
  }
}
