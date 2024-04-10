import React, { Component } from 'react';
import { observer, engineConfig } from '@alilc/lowcode-editor-core';
import { BorderDetecting } from './border-detecting';
import { BorderContainer } from './border-container';
import { BuiltinSimulatorHost } from '../host';
import { BorderSelecting } from './border-selecting';
import BorderResizing from './border-resizing';
import { InsertionView } from './insertion';
import './bem-tools.less';
import './borders.less';

@observer
export class BemTools extends Component<{ host: BuiltinSimulatorHost }> {
  render() {
    const { host } = this.props;
    const { designMode } = host;
    const { scrollX, scrollY, scale } = host.viewport;
    if (designMode === 'live') {
      return null;
    }
    return (
      <div className="lc-bem-tools" style={{ transform: `translate(${-scrollX * scale}px,${-scrollY * scale}px)` }}>
        { !engineConfig.get('disableDetecting') && <BorderDetecting key="hovering" host={host} /> }
        <BorderSelecting key="selecting" host={host} />
        { engineConfig.get('enableReactiveContainer') && <BorderContainer key="reactive-container-border" host={host} /> }
        <InsertionView key="insertion" host={host} />
        <BorderResizing key="resizing" host={host} />
        {
          host.designer.bemToolsManager.getAllBemTools().map(tools => {
            const ToolsCls = tools.item;
            return <ToolsCls key={tools.name} host={host} />;
          })
        }
      </div>
    );
  }
}
