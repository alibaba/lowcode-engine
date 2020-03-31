import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Breadcrumb.Item
 */
class Item extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 面包屑节点链接，如果设置这个属性，则该节点为`<a />` ，否则是`<span />`
         */
        link: PropTypes.string,
        activated: PropTypes.bool,
        separator: PropTypes.node,
        className: PropTypes.any,
        children: PropTypes.node,
    };

    static defaultProps = {
        prefix: 'next-',
    };

    static _typeMark = 'breadcrumb_item';

    // stateless separator component
    static Separator({ prefix, children }) {
        return (
            <span className={`${prefix}breadcrumb-separator`}>{children}</span>
        );
    }

    render() {
        const {
            prefix,
            rtl,
            className,
            children,
            link,
            activated,
            separator,
            ...others
        } = this.props;
        const clazz = classNames(`${prefix}breadcrumb-text`, className, {
            activated,
        });

        return (
            <li dir={rtl ? 'rtl' : null} className={`${prefix}breadcrumb-item`}>
                {link ? (
                    <a href={link} className={clazz} {...others}>
                        {children}
                    </a>
                ) : (
                    <span className={clazz} {...others}>
                        {children}
                    </span>
                )}
                {activated
                    ? null
                    : Item.Separator({ prefix, children: separator })}
            </li>
        );
    }
}

export default ConfigProvider.config(Item);
