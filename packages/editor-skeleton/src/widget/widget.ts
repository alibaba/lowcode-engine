import { ReactNode, createElement } from 'react';
import { obx } from '@ali/lowcode-editor-core';
import { createContent, uniqueId } from '@ali/lowcode-utils';
import { WidgetConfig, IWidgetBaseConfig } from '../types';
import { Skeleton } from '../skeleton';
import { WidgetView } from '../components/widget-views';
import { TitleContent } from '@ali/lowcode-types';

export interface IWidget {
  readonly name: string;
  readonly content: ReactNode;
  readonly align?: string;
  readonly isWidget: true;
  readonly visible: boolean;
  readonly disabled: boolean;
  readonly body: ReactNode;
  readonly skeleton: Skeleton;
  readonly config: IWidgetBaseConfig;

  getName(): string;
  getContent(): any;
  show(): void;
  hide(): void;
  toggle(): void;
  enable?(): void;
  disable?(): void;
}

export default class Widget implements IWidget {
  readonly isWidget = true;

  readonly id = uniqueId('widget');

  readonly name: string;

  readonly align?: string;

  @obx.ref private _visible = true;

  get visible(): boolean {
    return this._visible;
  }

  @obx.ref inited = false;

  @obx.ref private _disabled = false;

  private _body: ReactNode;

  get body() {
    if (this.inited) {
      return this._body;
    }
    this.inited = true;
    const { content, contentProps } = this.config;
    this._body = createContent(content, {
      ...contentProps,
      config: this.config,
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

  readonly title: TitleContent;

  constructor(readonly skeleton: Skeleton, readonly config: WidgetConfig) {
    const { props = {}, name } = config;
    this.name = name;
    this.align = props.align;
    this.title = props.title || name;
    if (props.onInit) {
      props.onInit.call(this, this);
    }
  }

  getId() {
    return this.id;
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
}

export function isWidget(obj: any): obj is IWidget {
  return obj && obj.isWidget;
}

