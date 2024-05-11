import { ReactNode, createElement } from 'react';
import { makeObservable, observable } from '@alilc/lowcode-editor-core';
import { uniqueId, createContent } from '@alilc/lowcode-utils';
import { getEvent } from '../../../engine/src/shell/api/event';
import { DockConfig } from '../types';
import { Skeleton } from '../skeleton';
import { DockView, WidgetView } from '../components/widget-views';
import { IWidget } from './widget';

/**
 * 带图标（主要）/标题（次要）的扩展
 */
export class Dock implements IWidget {
  readonly isWidget = true;

  readonly id = uniqueId('dock');

  readonly name: string;

  readonly align?: string;

  @observable.ref private _visible = true;

  get visible(): boolean {
    return this._visible;
  }

  @observable.ref private _disabled = false;

  get content(): ReactNode {
    return createElement(WidgetView, {
      widget: this,
      key: this.id,
    });
  }

  private inited = false;

  private _body: ReactNode;

  get body() {
    if (this.inited) {
      return this._body;
    }

    const { props, content, contentProps } = this.config;

    if (content) {
      this._body = createContent(content, {
        ...contentProps,
        config: this.config,
        editor: getEvent(this.skeleton.editor),
      });
    } else {
      this._body = createElement(DockView, props);
    }
    this.inited = true;

    return this._body;
  }

  constructor(
    readonly skeleton: Skeleton,
    readonly config: DockConfig,
  ) {
    makeObservable(this);
    const { props = {}, name } = config;
    this.name = name;
    this.align = props.align;
    if (props.onInit) {
      props.onInit.call(this, this);
    }
  }

  setVisible(flag: boolean) {
    if (flag === this._visible) {
      return;
    }
    if (flag) {
      this._visible = true;
    } else if (this.inited) {
      this._visible = false;
    }
  }

  private setDisabled(flag: boolean) {
    if (this._disabled === flag) return;
    this._disabled = flag;
  }

  disable() {
    this.setDisabled(true);
  }

  enable() {
    this.setDisabled(false);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  getContent() {
    return this.content;
  }

  getName() {
    return this.name;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  toggle() {
    this.setVisible(!this._visible);
  }
}
