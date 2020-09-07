import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore file */

/**
 * Select.Option
 */
var Option = (_temp = _class = function (_React$Component) {
  _inherits(Option, _React$Component);

  function Option() {
    _classCallCheck(this, Option);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Option.prototype.render = function render() {
    return this.props.children;
  };

  return Option;
}(React.Component), _class.propTypes = {
  /**
   * 选项值
   */
  value: PropTypes.any.isRequired,
  /**
   * 是否禁用
   */
  disabled: PropTypes.bool,
  children: PropTypes.any
}, _class._typeMark = 'next_select_option', _temp);
Option.displayName = 'Option';
export { Option as default };