import { obx, computed } from '@ali/lowcode-globals';
import WidgetContainer from './widget-container';
import { Skeleton } from './skeleton';
import { IWidget } from './widget';
import { IWidgetBaseConfig } from './types';

export default class Area<C extends IWidgetBaseConfig = any, T extends IWidget = IWidget> {
  @obx private _visible: boolean = true;

  @computed get visible() {
    if (this.exclusive) {
      return this.container.current != null;
    }
    return this._visible;
  }

  readonly container: WidgetContainer<T, C>;
  constructor(readonly skeleton: Skeleton, readonly name: string, handle: (item: T | C) => T, private exclusive?: boolean, defaultSetCurrent: boolean = false) {
    this.container = skeleton.createContainer(name, handle, exclusive, () => this.visible, defaultSetCurrent);
  }

  @computed isEmpty(): boolean {
    return this.container.items.length < 1;
  }

  add(config: T | C): T {
    return this.container.add(config);
  }

  private lastCurrent: T | null = null;
  setVisible(flag: boolean) {
    if (this.exclusive) {
      const current = this.container.current;
      if (flag && !current) {
        this.container.active(this.lastCurrent || this.container.getAt(0))
      } else if (current) {
        this.lastCurrent = this.container.current;
        this.container.unactive();
      }
      return;
    }
    this._visible = flag;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }
}
