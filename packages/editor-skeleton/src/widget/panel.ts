import { EventEmitter } from 'events';
import { createElement, ReactNode } from 'react';
import { obx, computed } from '@ali/lowcode-editor-core';
import { uniqueId, createContent } from '@ali/lowcode-utils';
import { TitleContent } from '@ali/lowcode-types';
import WidgetContainer from './widget-container';
import { PanelConfig, HelpTipConfig } from '../types';
import { TitledPanelView, TabsPanelView, PanelView } from '../components/widget-views';
import { Skeleton } from '../skeleton';
import { composeTitle } from './utils';
import { IWidget } from './widget';
import PanelDock, { isPanelDock } from './panel-dock';

export default class Panel implements IWidget {
  readonly isWidget = true;

  readonly name: string;

  readonly id: string;

  @obx.ref inited = false;

  @obx.ref private _actived = false;

  private emitter = new EventEmitter();

  get actived(): boolean {
    return this._actived;
  }

  @computed get visible(): boolean {
    if (!this.parent || this.parent.visible) {
      const { props } = this.config;
      if (props?.condition) {
        return props.condition(this);
      }
      return this._actived;
    }
    return false;
  }

  readonly isPanel = true;

  get body() {
    if (this.container) {
      return createElement(TabsPanelView, {
        container: this.container,
      });
    }

    const { content, contentProps } = this.config;
    return createContent(content, {
      ...contentProps,
      editor: this.skeleton.editor,
      config: this.config,
      panel: this,
      pane: this,
    });
  }

  get content(): ReactNode {
    const area = this.config?.area || this.parent?.name;
    if (this.plain) {
      return createElement(PanelView, {
        panel: this,
        key: this.id,
        area,
      });
    }
    return createElement(TitledPanelView, { panel: this, key: this.id, area });
  }

  readonly title: TitleContent;

  readonly help?: HelpTipConfig;

  private plain = false;

  private container?: WidgetContainer<Panel, PanelConfig>;

  private parent?: WidgetContainer;

  constructor(readonly skeleton: Skeleton, readonly config: PanelConfig) {
    const { name, content, props = {} } = config;
    const { hideTitleBar, title, icon, description, help, shortcut } = props;
    this.name = name;
    this.id = uniqueId(`pane:${name}$`);
    this.title = composeTitle(title || name, icon, description);
    this.plain = hideTitleBar || !title;
    this.help = help;
    if (Array.isArray(content)) {
      if (content.length === 1) {
        // todo: not show tabs
      }
      this.container = this.skeleton.createContainer(
        name,
        (item) => {
          if (isPanel(item)) {
            return item;
          }
          return this.skeleton.createPanel(item);
        },
        true,
        () => this.visible,
        true,
      );
      content.forEach((item) => this.add(item));
    }
    if (props.onInit) {
      props.onInit.call(this, this);
    }
    // todo: process shortcut
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
    if (item) {
      this.container?.active(item);
    } else {
      this.setActive(true);
    }
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  setActive(flag: boolean) {
    if (flag === this._actived) {
      // TODO: 如果移动到另外一个 container，会有问题
      return;
    }
    if (flag) {
      this._actived = true;
      this.parent?.active(this);
      if (!this.inited) {
        this.inited = true;
      }
      this.emitter.emit('activechange', true);
    } else if (this.inited) {
      if (this.parent?.name && this.name.startsWith(this.parent.name)) {
        this.inited = false;
      }
      this._actived = false;
      this.parent?.unactive(this);
      this.emitter.emit('activechange', false);
    }
  }

  toggle() {
    this.setActive(!this._actived);
  }

  hide() {
    this.setActive(false);
  }

  show() {
    this.setActive(true);
  }

  getAssocDocks(): PanelDock[] {
    return this.skeleton.widgets.filter(item => {
      return isPanelDock(item) && item.panelName === this.name;
    }) as any;
  }

  /**
   * @deprecated
   */
  getSupportedPositions() {
    return ['default'];
  }

  /**
   * @deprecated
   */
  getCurrentPosition() {
    return 'default';
  }

  /**
   * @deprecated
   */
  setPosition(position: string) {
    // noop
  }

  /**
   * @deprecated
   */
  onActiveChange(fn: (flag: boolean) => void): () => void {
    this.emitter.on('activechange', fn);
    return () => {
      this.emitter.removeListener('activechange', fn);
    };
  }
}

export function isPanel(obj: any): obj is Panel {
  return obj && obj.isPanel;
}
