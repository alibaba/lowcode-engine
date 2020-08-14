import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { obj } from '../../util';

var Cell = (_temp = _class = function (_React$Component) {
    _inherits(Cell, _React$Component);

    function Cell() {
        _classCallCheck(this, Cell);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Cell.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        if (nextProps.pure) {
            var isEqual = obj.shallowEqual(this.props, nextProps);
            return !isEqual;
        }
        return true;
    };

    Cell.prototype.render = function render() {
        var _classnames;

        /* eslint-disable no-unused-vars */
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            cell = _props.cell,
            value = _props.value,
            resizable = _props.resizable,
            colIndex = _props.colIndex,
            rowIndex = _props.rowIndex,
            __colIndex = _props.__colIndex,
            record = _props.record,
            context = _props.context,
            align = _props.align,
            _props$style = _props.style,
            style = _props$style === undefined ? {} : _props$style,
            Tag = _props.component,
            children = _props.children,
            title = _props.title,
            width = _props.width,
            innerStyle = _props.innerStyle,
            primaryKey = _props.primaryKey,
            __normalized = _props.__normalized,
            filterMode = _props.filterMode,
            filterMenuProps = _props.filterMenuProps,
            filterProps = _props.filterProps,
            filters = _props.filters,
            sortable = _props.sortable,
            lock = _props.lock,
            pure = _props.pure,
            locale = _props.locale,
            expandedIndexSimulate = _props.expandedIndexSimulate,
            rtl = _props.rtl,
            isIconLeft = _props.isIconLeft,
            type = _props.type,
            htmlTitle = _props.htmlTitle,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'cell', 'value', 'resizable', 'colIndex', 'rowIndex', '__colIndex', 'record', 'context', 'align', 'style', 'component', 'children', 'title', 'width', 'innerStyle', 'primaryKey', '__normalized', 'filterMode', 'filterMenuProps', 'filterProps', 'filters', 'sortable', 'lock', 'pure', 'locale', 'expandedIndexSimulate', 'rtl', 'isIconLeft', 'type', 'htmlTitle']);

        var tagStyle = _extends({}, style);
        var cellProps = { value: value, index: rowIndex, record: record, context: context };
        var content = cell;
        if (React.isValidElement(content)) {
            content = React.cloneElement(content, cellProps);
        } else if (typeof content === 'function') {
            content = content(value, rowIndex, record, context);
        }
        if (align) {
            tagStyle.textAlign = align;
            if (rtl) {
                tagStyle.textAlign = align === 'left' ? 'right' : align === 'right' ? 'left' : align;
            }
        }
        var cls = classnames((_classnames = {}, _classnames[prefix + 'table-cell'] = true, _classnames[className] = className, _classnames));

        return React.createElement(
            Tag,
            _extends({}, others, { className: cls, style: tagStyle, role: 'gridcell' }),
            React.createElement(
                'div',
                {
                    className: prefix + 'table-cell-wrapper',
                    style: innerStyle,
                    title: htmlTitle,
                    'data-next-table-col': __colIndex,
                    'data-next-table-row': rowIndex
                },
                isIconLeft ? children : content,
                isIconLeft ? content : children
            )
        );
    };

    return Cell;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    primaryKey: PropTypes.string,
    className: PropTypes.string,
    record: PropTypes.any,
    value: PropTypes.any,
    isIconLeft: PropTypes.bool,
    colIndex: PropTypes.number,
    rowIndex: PropTypes.number,
    // 经过锁列调整后的列索引，lock right的列会从非0开始
    __colIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.any,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    context: PropTypes.any,
    cell: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.func]),
    align: PropTypes.oneOf(['left', 'center', 'right']),
    component: PropTypes.oneOf(['td', 'th', 'div']),
    children: PropTypes.any,
    style: PropTypes.object,
    innerStyle: PropTypes.object,
    filterMode: PropTypes.oneOf(['single', 'multiple']),
    filterMenuProps: PropTypes.object,
    filterProps: PropTypes.object,
    filters: PropTypes.array,
    sortable: PropTypes.bool,
    lock: PropTypes.any,
    type: PropTypes.oneOf(['header', 'body']),
    resizable: PropTypes.bool,
    __normalized: PropTypes.bool
}, _class.defaultProps = {
    component: 'td',
    type: 'body',
    isIconLeft: false,
    cell: function cell(value) {
        return value;
    },
    prefix: 'next-'
}, _temp);
Cell.displayName = 'Cell';
export { Cell as default };