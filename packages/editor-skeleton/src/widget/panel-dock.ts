import { obx, computed } from '@ali/lowcode-editor-core';
import { uniqueId } from '@ali/lowcode-utils';
import { createElement, ReactNode, ReactInstance } from 'react';
import { Skeleton } from '../skeleton';
import { PanelDockConfig } from '../types';
import Panel from './panel';
import { PanelDockView, WidgetView } from '../components/widget-views';
import { IWidget } from './widget';
import { composeTitle } from './utils';
import { findDOMNode } from 'react-dom';

export default class PanelDock implements IWidget {
  readonly isWidget = true;
  readonly isPanelDock = true;
  readonly id: string;
  readonly name: string;
  readonly align?: string;

  private inited: boolean = false;
  private _body: ReactNode;
  get body() {
    if (this.inited) {
      return this._body;
    }
    this.inited = true;
    const { props } = this.config;

    this._body = createElement(PanelDockView, {
      ...props,
      dock: this,
    });

    return this._body;
  }

  private _shell: ReactInstance | null = null;
  get content(): ReactNode {
    return createElement(WidgetView, {
      widget: this,
      ref: (ref) => {
        this._shell = ref;
      },
      key: this.id,
    });
  }

  getDOMNode() {
    return this._shell ? findDOMNode(this._shell) : null;
  }

  @obx.ref private _visible: boolean = true;
  get visible() {
    return this._visible;
  }

  @computed get actived(): boolean {
    return this.panel?.visible || false;
  }

  readonly panelName: string;
  private _panel?: Panel;
  @computed get panel() {
    return this._panel || this.skeleton.getPanel(this.panelName);
  }

  constructor(readonly skeleton: Skeleton, readonly config: PanelDockConfig) {
    const { content, contentProps, panelProps, name, props } = config;
    this.name = name;
    this.id = uniqueId(`dock:${name}$`);
    this.panelName = config.panelName || name;
    this.align = props?.align;
    if (content) {
      const _panelProps: any = { ...panelProps };
      if (_panelProps.title == null && props) {
        _panelProps.title = composeTitle(props.title, undefined, props.description, true, true);
      }
      this._panel = this.skeleton.add({
        type: 'Panel',
        name: this.panelName,
        props: _panelProps,
        contentProps,
        content,
        area: panelProps?.area,
      }) as Panel;
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

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  toggle() {
    this.setVisible(!this._visible);
  }

  togglePanel() {
    this.panel?.toggle();
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  hidePanel() {
    this.panel?.setActive(false);
  }

  showPanel() {
    this.panel?.setActive(true);
  }
}


export function isPanelDock(obj: any): obj is PanelDock {
  return obj && obj.isPanelDock;
}
