import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckableItem from './checkable-item';

/**
 * Menu.CheckboxItem
 * @order 3
 * @description 该子组件选中情况不受 defaultSelectedKeys/selectedKeys 控制，请自行控制选中逻辑
 */
var CheckboxItem = (_temp = _class = function (_Component) {
  _inherits(CheckboxItem, _Component);

  function CheckboxItem() {
    _classCallCheck(this, CheckboxItem);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  CheckboxItem.prototype.render = function render() {
    var _props = this.props,
        checkboxDisabled = _props.checkboxDisabled,
        others = _objectWithoutProperties(_props, ['checkboxDisabled']);

    return React.createElement(CheckableItem, _extends({
      role: 'menuitemcheckbox',
      checkType: 'checkbox',
      checkDisabled: checkboxDisabled
    }, others));
  };

  return CheckboxItem;
}(Component), _class.menuChildType = 'item', _class.propTypes = {
  /**
   * 是否选中
   */
  checked: PropTypes.bool,
  /**
   * 是否半选中
   */
  indeterminate: PropTypes.bool,
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
  children: PropTypes.node,
  checkboxDisabled: PropTypes.bool
}, _class.defaultProps = {
  checked: false,
  indeterminate: false,
  disabled: false,
  onChange: function onChange() {},
  checkboxDisabled: false
}, _temp);
CheckboxItem.displayName = 'CheckboxItem';
export { CheckboxItem as default };