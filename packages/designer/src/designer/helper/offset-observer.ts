import { obx, computed } from '@recore/obx';
import { INodeInstance, IViewport } from '../simulator';
import Viewport from '../../builtins/simulator/host/viewport';

export default class OffsetObserver {
  @obx.ref hasOffset = false;

  @computed get offsetLeft() {
    return this.left + this.viewport.scrollX;
  }
  @computed get offsetTop() {
    return this.top + this.viewport.scrollY;
  }

  @obx.ref height = 0;
  @obx.ref width = 0;
  @obx.ref left = 0;
  @obx.ref top = 0;

  @computed get scale() {
    return this.viewport.scale;
  }

  private pid: number | undefined;
  private viewport: IViewport;

  constructor(readonly nodeInstance: INodeInstance) {
    const { node, instance } = nodeInstance;
    const doc = node.document;
    const host = doc.simulator!;
    this.viewport = host.viewport;
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
        this.hasOffset = true;
        this.height = rect.height;
        this.width = rect.width;
        this.left = rect.left;
        this.top = rect.top;
      }
      this.pid = pid = (window as any).requestIdleCallback(compute);
    };

    // try first
    compute();
    // try second, ensure the dom mounted
    this.pid = pid = (window as any).requestIdleCallback(compute);
  }

  destroy() {
    if (this.pid) {
      (window as any).cancelIdleCallback(this.pid);
    }
    this.pid = undefined;
  }
}

export function createOffsetObserver(nodeInstance: INodeInstance): OffsetObserver | null {
  if (!nodeInstance.instance) {
    return null;
  }
  return new OffsetObserver(nodeInstance);
}
