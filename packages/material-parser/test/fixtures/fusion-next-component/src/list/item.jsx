import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';

/**
 * List.Item
 */
class ListItem extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 列表元素的标题
         */
        title: PropTypes.node,
        /**
         * 列表元素的描述内容
         */
        description: PropTypes.node,
        /**
         * 列表元素的头像 / 图标 / 图片内容
         */
        media: PropTypes.node,
        /**
         * 额外内容
         */
        extra: PropTypes.node,
        className: PropTypes.any,
    };

    static defaultProps = {
        prefix: 'next-',
    };

    render() {
        const {
            prefix,
            title,
            description,
            media,
            extra,
            className,
            children,
            ...others
        } = this.props;

        const classes = classNames(`${prefix}list-item`, className);

        return (
            <li {...others} className={classes}>
                {media ? (
                    <div className={`${prefix}list-item-media`}>{media}</div>
                ) : null}
                <div className={`${prefix}list-item-content`}>
                    {title ? (
                        <div className={`${prefix}list-item-title`}>
                            {title}
                        </div>
                    ) : null}
                    {description ? (
                        <div className={`${prefix}list-item-description`}>
                            {description}
                        </div>
                    ) : null}
                    {children}
                </div>
                {extra ? (
                    <div className={`${prefix}list-item-extra`}>{extra}</div>
                ) : null}
            </li>
        );
    }
}

export default ConfigProvider.config(polyfill(ListItem));
