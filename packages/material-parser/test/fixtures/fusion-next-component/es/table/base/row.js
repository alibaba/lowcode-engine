import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { obj, dom } from '../../util';
import { fetchDataByPath } from '../util';

var noop = function noop() {};

var Row = (_temp2 = _class = function (_React$Component) {
    _inherits(Row, _React$Component);

    function Row() {
        var _temp, _this, _ret;

        _classCallCheck(this, Row);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onClick = function (e) {
            var _this$props = _this.props,
                record = _this$props.record,
                rowIndex = _this$props.rowIndex;

            _this.props.onClick(record, rowIndex, e);
        }, _this.onMouseEnter = function (e) {
            var _this$props2 = _this.props,
                record = _this$props2.record,
                rowIndex = _this$props2.rowIndex,
                __rowIndex = _this$props2.__rowIndex;

            var row = __rowIndex || rowIndex;
            _this.onRowHover(record, row, true, e);
        }, _this.onMouseLeave = function (e) {
            var _this$props3 = _this.props,
                record = _this$props3.record,
                rowIndex = _this$props3.rowIndex,
                __rowIndex = _this$props3.__rowIndex;

            var row = __rowIndex || rowIndex;
            _this.onRowHover(record, row, false, e);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Row.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        if (nextProps.pure) {
            var isEqual = obj.shallowEqual(this.props, nextProps);
            return !isEqual;
        }

        return true;
    };

    Row.prototype.onRowHover = function onRowHover(record, index, isEnter, e) {
        var _props = this.props,
            onMouseEnter = _props.onMouseEnter,
            onMouseLeave = _props.onMouseLeave,
            currentRow = findDOMNode(this);

        if (isEnter) {
            onMouseEnter(record, index, e);
            currentRow && dom.addClass(currentRow, 'hovered');
        } else {
            onMouseLeave(record, index, e);
            currentRow && dom.removeClass(currentRow, 'hovered');
        }
    };

    Row.prototype.renderCells = function renderCells(record, rowIndex) {
        var _this2 = this;

        var _props2 = this.props,
            Cell = _props2.Cell,
            columns = _props2.columns,
            getCellProps = _props2.getCellProps,
            cellRef = _props2.cellRef,
            prefix = _props2.prefix,
            primaryKey = _props2.primaryKey,
            __rowIndex = _props2.__rowIndex,
            pure = _props2.pure,
            locale = _props2.locale,
            rtl = _props2.rtl;

        // use params first, it's for list

        rowIndex = rowIndex !== undefined ? rowIndex : this.props.rowIndex;

        var lockType = this.context.lockType;

        return columns.map(function (child, index) {
            var _classnames;

            /* eslint-disable no-unused-vars, prefer-const */
            var dataIndex = child.dataIndex,
                align = child.align,
                alignHeader = child.alignHeader,
                width = child.width,
                colSpan = child.colSpan,
                style = child.style,
                __colIndex = child.__colIndex,
                others = _objectWithoutProperties(child, ['dataIndex', 'align', 'alignHeader', 'width', 'colSpan', 'style', '__colIndex']);

            var colIndex = '__colIndex' in child ? __colIndex : index;
            // colSpan should show in body td by the way of <Table.Column colSpan={2} />
            // tbody's cell merge should only by the way of <Table cellProps={} />

            var value = fetchDataByPath(record, dataIndex);
            var attrs = getCellProps(rowIndex, colIndex, dataIndex, record) || {};

            if (_this2.context.notRenderCellIndex) {
                var matchCellIndex = _this2.context.notRenderCellIndex.map(function (cellIndex) {
                    return cellIndex.toString();
                }).indexOf([rowIndex, colIndex].toString());
                if (matchCellIndex > -1) {
                    _this2.context.notRenderCellIndex.splice(matchCellIndex, 1);
                    return null;
                }
            }
            if (attrs.colSpan && attrs.colSpan > 1 || attrs.rowSpan && attrs.rowSpan > 1) {
                _this2._getNotRenderCellIndex(colIndex, rowIndex, attrs.colSpan || 1, attrs.rowSpan || 1);
            }

            var cellClass = attrs.className;
            var className = classnames((_classnames = {
                first: lockType !== 'right' && colIndex === 0,
                last: lockType !== 'left' && (colIndex === columns.length - 1 || colIndex + attrs.colSpan === columns.length) }, _classnames[child.className] = child.className, _classnames[cellClass] = cellClass, _classnames));

            return React.createElement(Cell, _extends({
                key: __rowIndex + '-' + colIndex
            }, others, attrs, {
                'data-next-table-col': colIndex,
                'data-next-table-row': rowIndex,
                ref: function ref(cell) {
                    return cellRef(__rowIndex, colIndex, cell);
                },
                prefix: prefix,
                pure: pure,
                primaryKey: primaryKey,
                record: record,
                className: className,
                value: value,
                colIndex: colIndex,
                rowIndex: rowIndex,
                align: align,
                locale: locale,
                rtl: rtl,
                width: width
            }));
        });
    };

    Row.prototype._getNotRenderCellIndex = function _getNotRenderCellIndex(colIndex, rowIndex, colSpan, rowSpan) {
        var maxColIndex = colSpan;
        var maxRowIndex = rowSpan;
        var notRenderCellIndex = [];
        for (var i = 0; i < maxColIndex; i++) {
            for (var j = 0; j < maxRowIndex; j++) {
                notRenderCellIndex.push([rowIndex + j, colIndex + i]);
            }
        }
        [].push.apply(this.context.notRenderCellIndex, notRenderCellIndex);
    };

    Row.prototype.render = function render() {
        var _classnames2;

        /* eslint-disable no-unused-vars*/
        var _props3 = this.props,
            prefix = _props3.prefix,
            className = _props3.className,
            onClick = _props3.onClick,
            onMouseEnter = _props3.onMouseEnter,
            onMouseLeave = _props3.onMouseLeave,
            columns = _props3.columns,
            Cell = _props3.Cell,
            getCellProps = _props3.getCellProps,
            rowIndex = _props3.rowIndex,
            record = _props3.record,
            __rowIndex = _props3.__rowIndex,
            children = _props3.children,
            primaryKey = _props3.primaryKey,
            cellRef = _props3.cellRef,
            colGroup = _props3.colGroup,
            pure = _props3.pure,
            locale = _props3.locale,
            expandedIndexSimulate = _props3.expandedIndexSimulate,
            rtl = _props3.rtl,
            wrapper = _props3.wrapper,
            others = _objectWithoutProperties(_props3, ['prefix', 'className', 'onClick', 'onMouseEnter', 'onMouseLeave', 'columns', 'Cell', 'getCellProps', 'rowIndex', 'record', '__rowIndex', 'children', 'primaryKey', 'cellRef', 'colGroup', 'pure', 'locale', 'expandedIndexSimulate', 'rtl', 'wrapper']);

        var cls = classnames((_classnames2 = {}, _classnames2[prefix + 'table-row'] = true, _classnames2[className] = className, _classnames2));

        var tr = React.createElement(
            'tr',
            _extends({
                className: cls,
                role: 'row'
            }, others, {
                onClick: this.onClick,
                onMouseEnter: this.onMouseEnter,
                onMouseLeave: this.onMouseLeave
            }),
            this.renderCells(record),
            children
        );

        return wrapper(tr);
    };

    return Row;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    primaryKey: PropTypes.string,
    className: PropTypes.string,
    columns: PropTypes.array,
    record: PropTypes.any,
    Cell: PropTypes.func,
    rowIndex: PropTypes.number,
    getCellProps: PropTypes.func,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    children: PropTypes.any,
    cellRef: PropTypes.func,
    colGroup: PropTypes.object,
    locale: PropTypes.object,
    wrapper: PropTypes.func
}, _class.defaultProps = {
    prefix: 'next-',
    primaryKey: 'id',
    columns: [],
    record: {},
    getCellProps: noop,
    onClick: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    cellRef: noop,
    colGroup: {},
    wrapper: function wrapper(row) {
        return row;
    }
}, _class.contextTypes = {
    notRenderCellIndex: PropTypes.array,
    lockType: PropTypes.oneOf(['left', 'right'])
}, _temp2);
Row.displayName = 'Row';
export { Row as default };