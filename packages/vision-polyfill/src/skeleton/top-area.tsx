import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-globals';
import Area from './area';

@observer
export default class TopArea extends Component<{ area: Area }> {
  render() {
    const { area } = this.props;
    return (
      <div className={classNames("lc-top-area", {
        'lc-area-visible': area.visible
      })}>
        <Contents area={area} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area }> {
  render() {
    const { area } = this.props;
    const left: any[] = [];
    const center: any[] = [];
    const right: any[] = [];
    area.container.items.forEach(item => {
      if (item.align === 'center') {
        center.push(item.content);
      } else if (item.align === 'left') {
        right.push(item.content);
      } else {
        left.push(item.content);
      }
    });
    return (
      <Fragment>
        <div className="lc-top-area-left">{left}</div>
        <div className="lc-top-area-center">{center}</div>
        <div className="lc-top-area-right">{right}</div>
      </Fragment>
    );
  }
}
