import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import createStyle, { getMargin, getChildMargin, getSpacingHelperMargin, filterInnerStyle, filterHelperStyle, filterOuterStyle, getGridChildProps } from
// getBoxChildProps,
'../responsive-grid/create-style';

var pickOthers = obj.pickOthers;


var createChildren = function createChildren(children, _ref) {
    var spacing = _ref.spacing,
        direction = _ref.direction,
        wrap = _ref.wrap,
        device = _ref.device;

    var array = React.Children.toArray(children);
    if (!children) {
        return null;
    }

    return array.map(function (child, index) {
        var spacingMargin = {};

        spacingMargin = getChildMargin(spacing);

        if (!wrap) {
            // 不折行
            var isNone = [index === 0, index === array.length - 1];
            var props = direction === 'row' ? ['marginLeft', 'marginRight'] : ['marginTop', 'marginBottom'];

            ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(function (prop) {
                if (prop in spacingMargin && props.indexOf(prop) === -1) {
                    spacingMargin[prop] = 0;
                }

                props.forEach(function (key, i) {
                    if (key in spacingMargin && isNone[i]) {
                        spacingMargin[key] = 0;
                    }
                });
            });
        }

        if (React.isValidElement(child)) {
            var propsMargin = child.props.margin;

            var childPropsMargin = getMargin(propsMargin);
            var gridProps = {};

            if (typeof child.type === 'function' && child.type._typeMark === 'responsive_grid') {
                gridProps = createStyle(_extends({ display: 'grid' }, child.props));
            }

            return React.cloneElement(child, {
                style: _extends({}, spacingMargin, childPropsMargin, gridProps, child.props.style || {})
            });
        }

        return child;
    });
};

var getStyle = function getStyle() {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var props = arguments[1];

    return _extends({}, createStyle(_extends({ display: 'flex' }, props)), style);
};

var getOuterStyle = function getOuterStyle(style, styleProps) {
    var sheet = getStyle(style, styleProps);

    return filterOuterStyle(sheet);
};

var getHelperStyle = function getHelperStyle(style, styleProps) {
    var sheet = getStyle(style, styleProps);

    return filterHelperStyle(_extends({}, sheet, getSpacingHelperMargin(styleProps.spacing)));
};

var getInnerStyle = function getInnerStyle(style, styleProps) {
    var sheet = getStyle(style, styleProps);

    return filterInnerStyle(sheet);
};

/**
 * Box
 */
var Box = (_temp = _class = function (_Component) {
    _inherits(Box, _Component);

    function Box() {
        _classCallCheck(this, Box);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Box.prototype.render = function render() {
        var _cx;

        var _props = this.props,
            prefix = _props.prefix,
            direction = _props.direction,
            justify = _props.justify,
            align = _props.align,
            wrap = _props.wrap,
            flex = _props.flex,
            spacing = _props.spacing,
            padding = _props.padding,
            margin = _props.margin,
            style = _props.style,
            className = _props.className,
            children = _props.children,
            device = _props.device;


        var styleProps = {
            direction: direction,
            justify: justify,
            align: align,
            wrap: wrap,
            flex: flex,
            spacing: spacing,
            padding: padding,
            margin: margin
        };
        var View = 'Component' in this.props ? Component : 'div';
        var others = pickOthers(Object.keys(Box.propTypes), this.props);
        var styleSheet = getStyle(style, styleProps);

        var boxs = createChildren(children, {
            spacing: spacing,
            direction: direction,
            wrap: wrap,
            device: device
        });

        var cls = cx((_cx = {}, _cx[prefix + 'box'] = true, _cx), className);
        if (wrap && spacing) {
            var outerStyle = getOuterStyle(style, styleProps);
            var helperStyle = getHelperStyle(style, styleProps);
            var innerStyle = getInnerStyle(style, styleProps);

            return React.createElement(
                View,
                _extends({ style: outerStyle, className: cls }, others),
                React.createElement(
                    View,
                    { style: helperStyle },
                    React.createElement(
                        View,
                        { style: innerStyle, className: prefix + 'box' },
                        boxs
                    )
                )
            );
        }

        return React.createElement(
            View,
            _extends({ style: styleSheet, className: cls }, others),
            boxs
        );
    };

    return Box;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.any,
    /**
     * 布局属性
     */
    flex: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), PropTypes.number]),
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
    spacing: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    /**
     * 设置 margin [bottom&top, right&left]
     */
    margin: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    /**
     * 设置 padding [bottom&top, right&left]
     */
    padding: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    /**
     * 沿着主轴方向，子元素们的排布关系 （兼容性同 justify-content ）
     */
    justify: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between', 'space-around']),
    /**
     * 垂直主轴方向，子元素们的排布关系 （兼容性同 align-items ）
     */
    align: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'baseline', 'stretch']),
    device: PropTypes.oneOf(['phone', 'tablet', 'desktop'])
}, _class.defaultProps = {
    prefix: 'next-',
    direction: 'column',
    wrap: false
}, _temp);
Box.displayName = 'Box';


export default ConfigProvider.config(Box);