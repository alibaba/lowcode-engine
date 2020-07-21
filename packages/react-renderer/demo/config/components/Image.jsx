import React, { PureComponent } from 'react';
export default class ImageView extends PureComponent {
  static displayName = 'Image';
  static version = '0.0.0';
  static defaultProps = {
    src: '//img.alicdn.com/tfs/TB1knm4bqNj0u4jSZFyXXXgMVXa-240-240.png_100x100.jpg',
  };
  render() {
    return <img {...this.props} />;
  }
}
