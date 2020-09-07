import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../../config-provider';

/**
 * Button.Group
 */
var ButtonGroup = (_temp = _class = function (_Component) {
    _inherits(ButtonGroup, _Component);

    function ButtonGroup() {
        _classCallCheck(this, ButtonGroup);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ButtonGroup.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            size = _props.size,
            children = _props.children,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'size', 'children', 'rtl']);

        var groupCls = classNames((_classNames = {}, _classNames[prefix + 'btn-group'] = true, _classNames[className] = className, _classNames));

        var cloneChildren = Children.map(children, function (child) {
            if (child) {
                return React.cloneElement(child, {
                    size: size
                });
            }
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        return React.createElement(
            'div',
            _extends({}, others, { className: groupCls }),
            cloneChildren
        );
    };

    return ButtonGroup;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    rtl: PropTypes.bool,
    prefix: PropTypes.string,
    /**
     * 统一设置 Button 组件的按钮大小
     */
    size: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
}), _class.defaultProps = {
    prefix: 'next-',
    size: 'medium'
}, _temp);
ButtonGroup.displayName = 'ButtonGroup';


export default ConfigProvider.config(ButtonGroup);