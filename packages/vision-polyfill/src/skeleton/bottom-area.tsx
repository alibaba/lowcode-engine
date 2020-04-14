import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/recore';
import Area from './area';
import Panel from './panel';
import { PanelWrapper } from './widget-views';

@observer
export default class BottomArea extends Component<{ area: Area<any, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    if (area.isEmpty()) {
      return null;
    }
    return (
      <div className={classNames('lc-bottom-area', {
        'lc-area-visible': area.visible,
      })}>
        <Contents area={area} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    return (
      <Fragment>
        {area.container.items.map((item) => <PanelWrapper key={item.id} panel={item} />)}
      </Fragment>
    );
  }
}
