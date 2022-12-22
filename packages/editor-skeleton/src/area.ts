/* eslint-disable max-len */
import { obx, computed, makeObservable } from '@alilc/lowcode-editor-core';
import { WidgetContainer } from './widget/widget-container';
import { Skeleton } from './skeleton';
import { IWidget } from './widget/widget';
import { IPublicTypeWidgetBaseConfig, IArea } from '@alilc/lowcode-types';

export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget> implements IArea<C, T> {
  @obx private _visible = true;

  @computed get visible() {
    if (this.exclusive) {
      return this.container.current != null;
    }
    return this._visible;
  }

  get current() {
    if (this.exclusive) {
      return this.container.current;
    }
    return null;
  }

  readonly container: WidgetContainer<T, C>;

  constructor(readonly skeleton: Skeleton, readonly name: string, handle: (item: T | C) => T, private exclusive?: boolean, defaultSetCurrent = false) {
    makeObservable(this);
    this.container = skeleton.createContainer(name, handle, exclusive, () => this.visible, defaultSetCurrent);
  }

  isEmpty(): boolean {
    return this.container.items.length < 1;
  }

  add(config: T | C): T {
    const item = this.container.get(config.name);
    if (item) {
      return item;
    }
    return this.container.add(config);
  }

  remove(config: T | string): number {
    return this.container.remove(config);
  }

  private lastCurrent: T | null = null;

  setVisible(flag: boolean) {
    if (this.exclusive) {
      const { current } = this.container;
      if (flag && !current) {
        this.container.active(this.lastCurrent || this.container.getAt(0));
      } else if (current) {
        this.lastCurrent = current;
        this.container.unactive(current);
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

  // ========== compatible for vision ========
  /**
   * @deprecated
   */
  removeAction(config: string): number {
    return this.remove(config);
  }
}
