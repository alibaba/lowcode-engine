import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.Header
 * @order 2
 */
class CardHeader extends Component {
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
         * 标题区域的用户自定义内容
         */
        extra: PropTypes.node,
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
        className: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        component: 'div',
    };

    render() {
        const {
            prefix,
            title,
            subTitle,
            extra,
            className,
            component: Component,
            ...others
        } = this.props;

        return (
            <Component
                {...others}
                className={classNames(`${prefix}card-header`, className)}
            >
                {extra && (
                    <div className={`${prefix}card-header-extra`}>{extra}</div>
                )}
                <div className={`${prefix}card-header-titles`}>
                    {title && (
                        <div className={`${prefix}card-header-title`}>
                            {title}
                        </div>
                    )}
                    {subTitle && (
                        <div className={`${prefix}card-header-subtitle`}>
                            {subTitle}
                        </div>
                    )}
                </div>
            </Component>
        );
    }
}

export default ConfigProvider.config(CardHeader);
