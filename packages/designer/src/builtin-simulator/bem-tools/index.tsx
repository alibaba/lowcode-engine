import React, { Component } from 'react';
import { observer } from '@ali/lowcode-editor-core';
import { BorderDetecting } from './border-detecting';
import { BuiltinSimulatorHost } from '../host';
import { BorderSelecting } from './border-selecting';
import BorderResizing from './border-resizing';
import { InsertionView } from './insertion';
import './bem-tools.less';
import './borders.less';

@observer
export class BemTools extends Component<{ host: BuiltinSimulatorHost }> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { host } = this.props;
    const { designMode } = host;
    const { scrollX, scrollY, scale } = host.viewport;
    if (designMode === 'live') {
      return null;
    }
    return (
      <div className="lc-bem-tools" style={{ transform: `translate(${-scrollX * scale}px,${-scrollY * scale}px)` }}>
        <BorderDetecting key="hovering" host={host} />
        <BorderSelecting key="selecting" host={host} />
        <InsertionView key="insertion" host={host} />
        <BorderResizing key="resizing" host={host} />
      </div>
    );
  }
}
