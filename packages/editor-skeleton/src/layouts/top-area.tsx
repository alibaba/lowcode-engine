import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@alilc/lowcode-editor-core';
import { Area } from '../area';

@observer
export default class TopArea extends Component<{ area: Area; itemClassName?: string; className?: string }> {
  render() {
    const { area, itemClassName, className } = this.props;
    if (area.isEmpty()) {
      return null;
    }
    return (
      <div className={classNames(className, 'lc-top-area engine-actionpane', {
        'lc-area-visible': area.visible,
      })}
      >
        <Contents area={area} itemClassName={itemClassName} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area; itemClassName?: string }> {
  render() {
    const { area, itemClassName } = this.props;
    const left: any[] = [];
    const center: any[] = [];
    const right: any[] = [];
    area.container.items.slice().sort((a, b) => {
      const index1 = a.config?.index || 0;
      const index2 = b.config?.index || 0;
      return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1);
    }).forEach(item => {
      const content = (
        <div className={itemClassName || ''} key={`top-area-${item.name}`}>
          {item.content}
        </div>
      );
      if (item.align === 'center') {
        center.push(content);
      } else if (item.align === 'left') {
        left.push(content);
      } else {
        right.push(content);
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
