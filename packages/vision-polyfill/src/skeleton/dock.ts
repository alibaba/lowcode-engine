import { ReactNode, createElement } from 'react';
import { uniqueId, createContent, obx } from '@ali/lowcode-globals';
import { DockConfig } from "./types";
import { Skeleton } from './skeleton';
import { DockView } from './widget-views';
import { IWidget } from './widget';

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

  private inited: boolean = false;
  private _content: ReactNode;
  get content() {
    if (this.inited) {
      return this._content;
    }
    this.inited = true;
    const { props, content, contentProps } = this.config;

    if (content) {
      this._content = createContent(content, {
        ...contentProps,
        editor: this.skeleton.editor,
        key: this.id,
      });
    } else {
      this._content = createElement(DockView, {
        ...props,
        key: this.id,
      });
    }

    return this._content;
  }
  constructor(readonly skeleton: Skeleton, private config: DockConfig) {
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
}
