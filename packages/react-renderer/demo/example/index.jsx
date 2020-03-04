import React, { PureComponent } from 'react';

import Widget from '_';

import './index.less';

export default class Example extends PureComponent {
  static displayName = 'example';
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="example">
        This is an example
        <Widget />
      </div>
    );
  }
}
