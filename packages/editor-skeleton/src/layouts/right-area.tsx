import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@alilc/lowcode-editor-core';
import { Area } from '../area';
import { Panel } from '../widget/panel';

@observer
export default class RightArea extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    if (area.isEmpty()) {
      return null;
    }
    return (
      <div className={classNames('lc-right-area engine-tabpane', {
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
        {
          area.container.items
            .slice()
            .sort((a, b) => {
              const index1 = a.config?.index || 0;
              const index2 = b.config?.index || 0;
              return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1);
            })
            .map((item) => item.content)
        }
      </Fragment>
    );
  }
}
