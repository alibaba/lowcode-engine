import React, {PureComponent} from 'react';

import './index.scss';

export default class RightArea extends PureComponent {
  static displayName = 'lowcodeRightArea';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="lowcode-right-area"/>
    );
  }
}