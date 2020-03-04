import React, {PureComponent} from 'react';

import './index.scss';

export default class CenterArea extends PureComponent {
  static displayName = 'lowcodeCenterArea';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="lowcode-center-area" />
    );
  }
}