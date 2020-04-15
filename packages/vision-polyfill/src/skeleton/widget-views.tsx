import { Component, ReactElement } from 'react';
import classNames from 'classnames';
import { Title, observer } from '@ali/lowcode-globals';
import { DockProps } from './types';
import PanelDock from './panel-dock';
import { composeTitle } from './utils';
import WidgetContainer from './widget-container';
import Panel from './panel';
import { IWidget } from './widget';

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
        dock.skeleton.editor.emit('skeleton.panel-dock.active', dock.name, dock);
      } else {
        dock.skeleton.editor.emit('skeleton.panel-dock.unactive', dock.name, dock);
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
        panel.skeleton.editor.emit('skeleton.panel.show', panel.name, panel);
      } else {
        panel.skeleton.editor.emit('skeleton.panel.hide', panel.name, panel);
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
        <div className="lc-pane-body">{panel.body}</div>
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
        panel.skeleton.editor.emit('skeleton.panel.show', panel.name, panel);
      } else {
        panel.skeleton.editor.emit('skeleton.panel.hide', panel.name, panel);
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
        {/*pane.help ? <HelpTip tip={panel.help} /> : null*/}
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
        widget.skeleton.editor.emit('skeleton.widget.show', widget.name, widget);
      } else {
        widget.skeleton.editor.emit('skeleton.widget.hide', widget.name, widget);
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
