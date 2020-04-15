import { ReactNode, createElement } from 'react';
import { createContent, uniqueId, obx } from '@ali/lowcode-globals';
import { WidgetConfig } from './types';
import { Skeleton } from './skeleton';
import { WidgetView } from './widget-views';

export interface IWidget {
  readonly name: string;
  readonly content: ReactNode;
  readonly align?: string;
  readonly isWidget: true;
  readonly visible: boolean;
  readonly body: ReactNode;
  readonly skeleton: Skeleton;

  getName(): string;
  getContent(): any;
  show(): void;
  hide(): void;
  toggle(): void;
}

export default class Widget implements IWidget {
  readonly isWidget = true;
  readonly id = uniqueId('widget');
  readonly name: string;
  readonly align?: string;

  @obx.ref private _visible: boolean = true;
  get visible(): boolean {
    return this._visible;
  }

  @obx.ref inited: boolean = false;
  private _body: ReactNode;
  get body() {
    if (this.inited) {
      return this._body;
    }
    this.inited = true;
    const { content, contentProps } = this.config;
    this._body = createContent(content, {
      ...contentProps,
      editor: this.skeleton.editor,
    });
    return this._body;
  }

  get content(): ReactNode {
    return createElement(WidgetView, {
      widget: this,
      key: this.id,
    });
  }

  constructor(readonly skeleton: Skeleton, private config: WidgetConfig) {
    const { props = {}, name } = config;
    this.name = name;
    this.align = props.align;
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
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

  toggle() {
    this.setVisible(!this._visible);
  }
}

export function isWidget(obj: any): obj is IWidget {
  return obj && obj.isWidget;
}


