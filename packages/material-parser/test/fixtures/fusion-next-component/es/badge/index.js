import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import Sup from './sup';

/**
 * Badge
 */
var Badge = (_temp = _class = function (_Component) {
    _inherits(Badge, _Component);

    function Badge() {
        _classCallCheck(this, Badge);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Badge.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            dot = _props.dot,
            className = _props.className,
            children = _props.children,
            content = _props.content,
            style = _props.style,
            rtl = _props.rtl,
            originCount = _props.count,
            showZero = _props.showZero,
            originOverflowCount = _props.overflowCount;

        var count = parseInt(originCount, 10);
        var overflowCount = parseInt(originOverflowCount, 10);
        var others = obj.pickOthers(Badge.propTypes, this.props);

        // 如果是数字，则添加默认的 title
        if (count || count === 0 && showZero) {
            others.title = others.title || '' + count;
        }

        var classes = classNames(prefix + 'badge', (_classNames = {}, _classNames[prefix + 'badge-not-a-wrapper'] = !children, _classNames), className);

        return React.createElement(
            'span',
            _extends({ dir: rtl ? 'rtl' : undefined, className: classes }, others),
            children,
            React.createElement(Sup, {
                prefix: prefix,
                content: content,
                count: count,
                showZero: showZero,
                overflowCount: overflowCount,
                dot: dot,
                style: style
            })
        );
    };

    return Badge;
}(Component), _class.propTypes = {
    // 样式类名的品牌前缀
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    // 自定义类名
    className: PropTypes.string,
    // 自定义内联样式
    style: PropTypes.object,
    /**
     * 徽章依托的内容
     */
    children: PropTypes.node,
    /**
     * 展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时默认隐藏
     */
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 当count为0时，是否显示count
     */
    showZero: PropTypes.bool,
    /**
     * 自定义节点内容
     */
    content: PropTypes.node,
    /**
     * 展示的封顶的数字
     */
    overflowCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 不展示数字，只展示一个小红点
     */
    dot: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    count: 0,
    showZero: false,
    overflowCount: 99,
    dot: false
}, _temp);
Badge.displayName = 'Badge';


export default ConfigProvider.config(Badge);