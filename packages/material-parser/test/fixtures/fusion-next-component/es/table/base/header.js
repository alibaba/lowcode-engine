import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FilterComponent from './filter';
import SortComponent from './sort';
import CellComponent from './cell';
import ResizeComponent from './resize';

var noop = function noop() {};
var Header = (_temp2 = _class = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header() {
        var _temp, _this, _ret;

        _classCallCheck(this, Header);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.getCellRef = function (i, j, cell) {
            _this.props.headerCellRef(i, j, cell);
        }, _this.onSort = function (dataIndex, order, sort) {
            _this.props.onSort(dataIndex, order, sort);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Header.prototype.render = function render() {
        var _this2 = this;

        /*eslint-disable no-unused-vars */
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            children = _props.children,
            Tag = _props.component,
            colGroup = _props.colGroup,
            columns = _props.columns,
            locale = _props.locale,
            filterParams = _props.filterParams,
            onFilter = _props.onFilter,
            components = _props.components,
            affixRef = _props.affixRef,
            headerCellRef = _props.headerCellRef,
            onSort = _props.onSort,
            sort = _props.sort,
            sortIcons = _props.sortIcons,
            onResizeChange = _props.onResizeChange,
            pure = _props.pure,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'children', 'component', 'colGroup', 'columns', 'locale', 'filterParams', 'onFilter', 'components', 'affixRef', 'headerCellRef', 'onSort', 'sort', 'sortIcons', 'onResizeChange', 'pure', 'rtl']);

        var _components$Cell = components.Cell,
            Cell = _components$Cell === undefined ? CellComponent : _components$Cell,
            _components$Filter = components.Filter,
            Filter = _components$Filter === undefined ? FilterComponent : _components$Filter,
            _components$Sort = components.Sort,
            Sort = _components$Sort === undefined ? SortComponent : _components$Sort,
            _components$Resize = components.Resize,
            Resize = _components$Resize === undefined ? ResizeComponent : _components$Resize;

        var rowSpan = columns.length;

        var header = columns.map(function (cols, index) {
            var col = cols.map(function (col, j) {
                var _classnames;

                /* eslint-disable no-unused-vars, prefer-const */
                var title = col.title,
                    colSpan = col.colSpan,
                    sortable = col.sortable,
                    resizable = col.resizable,
                    dataIndex = col.dataIndex,
                    filters = col.filters,
                    filterMode = col.filterMode,
                    filterMenuProps = col.filterMenuProps,
                    filterProps = col.filterProps,
                    width = col.width,
                    align = col.align,
                    alignHeader = col.alignHeader,
                    className = col.className,
                    __normalized = col.__normalized,
                    lock = col.lock,
                    others = _objectWithoutProperties(col, ['title', 'colSpan', 'sortable', 'resizable', 'dataIndex', 'filters', 'filterMode', 'filterMenuProps', 'filterProps', 'width', 'align', 'alignHeader', 'className', '__normalized', 'lock']);

                className = classnames((_classnames = {}, _classnames[prefix + 'table-header-node'] = true, _classnames[prefix + 'table-header-resizable'] = resizable, _classnames[className] = className, _classnames));
                var attrs = {},
                    sortElement = void 0,
                    filterElement = void 0,
                    resizeElement = void 0;

                attrs.colSpan = colSpan;

                // column.group doesn't have sort resize filter
                if (!(col.children && col.children.length)) {
                    if (sortable) {
                        sortElement = React.createElement(Sort, {
                            prefix: prefix,
                            className: prefix + 'table-header-icon',
                            dataIndex: dataIndex,
                            onSort: _this2.onSort,
                            sortIcons: sortIcons,
                            sort: sort,
                            rtl: rtl,
                            locale: locale
                        });
                    }
                    if (resizable) {
                        resizeElement = React.createElement(Resize, {
                            prefix: prefix,
                            rtl: rtl,
                            dataIndex: dataIndex,
                            onChange: onResizeChange
                        });
                    }

                    if (filters) {
                        filterElement = filters.length ? React.createElement(Filter, {
                            dataIndex: dataIndex,
                            className: prefix + 'table-header-icon',
                            filters: filters,
                            prefix: prefix,
                            locale: locale,
                            rtl: rtl,
                            filterParams: filterParams,
                            filterMode: filterMode,
                            filterMenuProps: filterMenuProps,
                            filterProps: filterProps,
                            onFilter: onFilter
                        }) : null;
                    }
                    attrs.rowSpan = rowSpan - index;
                }

                if (+attrs.colSpan === 0) {
                    return null;
                }

                return React.createElement(
                    Cell,
                    _extends({}, others, attrs, {
                        key: j,
                        prefix: prefix,
                        pure: pure,
                        rtl: rtl,
                        cell: title,
                        component: 'th',
                        align: alignHeader ? alignHeader : align,
                        className: className,
                        ref: _this2.getCellRef.bind(_this2, index, j),
                        type: 'header'
                    }),
                    sortElement,
                    filterElement,
                    resizeElement
                );
            });
            return React.createElement(
                'tr',
                { key: index },
                col
            );
        });

        return React.createElement(
            Tag,
            _extends({ className: className }, others),
            header,
            children
        );
    };

    return Header;
}(React.Component), _class.propTypes = {
    children: PropTypes.any,
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    className: PropTypes.string,
    component: PropTypes.string,
    columns: PropTypes.array,
    colGroup: PropTypes.object,
    headerCellRef: PropTypes.func,
    locale: PropTypes.object,
    filterParams: PropTypes.object,
    onFilter: PropTypes.func,
    components: PropTypes.object,
    sort: PropTypes.object,
    sortIcons: PropTypes.object,
    onSort: PropTypes.func,
    onResizeChange: PropTypes.func
}, _class.defaultProps = {
    component: 'thead',
    columns: [],
    headerCellRef: noop,
    onFilter: noop,
    components: {},
    onSort: noop,
    onResizeChange: noop
}, _temp2);
Header.displayName = 'Header';
export { Header as default };