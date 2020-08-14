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
 * Card.Header
 * @order 2
 */
var CardHeader = (_temp = _class = function (_Component) {
    _inherits(CardHeader, _Component);

    function CardHeader() {
        _classCallCheck(this, CardHeader);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    CardHeader.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            title = _props.title,
            subTitle = _props.subTitle,
            extra = _props.extra,
            className = _props.className,
            Component = _props.component,
            others = _objectWithoutProperties(_props, ['prefix', 'title', 'subTitle', 'extra', 'className', 'component']);

        return React.createElement(
            Component,
            _extends({}, others, {
                className: classNames(prefix + 'card-header', className)
            }),
            extra && React.createElement(
                'div',
                { className: prefix + 'card-header-extra' },
                extra
            ),
            React.createElement(
                'div',
                { className: prefix + 'card-header-titles' },
                title && React.createElement(
                    'div',
                    { className: prefix + 'card-header-title' },
                    title
                ),
                subTitle && React.createElement(
                    'div',
                    { className: prefix + 'card-header-subtitle' },
                    subTitle
                )
            )
        );
    };

    return CardHeader;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 卡片的标题
     */
    title: PropTypes.node,
    /**
     * 卡片的副标题
     */
    subTitle: PropTypes.node,
    /**
     * 标题区域的用户自定义内容
     */
    extra: PropTypes.node,
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'div'
}, _temp);
CardHeader.displayName = 'CardHeader';


export default ConfigProvider.config(CardHeader);