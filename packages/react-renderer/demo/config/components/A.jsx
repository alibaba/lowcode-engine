import React, { PureComponent } from 'react';

export default class AView extends PureComponent {
  static displayName = 'A';

  static version = '0.0.0';

  render() {
    return <a {...this.props} />;
  }
}
