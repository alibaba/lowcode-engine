import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import { Button, Icon } from '@alifd/next';
import Area from '../area';
import { PanelConfig } from '../types';
import Panel from '../widget/panel';

@observer
export default class LeftFixedPane extends Component<{ area: Area<PanelConfig, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    const hideTitleBar = area.current?.config.props?.hideTitleBar;
    return (
      <div
        className={classNames('lc-left-fixed-pane', {
          'lc-area-visible': area.visible,
        })}
      >
        {
          !hideTitleBar && (
            <Button
              text
              className="lc-pane-close"
              onClick={() => {
                area.setVisible(false);
              }}
            >
              <Icon type="close" />
            </Button>
          )
        }
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
