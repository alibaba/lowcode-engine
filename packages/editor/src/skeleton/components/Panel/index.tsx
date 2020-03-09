import React, { PureComponent } from 'react';

import './index.scss';

export interface PanelProps {
  children: Plugin;
}

export default class Panel extends PureComponent<PanelProps> {
  static displayName = 'LowcodePanel';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="lowcode-panel"
        style={{
          width: 240
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
