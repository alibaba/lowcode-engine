import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';

/**
 * List
 */
class List extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 列表头部
         */
        header: PropTypes.node,
        /**
         * 列表尾部
         */
        footer: PropTypes.node,
        /**
         * 列表尺寸
         */
        size: PropTypes.oneOf(['medium', 'small']),
        /**
         * 是否显示分割线
         */
        divider: PropTypes.bool,
        className: PropTypes.string,
        children: PropTypes.any,
    };

    static defaultProps = {
        rtl: false,
        size: 'medium',
        divider: true,
        prefix: 'next-',
    };

    render() {
        const {
            prefix,
            header,
            footer,
            size,
            divider,
            className,
            children,
            rtl,
            ...others
        } = this.props;

        if (rtl) {
            others.dir = 'rtl';
        }

        const classes = classNames(
            `${prefix}list`,
            {
                [`${prefix}list-small`]: size === 'small',
                [`${prefix}list-divider`]: divider,
            },
            className
        );

        return (
            <div {...others} className={classes}>
                {header ? (
                    <div className={`${prefix}list-header`}>{header}</div>
                ) : null}
                <ul className={`${prefix}list-items`}>{children}</ul>
                {footer ? (
                    <div className={`${prefix}list-footer`}>{footer}</div>
                ) : null}
            </div>
        );
    }
}

export default ConfigProvider.config(polyfill(List));
