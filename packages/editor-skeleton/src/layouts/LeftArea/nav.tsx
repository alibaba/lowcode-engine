import React, { PureComponent } from 'react';

import './index.scss';

export default class LeftAreaPanel extends PureComponent {
  static displayName = 'lowcodeLeftAreaNav';

  constructor(props) {
    super(props);
  }

  render() {
    return <div className="lowcode-left-area-nav" />;
  }
}
