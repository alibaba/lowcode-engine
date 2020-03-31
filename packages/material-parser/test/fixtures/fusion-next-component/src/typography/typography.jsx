import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from './text';

/**
 * Typography
 * @description 继承 Typography.Text API
 * @order 0
 */
class Typography extends Component {
    static propTypes = {
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
    };

    static defaultProps = {
        component: 'article',
    };

    render() {
        return <Text {...this.props} />;
    }
}

export default Typography;
