import { Component, ReactElement } from 'react';
import { Icon } from '@alifd/next';
import classNames from 'classnames';
import { Title, observer, Tip } from '@alilc/lowcode-editor-core';
import { DockProps } from '../../types';
import { PanelDock } from '../../widget/panel-dock';
import { composeTitle } from '../../widget/utils';
import { WidgetContainer } from '../../widget/widget-container';
import { Panel } from '../../widget/panel';
import { IWidget } from '../../widget/widget';
import { SkeletonEvents } from '../../skeleton';
import DraggableLine from '../draggable-line';
import PanelOperationRow from './panel-operation-row';

import './index.less';

export function DockView({ title, icon, description, size, className, onClick }: DockProps) {
  return (
    <Title
      title={composeTitle(title, icon, description)}
      className={classNames('lc-dock', className, {
        [`lc-dock-${size}`]: size,
      })}
      onClick={onClick}
    />
  );
}

function HelpTip({ tip }: any) {
  if (tip && tip.url) {
    return (
      <div>
        <a href={tip.url} target="_blank" rel="noopener noreferrer">
          <Icon type="help" size="small" className="lc-help-tip" />
        </a>
        <Tip>{tip.content}</Tip>
      </div>
    );
  }
  return (
    <div>
      <Icon type="help" size="small" className="lc-help-tip" />
      <Tip>{tip.content}</Tip>
    </div>
  );
}

@observer
export class PanelDockView extends Component<DockProps & { dock: PanelDock }> {
  private lastActived = false;

  componentDidMount() {
    this.checkActived();
  }

  componentDidUpdate() {
    this.checkActived();
  }

  checkActived() {
    const { dock } = this.props;
    if (dock.actived !== this.lastActived) {
      this.lastActived = dock.actived;
      if (this.lastActived) {
        dock.skeleton.postEvent(SkeletonEvents.PANEL_DOCK_ACTIVE, dock.name, dock);
      } else {
        dock.skeleton.postEvent(SkeletonEvents.PANEL_DOCK_UNACTIVE, dock.name, dock);
      }
    }
  }

  render() {
    const { dock, className, onClick, ...props } = this.props;
    return DockView({
      ...props,
      className: classNames(className, {
        actived: dock.actived,
      }),
      onClick: () => {
        onClick && onClick();
        dock.togglePanel();
      },
    });
  }
}

export class DialogDockView extends Component {}

export class DraggableLineView extends Component<{ panel: Panel }> {
  private shell: any;
  private defaultWidth: number;

  private getDefaultWidth() {
    const configWidth = this.props.panel?.config.props?.width;
    if (configWidth) {
      return configWidth;
    }
    if (this.defaultWidth) {
      return this.defaultWidth;
    }
    const containerRef = this.shell?.getParent();
    if (containerRef) {
      this.defaultWidth = containerRef.offsetWidth;
      return this.defaultWidth;
    }
    return 300;
  }

  onDrag(value: number) {
    const defaultWidth = this.getDefaultWidth();
    const width = defaultWidth + value;

    const containerRef = this.shell?.getParent();
    if (containerRef) {
      containerRef.style.width = `${width}px`;
    }

    // 抛出事件，对于有些需要 panel 插件随着 度变化进行再次渲染的，由panel插件内部监听事件实现
    const editor = this.props.panel.skeleton.editor;
    editor?.eventBus.emit('dockpane.drag', width);
  }

  onDragChange(type: 'start' | 'end') {
    const editor = this.props.panel.skeleton.editor;
    editor?.eventBus.emit('dockpane.dragchange', type);
    // builtinSimulator 屏蔽掉 鼠标事件
    editor?.eventBus.emit('designer.builtinSimulator.disabledEvents', type === 'start');
  }

  render() {
    // left fixed 下不允许改变宽度
    // 默认 关闭，通过配置开启
    const enableDrag = this.props.panel.config.props?.enableDrag;
    const isRightArea = this.props.panel.config?.area === 'rightArea';
    if (isRightArea || !enableDrag || this.props.panel?.parent?.name === 'leftFixedArea') {
      return null;
    }
    return (
      <DraggableLine
        ref={(ref) => {
          this.shell = ref;
        }}
        position="right"
        className="lc-engine-slate-draggable-line-right"
        onDrag={(e) => this.onDrag(e)}
        onDragStart={() => this.onDragChange('start')}
        onDragEnd={() => this.onDragChange('end')}
        maxIncrement={500}
        maxDecrement={0}
        // TODO: 优化
        // maxIncrement={dock.getMaxWidth() - this.cachedSize.width}
        // maxDecrement={this.cachedSize.width - dock.getWidth()}
      />
    );
  }
}

@observer
export class TitledPanelView extends Component<{ panel: Panel; area?: string }> {
  private lastVisible = false;

  componentDidMount() {
    this.checkVisible();
  }

  componentDidUpdate() {
    this.checkVisible();
  }

  checkVisible() {
    const { panel } = this.props;
    const currentVisible = panel.inited && panel.visible;
    if (currentVisible !== this.lastVisible) {
      this.lastVisible = currentVisible;
      if (this.lastVisible) {
        panel.skeleton.postEvent(SkeletonEvents.PANEL_SHOW, panel.name, panel);
      } else {
        panel.skeleton.postEvent(SkeletonEvents.PANEL_HIDE, panel.name, panel);
      }
    }
  }

  render() {
    const { panel, area } = this.props;
    if (!panel.inited) {
      return null;
    }
    const editor = panel.skeleton.editor;
    const panelName = area ? `${area}-${panel.name}` : panel.name;
    editor?.eventBus.emit('skeleton.panel.toggle', {
      name: panelName || '',
      status: panel.visible ? 'show' : 'hide',
    });
    return (
      <div
        className={classNames('lc-titled-panel', {
          hidden: !panel.visible,
        })}
        id={panelName}
        data-keep-visible-while-dragging={panel.config.props?.keepVisibleWhileDragging}
      >
        <PanelOperationRow panel={panel} />
        <PanelTitle panel={panel} />
        <div className="lc-panel-body">{panel.body}</div>
        <DraggableLineView panel={panel} />
      </div>
    );
  }
}

@observer
export class PanelView extends Component<{
  panel: Panel;
  area?: string;
  hideOperationRow?: boolean;
  hideDragLine?: boolean;
}> {
  private lastVisible = false;

  componentDidMount() {
    this.checkVisible();
  }

  componentDidUpdate() {
    this.checkVisible();
  }

  checkVisible() {
    const { panel } = this.props;
    const currentVisible = panel.inited && panel.visible;
    if (currentVisible !== this.lastVisible) {
      this.lastVisible = currentVisible;
      if (this.lastVisible) {
        panel.skeleton.postEvent(SkeletonEvents.PANEL_SHOW, panel.name, panel);
        // FIXME! remove this line
        panel.skeleton.postEvent('leftPanel.show' as any, panel.name, panel);
      } else {
        panel.skeleton.postEvent(SkeletonEvents.PANEL_HIDE, panel.name, panel);
        // FIXME! remove this line
        panel.skeleton.postEvent('leftPanel.hide' as any, panel.name, panel);
      }
    }
  }

  render() {
    const { panel, area, hideOperationRow, hideDragLine } = this.props;
    if (!panel.inited) {
      return null;
    }
    const editor = panel.skeleton.editor;
    const panelName = area ? `${area}-${panel.name}` : panel.name;
    editor?.eventBus.emit('skeleton.panel.toggle', {
      name: panelName || '',
      status: panel.visible ? 'show' : 'hide',
    });
    return (
      <div
        className={classNames('lc-panel', {
          hidden: !panel.visible,
        })}
        id={panelName}
        data-keep-visible-while-dragging={panel.config.props?.keepVisibleWhileDragging}
      >
        {!hideOperationRow && <PanelOperationRow panel={panel} />}
        {panel.body}
        {!hideDragLine && <DraggableLineView panel={panel} />}
      </div>
    );
  }
}

@observer
export class TabsPanelView extends Component<{ container: WidgetContainer<Panel> }> {
  render() {
    const { container } = this.props;
    const titles: ReactElement[] = [];
    const contents: ReactElement[] = [];
    container.items.forEach((item: any) => {
      titles.push(<PanelTitle key={item.id} panel={item} className="lc-tab-title" />);
      contents.push(<PanelView key={item.id} panel={item} hideOperationRow hideDragLine />);
    });

    return (
      <div className="lc-tabs">
        <div
          className="lc-tabs-title"
          onClick={(e) => {
            const shell = e.currentTarget;
            const t = e.target as Element;
            let elt = shell.firstElementChild;
            while (elt) {
              if (elt.contains(t)) {
                break;
              }
              elt = elt.nextElementSibling;
            }
            if (elt) {
              container.active((elt as any).dataset.name);
            }
          }}
        >
          {titles}
        </div>
        <div className="lc-tabs-content">{contents}</div>
      </div>
    );
  }
}

@observer
class PanelTitle extends Component<{ panel: Panel; className?: string }> {
  render() {
    const { panel, className } = this.props;
    return (
      <div
        className={classNames('lc-panel-title', className, {
          actived: panel.actived,
        })}
        data-name={panel.name}
      >
        <Title title={panel.title || panel.name} />
        {panel.help ? <HelpTip tip={panel.help} /> : null}
      </div>
    );
  }
}

@observer
export class WidgetView extends Component<{ widget: IWidget }> {
  private lastVisible = false;
  private lastDisabled: boolean | undefined = false;

  componentDidMount() {
    this.checkVisible();
    this.checkDisabled();
  }

  componentDidUpdate() {
    this.checkVisible();
    this.checkDisabled();
  }

  checkVisible() {
    const { widget } = this.props;
    const currentVisible = widget.visible;
    if (currentVisible !== this.lastVisible) {
      this.lastVisible = currentVisible;
      if (this.lastVisible) {
        widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
      } else {
        widget.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, widget.name, widget);
      }
    }
  }

  checkDisabled() {
    const { widget } = this.props;
    const currentDisabled = widget.disabled;
    if (currentDisabled !== this.lastDisabled) {
      this.lastDisabled = currentDisabled;
      if (this.lastDisabled) {
        widget.skeleton.postEvent(SkeletonEvents.WIDGET_DISABLE, widget.name, widget);
      } else {
        widget.skeleton.postEvent(SkeletonEvents.WIDGET_ENABLE, widget.name, widget);
      }
    }
  }

  render() {
    const { widget } = this.props;
    if (!widget.visible) {
      return null;
    }
    if (widget.disabled) {
      return <div className="lc-widget-disabled">{widget.body}</div>;
    }
    return widget.body;
  }
}
