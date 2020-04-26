import { ReactNode, createElement } from 'react';
import { uniqueId, createContent, obx } from '@ali/lowcode-globals';
import { DockConfig } from "./types";
import { Skeleton } from './skeleton';
import { DockView, WidgetView } from './components/widget-views';
import { IWidget } from './widget/widget';

/**
 * 带图标（主要）/标题（次要）的扩展
 */
export default class Dock implements IWidget {
  readonly isWidget = true;
  readonly id = uniqueId('dock');
  readonly name: string;
  readonly align?: string;

  @obx.ref private _visible: boolean = true;
  get visible(): boolean {
    return this._visible;
  }

  get content(): ReactNode {
    return createElement(WidgetView, {
      widget: this,
      key: this.id,
    });
  }

  private inited: boolean = false;
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
        editor: this.skeleton.editor,
      });
    } else {
      this._body = createElement(DockView, props);
    }
    return this._body;
  }

  constructor(readonly skeleton: Skeleton, readonly config: DockConfig) {
    const { props = {}, name } = config;
    this.name = name;
    this.align = props.align;
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
