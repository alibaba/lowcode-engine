import { Component, ReactElement } from 'react';
import { Icon } from '@alifd/next';
import classNames from 'classnames';
import { Title, observer, Tip } from '@ali/lowcode-editor-core';
import { DockProps } from '../types';
import PanelDock from '../widget/panel-dock';
import { composeTitle } from '../widget/utils';
import WidgetContainer from '../widget/widget-container';
import Panel from '../widget/panel';
import { IWidget } from '../widget/widget';
import { SkeletonEvents } from '../skeleton';

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
          <Icon type="help" size="small" className="lc-help-tip"/>
        </a>
        <Tip>{tip.content}</Tip>
      </div>
    );
  }
  return (
    <div>
      <Icon type="help" size="small" className="lc-help-tip"/>
      <Tip>{tip.content}</Tip>
    </div>
  )
}

@observer
export class PanelDockView extends Component<DockProps & { dock: PanelDock }> {
  componentDidMount() {
    this.checkActived();
  }
  componentDidUpdate() {
    this.checkActived();
  }
  private lastActived: boolean = false;
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

export class DialogDockView extends Component {

}

@observer
export class TitledPanelView extends Component<{ panel: Panel }> {
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    this.checkVisible();
  }
  componentDidUpdate() {
    this.checkVisible();
  }
  private lastVisible: boolean = false;
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
    const { panel } = this.props;
    if (!panel.inited) {
      return null;
    }
    return (
      <div className={classNames('lc-titled-panel', {
        hidden: !panel.visible,
      })}>
        <PanelTitle panel={panel} />
        <div className="lc-panel-body">{panel.body}</div>
      </div>
    );
  }
}

@observer
export class PanelView extends Component<{ panel: Panel }> {
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    this.checkVisible();
  }
  componentDidUpdate() {
    this.checkVisible();
  }
  private lastVisible: boolean = false;
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
    const { panel } = this.props;
    if (!panel.inited) {
      return null;
    }
    return (
      <div
        className={classNames('lc-panel', {
          hidden: !panel.visible,
        })}
      >
        {panel.body}
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
      contents.push(<PanelView key={item.id} panel={item} />);
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
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    this.checkVisible();
  }
  componentDidUpdate() {
    this.checkVisible();
  }
  private lastVisible: boolean = false;
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
  render() {
    const { widget } = this.props;
    if (!widget.visible) {
      return null;
    }
    return widget.body;
  }
}
