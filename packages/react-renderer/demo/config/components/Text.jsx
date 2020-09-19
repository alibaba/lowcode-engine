import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class TextView extends PureComponent {
  static displayName = 'Text';

  static version = '0.0.0';

  static propTypes = {
    text: PropTypes.string,
  };

  render() {
    const { text, ...restProps } = this.props;
    let textNode = text;
    // 强制类型转换
    try {
      textNode = text.toString();
    } catch (e) {
      textNode = '';
    }
    if (window.__ctx && window.__ctx.canvasAppHelper) {
      textNode = textNode || 'Text';
    }
    return <span {...restProps}>{textNode}</span>;
  }
}
