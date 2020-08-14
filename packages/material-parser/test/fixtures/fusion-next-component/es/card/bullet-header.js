import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.BulletHeader
 * @order 2
 */
var CardBulletHeader = (_temp = _class = function (_Component) {
    _inherits(CardBulletHeader, _Component);

    function CardBulletHeader() {
        _classCallCheck(this, CardBulletHeader);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    CardBulletHeader.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            title = _props.title,
            subTitle = _props.subTitle,
            extra = _props.extra,
            showTitleBullet = _props.showTitleBullet;


        if (!title) return null;

        var headCls = classNames((_classNames = {}, _classNames[prefix + 'card-head'] = true, _classNames[prefix + 'card-head-show-bullet'] = showTitleBullet, _classNames));

        var headExtra = extra ? React.createElement(
            'div',
            { className: prefix + 'card-extra' },
            extra
        ) : null;

        return React.createElement(
            'div',
            { className: headCls },
            React.createElement(
                'div',
                { className: prefix + 'card-head-main' },
                React.createElement(
                    'div',
                    { className: prefix + 'card-title' },
                    title,
                    subTitle ? React.createElement(
                        'span',
                        { className: prefix + 'card-subtitle' },
                        subTitle
                    ) : null
                ),
                headExtra
            )
        );
    };

    return CardBulletHeader;
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
     * 是否显示标题的项目符号
     */
    showTitleBullet: PropTypes.bool,
    /**
     * 标题区域的用户自定义内容
     */
    extra: PropTypes.node
}, _class.defaultProps = {
    prefix: 'next-',
    showTitleBullet: true
}, _temp);
CardBulletHeader.displayName = 'CardBulletHeader';


export default ConfigProvider.config(CardBulletHeader, {
    componentName: 'Card'
});