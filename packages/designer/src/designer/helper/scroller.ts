import { isElement } from '../../utils/is-element';

export class ScrollTarget {
  get left() {
    return 'scrollX' in this.target ? this.target.scrollX : this.target.scrollLeft;
  }
  get top() {
    return 'scrollY' in this.target ? this.target.scrollY : this.target.scrollTop;
  }
  scrollTo(options: { left?: number; top?: number }) {
    this.target.scrollTo(options);
  }

  scrollToXY(x: number, y: number) {
    this.target.scrollTo(x, y);
  }

  get scrollHeight(): number {
    return ((this.doe || this.target) as any).scrollHeight;
  }

  get scrollWidth(): number {
    return ((this.doe || this.target) as any).scrollWidth;
  }

  private doe?: HTMLElement;
  constructor(private target: Window | Element) {
    if (isWindow(target)) {
      this.doe = target.document.documentElement;
    }
  }
}

function isWindow(obj: any): obj is Window {
  return obj && obj.document;
}

function easing(n: number) {
  return Math.sin((n * Math.PI) / 2);
}

const SCROLL_ACCURCY = 30;

export interface IScrollable {
  scrollTarget?: ScrollTarget | Element;
  bounds: DOMRect;
  scale: number;
}

export default class Scroller {
  private pid: number | undefined;

  get scrollTarget(): ScrollTarget | null {
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

  constructor(private scrollable: IScrollable) {
  }

  scrollTo(options: { left?: number; top?: number }) {
    this.cancel();

    const scrollTarget = this.scrollTarget;
    if (!scrollTarget) {
      return;
    }

    let pid: number;
    const left = scrollTarget.left;
    const top = scrollTarget.top;
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
        this.pid = pid = requestAnimationFrame(animate);
      } else {
        end();
      }
    };

    this.pid = pid = requestAnimationFrame(animate);
  }

  scrolling(point: { globalX: number; globalY: number }) {
    this.cancel();

    const { bounds, scale } = this.scrollable;
    const scrollTarget = this.scrollTarget;
    if (!scrollTarget) {
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
    if (y < bounds.top + SCROLL_ACCURCY) {
      ay = -Math.min(Math.max(bounds.top + SCROLL_ACCURCY - y, 10), 50) / scale;
    } else if (y > bounds.bottom - SCROLL_ACCURCY) {
      ay = Math.min(Math.max(y + SCROLL_ACCURCY - bounds.bottom, 10), 50) / scale;
    }
    if (x < bounds.left + SCROLL_ACCURCY) {
      ax = -Math.min(Math.max(bounds.top + SCROLL_ACCURCY - y, 10), 50) / scale;
    } else if (x > bounds.right - SCROLL_ACCURCY) {
      ax = Math.min(Math.max(x + SCROLL_ACCURCY - bounds.right, 10), 50) / scale;
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
