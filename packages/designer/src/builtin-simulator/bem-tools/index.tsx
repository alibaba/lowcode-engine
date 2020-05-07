import { Component } from 'react';
import { observer } from '@ali/lowcode-editor-core';
import { BorderHovering } from './border-hovering';
import { SimulatorContext } from '../context';
import { BuiltinSimulatorHost } from '../host';
import { BorderSelecting } from './border-selecting';
import BorderResizing from './border-resizing';
import { InsertionView } from './insertion';
import './bem-tools.less';
import './borders.less';

@observer
export class BemTools extends Component {
  static contextType = SimulatorContext;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const host = this.context as BuiltinSimulatorHost;
    const { scrollX, scrollY, scale } = host.viewport;
    return (
      <div className="lc-bem-tools" style={{ transform: `translate(${-scrollX * scale}px,${-scrollY * scale}px)` }}>
        <BorderHovering key="hovering" />
        <BorderSelecting key="selecting" />
        <InsertionView key="insertion" />
        <BorderResizing key="resizing" />
      </div>
    );
  }
}
