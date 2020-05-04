import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import Area from '../area';

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
    area.container.items.sort((a,b) => {
      const index1 = a.config?.index || 0;
      const index2 = b.config?.index || 0;
      return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1);
    }).forEach(item => {
      if (item.align === 'center') {
        center.push(item.content);
      } else if (item.align === 'left') {
        left.push(item.content);
      } else {
        right.push(item.content);
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
