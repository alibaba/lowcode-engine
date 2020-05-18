import './style.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LowStyleSetter from '@ali/lc-style-setter';
import { globalLocale } from '@ali/lowcode-editor-core';

export default class StyleSetter extends Component{

  static displayName = 'StyleSetter';
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    locale: PropTypes.string
  };
  static defaultProps = {
    value: {},
    onChange: () => {},
    placeholder: '',
    locale: globalLocale.getLocale() || 'en-US'
  };

  onChange = (val: any) => {
    const { onChange } = this.props;
    onChange(val.native);
  }

  render () {
    const { value } = this.props;
    return (
      <div className="lc-block-setter">
        <LowStyleSetter {...this.props} value={value} onChange={this.onChange} />
      </div>
    );
  }

}
