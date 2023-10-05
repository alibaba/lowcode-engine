import { isElement } from '@alilc/lowcode-utils';
import { IPublicModelScrollTarget, IPublicTypeScrollable, IPublicModelScroller } from '@alilc/lowcode-types';

export interface IScrollTarget extends IPublicModelScrollTarget {
}

export class ScrollTarget implements IScrollTarget {
  get left() {
    return 'scrollX' in this.target ? this.target.scrollX : this.target.scrollLeft;
  }

  get top() {
    return 'scrollY' in this.target ? this.target.scrollY : this.target.scrollTop;
  }

  private doc?: HTMLElement;

  constructor(private target: Window | Element) {
    if (isWindow(target)) {
      this.doc = target.document.documentElement;
    }
  }

  scrollTo(options: { left?: number; top?: number }) {
    this.target.scrollTo(options);
  }

  scrollToXY(x: number, y: number) {
    this.target.scrollTo(x, y);
  }

  get scrollHeight(): number {
    return ((this.doc || this.target) as any).scrollHeight;
  }

  get scrollWidth(): number {
    return ((this.doc || this.target) as any).scrollWidth;
  }
}

function isWindow(obj: any): obj is Window {
  return obj && obj.document;
}

function easing(n: number) {
  return Math.sin((n * Math.PI) / 2);
}

const SCROLL_ACCURACY = 30;

export interface IScroller extends IPublicModelScroller {

}
export class Scroller implements IScroller {
  private pid: number | undefined;
  scrollable: IPublicTypeScrollable;

  constructor(scrollable: IPublicTypeScrollable) {
    this.scrollable = scrollable;
  }

  get scrollTarget(): IScrollTarget | null {
    let target = this.scrollable.scrollTarget;
    if (!target) {
      return null;
    }
    if (isElement(target)) {
      target = new ScrollTarget(target);
      this.scrollable.scrollTarget = target;
    }
    return target;
  }

  scrollTo(options: { left?: number; top?: number }) {
    this.cancel();

    const { scrollTarget } = this;
    if (!scrollTarget) {
      return;
    }

    let pid: number;
    const { left } = scrollTarget;
    const { top } = scrollTarget;
    const end = () => {
      this.cancel();
    };

    if ((left === options.left || options.left == null) && top === options.top) {
      end();
      return;
    }

    const duration = 200;
    const start = +new Date();

    const animate = () => {
      if (pid !== this.pid) {
        return;
      }

      const now = +new Date();
      const time = Math.min(1, (now - start) / duration);
      const eased = easing(time);
      const opt: any = {};
      if (options.left != null) {
        opt.left = eased * (options.left - left) + left;
      }
      if (options.top != null) {
        opt.top = eased * (options.top - top) + top;
      }

      scrollTarget.scrollTo(opt);

      if (time < 1) {
        this.pid = requestAnimationFrame(animate);
        pid = this.pid;
      } else {
        end();
      }
    };

    this.pid = requestAnimationFrame(animate);
    pid = this.pid;
  }

  scrolling(point: { globalX: number; globalY: number }) {
    this.cancel();

    const { bounds, scale = 1 } = this.scrollable;
    const { scrollTarget } = this;
    if (!scrollTarget || !bounds) {
      return;
    }

    const x = point.globalX;
    const y = point.globalY;

    const maxScrollHeight = scrollTarget.scrollHeight - bounds.height / scale;
    const maxScrollWidth = scrollTarget.scrollWidth - bounds.width / scale;
    let sx = scrollTarget.left;
    let sy = scrollTarget.top;
    let ax = 0;
    let ay = 0;
    if (y < bounds.top + SCROLL_ACCURACY) {
      ay = -Math.min(Math.max(bounds.top + SCROLL_ACCURACY - y, 10), 50) / scale;
    } else if (y > bounds.bottom - SCROLL_ACCURACY) {
      ay = Math.min(Math.max(y + SCROLL_ACCURACY - bounds.bottom, 10), 50) / scale;
    }
    if (x < bounds.left + SCROLL_ACCURACY) {
      ax = -Math.min(Math.max(bounds.top + SCROLL_ACCURACY - y, 10), 50) / scale;
    } else if (x > bounds.right - SCROLL_ACCURACY) {
      ax = Math.min(Math.max(x + SCROLL_ACCURACY - bounds.right, 10), 50) / scale;
    }

    if (!ax && !ay) {
      return;
    }

    const animate = () => {
      let scroll = false;
      if ((ay > 0 && sy < maxScrollHeight) || (ay < 0 && sy > 0)) {
        sy += ay;
        sy = Math.min(Math.max(sy, 0), maxScrollHeight);
        scroll = true;
      }
      if ((ax > 0 && sx < maxScrollWidth) || (ax < 0 && sx > 0)) {
        sx += ax;
        sx = Math.min(Math.max(sx, 0), maxScrollWidth);
        scroll = true;
      }
      if (!scroll) {
        return;
      }

      scrollTarget.scrollTo({ left: sx, top: sy });
      this.pid = requestAnimationFrame(animate);
    };

    animate();
  }

  cancel() {
    if (this.pid) {
      cancelAnimationFrame(this.pid);
    }
    this.pid = undefined;
  }
}
