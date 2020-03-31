import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfigProvider from '../config-provider';
import { obj } from '../util';

const { pickOthers } = obj;
/**
 * ResponsiveGrid.Cell
 */
class Cell extends Component {
    static _typeMark = 'responsive_grid_cell';
    static propTypes = {
        device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
        /**
         * 横向，占据几列
         */
        colSpan: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        /**
         * 纵向，占据几行
         */
        rowSpan: PropTypes.number,
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
    };

    static defaultProps = {
        component: 'div',
        device: 'desktop',
    };

    render() {
        const { component: View, children } = this.props;

        const others = pickOthers(Object.keys(Cell.propTypes), this.props);

        return <View {...others}>{children}</View>;
    }
}

export default ConfigProvider.config(Cell);
