import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import createStyle, { getGridChildProps } from './create-style';
import Cell from './cell';

var pickOthers = obj.pickOthers;


var createChildren = function createChildren(children, device) {
    var array = React.Children.toArray(children);
    if (!children) {
        return null;
    }

    return array.map(function (child) {
        if (React.isValidElement(child) && typeof child.type === 'function' && ['form_item', 'responsive_grid_cell'].indexOf(child.type._typeMark) > -1) {
            return React.cloneElement(child, {
                style: _extends({}, getGridChildProps(child.props, device), child.props.style || {})
            });
        }

        return child;
    });
};

var getStyle = function getStyle() {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var props = arguments[1];

    return _extends({}, createStyle(_extends({ display: 'grid' }, props)), style);
};

/**
 * ResponsiveGrid
 */
var ResponsiveGrid = (_temp = _class = function (_Component) {
    _inherits(ResponsiveGrid, _Component);

    function ResponsiveGrid() {
        _classCallCheck(this, ResponsiveGrid);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ResponsiveGrid.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            View = _props.component,
            style = _props.style,
            className = _props.className,
            children = _props.children,
            device = _props.device,
            rows = _props.rows,
            columns = _props.columns,
            gap = _props.gap,
            rowSpan = _props.rowSpan,
            colSpan = _props.colSpan,
            component = _props.component;

        var styleProps = {
            rows: rows,
            columns: columns,
            gap: gap,
            device: device,
            rowSpan: rowSpan,
            colSpan: colSpan,
            component: component
        };

        var others = pickOthers(Object.keys(ResponsiveGrid.propTypes), this.props);

        var styleSheet = getStyle(style, styleProps);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'responsive-grid'] = true, _classNames), className);

        return React.createElement(
            View,
            _extends({ style: styleSheet, className: cls }, others),
            createChildren(children, device)
        );
    };

    return ResponsiveGrid;
}(Component), _class._typeMark = 'responsive_grid', _class.propTypes = {
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
    gap: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'div',
    device: 'desktop'
}, _temp);
ResponsiveGrid.displayName = 'ResponsiveGrid';


ResponsiveGrid.Cell = Cell;

export default ConfigProvider.config(ResponsiveGrid);