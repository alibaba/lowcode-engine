import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import { func, obj } from '../util';

/**
 * Form.Reset
 * @description 继承 Button API
 * @order 3
 */
var Reset = (_temp2 = _class = function (_React$Component) {
    _inherits(Reset, _React$Component);

    function Reset() {
        var _temp, _this, _ret;

        _classCallCheck(this, Reset);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleClick = function () {
            var _this$props = _this.props,
                names = _this$props.names,
                toDefault = _this$props.toDefault,
                onClick = _this$props.onClick;

            var field = _this.context._formField || _this.props.field;

            if (!field) {
                onClick();
                return;
            }

            if (toDefault) {
                field.resetToDefault(names);
            } else {
                field.reset(names);
            }

            onClick();
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Reset.prototype.render = function render() {
        var children = this.props.children;


        return React.createElement(
            Button,
            _extends({}, obj.pickOthers(Reset.propTypes, this.props), {
                onClick: this.handleClick
            }),
            children
        );
    };

    return Reset;
}(React.Component), _class.propTypes = {
    /**
     * 自定义重置的字段
     */
    names: PropTypes.array,
    /**
     * 点击提交后触发
     */
    onClick: PropTypes.func,
    /**
     * 返回默认值
     */
    toDefault: PropTypes.bool,
    /**
     * 自定义 field (在 Form 内不需要设置)
     */
    field: PropTypes.object,
    children: PropTypes.node
}, _class.defaultProps = {
    onClick: func.noop
}, _class.contextTypes = {
    _formField: PropTypes.object
}, _temp2);
Reset.displayName = 'Reset';


export default Reset;