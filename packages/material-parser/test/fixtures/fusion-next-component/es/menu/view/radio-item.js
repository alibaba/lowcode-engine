import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckableItem from './checkable-item';

/**
 * Menu.RadioItem
 * @order 4
 * @description 该子组件选中情况不受 defaultSelectedKeys/selectedKeys 控制，请自行控制选中逻辑
 */
var RadioItem = (_temp = _class = function (_Component) {
  _inherits(RadioItem, _Component);

  function RadioItem() {
    _classCallCheck(this, RadioItem);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  RadioItem.prototype.render = function render() {
    return React.createElement(CheckableItem, _extends({
      role: 'menuitemradio',
      checkType: 'radio'
    }, this.props));
  };

  return RadioItem;
}(Component), _class.menuChildType = 'item', _class.propTypes = {
  /**
   * 是否选中
   */
  checked: PropTypes.bool,
  /**
   * 是否禁用
   */
  disabled: PropTypes.bool,
  /**
   * 选中或取消选中触发的回调函数
   * @param {Boolean} checked 是否选中
   * @param {Object} event 选中事件对象
   */
  onChange: PropTypes.func,
  /**
   * 帮助文本
   */
  helper: PropTypes.node,
  /**
   * 标签内容
   */
  children: PropTypes.node
}, _class.defaultProps = {
  checked: false,
  disabled: false,
  onChange: function onChange() {}
}, _temp);
RadioItem.displayName = 'RadioItem';
export { RadioItem as default };