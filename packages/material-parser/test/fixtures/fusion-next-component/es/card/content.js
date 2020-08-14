import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.Content
 * @order 3
 */
var CardContent = (_temp = _class = function (_Component) {
    _inherits(CardContent, _Component);

    function CardContent() {
        _classCallCheck(this, CardContent);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    CardContent.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            Component = _props.component,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'component']);

        return React.createElement(Component, _extends({}, others, {
            className: classNames(prefix + 'card-content-container', className)
        }));
    };

    return CardContent;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'div'
}, _temp);
CardContent.displayName = 'CardContent';


export default ConfigProvider.config(CardContent);