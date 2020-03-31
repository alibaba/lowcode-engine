import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.BulletHeader
 * @order 2
 */
class CardBulletHeader extends Component {
    static propTypes = {
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
        extra: PropTypes.node,
    };

    static defaultProps = {
        prefix: 'next-',
        showTitleBullet: true,
    };

    render() {
        const { prefix, title, subTitle, extra, showTitleBullet } = this.props;

        if (!title) return null;

        const headCls = classNames({
            [`${prefix}card-head`]: true,
            [`${prefix}card-head-show-bullet`]: showTitleBullet,
        });

        const headExtra = extra ? (
            <div className={`${prefix}card-extra`}>{extra}</div>
        ) : null;

        return (
            <div className={headCls}>
                <div className={`${prefix}card-head-main`}>
                    <div className={`${prefix}card-title`}>
                        {title}
                        {subTitle ? (
                            <span className={`${prefix}card-subtitle`}>
                                {subTitle}
                            </span>
                        ) : null}
                    </div>
                    {headExtra}
                </div>
            </div>
        );
    }
}

export default ConfigProvider.config(CardBulletHeader, {
    componentName: 'Card',
});
