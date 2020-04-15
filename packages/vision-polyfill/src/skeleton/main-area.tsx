import { Component } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-globals';
import Area from './area';
import Panel from './panel';
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
        {area.container.items.map((item) => item.content)}
      </div>
    );
  }
}
