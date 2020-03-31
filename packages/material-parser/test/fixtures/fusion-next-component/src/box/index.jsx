import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import createStyle, {
    getMargin,
    getChildMargin,
    getSpacingHelperMargin,
    filterInnerStyle,
    filterHelperStyle,
    filterOuterStyle,
    getGridChildProps,
    // getBoxChildProps,
} from '../responsive-grid/create-style';

const { pickOthers } = obj;

const createChildren = (children, { spacing, direction, wrap, device }) => {
    const array = React.Children.toArray(children);
    if (!children) {
        return null;
    }

    return array.map((child, index) => {
        let spacingMargin = {};

        spacingMargin = getChildMargin(spacing);

        if (!wrap) {
            // 不折行
            const isNone = [index === 0, index === array.length - 1];
            const props =
                direction === 'row'
                    ? ['marginLeft', 'marginRight']
                    : ['marginTop', 'marginBottom'];

            ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(
                prop => {
                    if (prop in spacingMargin && props.indexOf(prop) === -1) {
                        spacingMargin[prop] = 0;
                    }

                    props.forEach((key, i) => {
                        if (key in spacingMargin && isNone[i]) {
                            spacingMargin[key] = 0;
                        }
                    });
                }
            );
        }

        if (React.isValidElement(child)) {
            const { margin: propsMargin } = child.props;
            const childPropsMargin = getMargin(propsMargin);
            let gridProps = {};

            if (
                typeof child.type === 'function' &&
                child.type._typeMark === 'responsive_grid'
            ) {
                gridProps = createStyle({ display: 'grid', ...child.props });
            }

            return React.cloneElement(child, {
                style: {
                    ...spacingMargin,
                    // ...getBoxChildProps(child.props),
                    ...childPropsMargin,
                    ...gridProps,
                    ...(child.props.style || {}),
                },
            });
        }

        return child;
    });
};

const getStyle = (style = {}, props) => {
    return {
        ...createStyle({ display: 'flex', ...props }),
        ...style,
    };
};

const getOuterStyle = (style, styleProps) => {
    const sheet = getStyle(style, styleProps);

    return filterOuterStyle(sheet);
};

const getHelperStyle = (style, styleProps) => {
    const sheet = getStyle(style, styleProps);

    return filterHelperStyle({
        ...sheet,
        ...getSpacingHelperMargin(styleProps.spacing),
    });
};

const getInnerStyle = (style, styleProps) => {
    const sheet = getStyle(style, styleProps);

    return filterInnerStyle(sheet);
};

/**
 * Box
 */
class Box extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.any,
        /**
         * 布局属性
         */
        flex: PropTypes.oneOfType([
            PropTypes.arrayOf(
                PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            ),
            PropTypes.number,
        ]),
        /**
         * 布局方向，默认为 column ，一个元素占据一整行
         * @default column
         */
        direction: PropTypes.oneOf(['row', 'column']),
        /**
         * 是否折行
         */
        wrap: PropTypes.bool,
        /**
         * 元素之间的间距 [bottom&top, right&left]
         */
        spacing: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.number,
        ]),
        /**
         * 设置 margin [bottom&top, right&left]
         */
        margin: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.number,
        ]),
        /**
         * 设置 padding [bottom&top, right&left]
         */
        padding: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.number,
        ]),
        /**
         * 沿着主轴方向，子元素们的排布关系 （兼容性同 justify-content ）
         */
        justify: PropTypes.oneOf([
            'flex-start',
            'center',
            'flex-end',
            'space-between',
            'space-around',
        ]),
        /**
         * 垂直主轴方向，子元素们的排布关系 （兼容性同 align-items ）
         */
        align: PropTypes.oneOf([
            'flex-start',
            'center',
            'flex-end',
            'baseline',
            'stretch',
        ]),
        device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
    };

    static defaultProps = {
        prefix: 'next-',
        direction: 'column',
        wrap: false,
    };

    render() {
        const {
            prefix,
            direction,
            justify,
            align,
            wrap,
            flex,
            spacing,
            padding,
            margin,
            style,
            className,
            children,
            device,
        } = this.props;

        const styleProps = {
            direction,
            justify,
            align,
            wrap,
            flex,
            spacing,
            padding,
            margin,
        };
        const View = 'Component' in this.props ? Component : 'div';
        const others = pickOthers(Object.keys(Box.propTypes), this.props);
        const styleSheet = getStyle(style, styleProps);

        const boxs = createChildren(children, {
            spacing,
            direction,
            wrap,
            device,
        });

        const cls = cx(
            {
                [`${prefix}box`]: true,
            },
            className
        );
        if (wrap && spacing) {
            const outerStyle = getOuterStyle(style, styleProps);
            const helperStyle = getHelperStyle(style, styleProps);
            const innerStyle = getInnerStyle(style, styleProps);

            return (
                <View style={outerStyle} className={cls} {...others}>
                    <View style={helperStyle}>
                        <View style={innerStyle} className={`${prefix}box`}>
                            {boxs}
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={styleSheet} className={cls} {...others}>
                {boxs}
            </View>
        );
    }
}

export default ConfigProvider.config(Box);
