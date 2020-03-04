import React, {PureComponent} from 'react';

import './index.scss';

export default class TopArea extends PureComponent {
  static displayName = 'lowcodeTopArea';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="lowcode-top-area"/>
    );
  }
}