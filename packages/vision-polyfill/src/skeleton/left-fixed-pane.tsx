import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-globals';
import { Button } from '@alifd/next';
import Area from './area';
import { PanelConfig } from './types';
import Panel from './panel';
import { PanelWrapper } from './widget-views';

@observer
export default class LeftFixedPane extends Component<{ area: Area<PanelConfig, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    return (
      <div
        className={classNames('lc-left-fixed-pane', {
          'lc-area-visible': area.visible,
        })}
      >
        <Button
          className="lc-pane-close"
          onClick={() => {
            area.setVisible(false);
          }}
        />
        <Contents area={area} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area<PanelConfig, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    return (
      <Fragment>
        {area.container.items.map((panel) => (
          <PanelWrapper key={panel.id} panel={panel} />
        ))}
      </Fragment>
    );
  }
}
