import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.Content
 * @order 3
 */
class CardContent extends Component {
    static propTypes = {
        prefix: PropTypes.string,
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
            className,
            component: Component,
            ...others
        } = this.props;
        return (
            <Component
                {...others}
                className={classNames(
                    `${prefix}card-content-container`,
                    className
                )}
            />
        );
    }
}

export default ConfigProvider.config(CardContent);
