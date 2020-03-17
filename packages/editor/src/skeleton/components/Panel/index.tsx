import React, { PureComponent } from 'react';
import classNames from 'classnames';

import './index.scss';

export interface PanelProps {
  align: 'left' | 'right';
  defaultWidth: number;
  minWidth: number;
  draggable: boolean;
  floatable: boolean;
  children: Plugin;
  visible: boolean;
}

export interface PanelState {
  width: number;
}

export default class Panel extends PureComponent<PanelProps, PanelState> {
  static displayName = 'LowcodePanel';

  static defaultProps = {
    align: 'left',
    defaultWidth: 240,
    minWidth: 100,
    draggable: true,
    floatable: false,
    visible: true
  };

  constructor(props) {
    super(props);

    this.state = {
      width: props.defaultWidth
    };
  }

  render(): React.ReactNode {
    const { align, draggable, floatable, visible } = this.props;
    const { width } = this.state;
    return (
      <div
        className={classNames('lowcode-panel', align, {
          draggable,
          floatable,
          visible
        })}
        style={{
          width,
          display: visible ? '' : 'none'
        }}
      >
        {this.props.children}
        <div className="drag-area" />
      </div>
    );
  }
}
