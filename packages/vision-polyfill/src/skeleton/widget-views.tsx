import { Component, ReactElement } from 'react';
import classNames from 'classnames';
import { Title, observer } from '@ali/lowcode-globals';
import { DockProps } from './types';
import PanelDock from './panel-dock';
import { composeTitle } from './utils';
import WidgetContainer from './widget-container';
import Panel from './panel';
import Widget from './widget';

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
  render() {
    const { dock, className, onClick, ...props } = this.props;
    return DockView({
      ...props,
      className: classNames(className, {
        actived: dock.actived,
      }),
      onClick: () => {
        onClick && onClick();
        dock.toggle();
      },
    });
  }
}

export class DialogDockView extends Component {

}

export class PanelView extends Component<{ panel: Panel }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { panel } = this.props;
    return (
      <div className="lc-panel">
        <PanelTitle panel={panel} />
        <div className="lc-pane-body">{panel.body}</div>
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
      contents.push(<PanelWrapper key={item.id} panel={item} />);
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
export class PanelWrapper extends Component<{ panel: Panel }> {
  render() {
    const { panel } = this.props;
    if (!panel.inited) {
      return null;
    }
    return (
      <div
        className={classNames('lc-panel-wrapper', {
          hidden: !panel.actived,
        })}
      >
        {panel.body}
      </div>
    );
  }
}

@observer
export class WidgetWrapper extends Component<{ widget: Widget }> {
  render() {
    const { widget } = this.props;
    if (!widget.visible) {
      return null;
    }
    return widget.body;
  }
}
