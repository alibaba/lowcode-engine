import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-globals';
import { Button } from '@alifd/next';
import Area from './area';
import Panel from './panel';

@observer
export default class LeftFloatPane extends Component<{ area: Area<any, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    // TODO: add focusingManager
    // TODO: dragstart close
    return (
      <div
        className={classNames('lc-left-float-pane', {
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
class Contents extends Component<{ area: Area<any, Panel> }> {
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
