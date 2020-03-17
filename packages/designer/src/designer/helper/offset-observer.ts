import { obx, computed } from '@recore/obx';
import { INodeSelector, IViewport } from '../simulator';
import { uniqueId } from '../../../../utils/unique-id';
import { isRootNode } from '../document/node/root-node';

export default class OffsetObserver {
  readonly id = uniqueId('oobx');

  private lastOffsetLeft?: number;
  private lastOffsetTop?: number;
  private lastOffsetHeight?: number;
  private lastOffsetWidth?: number;
  @obx private height = 0;
  @obx private width = 0;
  @obx private left = 0;
  @obx private top = 0;

  @obx hasOffset = false;
  @computed get offsetLeft() {
    if (!this.viewport.scrolling || this.lastOffsetLeft == null) {
      this.lastOffsetLeft = this.isRoot ? this.viewport.scrollX : (this.left + this.viewport.scrollX) * this.scale;
    }
    return this.lastOffsetLeft;
  }
  @computed get offsetTop() {
    if (!this.viewport.scrolling || this.lastOffsetTop == null) {
      this.lastOffsetTop = this.isRoot ? this.viewport.scrollY : (this.top + this.viewport.scrollY) * this.scale;
    }
    return this.lastOffsetTop;
  }
  @computed get offsetHeight() {
    if (!this.viewport.scrolling || this.lastOffsetHeight == null) {
      this.lastOffsetHeight = this.isRoot ? this.viewport.height : this.height * this.scale;
    }
    return this.lastOffsetHeight;
  }
  @computed get offsetWidth() {
    if (!this.viewport.scrolling || this.lastOffsetWidth == null) {
      this.lastOffsetWidth = this.isRoot ? this.viewport.width : this.width * this.scale;
    }
    return this.lastOffsetWidth;
  }

  @computed get scale() {
    return this.viewport.scale;
  }

  private pid: number | undefined;
  private viewport: IViewport;
  private isRoot: boolean;

  constructor(readonly nodeInstance: INodeSelector) {
    const { node, instance } = nodeInstance;
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

      const rect = host.computeComponentInstanceRect(instance!);

      if (!rect) {
        this.hasOffset = false;
      } else {
        if (!this.viewport.scrolling || !this.hasOffset) {
          this.height = rect.height;
          this.width = rect.width;
          this.left = rect.left;
          this.top = rect.top;
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
