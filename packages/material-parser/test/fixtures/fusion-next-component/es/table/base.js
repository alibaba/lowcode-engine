import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import shallowElementEquals from 'shallow-element-equals';
import Loading from '../loading';
import ConfigProvider from '../config-provider';
import zhCN from '../locale/zh-cn';
import { log, obj, dom } from '../util';
import BodyComponent from './base/body';
import HeaderComponent from './base/header';
import WrapperComponent from './base/wrapper';
import RowComponent from './base/row';
import CellComponent from './base/cell';
import FilterComponent from './base/filter';
import SortComponent from './base/sort';
import Column from './column';
import ColumnGroup from './column-group';

var Children = React.Children,
    noop = function noop() {};

//<Table>
//    <Table.Column/>
//    <Table.ColumnGroup>
//      <Table.Column/>
//      <Table.Column/>
//    </Table.ColumnGroup>
//</Table>

/** Table */
var Table = (_temp = _class = function (_React$Component) {
    _inherits(Table, _React$Component);

    function Table(props, context) {
        _classCallCheck(this, Table);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

        _this.state = {
            sort: _this.props.sort || {}
        };

        _this.onSort = function (dataIndex, order, sort) {
            if (typeof _this.props.sort === 'undefined') {
                _this.setState({
                    sort: sort
                }, function () {
                    _this.props.onSort(dataIndex, order, sort);
                });
            } else {
                _this.props.onSort(dataIndex, order, sort);
            }
        };

        _this.onFilter = function (filterParams) {
            _this.props.onFilter(filterParams);
        };

        _this.onResizeChange = function (dataIndex, value) {
            _this.props.onResizeChange(dataIndex, value);
        };

        _this.getWrapperRef = function (wrapper) {
            if (!wrapper) {
                return _this.wrapper;
            }
            _this.wrapper = wrapper;
        };

        _this.getAffixRef = function (affixRef) {
            if (!affixRef) {
                return _this.affixRef;
            }
            _this.affixRef = affixRef;
        };

        _this.getHeaderCellRef = function (i, j, cell) {
            var cellRef = 'header_cell_' + i + '_' + j;
            if (!cell) {
                return _this[cellRef];
            }
            _this[cellRef] = cell;
        };

        _this.getRowRef = function (i, row) {
            var rowRef = 'row_' + i;
            if (!row) {
                return _this[rowRef];
            }
            _this[rowRef] = row;
        };

        _this.getCellRef = function (i, j, cell) {
            var cellRef = 'cell_' + i + '_' + j;
            if (!cell) {
                return _this[cellRef];
            }
            _this[cellRef] = cell;
        };

        _this.handleColHoverClass = function (rowIndex, colIndex, isAdd) {
            var crossline = _this.props.crossline;

            var funcName = isAdd ? 'addClass' : 'removeClass';
            if (crossline) {
                _this.props.entireDataSource.forEach(function (val, index) {
                    try {
                        // in case of finding an unmounted component due to cached data
                        // need to clear refs of this.tableInc when dataSource Changed
                        // in virtual table
                        var currentCol = findDOMNode(_this.getCellRef(index, colIndex));
                        currentCol && dom[funcName](currentCol, 'hovered');
                    } catch (error) {
                        return null;
                    }
                });
            }
        };

        _this.findEventTarget = function (e) {
            var prefix = _this.props.prefix;

            var target = dom.getClosest(e.target, 'td.' + prefix + 'table-cell');
            var colIndex = target && target.getAttribute('data-next-table-col');
            var rowIndex = target && target.getAttribute('data-next-table-row');

            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of this.tableInc when dataSource Changed
                // in virtual table
                var currentCol = findDOMNode(_this.getCellRef(rowIndex, colIndex));
                if (currentCol === target) {
                    return {
                        colIndex: colIndex,
                        rowIndex: rowIndex
                    };
                }
            } catch (error) {
                return {};
            }

            return {};
        };

        _this.onBodyMouseOver = function (e) {
            var crossline = _this.props.crossline;

            if (!crossline) {
                return;
            }

            var _this$findEventTarget = _this.findEventTarget(e),
                colIndex = _this$findEventTarget.colIndex,
                rowIndex = _this$findEventTarget.rowIndex;
            // colIndex, rowIndex are string


            if (!colIndex || !rowIndex) {
                return;
            }
            _this.handleColHoverClass(rowIndex, colIndex, true);
            _this.colIndex = colIndex;
            _this.rowIndex = rowIndex;
        };

        _this.onBodyMouseOut = function (e) {
            var crossline = _this.props.crossline;

            if (!crossline) {
                return;
            }

            var _this$findEventTarget2 = _this.findEventTarget(e),
                colIndex = _this$findEventTarget2.colIndex,
                rowIndex = _this$findEventTarget2.rowIndex;
            // colIndex, rowIndex are string


            if (!colIndex || !rowIndex) {
                return;
            }
            _this.handleColHoverClass(_this.rowIndex, _this.colIndex, false);
            _this.colIndex = -1;
            _this.rowIndex = -1;
        };

        _this.addColIndex = function (children) {
            var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            children.forEach(function (child, i) {
                child.__colIndex = start + i;
            });
        };

        var _this$context = _this.context,
            getTableInstance = _this$context.getTableInstance,
            getTableInstanceForVirtual = _this$context.getTableInstanceForVirtual;

        getTableInstance && getTableInstance(props.lockType, _this);
        getTableInstanceForVirtual && getTableInstanceForVirtual(props.lockType, _this);
        _this.notRenderCellIndex = [];
        return _this;
    }

    Table.prototype.getChildContext = function getChildContext() {
        return {
            notRenderCellIndex: this.notRenderCellIndex,
            lockType: this.props.lockType
        };
    };

    Table.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (typeof this.props.sort !== 'undefined') {
            this.setState({
                sort: nextProps.sort
            });
        }
    };

    Table.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.pure) {
            var isEqual = shallowElementEquals(nextProps, this.props) && obj.shallowEqual(nextState, this.state) && obj.shallowEqual(nextContext, this.context);
            return !isEqual;
        }

        return true;
    };

    Table.prototype.componentWillUpdate = function componentWillUpdate() {
        this.notRenderCellIndex = [];
    };

    Table.prototype.normalizeChildrenState = function normalizeChildrenState(props) {
        var columns = props.columns;
        if (props.children) {
            columns = this.normalizeChildren(props);
        }
        return this.fetchInfoFromBinaryChildren(columns);
    };

    // 将React结构化数据提取props转换成数组


    Table.prototype.normalizeChildren = function normalizeChildren(props) {
        var columns = props.columns;

        var getChildren = function getChildren(children) {
            var ret = [];
            Children.forEach(children, function (child) {
                if (child) {
                    var _props = _extends({}, child.props);

                    if (!(child && typeof child.type === 'function' && (child.type._typeMark === 'column' || child.type._typeMark === 'columnGroup'))) {
                        log.warning('Use <Table.Column/>, <Table.ColumnGroup/> as child.');
                    }
                    ret.push(_props);
                    if (child.props.children) {
                        _props.children = getChildren(child.props.children);
                    }
                }
            });
            return ret;
        };
        if (props.children) {
            columns = getChildren(props.children);
        }
        return columns;
    };

    Table.prototype.fetchInfoFromBinaryChildren = function fetchInfoFromBinaryChildren(children) {
        var hasGroupHeader = false;
        var flatChildren = [],
            groupChildren = [],
            getChildren = function getChildren(propsChildren, level) {
            groupChildren[level] = groupChildren[level] || [];
            propsChildren.forEach(function (child) {
                if (child.children) {
                    hasGroupHeader = true;
                    getChildren(child.children, level + 1);
                } else {
                    flatChildren.push(child);
                }
                groupChildren[level].push(child);
            });
        },
            getColSpan = function getColSpan(children, colSpan) {
            colSpan = colSpan || 0;
            children.forEach(function (child) {
                if (child.children) {
                    colSpan = getColSpan(child.children, colSpan);
                } else {
                    colSpan += 1;
                }
            });
            return colSpan;
        };

        getChildren(children, 0);

        groupChildren.forEach(function (groupChild, i) {
            groupChild.forEach(function (child, j) {
                var colSpan = void 0;
                var children = child.children;

                if (children) {
                    colSpan = getColSpan(children);
                    child.colSpan = colSpan;
                    groupChildren[i][j] = child;
                }
            });
        });

        var _props2 = this.props,
            lockType = _props2.lockType,
            lengths = _props2.lengths;

        var start = lockType === 'right' ? lengths.origin - lengths.right : 0;
        this.addColIndex(flatChildren, start);

        return {
            flatChildren: flatChildren,
            groupChildren: groupChildren,
            hasGroupHeader: hasGroupHeader
        };
    };

    Table.prototype.renderColGroup = function renderColGroup(flatChildren) {
        var cols = flatChildren.map(function (col, index) {
            var width = col.width;
            var style = {};
            if (width) {
                style = {
                    width: width
                };
            }

            return React.createElement('col', { style: style, key: index });
        });
        return React.createElement(
            'colgroup',
            { key: 'table-colgroup' },
            cols
        );
    };

    // 通过头部和扁平的结构渲染表格
    Table.prototype.renderTable = function renderTable(groupChildren, flatChildren) {
        if (flatChildren.length || !flatChildren.length && !this.props.lockType) {
            var _props3 = this.props,
                hasHeader = _props3.hasHeader,
                components = _props3.components,
                prefix = _props3.prefix,
                wrapperContent = _props3.wrapperContent,
                filterParams = _props3.filterParams,
                locale = _props3.locale,
                dataSource = _props3.dataSource,
                emptyContent = _props3.emptyContent,
                loading = _props3.loading,
                primaryKey = _props3.primaryKey,
                cellProps = _props3.cellProps,
                rowProps = _props3.rowProps,
                onRowClick = _props3.onRowClick,
                onRowMouseEnter = _props3.onRowMouseEnter,
                onRowMouseLeave = _props3.onRowMouseLeave,
                expandedIndexSimulate = _props3.expandedIndexSimulate,
                pure = _props3.pure,
                rtl = _props3.rtl,
                crossline = _props3.crossline,
                sortIcons = _props3.sortIcons;
            var sort = this.state.sort;
            var _components$Header = components.Header,
                Header = _components$Header === undefined ? HeaderComponent : _components$Header,
                _components$Wrapper = components.Wrapper,
                Wrapper = _components$Wrapper === undefined ? WrapperComponent : _components$Wrapper,
                _components$Body = components.Body,
                Body = _components$Body === undefined ? BodyComponent : _components$Body;

            var colGroup = this.renderColGroup(flatChildren);

            return React.createElement(
                Wrapper,
                {
                    colGroup: colGroup,
                    ref: this.getWrapperRef,
                    prefix: prefix
                },
                hasHeader ? React.createElement(Header, {
                    prefix: prefix,
                    rtl: rtl,
                    pure: pure,
                    affixRef: this.getAffixRef,
                    colGroup: colGroup,
                    className: prefix + 'table-header',
                    filterParams: filterParams,
                    columns: groupChildren,
                    locale: locale,
                    headerCellRef: this.getHeaderCellRef,
                    components: components,
                    onFilter: this.onFilter,
                    sort: sort,
                    onResizeChange: this.onResizeChange,
                    onSort: this.onSort,
                    sortIcons: sortIcons
                }) : null,
                React.createElement(Body, {
                    prefix: prefix,
                    rtl: rtl,
                    pure: pure,
                    crossline: crossline,
                    colGroup: colGroup,
                    className: prefix + 'table-body',
                    components: components,
                    loading: loading,
                    emptyContent: emptyContent,
                    getCellProps: cellProps,
                    primaryKey: primaryKey,
                    getRowProps: rowProps,
                    columns: flatChildren,
                    rowRef: this.getRowRef,
                    cellRef: this.getCellRef,
                    onRowClick: onRowClick,
                    expandedIndexSimulate: expandedIndexSimulate,
                    onRowMouseEnter: onRowMouseEnter,
                    onRowMouseLeave: onRowMouseLeave,
                    dataSource: dataSource,
                    locale: locale,
                    onBodyMouseOver: this.onBodyMouseOver,
                    onBodyMouseOut: this.onBodyMouseOut
                }),
                wrapperContent
            );
        } else {
            return null;
        }
    };

    /**
     * @param event
     * @returns {Object} { rowIndex: string; colIndex: string }
     */


    Table.prototype.render = function render() {
        var _classnames;

        var ret = this.normalizeChildrenState(this.props);
        this.groupChildren = ret.groupChildren;
        this.flatChildren = ret.flatChildren;
        /* eslint-disable no-unused-vars, prefer-const */
        var table = this.renderTable(ret.groupChildren, ret.flatChildren),
            _props4 = this.props,
            className = _props4.className,
            style = _props4.style,
            hasBorder = _props4.hasBorder,
            isZebra = _props4.isZebra,
            loading = _props4.loading,
            size = _props4.size,
            hasHeader = _props4.hasHeader,
            prefix = _props4.prefix,
            dataSource = _props4.dataSource,
            entireDataSource = _props4.entireDataSource,
            onSort = _props4.onSort,
            onResizeChange = _props4.onResizeChange,
            onRowClick = _props4.onRowClick,
            onRowMouseEnter = _props4.onRowMouseEnter,
            onRowMouseLeave = _props4.onRowMouseLeave,
            onFilter = _props4.onFilter,
            rowProps = _props4.rowProps,
            cellProps = _props4.cellProps,
            primaryKey = _props4.primaryKey,
            components = _props4.components,
            wrapperContent = _props4.wrapperContent,
            lockType = _props4.lockType,
            locale = _props4.locale,
            expandedIndexSimulate = _props4.expandedIndexSimulate,
            refs = _props4.refs,
            pure = _props4.pure,
            rtl = _props4.rtl,
            emptyContent = _props4.emptyContent,
            filterParams = _props4.filterParams,
            columns = _props4.columns,
            sortIcons = _props4.sortIcons,
            _props4$loadingCompon = _props4.loadingComponent,
            LoadingComponent = _props4$loadingCompon === undefined ? Loading : _props4$loadingCompon,
            others = _objectWithoutProperties(_props4, ['className', 'style', 'hasBorder', 'isZebra', 'loading', 'size', 'hasHeader', 'prefix', 'dataSource', 'entireDataSource', 'onSort', 'onResizeChange', 'onRowClick', 'onRowMouseEnter', 'onRowMouseLeave', 'onFilter', 'rowProps', 'cellProps', 'primaryKey', 'components', 'wrapperContent', 'lockType', 'locale', 'expandedIndexSimulate', 'refs', 'pure', 'rtl', 'emptyContent', 'filterParams', 'columns', 'sortIcons', 'loadingComponent']),
            cls = classnames((_classnames = {}, _classnames[prefix + 'table'] = true, _classnames[prefix + 'table-' + size] = size, _classnames['only-bottom-border'] = !hasBorder, _classnames['no-header'] = !hasHeader, _classnames.zebra = isZebra, _classnames[className] = className, _classnames));


        if (rtl) {
            others.dir = 'rtl';
        }

        var content = React.createElement(
            'div',
            _extends({
                className: cls,
                style: style
            }, obj.pickOthers(Object.keys(Table.propTypes), others)),
            table
        );
        if (loading) {
            var loadingClassName = prefix + 'table-loading';
            return React.createElement(
                LoadingComponent,
                { className: loadingClassName },
                content
            );
        }
        return content;
    };

    return Table;
}(React.Component), _class.Column = Column, _class.ColumnGroup = ColumnGroup, _class.Header = HeaderComponent, _class.Body = BodyComponent, _class.Wrapper = WrapperComponent, _class.Row = RowComponent, _class.Cell = CellComponent, _class.Filter = FilterComponent, _class.Sort = SortComponent, _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * 样式类名的品牌前缀
     */
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 自定义内联样式
     */
    style: PropTypes.object,
    /**
     * 尺寸 small为紧凑模式
     */
    size: PropTypes.oneOf(['small', 'medium']),
    /**
     * 表格展示的数据源
     */
    dataSource: PropTypes.array,
    entireDataSource: PropTypes.array,
    /**
     * 点击表格每一行触发的事件
     * @param {Object} record 该行所对应的数据
     * @param {Number} index 该行所对应的序列
     * @param {Event} e DOM事件对象
     */
    onRowClick: PropTypes.func,
    /**
     * 悬浮在表格每一行的时候触发的事件
     * @param {Object} record 该行所对应的数据
     * @param {Number} index 该行所对应的序列
     * @param {Event} e DOM事件对象
     */
    onRowMouseEnter: PropTypes.func,
    /**
     * 离开表格每一行的时候触发的事件
     * @param {Object} record 该行所对应的数据
     * @param {Number} index 该行所对应的序列
     * @param {Event} e DOM事件对象
     */
    onRowMouseLeave: PropTypes.func,
    /**
     * 点击列排序触发的事件
     * @param {String} dataIndex 指定的排序的字段
     * @param {String} order 排序对应的顺序, 有`desc`和`asc`两种
     */
    onSort: PropTypes.func,
    /**
     * 点击过滤确认按钮触发的事件
     * @param {Object} filterParams 过滤的字段信息
     */
    onFilter: PropTypes.func,
    /**
     * 重设列尺寸的时候触发的事件
     * @param {String} dataIndex 指定重设的字段
     * @param {Number} value 列宽变动的数值
     */
    onResizeChange: PropTypes.func,
    /**
     * 设置每一行的属性，如果返回值和其他针对行操作的属性冲突则无效。
     * @param {Object} record 该行所对应的数据
     * @param {Number} index 该行所对应的序列
     * @returns {Object} 需要设置的行属性
     */
    rowProps: PropTypes.func,
    /**
     * 设置单元格的属性，通过该属性可以进行合并单元格
     * @param {Number} rowIndex 该行所对应的序列
     * @param {Number} colIndex 该列所对应的序列
     * @param {String} dataIndex 该列所对应的字段名称
     * @param {Object} record 该行对应的记录
     * @returns {Object} 返回td元素的所支持的属性对象
     */
    cellProps: PropTypes.func,
    /**
     * 表格是否具有边框
     */
    hasBorder: PropTypes.bool,
    /**
     * 表格是否具有头部
     */
    hasHeader: PropTypes.bool,
    /**
     * 表格是否是斑马线
     */
    isZebra: PropTypes.bool,
    /**
     * 表格是否在加载中
     */
    loading: PropTypes.bool,
    /**
     * 自定义 Loading 组件
     * 请务必传递 props, 使用方式： loadingComponent={props => <Loading {...props}/>}
     * @param {Object} props 当前点击行的key
     */
    loadingComponent: PropTypes.func,
    /**
     * 当前过滤的的keys,使用此属性可以控制表格的头部的过滤选项中哪个菜单被选中,格式为 {dataIndex: {selectedKeys:[]}}
     * 示例:
     * 假设要控制dataIndex为id的列的过滤菜单中key为one的菜单项选中
     * `<Table filterParams={{id: {selectedKeys: ['one']}}}/>`
     */
    filterParams: PropTypes.object,
    /**
     * 当前排序的字段,使用此属性可以控制表格的字段的排序,格式为{dataIndex: 'asc'}
     */
    sort: PropTypes.object,
    /**
     * 自定义排序按钮，例如上下排布的: `{desc: <Icon style={{top: '6px', left: '4px'}} type={'arrow-down'} size="small" />, asc: <Icon style={{top: '-6px', left: '4px'}} type={'arrow-up'} size="small" />}`
     */
    sortIcons: PropTypes.object,
    /**
     * 自定义国际化文案对象
     * @property {String} ok 过滤器中确认按钮文案
     * @property {String} reset 过滤器中重置按钮文案
     * @property {String} empty 没有数据情况下 table内的文案
     * @property {String} asc 排序升序状态下的文案
     * @property {String} desc 排序将序状态下的文案
     * @property {String} expanded 可折叠行，展开状态下的文案
     * @property {String} folded 可折叠行，折叠状态下的文案
     * @property {String} filter 过滤器文案
     * @property {String} selectAll header里全选的按钮文案
     */
    locale: PropTypes.object,
    components: PropTypes.object,
    columns: PropTypes.array,
    /**
     * 设置数据为空的时候的表格内容展现
     */
    emptyContent: PropTypes.node,
    /**
     * dataSource当中数据的主键，如果给定的数据源中的属性不包含该主键，会造成选择状态全部选中
     */
    primaryKey: PropTypes.string,
    lockType: PropTypes.oneOf(['left', 'right']),
    wrapperContent: PropTypes.any,
    refs: PropTypes.object,
    /**
     * 额外渲染行的渲染函数
     * @param {Object} record 该行所对应的数据
     * @param {Number} index 该行所对应的序列
     * @returns {Element} 渲染内容
     */
    expandedRowRender: PropTypes.func,
    /**
     * 额外渲染行的缩进
     */
    expandedRowIndent: PropTypes.array,
    /**
     * 默认情况下展开的渲染行或者Tree, 传入此属性为受控状态
     */
    openRowKeys: PropTypes.array,
    /**
     * 是否显示点击展开额外渲染行的+号按钮
     */
    hasExpandedRowCtrl: PropTypes.bool,
    /**
     * 设置额外渲染行的属性
     */
    getExpandedColProps: PropTypes.func,
    /**
     * 在额外渲染行或者Tree展开或者收起的时候触发的事件
     * @param {Array} openRowKeys 展开的渲染行的key
     * @param {String} currentRowKey 当前点击的渲染行的key
     * @param {Boolean} expanded 当前点击是展开还是收起
     * @param {Object} currentRecord 当前点击额外渲染行的记录
     */
    onRowOpen: PropTypes.func,
    onExpandedRowClick: PropTypes.func,
    /**
     * 表头是否固定，该属性配合maxBodyHeight使用，当内容区域的高度超过maxBodyHeight的时候，在内容区域会出现滚动条
     */
    fixedHeader: PropTypes.bool,
    /**
     * 最大内容区域的高度,在`fixedHeader`为`true`的时候,超过这个高度会出现滚动条
     */
    maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 是否启用选择模式
     * @property {Function} getProps `Function(record, index)=>Object` 获取selection的默认属性
     * @property {Function} onChange `Function(selectedRowKeys:Array, records:Array)` 选择改变的时候触发的事件，**注意:** 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
     * @property {Function} onSelect `Function(selected:Boolean, record:Object, records:Array)` 用户手动选择/取消选择某行的回调
     * @property {Function} onSelectAll `Function(selected:Boolean, records:Array)` 用户手动选择/取消选择所有行的回调
     * @property {Array} selectedRowKeys 设置了此属性,将rowSelection变为受控状态,接收值为该行数据的primaryKey的值
     * @property {String} mode 选择selection的模式, 可选值为`single`, `multiple`，默认为`multiple`
     * @property {Function} columnProps `Function()=>Object` 选择列 的props，例如锁列、对齐等，可使用`Table.Column` 的所有参数
     * @property {Function} titleProps `Function()=>Object` 选择列 表头的props，仅在 `multiple` 模式下生效
     * @property {Function} titleAddons `Function()=>Node` 选择列 表头添加的元素，在`single` `multiple` 下都生效
     */
    rowSelection: PropTypes.object,
    /**
     * 表头是否是sticky
     */
    stickyHeader: PropTypes.bool,
    /**
     * 距离窗口顶部达到指定偏移量后触发
     */
    offsetTop: PropTypes.number,
    /**
     * affix组件的的属性
     */
    affixProps: PropTypes.object,
    /**
     * 在tree模式下的缩进尺寸， 仅在isTree为true时候有效
     */
    indent: PropTypes.number,
    /**
     * 开启Table的tree模式, 接收的数据格式中包含children则渲染成tree table
     */
    isTree: PropTypes.bool,
    /**
     * 是否开启虚拟滚动
     */
    useVirtual: PropTypes.bool,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    /**
     * 在内容区域滚动的时候触发的函数
     */
    onBodyScroll: PropTypes.func,
    /**
     * 开启时，getExpandedColProps() / rowProps() / expandedRowRender() 的第二个参数 index (该行所对应的序列) 将按照01,2,3,4...的顺序返回，否则返回真实index(0,2,4,6... / 1,3,5,7...)
     */
    expandedIndexSimulate: PropTypes.bool,
    /**
     * 在 hover 时出现十字参考轴，适用于表头比较复杂，需要做表头分类的场景。
     */
    crossline: PropTypes.bool,
    lengths: PropTypes.object
}), _class.defaultProps = {
    dataSource: [],
    onRowClick: noop,
    onRowMouseEnter: noop,
    onRowMouseLeave: noop,
    onSort: noop,
    onFilter: noop,
    onResizeChange: noop,
    size: 'medium',
    rowProps: noop,
    cellProps: noop,
    prefix: 'next-',
    hasBorder: true,
    hasHeader: true,
    isZebra: false,
    loading: false,
    expandedIndexSimulate: false,
    primaryKey: 'id',
    components: {},
    locale: zhCN.Table,
    crossline: false
}, _class.childContextTypes = {
    notRenderCellIndex: PropTypes.array,
    lockType: PropTypes.oneOf(['left', 'right'])
}, _class.contextTypes = {
    getTableInstance: PropTypes.func,
    getTableInstanceForVirtual: PropTypes.func
}, _temp);
Table.displayName = 'Table';
export { Table as default };