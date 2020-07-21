import React, { PureComponent } from 'react';
export default class DivView extends PureComponent {
  static displayName = 'Div';
  static version = '0.0.0';
  render() {
    return <div {...this.props} />;
  }
}
