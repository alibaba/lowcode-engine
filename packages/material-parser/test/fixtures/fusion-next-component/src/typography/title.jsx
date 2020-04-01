import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from './text';
import ConfigProvider from '../config-provider';

export default Tag => {
    /**
     * Typography.Title
     * @description 分为 H1, H2, H3, H4, H5, H6 不同的组件，表示不同层级，继承 Typography.Text API
     * @order 1
     */
    class Title extends Component {
        static propTypes = {
            prefix: PropTypes.string,
        };

        static defaultProps = {
            prefix: 'next-',
        };

        render() {
            const { prefix, className, ...others } = this.props;
            return (
                <Text
                    {...others}
                    component={Tag}
                    className={`${className || ''} ${prefix}typography-title`}
                />
            );
        }
    }

    Title.displayName = Tag.toUpperCase();
    return ConfigProvider.config(Title);
};
