import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfigProvider from '../config-provider';
import { obj } from '../util';

var pickOthers = obj.pickOthers;
/**
 * ResponsiveGrid.Cell
 */

var Cell = (_temp = _class = function (_Component) {
    _inherits(Cell, _Component);

    function Cell() {
        _classCallCheck(this, Cell);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Cell.prototype.render = function render() {
        var _props = this.props,
            View = _props.component,
            children = _props.children;


        var others = pickOthers(Object.keys(Cell.propTypes), this.props);

        return React.createElement(
            View,
            others,
            children
        );
    };

    return Cell;
}(Component), _class._typeMark = 'responsive_grid_cell', _class.propTypes = {
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
    component: PropTypes.elementType
}, _class.defaultProps = {
    component: 'div',
    device: 'desktop'
}, _temp);
Cell.displayName = 'Cell';


export default ConfigProvider.config(Cell);