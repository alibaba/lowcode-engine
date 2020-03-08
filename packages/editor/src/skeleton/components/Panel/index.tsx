import React, { PureComponent } from 'react';

import './index.scss';
export default class Panel extends PureComponent {
  static displayName = 'Panel';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="lowcode-panel"
        style={{
          width: 240,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
