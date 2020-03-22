import Node from '../document/node/node';
import DocumentModel from '../document/document-model';
import { obx } from '../../../../globals';

export default class Hovering {
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

  hover(node: Node | null) {
    this._current = node;
  }

  unhover(node: Node) {
    if (this._current === node) {
      this._current = null;
    }
  }

  leave(document: DocumentModel) {
    if (this.current && this.current.document === document) {
      this._current = null;
    }
  }
}
