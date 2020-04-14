import {createElement, ReactNode } from 'react';
import { obx, uniqueId, createContent, TitleContent } from '@ali/lowcode-globals';
import WidgetContainer from './widget-container';
import { PanelConfig, HelpTipConfig } from './types';
import { PanelView, TabsPanelView } from './widget-views';
import { Skeleton } from './skeleton';
import { composeTitle } from './utils';
import { IWidget } from './widget';

export default class Panel implements IWidget {
  readonly isWidget = true;
  readonly name: string;
  readonly id: string;
  @obx.ref inited: boolean = false;
  @obx.ref private _actived: boolean = false;
  get actived(): boolean {
    return this._actived;
  }
  get visible(): boolean {
    if (this.parent?.visible) {
      return this._actived;
    }
    return false;
  }
  setActive(flag: boolean) {
    if (flag === this._actived) {
      // TODO: 如果移动到另外一个 container，会有问题
      return;
    }
    if (flag) {
      if (!this.inited) {
        this.initBody();
      }
      this._actived = true;
      this.parent?.active(this);
    } else if (this.inited) {
      this._actived = false;
      this.parent?.unactive(this);
    }
  }

  toggle() {
    this.setActive(!this._actived);
  }

  readonly isPanel = true;

  private _body?: ReactNode;
  get body() {
    this.initBody();
    return this._body;
  }

  get content() {
    return this.plain ? this.body : createElement(PanelView, { panel: this });
  }

  readonly title: TitleContent;
  readonly help?: HelpTipConfig;
  private plain: boolean = false;

  private container?: WidgetContainer<Panel, PanelConfig>;
  private parent?: WidgetContainer;

  constructor(readonly skeleton: Skeleton, private config: PanelConfig) {
    const { name, content, props = {} } = config;
    const { hideTitleBar, title, icon, description, help, shortcut } = props;
    this.name = name;
    this.id = uniqueId(`pane:${name}$`);
    this.title = composeTitle(title || name, icon, description);
    this.plain = hideTitleBar || !title;
    this.help = help;
    if (Array.isArray(content)) {
      this.container = this.skeleton.createContainer(name, (item) => {
        if (isPanel(item)) {
          return item;
        }
        return this.skeleton.createPanel(item);
      }, true, () => this.visible, true);
      content.forEach(item => this.add(item));
    }
    // todo: process shortcut
  }

  private initBody() {
    if (this.inited) {
      return;
    }
    this.inited = true;
    if (this.container) {
      this._body = createElement(TabsPanelView, {
        container: this.container,
        key: this.id,
      });
    } else {
      const { content, contentProps } = this.config;
      this._body = createContent(content, {
        ...contentProps,
        editor: this.skeleton.editor,
        panel: this,
        key: this.id,
      });
    }
  }
  setParent(parent: WidgetContainer) {
    if (parent === this.parent) {
      return;
    }
    if (this.parent) {
      this.parent.remove(this);
    }
    this.parent = parent;
  }

  add(item: Panel | PanelConfig) {
    return this.container?.add(item);
  }

  getPane(name: string): Panel | null {
    return this.container?.get(name) || null;
  }

  remove(item: Panel | string) {
    return this.container?.remove(item);
  }

  active(item?: Panel | string | null) {
    this.container?.active(item);
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  hide() {
    this.setActive(false);
  }

  show() {
    this.setActive(true);
  }
}

export function isPanel(obj: any): obj is Panel {
  return obj && obj.isPanel;
}
