import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@alilc/lowcode-editor-core';
import { Area } from '../area';
import { Panel } from '../widget/panel';

@observer
export default class BottomArea extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    if (area.isEmpty()) {
      return null;
    }
    return (
      <div className={classNames('lc-bottom-area', {
        'lc-area-visible': area.visible,
      })}
      >
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
        {area.container.items.map((item) => item.content)}
      </Fragment>
    );
  }
}
