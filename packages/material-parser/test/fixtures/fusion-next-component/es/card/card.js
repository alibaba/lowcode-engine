import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

/* eslint-disable valid-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import BulletHeader from './bullet-header';
import CollapseContent from './collapse-content';
import CardMedia from './media';
import CardActions from './actions';
import { obj } from '../util';

var pickOthers = obj.pickOthers;

/**
 * Card
 * @order 0
 */

var Card = (_temp = _class = function (_React$Component) {
    _inherits(Card, _React$Component);

    function Card() {
        _classCallCheck(this, Card);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Card.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            title = _props.title,
            subTitle = _props.subTitle,
            extra = _props.extra,
            showTitleBullet = _props.showTitleBullet,
            showHeadDivider = _props.showHeadDivider,
            children = _props.children,
            rtl = _props.rtl,
            contentHeight = _props.contentHeight,
            free = _props.free,
            actions = _props.actions,
            media = _props.media;


        var cardCls = classNames((_classNames = {}, _classNames[prefix + 'card'] = true, _classNames[prefix + 'card-free'] = free, _classNames[prefix + 'card-show-divider'] = showHeadDivider, _classNames[prefix + 'card-hide-divider'] = !showHeadDivider, _classNames), className);

        var others = pickOthers(Object.keys(Card.propTypes), this.props);

        others.dir = rtl ? 'rtl' : undefined;

        return React.createElement(
            'div',
            _extends({}, others, { className: cardCls }),
            media && React.createElement(
                CardMedia,
                null,
                media
            ),
            React.createElement(BulletHeader, {
                title: title,
                subTitle: subTitle,
                extra: extra,
                showTitleBullet: showTitleBullet
            }),
            free ? children : React.createElement(
                CollapseContent,
                { contentHeight: contentHeight },
                children
            ),
            actions && React.createElement(
                CardActions,
                null,
                actions
            )
        );
    };

    return Card;
}(React.Component), _class.displayName = 'Card', _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * 卡片的上的图片 / 视频
     */
    media: PropTypes.node,
    /**
     * 卡片的标题
     */
    title: PropTypes.node,
    /**
     * 卡片的副标题
     */
    subTitle: PropTypes.node,
    /**
     * 卡片操作组，位置在卡片底部
     */
    actions: PropTypes.node,
    /**
     * 是否显示标题的项目符号
     */
    showTitleBullet: PropTypes.bool,
    /**
     * 是否展示头部的分隔线
     */
    showHeadDivider: PropTypes.bool,
    /**
     * 内容区域的固定高度
     */
    contentHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 标题区域的用户自定义内容
     */
    extra: PropTypes.node,
    /**
     * 是否开启自由模式，开启后card 将使用子组件配合使用, 设置此项后 title, subtitle, 等等属性都将失效
     */
    free: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node
}), _class.defaultProps = {
    prefix: 'next-',
    free: false,
    showTitleBullet: true,
    showHeadDivider: true,
    contentHeight: 120
}, _temp);
Card.displayName = 'Card';
export { Card as default };