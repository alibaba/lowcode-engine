import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Form.Error
 * @description 自定义错误展示
 * @order 4
 */
var Error = (_temp2 = _class = function (_React$Component) {
    _inherits(Error, _React$Component);

    function Error() {
        var _temp, _this, _ret;

        _classCallCheck(this, Error);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.itemRender = function (errors) {
            return errors.length ? errors : null;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Error.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            children = _props.children,
            name = _props.name,
            prefix = _props.prefix,
            style = _props.style,
            className = _props.className,
            _field = _props.field,
            others = _objectWithoutProperties(_props, ['children', 'name', 'prefix', 'style', 'className', 'field']);

        if (children && typeof children !== 'function') {
            return React.createElement(
                'div',
                { className: prefix + 'form-item-help' },
                children
            );
        }

        var field = this.context._formField || _field;

        if (!field || !name) {
            return null;
        }

        var isSingle = typeof name === 'string';

        var names = isSingle ? [name] : name;
        var errorArr = [];

        if (names.length) {
            var errors = field.getErrors(names);
            Object.keys(errors).forEach(function (key) {
                if (errors[key]) {
                    errorArr.push(errors[key]);
                }
            });
        }

        var result = null;
        if (typeof children === 'function') {
            result = children(errorArr, isSingle ? field.getState(name) : undefined);
        } else {
            result = this.itemRender(errorArr);
        }

        if (!result) {
            return null;
        }

        var cls = classNames((_classNames = {}, _classNames[prefix + 'form-item-help'] = true, _classNames[className] = className, _classNames));

        return React.createElement(
            'div',
            _extends({}, others, { className: cls, style: style }),
            result
        );
    };

    return Error;
}(React.Component), _class.propTypes = {
    /**
     * 表单名
     */
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 自定义 field (在 Form 内不需要设置)
     */
    field: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
    /**
     * 自定义错误渲染, 可以是 node 或者 function(errors, state)
     */
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    prefix: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-'
}, _class.contextTypes = {
    _formField: PropTypes.object
}, _class._typeMark = 'form_error', _temp2);
Error.displayName = 'Error';


export default ConfigProvider.config(Error);