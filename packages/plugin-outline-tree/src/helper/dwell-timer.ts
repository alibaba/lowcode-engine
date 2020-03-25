import { NodeParent } from '../../../designer/src/designer/document/node/node';
import DropLocation, { isLocationChildrenDetail } from '../../../designer/src/designer/helper/location';
import { LocateEvent } from '../../../designer/src/designer/helper/dragon';

/**
 * 停留检查计时器
 */
export default class DwellTimer {
  private timer: number | undefined;
  private previous?: NodeParent;
  private event?: LocateEvent

  constructor(private decide: (node: NodeParent, event: LocateEvent) => void, private timeout: number = 800) {}

  focus(node: NodeParent, event: LocateEvent) {
    this.event = event;
    if (this.previous === node) {
      return;
    }
    this.reset();
    this.previous = node;
    const x = Date.now();
    console.info('set', x);
    this.timer = setTimeout(() => {
      console.info('done', x, Date.now() - x);
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
    console.info('reset');
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.previous = undefined;
  }
}
