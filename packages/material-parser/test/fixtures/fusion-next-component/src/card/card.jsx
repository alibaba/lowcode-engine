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

const { pickOthers } = obj;

/**
 * Card
 * @order 0
 */
export default class Card extends React.Component {
    static displayName = 'Card';

    static propTypes = {
        ...ConfigProvider.propTypes,
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
        contentHeight: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        /**
         * 标题区域的用户自定义内容
         */
        extra: PropTypes.node,
        /**
         * 是否开启自由模式，开启后card 将使用子组件配合使用, 设置此项后 title, subtitle, 等等属性都将失效
         */
        free: PropTypes.bool,
        className: PropTypes.string,
        children: PropTypes.node,
    };

    static defaultProps = {
        prefix: 'next-',
        free: false,
        showTitleBullet: true,
        showHeadDivider: true,
        contentHeight: 120,
    };

    render() {
        const {
            prefix,
            className,
            title,
            subTitle,
            extra,
            showTitleBullet,
            showHeadDivider,
            children,
            rtl,
            contentHeight,
            free,
            actions,
            media,
        } = this.props;

        const cardCls = classNames(
            {
                [`${prefix}card`]: true,
                [`${prefix}card-free`]: free,
                [`${prefix}card-show-divider`]: showHeadDivider,
                [`${prefix}card-hide-divider`]: !showHeadDivider,
            },
            className
        );

        const others = pickOthers(Object.keys(Card.propTypes), this.props);

        others.dir = rtl ? 'rtl' : undefined;

        return (
            <div {...others} className={cardCls}>
                {media && <CardMedia>{media}</CardMedia>}
                <BulletHeader
                    title={title}
                    subTitle={subTitle}
                    extra={extra}
                    showTitleBullet={showTitleBullet}
                />
                {free ? (
                    children
                ) : (
                    <CollapseContent contentHeight={contentHeight}>
                        {children}
                    </CollapseContent>
                )}
                {actions && <CardActions>{actions}</CardActions>}
            </div>
        );
    }
}
