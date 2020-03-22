import { obx, computed } from '../../../../globals';
import { INodeSelector, IViewport } from '../simulator';
import { uniqueId } from '../../../../utils/unique-id';
import { isRootNode } from '../document/node/root-node';
import Node from '../document/node/node';

export default class OffsetObserver {
  readonly id = uniqueId('oobx');

  private lastOffsetLeft?: number;
  private lastOffsetTop?: number;
  private lastOffsetHeight?: number;
  private lastOffsetWidth?: number;
  @obx private _height = 0;
  @obx private _width = 0;
  @obx private _left = 0;
  @obx private _top = 0;
  @obx private _right = 0;
  @obx private _bottom = 0;

  @computed get height() {
    return this.isRoot ? this.viewport.height : this._height * this.scale;
  }

  @computed get width() {
    return this.isRoot ? this.viewport.width : this._width * this.scale;
  }

  @computed get top() {
    return this.isRoot ? 0 : this._top * this.scale;
  }

  @computed get left() {
    return this.isRoot ? 0 : this._left * this.scale;
  }

  @computed get bottom() {
    return this.isRoot ? this.viewport.height : this._bottom * this.scale;
  }

  @computed get right() {
    return this.isRoot ? this.viewport.width : this._right * this.scale;
  }

  @obx hasOffset = false;
  @computed get offsetLeft() {
    if (this.isRoot) {
      return this.viewport.scrollX * this.scale;
    }
    if (!this.viewport.scrolling || this.lastOffsetLeft == null) {
      this.lastOffsetLeft = this.left + this.viewport.scrollX * this.scale;
    }
    return this.lastOffsetLeft;
  }
  @computed get offsetTop() {
    if (this.isRoot) {
      return this.viewport.scrollY * this.scale;
    }
    if (!this.viewport.scrolling || this.lastOffsetTop == null) {
      this.lastOffsetTop = this.top + this.viewport.scrollY * this.scale;
    }
    return this.lastOffsetTop;
  }
  @computed get offsetHeight() {
    if (!this.viewport.scrolling || this.lastOffsetHeight == null) {
      this.lastOffsetHeight = this.isRoot ? this.viewport.height : this.height;
    }
    return this.lastOffsetHeight;
  }
  @computed get offsetWidth() {
    if (!this.viewport.scrolling || this.lastOffsetWidth == null) {
      this.lastOffsetWidth = this.isRoot ? this.viewport.width : this.width;
    }
    return this.lastOffsetWidth;
  }

  @computed get scale() {
    return this.viewport.scale;
  }

  private pid: number | undefined;
  readonly viewport: IViewport;
  private isRoot: boolean;
  readonly node: Node;

  constructor(readonly nodeInstance: INodeSelector) {
    const { node, instance } = nodeInstance;
    this.node = node;
    const doc = node.document;
    const host = doc.simulator!;
    this.isRoot = isRootNode(node);
    this.viewport = host.viewport;
    if (this.isRoot) {
      this.hasOffset = true;
      return;
    }
    if (!instance) {
      return;
    }

    let pid: number;
    const compute = () => {
      if (pid !== this.pid) {
        return;
      }

      const rect = host.computeComponentInstanceRect(instance!, node.componentMeta.rectSelector);

      if (!rect) {
        this.hasOffset = false;
      } else {
        if (!this.viewport.scrolling || !this.hasOffset) {
          this._height = rect.height;
          this._width = rect.width;
          this._left = rect.left;
          this._top = rect.top;
          this._right = rect.right;
          this._bottom = rect.bottom;
          this.hasOffset = true;
        }
      }
      this.pid = pid = (window as any).requestIdleCallback(compute);
    };

    // try first
    compute();
    // try second, ensure the dom mounted
    this.pid = pid = (window as any).requestIdleCallback(compute);
  }

  purge() {
    if (this.pid) {
      (window as any).cancelIdleCallback(this.pid);
    }
    this.pid = undefined;
  }
}

export function createOffsetObserver(nodeInstance: INodeSelector): OffsetObserver | null {
  if (!nodeInstance.instance) {
    return null;
  }
  return new OffsetObserver(nodeInstance);
}
