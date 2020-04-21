import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-globals';
import { Button, Icon } from '@alifd/next';
import Area from './area';
import { PanelConfig } from './types';
import Panel from './panel';

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
          text
          className="lc-pane-close"
          onClick={() => {
            area.setVisible(false);
          }}
        >
          <Icon type="close" />
        </Button>
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
        {area.container.items.map((panel) => panel.content)}
      </Fragment>
    );
  }
}
