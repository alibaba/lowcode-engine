import { observer } from '@recore/obx-react';
import { Component } from 'react';
import { OutlineHovering } from './outline-hovering';
import { SimulatorContext } from '../context';
import { SimulatorHost } from '../host';
import { OutlineSelecting } from './outline-selecting';
import { InsertionView } from './insertion';
import './auxiliary.less';
import './outlines.less';

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
        <InsertionView key="insertion" />
      </div>
    );
  }
}
