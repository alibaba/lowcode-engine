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
 * Form.Submit
 * @description 继承 Button API
 * @order 2
 */
var Submit = (_temp2 = _class = function (_React$Component) {
    _inherits(Submit, _React$Component);

    function Submit() {
        var _temp, _this, _ret;

        _classCallCheck(this, Submit);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleClick = function () {
            var _this$props = _this.props,
                onClick = _this$props.onClick,
                validate = _this$props.validate;

            var field = _this.context._formField || _this.props.field;

            if (!field) {
                onClick();
                return;
            }

            if (validate === true) {
                field.validate(function (errors) {
                    onClick(field.getValues(), errors, field);
                });
            } else if (Array.isArray(validate)) {
                field.validate(validate, function (errors) {
                    onClick(field.getValues(), errors, field);
                });
            } else {
                onClick(field.getValues(), null, field);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Submit.prototype.render = function render() {
        var children = this.props.children;


        return React.createElement(
            Button,
            _extends({}, obj.pickOthers(Submit.propTypes, this.props), {
                onClick: this.handleClick
            }),
            children
        );
    };

    return Submit;
}(React.Component), _class.propTypes = {
    /**
     * 点击提交后触发
     * @param {Object} value 数据
     * @param {Object} errors 错误数据
     * @param {class} field 实例
     */
    onClick: PropTypes.func,
    /**
     * 是否校验/需要校验的 name 数组
     */
    validate: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
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
Submit.displayName = 'Submit';


export default Submit;