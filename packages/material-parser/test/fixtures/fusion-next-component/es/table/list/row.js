import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { log } from '../../util';
import Row from '../base/row';

var GroupListRow = (_temp = _class = function (_Row) {
    _inherits(GroupListRow, _Row);

    function GroupListRow() {
        _classCallCheck(this, GroupListRow);

        return _possibleConstructorReturn(this, _Row.apply(this, arguments));
    }

    GroupListRow.prototype.render = function render() {
        var _classnames;

        /* eslint-disable no-unused-vars*/
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            onClick = _props.onClick,
            onMouseEnter = _props.onMouseEnter,
            onMouseLeave = _props.onMouseLeave,
            columns = _props.columns,
            Cell = _props.Cell,
            rowIndex = _props.rowIndex,
            __rowIndex = _props.__rowIndex,
            record = _props.record,
            children = _props.children,
            primaryKey = _props.primaryKey,
            colGroup = _props.colGroup,
            cellRef = _props.cellRef,
            getCellProps = _props.getCellProps,
            locale = _props.locale,
            wrapper = _props.wrapper,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'onClick', 'onMouseEnter', 'onMouseLeave', 'columns', 'Cell', 'rowIndex', '__rowIndex', 'record', 'children', 'primaryKey', 'colGroup', 'cellRef', 'getCellProps', 'locale', 'wrapper', 'rtl']);

        var cls = classnames((_classnames = {}, _classnames[prefix + 'table-row'] = true, _classnames[className] = className, _classnames));

        // clear notRenderCellIndex, incase of cached data
        this.context.notRenderCellIndex = [];

        return React.createElement(
            'table',
            _extends({
                className: cls,
                role: 'row'
            }, others, {
                onClick: this.onClick,
                onMouseEnter: this.onMouseEnter,
                onMouseLeave: this.onMouseLeave
            }),
            colGroup,
            React.createElement(
                'tbody',
                null,
                this.renderContent('header'),
                this.renderChildren(),
                this.renderContent('footer')
            )
        );
    };

    GroupListRow.prototype.isChildrenSelection = function isChildrenSelection() {
        return this.context.listHeader && this.context.listHeader.hasChildrenSelection;
    };

    GroupListRow.prototype.isFirstLevelDataWhenNoChildren = function isFirstLevelDataWhenNoChildren() {
        return this.context.listHeader && this.context.listHeader.useFirstLevelDataWhenNoChildren;
    };

    GroupListRow.prototype.isSelection = function isSelection() {
        return this.context.listHeader && this.context.listHeader.hasSelection;
    };

    GroupListRow.prototype.renderChildren = function renderChildren() {
        var _this2 = this;

        var _props2 = this.props,
            record = _props2.record,
            primaryKey = _props2.primaryKey;
        var children = record.children;


        var toRenderList = children;
        if (this.isFirstLevelDataWhenNoChildren()) {
            log.warning('useFirstLevelDataWhenNoChildren is deprecated, change your dataSource structure, make sure there is \'children\' in your dataSource.');

            toRenderList = children || [record];
        }

        if (toRenderList) {
            return toRenderList.map(function (child, index) {
                var cells = _this2.renderCells(child, index);
                if (_this2.isChildrenSelection()) {
                    if (!child[primaryKey]) {
                        log.warning('record.children/recored should contains primaryKey when childrenSelection is true.');
                    }
                    return React.createElement(
                        'tr',
                        { key: child[primaryKey] },
                        cells
                    );
                }
                if (_this2.context.rowSelection) {
                    cells.shift();
                    cells[0] = React.cloneElement(cells[0], _extends({
                        colSpan: 2
                    }, cells[0].props));
                }
                return React.createElement(
                    'tr',
                    { key: index },
                    cells
                );
            });
        }
        return null;
    };

    GroupListRow.prototype.renderContent = function renderContent(type) {
        var _props3 = this.props,
            columns = _props3.columns,
            prefix = _props3.prefix,
            record = _props3.record,
            rowIndex = _props3.rowIndex;

        var cameType = type.charAt(0).toUpperCase() + type.substr(1);
        var list = this.context['list' + cameType];
        var listNode = void 0;
        if (list) {
            if (React.isValidElement(list.cell)) {
                listNode = React.cloneElement(list.cell, {
                    record: record,
                    index: rowIndex
                });
            } else if (typeof list.cell === 'function') {
                listNode = list.cell(record, rowIndex);
            }
            if (listNode) {
                var cells = this.renderCells(record);
                if (type === 'header' && this.context.rowSelection && this.isSelection()) {
                    cells = cells.slice(0, 1);
                    cells.push(React.createElement(
                        'td',
                        { colSpan: columns.length - 1, key: 'listNode' },
                        React.createElement(
                            'div',
                            { className: prefix + 'table-cell-wrapper' },
                            listNode
                        )
                    ));
                    listNode = React.createElement(
                        'tr',
                        { className: prefix + 'table-group-' + type },
                        cells
                    );
                } else {
                    listNode = React.createElement(
                        'tr',
                        { className: prefix + 'table-group-' + type },
                        React.createElement(
                            'td',
                            { colSpan: columns.length },
                            React.createElement(
                                'div',
                                { className: prefix + 'table-cell-wrapper' },
                                listNode
                            )
                        )
                    );
                }
            }
        }
        return listNode;
    };

    return GroupListRow;
}(Row), _class.contextTypes = {
    listHeader: PropTypes.any,
    listFooter: PropTypes.any,
    rowSelection: PropTypes.object,
    notRenderCellIndex: PropTypes.array,
    lockType: PropTypes.oneOf(['left', 'right'])
}, _temp);
export { GroupListRow as default };