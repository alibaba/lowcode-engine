import { observer } from '@recore/core-obx';
import { Component } from 'react';
import { OutlineHovering } from './outline-hovering';
import { SimulatorContext } from '../context';
import { SimulatorHost } from '../host';
import './auxiliary.less';
import './outlines.less';
import { OutlineSelecting } from './outline-selecting';

@observer
export class AuxiliaryView extends Component {
  static contextType = SimulatorContext;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const host = this.context as SimulatorHost;
    const { scrollX, scrollY, scale } = host.viewport;
    return (
      <div className="lc-auxiliary" style={{ transform: `translate(${-scrollX * scale}px,${-scrollY * scale}px)` }}>
        <OutlineHovering key="hovering" />
        <OutlineSelecting key="selecting" />
      </div>
    );
  }
}
