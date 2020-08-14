import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import { log } from '../../util';
import Row from '../lock/row';

var ExpandedRow = (_temp = _class = function (_React$Component) {
    _inherits(ExpandedRow, _React$Component);

    function ExpandedRow() {
        _classCallCheck(this, ExpandedRow);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    ExpandedRow.prototype.renderExpandedRow = function renderExpandedRow(record, rowIndex) {
        var _context = this.context,
            expandedRowRender = _context.expandedRowRender,
            expandedRowIndent = _context.expandedRowIndent,
            openRowKeys = _context.openRowKeys,
            lockType = _context.lockType,
            expandedIndexSimulate = _context.expandedIndexSimulate;

        var expandedIndex = expandedIndexSimulate ? (rowIndex - 1) / 2 : rowIndex;

        var _props = this.props,
            columns = _props.columns,
            cellRef = _props.cellRef;

        var colSpan = columns.length;
        var expandedCols = columns[0] && columns[0].__colIndex || 0;

        if (expandedRowRender) {
            var _props2 = this.props,
                primaryKey = _props2.primaryKey,
                prefix = _props2.prefix,
                leftIndent = expandedRowIndent[0],
                rightIndent = expandedRowIndent[1],
                totalIndent = leftIndent + rightIndent,
                renderCols = function renderCols(number) {
                var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                var ret = [];

                var _loop = function _loop(i) {
                    ret.push(React.createElement(
                        'td',
                        {
                            key: i,
                            ref: function ref(cell) {
                                return cellRef(rowIndex, i + start, cell);
                            }
                        },
                        '\xA0'
                    ));
                };

                for (var i = 0; i < number; i++) {
                    _loop(i);
                }
                return ret;
            };

            var content = void 0;

            if (totalIndent > colSpan && !lockType) {
                log.warning("It's not allowed expandedRowIndent is more than the number of columns.");
            }
            if (leftIndent < columns.length && lockType === 'left') {
                log.warning('expandedRowIndent left is less than the number of left lock columns.');
            }
            if (rightIndent < columns.length && lockType === 'right') {
                log.warning('expandedRowIndent right is less than the number of right lock columns.');
            }
            if (lockType) {
                return openRowKeys.indexOf(record[primaryKey]) > -1 ? React.createElement(
                    'tr',
                    {
                        className: prefix + 'table-expanded-row',
                        key: 'expanded-' + expandedIndex
                    },
                    React.createElement(
                        'td',
                        {
                            colSpan: colSpan,
                            ref: function ref(cell) {
                                return cellRef(rowIndex, expandedCols, cell);
                            }
                        },
                        '\xA0'
                    )
                ) : null;
            }
            // 暴露给用户的index
            content = expandedRowRender(record, expandedIndex);
            if (!React.isValidElement(content)) {
                content = React.createElement(
                    'div',
                    { className: prefix + 'table-cell-wrapper' },
                    content
                );
            }

            var rightStart = columns.length;
            columns.forEach(function (col) {
                col.lock === 'right' && rightStart--;
            });
            return openRowKeys.indexOf(record[primaryKey]) > -1 ? React.createElement(
                'tr',
                {
                    className: prefix + 'table-expanded-row',
                    key: 'expanded-' + (record[primaryKey] || expandedIndex)
                },
                renderCols(leftIndent),
                React.createElement(
                    'td',
                    { colSpan: colSpan - totalIndent },
                    content
                ),
                renderCols(rightIndent, rightStart)
            ) : null;
        } else {
            return null;
        }
    };

    ExpandedRow.prototype.render = function render() {
        /* eslint-disable no-unused-vars*/
        var _props3 = this.props,
            record = _props3.record,
            rowIndex = _props3.rowIndex,
            columns = _props3.columns,
            others = _objectWithoutProperties(_props3, ['record', 'rowIndex', 'columns']);

        var expandedIndexSimulate = this.context.expandedIndexSimulate;


        if (record.__expanded) {
            return this.renderExpandedRow(record, rowIndex, columns);
        }

        var newRowIndex = expandedIndexSimulate ? rowIndex / 2 : rowIndex;
        return React.createElement(Row, _extends({}, others, {
            record: record,
            columns: columns,
            __rowIndex: rowIndex,
            rowIndex: newRowIndex
        }));
    };

    return ExpandedRow;
}(React.Component), _class.propTypes = _extends({}, Row.propTypes), _class.defaultProps = _extends({}, Row.defaultProps), _class.contextTypes = {
    openRowKeys: PropTypes.array,
    expandedRowRender: PropTypes.func,
    expandedRowIndent: PropTypes.array,
    expandedIndexSimulate: PropTypes.bool,
    lockType: PropTypes.oneOf(['left', 'right'])
}, _temp);
ExpandedRow.displayName = 'ExpandedRow';
export { ExpandedRow as default };