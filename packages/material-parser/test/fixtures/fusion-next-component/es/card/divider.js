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
 * Card.Divider
 * @order 4
 */
var CardDivider = (_temp = _class = function (_Component) {
    _inherits(CardDivider, _Component);

    function CardDivider() {
        _classCallCheck(this, CardDivider);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    CardDivider.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            Component = _props.component,
            inset = _props.inset,
            className = _props.className,
            others = _objectWithoutProperties(_props, ['prefix', 'component', 'inset', 'className']);

        var dividerClassName = classNames(prefix + 'card-divider', (_classNames = {}, _classNames[prefix + 'card-divider--inset'] = inset, _classNames), className);

        return React.createElement(Component, _extends({}, others, { className: dividerClassName }));
    };

    return CardDivider;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType,
    /**
     * 分割线是否向内缩进
     */
    inset: PropTypes.bool,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'hr'
}, _temp);
CardDivider.displayName = 'CardDivider';


export default ConfigProvider.config(CardDivider);