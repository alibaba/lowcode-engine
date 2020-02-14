import { obx } from '@ali/recore';
import { screen } from '../globals/screen';
import { Point } from './location';
import { ScrollTarget } from '../../builtins/simulator/scroller';

export type AutoFit = '100%';
export const AutoFit = '100%';

export default class Viewport {
  private shell: HTMLDivElement | undefined;
  scrollTarget: ScrollTarget | undefined;

  get scale(): number {
    if (this.width === AutoFit) {
      return 1;
    }
    return screen.width / this.width;
  }

  get height(): number | AutoFit {
    if (this.scale === 1) {
      return AutoFit;
    }
    return screen.height / this.scale;
  }

  private _bounds: ClientRect | DOMRect | null = null;
  get bounds(): ClientRect | DOMRect {
    if (this._bounds) {
      return this._bounds;
    }
    this._bounds = this.shell!.getBoundingClientRect();
    requestAnimationFrame(() => {
      this._bounds = null;
    });
    return this._bounds;
  }

  get innerBounds(): ClientRect | DOMRect {
    const bounds = this.bounds;
    const scale = this.scale;
    const ret: any = {
      top: 0,
      left: 0,
      x: 0,
      y: 0,
      width: bounds.width / scale,
      height: bounds.height / scale,
    };
    ret.right = ret.width;
    ret.bottom = ret.height;
    return ret;
  }

  @obx.ref width: number | AutoFit = AutoFit;
  @obx.ref scrollX = 0;
  @obx.ref scrollY = 0;

  setShell(shell: HTMLDivElement) {
    this.shell = shell;
  }

  setScrollTarget(target: Window) {
    this.scrollTarget = new ScrollTarget(target);
    this.scrollX = this.scrollTarget.left;
    this.scrollY = this.scrollTarget.top;
    target.onscroll = () => {
      this.scrollX = this.scrollTarget!.left;
      this.scrollY = this.scrollTarget!.top;
    };
  }

  toGlobalPoint(point: Point): Point {
    if (!this.shell) {
      return point;
    }

    const rect = this.shell.getBoundingClientRect();
    return {
      clientX: point.clientX * this.scale + rect.left,
      clientY: point.clientY * this.scale + rect.top,
    };
  }

  toLocalPoint(point: Point): Point {
    if (!this.shell) {
      return point;
    }

    const rect = this.shell.getBoundingClientRect();
    return {
      clientX: (point.clientX - rect.left) / this.scale,
      clientY: (point.clientY - rect.top) / this.scale,
    };
  }
}
