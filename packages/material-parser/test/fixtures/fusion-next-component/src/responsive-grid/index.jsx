import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import createStyle, { getGridChildProps } from './create-style';
import Cell from './cell';

const { pickOthers } = obj;

const createChildren = (children, device) => {
    const array = React.Children.toArray(children);
    if (!children) {
        return null;
    }

    return array.map(child => {
        if (
            React.isValidElement(child) &&
            typeof child.type === 'function' &&
            ['form_item', 'responsive_grid_cell'].indexOf(
                child.type._typeMark
            ) > -1
        ) {
            return React.cloneElement(child, {
                style: {
                    ...getGridChildProps(child.props, device),
                    ...(child.props.style || {}),
                },
            });
        }

        return child;
    });
};

const getStyle = (style = {}, props) => {
    return {
        ...createStyle({ display: 'grid', ...props }),
        ...style,
    };
};

/**
 * ResponsiveGrid
 */
class ResponsiveGrid extends Component {
    static _typeMark = 'responsive_grid';
    static propTypes = {
        prefix: PropTypes.string,
        className: PropTypes.any,
        /**
         * 设备，用来做自适应，默认为 PC
         * @enumdesc 手机, 平板, PC
         */
        device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
        rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        /**
         * 分为几列， 默认是 12 列
         */
        columns: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        /**
         * 每个 cell 之间的间距， [bottom&top, right&left]
         */
        gap: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.number,
        ]),
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
    };

    static defaultProps = {
        prefix: 'next-',
        component: 'div',
        device: 'desktop',
    };

    render() {
        const {
            prefix,
            component: View,
            style,
            className,
            children,
            device,
            rows,
            columns,
            gap,
            rowSpan,
            colSpan,
            component,
        } = this.props;
        const styleProps = {
            rows,
            columns,
            gap,
            device,
            rowSpan,
            colSpan,
            component,
        };

        const others = pickOthers(
            Object.keys(ResponsiveGrid.propTypes),
            this.props
        );

        const styleSheet = getStyle(style, styleProps);

        const cls = classNames(
            {
                [`${prefix}responsive-grid`]: true,
            },
            className
        );

        return (
            <View style={styleSheet} className={cls} {...others}>
                {createChildren(children, device)}
            </View>
        );
    }
}

ResponsiveGrid.Cell = Cell;

export default ConfigProvider.config(ResponsiveGrid);
