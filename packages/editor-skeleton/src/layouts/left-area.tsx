import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import Area from '../area';

@observer
export default class LeftArea extends Component<{ area: Area }> {
  render() {
    const { area } = this.props;
    return (
      <div className={classNames('lc-left-area', {
        'lc-area-visible': area.visible,
      })}
      >
        <Contents area={area} />
      </div>
    );
  }
}


@observer
class Contents extends Component<{ area: Area }> {
  render() {
    const { area } = this.props;
    const top: any[] = [];
    const bottom: any[] = [];
    area.container.items.forEach((item) => {
      const content = <div key={`left-area-${item.name}`}>{item.content}</div>;
      if (item.align === 'bottom') {
        bottom.push(content);
      } else {
        top.push(content);
      }
    });
    return (
      <Fragment>
        <div className="lc-left-area-top">{top}</div>
        <div className="lc-left-area-bottom">{bottom}</div>
      </Fragment>
    );
  }
}
