import requestIdleCallback, { cancelIdleCallback } from 'ric-shim';
import { observable, computed, action, makeObservable } from '@alilc/lowcode-editor-core';
import { uniqueId } from '@alilc/lowcode-utils';
import { INodeSelector, IViewport } from '../simulator';
import { INode } from '../document';

export class OffsetObserver {
  readonly id = uniqueId('oobx');

  private lastOffsetLeft?: number;

  private lastOffsetTop?: number;

  private lastOffsetHeight?: number;

  private lastOffsetWidth?: number;

  @observable private _height = 0;

  @observable private _width = 0;

  @observable private _left = 0;

  @observable private _top = 0;

  @observable private _right = 0;

  @observable private _bottom = 0;

  @computed get height() {
    return this.isRoot ? this.viewport?.height : this._height * this.scale;
  }

  @computed get width() {
    return this.isRoot ? this.viewport?.width : this._width * this.scale;
  }

  @computed get top() {
    return this.isRoot ? 0 : this._top * this.scale;
  }

  @computed get left() {
    return this.isRoot ? 0 : this._left * this.scale;
  }

  @computed get bottom() {
    return this.isRoot ? this.viewport?.height : this._bottom * this.scale;
  }

  @computed get right() {
    return this.isRoot ? this.viewport?.width : this._right * this.scale;
  }

  @observable hasOffset = false;

  @computed get offsetLeft() {
    if (this.isRoot) {
      return (this.viewport?.scrollX || 0) * this.scale;
    }
    if (!this.viewport?.scrolling || this.lastOffsetLeft == null) {
      this.lastOffsetLeft = this.left + (this.viewport?.scrollX || 0) * this.scale;
    }
    return this.lastOffsetLeft;
  }

  @computed get offsetTop() {
    if (this.isRoot) {
      return (this.viewport?.scrollY || 0) * this.scale;
    }
    if (!this.viewport?.scrolling || this.lastOffsetTop == null) {
      this.lastOffsetTop = this.top + (this.viewport?.scrollY || 0) * this.scale;
    }
    return this.lastOffsetTop;
  }

  @computed get offsetHeight() {
    if (!this.viewport?.scrolling || this.lastOffsetHeight == null) {
      this.lastOffsetHeight = this.isRoot ? this.viewport?.height || 0 : this.height;
    }
    return this.lastOffsetHeight;
  }

  @computed get offsetWidth() {
    if (!(this.viewport?.scrolling || 0) || this.lastOffsetWidth == null) {
      this.lastOffsetWidth = this.isRoot ? this.viewport?.width || 0 : this.width;
    }
    return this.lastOffsetWidth;
  }

  @computed get scale() {
    return this.viewport?.scale || 0;
  }

  private pid: number | undefined;

  readonly viewport: IViewport | undefined;

  private isRoot: boolean;

  readonly node: INode;

  readonly compute: () => void;

  constructor(readonly nodeInstance: INodeSelector) {
    makeObservable(this);

    const { node, instance } = nodeInstance;
    this.node = node;

    const doc = node.document;
    const host = doc?.simulator;
    const focusNode = doc?.focusNode;
    this.isRoot = node.contains(focusNode!);
    this.viewport = host?.viewport;

    if (this.isRoot) {
      this.hasOffset = true;
      return;
    }
    if (!instance) {
      return;
    }

    let pid: number | undefined;
    const compute = action(() => {
      if (pid !== this.pid) {
        return;
      }

      const rect = host?.computeComponentInstanceRect(instance!, node.componentMeta.rootSelector);

      if (!rect) {
        this.hasOffset = false;
      } else if (!this.viewport?.scrolling || !this.hasOffset) {
        this._height = rect.height;
        this._width = rect.width;
        this._left = rect.left;
        this._top = rect.top;
        this._right = rect.right;
        this._bottom = rect.bottom;
        this.hasOffset = true;
      }
      this.pid = requestIdleCallback(compute);
      pid = this.pid;
    });

    this.compute = compute;

    // try first
    compute();
    // try second, ensure the dom mounted
    this.pid = requestIdleCallback(compute);
    pid = this.pid;
  }

  purge() {
    if (this.pid) {
      cancelIdleCallback(this.pid);
    }
    this.pid = undefined;
  }

  isPurged() {
    return this.pid == null;
  }
}

export function createOffsetObserver(nodeInstance: INodeSelector): OffsetObserver | null {
  if (!nodeInstance.instance) {
    return null;
  }
  return new OffsetObserver(nodeInstance);
}
