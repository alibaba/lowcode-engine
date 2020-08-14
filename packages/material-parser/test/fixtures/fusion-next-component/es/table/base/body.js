import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RowComponent from './row';
import CellComponent from './cell';

var noop = function noop() {};

var Body = (_temp2 = _class = function (_React$Component) {
    _inherits(Body, _React$Component);

    function Body() {
        var _temp, _this, _ret;

        _classCallCheck(this, Body);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.getRowRef = function (i, row) {
            _this.props.rowRef(i, row);
        }, _this.onRowClick = function (record, index, e) {
            _this.props.onRowClick(record, index, e);
        }, _this.onRowMouseEnter = function (record, index, e) {
            _this.props.onRowMouseEnter(record, index, e);
        }, _this.onRowMouseLeave = function (record, index, e) {
            _this.props.onRowMouseLeave(record, index, e);
        }, _this.onBodyMouseOver = function (e) {
            _this.props.onBodyMouseOver(e);
        }, _this.onBodyMouseOut = function (e) {
            _this.props.onBodyMouseOut(e);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Body.prototype.render = function render() {
        var _this2 = this;

        /*eslint-disable no-unused-vars */
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            children = _props.children,
            Tag = _props.component,
            colGroup = _props.colGroup,
            loading = _props.loading,
            emptyContent = _props.emptyContent,
            components = _props.components,
            getCellProps = _props.getCellProps,
            primaryKey = _props.primaryKey,
            getRowProps = _props.getRowProps,
            dataSource = _props.dataSource,
            cellRef = _props.cellRef,
            columns = _props.columns,
            rowRef = _props.rowRef,
            onRowClick = _props.onRowClick,
            onRowMouseEnter = _props.onRowMouseEnter,
            onRowMouseLeave = _props.onRowMouseLeave,
            onBodyMouseOver = _props.onBodyMouseOver,
            onBodyMouseOut = _props.onBodyMouseOut,
            locale = _props.locale,
            pure = _props.pure,
            expandedIndexSimulate = _props.expandedIndexSimulate,
            rtl = _props.rtl,
            crossline = _props.crossline,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'children', 'component', 'colGroup', 'loading', 'emptyContent', 'components', 'getCellProps', 'primaryKey', 'getRowProps', 'dataSource', 'cellRef', 'columns', 'rowRef', 'onRowClick', 'onRowMouseEnter', 'onRowMouseLeave', 'onBodyMouseOver', 'onBodyMouseOut', 'locale', 'pure', 'expandedIndexSimulate', 'rtl', 'crossline']);

        var _components$Row = components.Row,
            Row = _components$Row === undefined ? RowComponent : _components$Row,
            _components$Cell = components.Cell,
            Cell = _components$Cell === undefined ? CellComponent : _components$Cell;

        var empty = loading ? React.createElement(
            'span',
            null,
            '\xA0'
        ) : emptyContent || locale.empty;
        var rows = React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                { colSpan: columns.length },
                React.createElement(
                    'div',
                    { className: prefix + 'table-empty' },
                    empty
                )
            )
        );
        if (Tag === 'div') {
            rows = React.createElement(
                'table',
                { role: 'table' },
                React.createElement(
                    'tbody',
                    null,
                    rows
                )
            );
        }
        if (dataSource.length) {
            rows = dataSource.map(function (record, index) {
                var _classnames;

                var rowProps = {};
                // record may be a string
                var rowIndex = (typeof record === 'undefined' ? 'undefined' : _typeof(record)) === 'object' && '__rowIndex' in record ? record.__rowIndex : index;

                if (expandedIndexSimulate) {
                    rowProps = record.__expanded ? {} : getRowProps(record, index / 2);
                } else {
                    rowProps = getRowProps(record, rowIndex);
                }

                rowProps = rowProps || {};

                var rowClass = rowProps.className;
                var className = classnames((_classnames = {
                    first: index === 0,
                    last: index === dataSource.length - 1
                }, _classnames[rowClass] = rowClass, _classnames));
                var expanded = record.__expanded ? 'expanded' : '';
                return React.createElement(Row, _extends({
                    key: '' + (record[primaryKey] || (record[primaryKey] === 0 ? 0 : rowIndex)) + expanded
                }, rowProps, {
                    ref: _this2.getRowRef.bind(_this2, rowIndex),
                    colGroup: colGroup,
                    rtl: rtl,
                    columns: columns,
                    primaryKey: primaryKey,
                    record: record,
                    rowIndex: rowIndex,
                    __rowIndex: rowIndex,
                    prefix: prefix,
                    pure: pure,
                    cellRef: cellRef,
                    getCellProps: getCellProps,
                    className: className,
                    Cell: Cell,
                    onClick: _this2.onRowClick,
                    locale: locale,
                    onMouseEnter: _this2.onRowMouseEnter,
                    onMouseLeave: _this2.onRowMouseLeave
                }));
            });
        }
        var event = crossline ? {
            onMouseOver: this.onBodyMouseOver,
            onMouseOut: this.onBodyMouseOut
        } : {};
        return React.createElement(
            Tag,
            _extends({ className: className }, others, event),
            rows,
            children
        );
    };

    return Body;
}(React.Component), _class.propTypes = {
    loading: PropTypes.bool,
    emptyContent: PropTypes.any,
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    components: PropTypes.object,
    getCellProps: PropTypes.func,
    cellRef: PropTypes.func,
    primaryKey: PropTypes.string,
    getRowProps: PropTypes.func,
    rowRef: PropTypes.func,
    dataSource: PropTypes.array,
    children: PropTypes.any,
    className: PropTypes.string,
    component: PropTypes.string,
    colGroup: PropTypes.object,
    columns: PropTypes.array,
    onRowClick: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    onBodyMouseOver: PropTypes.func,
    onBodyMouseOut: PropTypes.func,
    locale: PropTypes.object,
    crossline: PropTypes.bool
}, _class.defaultProps = {
    loading: false,
    prefix: 'next-',
    components: {},
    getCellProps: noop,
    cellRef: noop,
    primaryKey: 'id',
    getRowProps: noop,
    rowRef: noop,
    dataSource: [],
    component: 'tbody',
    columns: []
}, _temp2);
Body.displayName = 'Body';
export { Body as default };