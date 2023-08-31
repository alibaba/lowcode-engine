import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@alilc/lowcode-editor-core';
import { Area } from '@alilc/lowcode-editor-skeleton';

@observer
export default class SubTopArea extends Component<{ area: Area; itemClassName?: string }> {
  render() {
    const { area, itemClassName } = this.props;

    if (area.isEmpty()) {
      return null;
    }

    return (
      <div className={classNames('lc-sub-top-area engine-actionpane', {
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
    let children = [];
    if (left && left.length) {
      children.push(<div className="lc-sub-top-area-left">{left}</div>);
    }
    if (center && center.length) {
      children.push(<div className="lc-sub-top-area-center">{center}</div>);
    }
    if (right && right.length) {
      children.push(<div className="lc-sub-top-area-right">{right}</div>);
    }
    return (
      <Fragment>
        {children}
      </Fragment>
    );
  }
}
