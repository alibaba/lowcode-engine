import { Component } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/recore';
import Area from './area';
import Panel, { isPanel } from './panel';
import { PanelWrapper } from './widget-views';
import Widget from './widget';

@observer
export default class MainArea extends Component<{ area: Area<any, Panel | Widget> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    return (
      <div className={classNames('lc-main-area')}>
        {area.container.items.map((item) => {
          // todo?
          if (isPanel(item)) {
            return <PanelWrapper key={item.id} panel={item} />;
          }
          return item.content;
        })}
      </div>
    );
  }
}
