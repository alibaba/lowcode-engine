import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@alilc/lowcode-editor-core';
import { Area } from '../area';

@observer
export default class Toolbar extends Component<{ area: Area }> {
  render() {
    const { area } = this.props;
    if (area.isEmpty()) {
      return null;
    }
    return (
      <div
        className={classNames('lc-toolbar', {
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
    const left: any[] = [];
    const center: any[] = [];
    const right: any[] = [];
    area.container.items.forEach((item) => {
      if (item.align === 'center') {
        center.push(item.content);
      } else if (item.align === 'right') {
        right.push(item.content);
      } else {
        left.push(item.content);
      }
    });
    return (
      <Fragment>
        <div className="lc-toolbar-left">{left}</div>
        <div className="lc-toolbar-center">{center}</div>
        <div className="lc-toolbar-right">{right}</div>
      </Fragment>
    );
  }
}
