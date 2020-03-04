import React, {PureComponent} from 'react';

import './index.scss';

export default class LeftAreaPanel extends PureComponent {
  static displayName = 'lowcodeLeftAreaPanel';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="lowcode-left-area"/>
    );
  }
}