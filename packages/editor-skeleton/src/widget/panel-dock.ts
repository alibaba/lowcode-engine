import { observable, computed, makeObservable } from '@alilc/lowcode-editor-core';
import { uniqueId } from '@alilc/lowcode-utils';
import { createElement, ReactNode, ReactInstance } from 'react';
import { ISkeleton } from '../skeleton';
import { PanelDockConfig } from '../types';
import { Panel } from './panel';
import { PanelDockView, WidgetView } from '../components/widget-views';
import { IWidget } from './widget';
import { composeTitle } from './utils';
import { findDOMNode } from 'react-dom';

export class PanelDock implements IWidget {
  readonly isWidget = true;

  readonly isPanelDock = true;

  readonly id: string;

  readonly name: string;

  readonly align?: 'left' | 'right' | 'bottom' | 'center' | 'top' | undefined;

  private inited = false;

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

  @observable.ref private _visible = true;

  get visible() {
    return this._visible;
  }

  @computed get actived(): boolean {
    return this.panel?.visible || false;
  }

  readonly panelName: string;

  private _panel?: Panel;

  @observable.ref private _disabled = false;

  @computed get panel() {
    return this._panel || this.skeleton.getPanel(this.panelName);
  }

  constructor(readonly skeleton: ISkeleton, readonly config: PanelDockConfig) {
    makeObservable(this);
    const { content, contentProps, panelProps, name, props } = config;
    this.name = name;
    this.id = uniqueId(`dock:${name}$`);
    this.panelName = config.panelName || name;
    this.align = props?.align;
    if (content) {
      const _panelProps = { ...panelProps };
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
    if (props?.onInit) {
      props.onInit.call(this, this);
    }
  }

  getDOMNode() {
    // eslint-disable-next-line react/no-find-dom-node
    return this._shell ? findDOMNode(this._shell) : null;
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
