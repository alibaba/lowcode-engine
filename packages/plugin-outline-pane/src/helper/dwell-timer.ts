import { NodeParent, DropLocation, isLocationChildrenDetail, LocateEvent } from '@ali/lowcode-designer';

/**
 * 停留检查计时器
 */
export default class DwellTimer {
  private timer: number | undefined;
  private previous?: NodeParent;
  private event?: LocateEvent;

  constructor(private decide: (node: NodeParent, event: LocateEvent) => void, private timeout: number = 500) {}

  focus(node: NodeParent, event: LocateEvent) {
    this.event = event;
    if (this.previous === node) {
      return;
    }
    this.reset();
    this.previous = node;
    this.timer = setTimeout(() => {
      this.previous && this.decide(this.previous, this.event!);
      this.reset();
    }, this.timeout) as any;
  }

  tryFocus(loc?: DropLocation | null) {
    if (!loc || !isLocationChildrenDetail(loc.detail)) {
      this.reset();
      return;
    }
    if (loc.detail.focus?.type === 'node') {
      this.focus(loc.detail.focus.node, loc.event);
    } else {
      this.reset();
    }
  }

  reset() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.previous = undefined;
  }
}
