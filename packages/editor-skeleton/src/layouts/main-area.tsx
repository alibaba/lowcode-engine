import { Component } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import Area from '../area';
import Panel from '../widget/panel';
import Widget from '../widget/widget';

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
