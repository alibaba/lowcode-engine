import { obx } from '@recore/obx';
import Node from '../document/node/node';
import DocumentModel from '../document/document-model';

export default class Hovering {
  @obx.ref private _enable: boolean = true;
  get enable() {
    return this._enable;
  }
  set enable(flag: boolean) {
    this._enable = flag;
    if (!flag) {
      this._current = null;
    }
  }
  @obx.ref xRayMode: boolean = false;

  @obx.ref private _current: Node | null = null;
  get current() {
    return this._current;
  }

  hover(node: Node | null) {
    this._current = node;
  }

  leave(document: DocumentModel) {
    if (this.current && this.current.document === document) {
      this._current = null;
    }
  }
}
