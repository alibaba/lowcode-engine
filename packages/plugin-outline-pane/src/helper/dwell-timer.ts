import { isLocationChildrenDetail } from '@alilc/lowcode-utils';
import { IPublicModelNode, IPublicModelDropLocation, IPublicModelLocateEvent } from '@alilc/lowcode-types';


/**
 * 停留检查计时器
 */
export default class DwellTimer {
  private timer: number | undefined;

  private previous?: IPublicModelNode;

  private event?: IPublicModelLocateEvent;

  private decide: (node: IPublicModelNode, event: IPublicModelLocateEvent) => void;

  private timeout = 500;

  constructor(decide: (node: IPublicModelNode, event: IPublicModelLocateEvent) => void, timeout = 500) {
    this.decide = decide;
    this.timeout = timeout;
  }

  focus(node: IPublicModelNode, event: IPublicModelLocateEvent) {
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

  tryFocus(loc?: IPublicModelDropLocation | null) {
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
