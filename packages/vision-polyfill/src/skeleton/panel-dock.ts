import { uniqueId, obx, computed } from '@ali/lowcode-globals';
import { createElement, ReactNode } from 'react';
import { Skeleton } from './skeleton';
import { PanelDockConfig } from './types';
import Panel from './panel';
import { PanelDockView } from './widget-views';
import { IWidget } from './widget';

export default class PanelDock implements IWidget {
  readonly isWidget = true;
  readonly id: string;
  readonly name: string;
  readonly align?: string;

  private inited: boolean = false;
  private _content: ReactNode;
  get content() {
    if (this.inited) {
      return this._content;
    }
    this.inited = true;
    const { props } = this.config;

    this._content = createElement(PanelDockView, {
      ...props,
      key: this.id,
      dock: this,
    });

    return this._content;
  }

  @computed get actived(): boolean {
    return this.panel?.visible || false;
  }

  readonly panelName: string;
  private _panel?: Panel;
  @computed get panel() {
    return this._panel || this.skeleton.getPanel(this.panelName);
  }

  constructor(readonly skeleton: Skeleton, private config: PanelDockConfig) {
    const { content, contentProps, panelProps, name } = config;
    this.name = name;
    this.id = uniqueId(`dock:${name}$`);
    this.panelName = config.panelName || name;
    if (content) {
      this._panel = this.skeleton.add({
        type: "Panel",
        name: this.panelName,
        props: panelProps || {},
        contentProps,
        content,
        area: panelProps?.area || 'leftFloatArea'
      }) as Panel;
    }
  }

  toggle() {
    this.panel?.toggle();
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  hide() {
    this.panel?.setActive(false);
  }

  show() {
    this.panel?.setActive(true);
  }
}
