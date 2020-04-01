import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.Divider
 * @order 4
 */
class CardDivider extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
        /**
         * 分割线是否向内缩进
         */
        inset: PropTypes.bool,
        className: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        component: 'hr',
    };

    render() {
        const {
            prefix,
            component: Component,
            inset,
            className,
            ...others
        } = this.props;

        const dividerClassName = classNames(
            `${prefix}card-divider`,
            {
                [`${prefix}card-divider--inset`]: inset,
            },
            className
        );

        return <Component {...others} className={dividerClassName} />;
    }
}

export default ConfigProvider.config(CardDivider);
