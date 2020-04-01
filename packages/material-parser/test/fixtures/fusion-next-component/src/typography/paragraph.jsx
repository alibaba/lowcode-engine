import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Text from './text';

/**
 * Typography.Paragraph
 * @description 继承 Typography.Text 的 API
 * @order 2
 */
class Paragraph extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
    };

    static defaultProps = {
        prefix: 'next-',
        type: 'long',
        size: 'medium',
        component: 'p',
    };

    render() {
        const { prefix, className, component, ...others } = this.props;

        const cls = classNames(`${prefix}typography-paragraph`, className);

        return <Text {...others} className={cls} component={component} />;
    }
}

export default ConfigProvider.config(Paragraph);
