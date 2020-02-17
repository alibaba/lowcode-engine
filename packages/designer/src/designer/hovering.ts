import { obx } from '@recore/obx';
import Node from './document/node/node';
import DocumentModel from './document/document-model';

export default class Hovering {
  @obx.ref private _enable: boolean = true;
  get enable() {
    return this._enable;
  }
  set enable(flag: boolean) {
    this._enable = flag;
    if (!flag) {
      this._hovering = null;
    }
  }
  @obx.ref xRayMode: boolean = false;

  @obx.ref private _hovering: Node | null = null;
  get hovering() {
    return this._hovering;
  }

  @obx.ref event?: MouseEvent;
  hover(node: Node | null, e: MouseEvent) {
    this._hovering = node;
    this.event = e;
  }

  leave(document: DocumentModel) {
    if (this.hovering && this.hovering.document === document) {
      this._hovering = null;
    }
  }
}
