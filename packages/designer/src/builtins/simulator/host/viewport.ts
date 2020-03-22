import { obx, computed } from '../../../../../globals';
import { Point } from '../../../designer/helper/location';
import { ScrollTarget } from '../../../designer/helper/scroller';
import { AutoFit, IViewport } from '../../../designer/simulator';

export default class Viewport implements IViewport {
  @obx.ref private rect?: DOMRect;
  private _bounds?: DOMRect;
  get bounds(): DOMRect {
    if (this._bounds) {
      return this._bounds;
    }
    this._bounds = this.viewportElement!.getBoundingClientRect();
    requestAnimationFrame(() => {
      this._bounds = undefined;
    });
    return this._bounds;
  }

  get contentBounds(): DOMRect {
    const bounds = this.bounds;
    const scale = this.scale;
    return new DOMRect(0, 0, bounds.width / scale, bounds.height / scale);
  }

  private viewportElement?: Element;
  mount(viewportElement: Element | null) {
    if (!viewportElement || this.viewportElement === viewportElement) {
      return;
    }
    this.viewportElement = viewportElement;
    this.touch();
  }

  touch() {
    if (this.viewportElement) {
      this.rect = this.bounds;
    }
  }

  @computed get height(): number {
    if (!this.rect) {
      return 600;
    }
    return this.rect.height;
  }
  @computed get width(): number {
    if (!this.rect) {
      return 1000;
    }
    return this.rect.width;
  }

  /**
   * 缩放比例
   */
  @computed get scale(): number {
    if (!this.rect || this.contentWidth === AutoFit) {
      return 1;
    }
    return this.width / this.contentWidth;
  }

  @obx.ref private _contentWidth: number | AutoFit = AutoFit;

  @computed get contentHeight(): number | AutoFit {
    if (!this.rect || this.scale === 1) {
      return AutoFit;
    }
    return this.height / this.scale;
  }

  @computed get contentWidth(): number | AutoFit {
    if (!this.rect || (this._contentWidth !== AutoFit && this._contentWidth <= this.width)) {
      return AutoFit;
    }
    return this._contentWidth;
  }

  set contentWidth(val: number | AutoFit) {
    this._contentWidth = val;
  }

  @obx.ref private _scrollX = 0;
  @obx.ref private _scrollY = 0;
  get scrollX() {
    return this._scrollX;
  }
  get scrollY() {
    return this._scrollY;
  }

  private _scrollTarget?: ScrollTarget;
  /**
   * 滚动对象
   */
  get scrollTarget(): ScrollTarget | undefined {
    return this._scrollTarget;
  }

  @obx private _scrolling = false;
  get scrolling(): boolean {
    return this._scrolling;
  }

  setScrollTarget(target: Window) {
    const scrollTarget = new ScrollTarget(target);
    this._scrollX = scrollTarget.left;
    this._scrollY = scrollTarget.top;

    let scrollTimer: any;
    target.addEventListener('scroll', () => {
      this._scrollX = scrollTarget.left;
      this._scrollY = scrollTarget.top;
      this._scrolling = true;
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        this._scrolling = false;
      }, 80);
    });
    target.addEventListener('resize', () => this.touch());
    this._scrollTarget = scrollTarget;
  }

  toGlobalPoint(point: Point): Point {
    if (!this.viewportElement) {
      return point;
    }

    const rect = this.bounds;
    return {
      clientX: point.clientX * this.scale + rect.left,
      clientY: point.clientY * this.scale + rect.top,
    };
  }

  toLocalPoint(point: Point): Point {
    if (!this.viewportElement) {
      return point;
    }

    const rect = this.bounds;
    return {
      clientX: (point.clientX - rect.left) / this.scale,
      clientY: (point.clientY - rect.top) / this.scale,
    };
  }
}
