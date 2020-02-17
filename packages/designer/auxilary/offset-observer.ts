import { obx } from '@ali/recore';
import { INode } from '../../document/node';

export default class OffsetObserver {
  @obx.ref offsetTop = 0;
  @obx.ref offsetLeft = 0;
  @obx.ref offsetRight = 0;
  @obx.ref offsetBottom = 0;
  @obx.ref height = 0;
  @obx.ref width = 0;
  @obx.ref hasOffset = false;
  @obx.ref left = 0;
  @obx.ref top = 0;
  @obx.ref right = 0;
  @obx.ref bottom = 0;

  private pid: number | undefined;

  constructor(node: INode) {
    const document = node.document;
    const scrollTarget = document.viewport.scrollTarget!;

    let pid: number;
    const compute = () => {
      if (pid !== this.pid) {
        return;
      }

      const rect = document.computeRect(node);
      if (!rect) {
        this.hasOffset = false;
        return;
      }
      this.hasOffset = true;
      this.offsetLeft = rect.left + scrollTarget.left;
      this.offsetRight = rect.right + scrollTarget.left;
      this.offsetTop = rect.top + scrollTarget.top;
      this.offsetBottom = rect.bottom + scrollTarget.top;
      this.height = rect.height;
      this.width = rect.width;
      this.left = rect.left;
      this.top = rect.top;
      this.right = rect.right;
      this.bottom = rect.bottom;
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
