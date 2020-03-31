import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.Actions
 * @order 5
 */
class CardActions extends Component {
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
            component: Component,
            className,
            ...others
        } = this.props;
        return (
            <Component
                {...others}
                className={classNames(`${prefix}card-actions`, className)}
            />
        );
    }
}

export default ConfigProvider.config(CardActions);
