import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Line from './progress-line';
import Circle from './progress-circle';

/**
 * Progress
 */
var Progress = (_temp = _class = function (_Component) {
  _inherits(Progress, _Component);

  function Progress() {
    _classCallCheck(this, Progress);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Progress.prototype.render = function render() {
    var _props = this.props,
        shape = _props.shape,
        hasBorder = _props.hasBorder,
        others = _objectWithoutProperties(_props, ['shape', 'hasBorder']);

    return shape === 'circle' ? React.createElement(Circle, others) : React.createElement(Line, _extends({}, others, { hasBorder: hasBorder }));
  };

  return Progress;
}(Component), _class.propTypes = {
  prefix: PropTypes.string,
  /**
   * 形态
   */
  shape: PropTypes.oneOf(['circle', 'line']),
  /**
   * 尺寸
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * 所占百分比
   */
  percent: PropTypes.number,
  /**
   * 进度状态, 显示优先级: color > progressive > state
   */
  state: PropTypes.oneOf(['normal', 'success', 'error']),
  /**
   * 是否为色彩阶段变化模式, 显示优先级: color > progressive > state
   */
  progressive: PropTypes.bool,
  /**
   * 是否添加 Border（只适用于 Line Progress)
   */
  hasBorder: PropTypes.bool,
  /**
   * 文本渲染函数
   * @param {Number} percent 当前的进度信息
   * @param {Object} option 额外的参数
   * @property {Boolean} option.rtl 是否在rtl 模式下渲染
   * @return {ReactNode} 返回文本节点
   */
  textRender: PropTypes.func,
  /**
   * 进度条颜色, 显示优先级: color > progressive > state
   */
  color: PropTypes.string,
  /**
   * 背景色
   */
  backgroundColor: PropTypes.string,
  rtl: PropTypes.bool
}, _class.defaultProps = {
  prefix: 'next-',
  shape: 'line',
  state: 'normal',
  size: 'medium',
  percent: 0,
  progressive: false,
  hasBorder: false,
  textRender: function textRender(percent) {
    return Math.floor(percent) + '%';
  }
}, _class.contextTypes = {
  prefix: PropTypes.string
}, _temp);
Progress.displayName = 'Progress';
export { Progress as default };