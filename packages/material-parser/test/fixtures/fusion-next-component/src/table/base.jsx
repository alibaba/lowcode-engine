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

const Children = React.Children,
    noop = () => {};

//<Table>
//    <Table.Column/>
//    <Table.ColumnGroup>
//      <Table.Column/>
//      <Table.Column/>
//    </Table.ColumnGroup>
//</Table>

/** Table */
export default class Table extends React.Component {
    static Column = Column;
    static ColumnGroup = ColumnGroup;
    static Header = HeaderComponent;
    static Body = BodyComponent;
    static Wrapper = WrapperComponent;
    static Row = RowComponent;
    static Cell = CellComponent;
    static Filter = FilterComponent;
    static Sort = SortComponent;

    static propTypes = {
        ...ConfigProvider.propTypes,
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
        maxBodyHeight: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
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
        lengths: PropTypes.object,
    };

    static defaultProps = {
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
        crossline: false,
    };

    static childContextTypes = {
        notRenderCellIndex: PropTypes.array,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

    static contextTypes = {
        getTableInstance: PropTypes.func,
        getTableInstanceForVirtual: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        const { getTableInstance, getTableInstanceForVirtual } = this.context;
        getTableInstance && getTableInstance(props.lockType, this);
        getTableInstanceForVirtual &&
            getTableInstanceForVirtual(props.lockType, this);
        this.notRenderCellIndex = [];
    }

    state = {
        sort: this.props.sort || {},
    };

    getChildContext() {
        return {
            notRenderCellIndex: this.notRenderCellIndex,
            lockType: this.props.lockType,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (typeof this.props.sort !== 'undefined') {
            this.setState({
                sort: nextProps.sort,
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.pure) {
            const isEqual =
                shallowElementEquals(nextProps, this.props) &&
                obj.shallowEqual(nextState, this.state) &&
                obj.shallowEqual(nextContext, this.context);
            return !isEqual;
        }

        return true;
    }

    componentWillUpdate() {
        this.notRenderCellIndex = [];
    }

    normalizeChildrenState(props) {
        let columns = props.columns;
        if (props.children) {
            columns = this.normalizeChildren(props);
        }
        return this.fetchInfoFromBinaryChildren(columns);
    }

    // 将React结构化数据提取props转换成数组
    normalizeChildren(props) {
        let { columns } = props;
        const getChildren = children => {
            const ret = [];
            Children.forEach(children, child => {
                if (child) {
                    const props = { ...child.props };

                    if (
                        !(
                            child &&
                            typeof child.type === 'function' &&
                            (child.type._typeMark === 'column' ||
                                child.type._typeMark === 'columnGroup')
                        )
                    ) {
                        log.warning(
                            'Use <Table.Column/>, <Table.ColumnGroup/> as child.'
                        );
                    }
                    ret.push(props);
                    if (child.props.children) {
                        props.children = getChildren(child.props.children);
                    }
                }
            });
            return ret;
        };
        if (props.children) {
            columns = getChildren(props.children);
        }
        return columns;
    }

    fetchInfoFromBinaryChildren(children) {
        let hasGroupHeader = false;
        const flatChildren = [],
            groupChildren = [],
            getChildren = (propsChildren, level) => {
                groupChildren[level] = groupChildren[level] || [];
                propsChildren.forEach(child => {
                    if (child.children) {
                        hasGroupHeader = true;
                        getChildren(child.children, level + 1);
                    } else {
                        flatChildren.push(child);
                    }
                    groupChildren[level].push(child);
                });
            },
            getColSpan = (children, colSpan) => {
                colSpan = colSpan || 0;
                children.forEach(child => {
                    if (child.children) {
                        colSpan = getColSpan(child.children, colSpan);
                    } else {
                        colSpan += 1;
                    }
                });
                return colSpan;
            };

        getChildren(children, 0);

        groupChildren.forEach((groupChild, i) => {
            groupChild.forEach((child, j) => {
                let colSpan;
                const children = child.children;

                if (children) {
                    colSpan = getColSpan(children);
                    child.colSpan = colSpan;
                    groupChildren[i][j] = child;
                }
            });
        });

        const { lockType, lengths } = this.props;
        const start = lockType === 'right' ? lengths.origin - lengths.right : 0;
        this.addColIndex(flatChildren, start);

        return {
            flatChildren,
            groupChildren,
            hasGroupHeader,
        };
    }

    renderColGroup(flatChildren) {
        const cols = flatChildren.map((col, index) => {
            const width = col.width;
            let style = {};
            if (width) {
                style = {
                    width: width,
                };
            }

            return <col style={style} key={index} />;
        });
        return <colgroup key="table-colgroup">{cols}</colgroup>;
    }

    onSort = (dataIndex, order, sort) => {
        if (typeof this.props.sort === 'undefined') {
            this.setState(
                {
                    sort: sort,
                },
                () => {
                    this.props.onSort(dataIndex, order, sort);
                }
            );
        } else {
            this.props.onSort(dataIndex, order, sort);
        }
    };

    onFilter = filterParams => {
        this.props.onFilter(filterParams);
    };

    onResizeChange = (dataIndex, value) => {
        this.props.onResizeChange(dataIndex, value);
    };

    // 通过头部和扁平的结构渲染表格
    renderTable(groupChildren, flatChildren) {
        if (
            flatChildren.length ||
            (!flatChildren.length && !this.props.lockType)
        ) {
            const {
                hasHeader,
                components,
                prefix,
                wrapperContent,
                filterParams,
                locale,
                dataSource,
                emptyContent,
                loading,
                primaryKey,
                cellProps,
                rowProps,
                onRowClick,
                onRowMouseEnter,
                onRowMouseLeave,
                expandedIndexSimulate,
                pure,
                rtl,
                crossline,
                sortIcons,
            } = this.props;
            const { sort } = this.state;
            const {
                Header = HeaderComponent,
                Wrapper = WrapperComponent,
                Body = BodyComponent,
            } = components;
            const colGroup = this.renderColGroup(flatChildren);

            return (
                <Wrapper
                    colGroup={colGroup}
                    ref={this.getWrapperRef}
                    prefix={prefix}
                >
                    {hasHeader ? (
                        <Header
                            prefix={prefix}
                            rtl={rtl}
                            pure={pure}
                            affixRef={this.getAffixRef}
                            colGroup={colGroup}
                            className={`${prefix}table-header`}
                            filterParams={filterParams}
                            columns={groupChildren}
                            locale={locale}
                            headerCellRef={this.getHeaderCellRef}
                            components={components}
                            onFilter={this.onFilter}
                            sort={sort}
                            onResizeChange={this.onResizeChange}
                            onSort={this.onSort}
                            sortIcons={sortIcons}
                        />
                    ) : null}
                    <Body
                        prefix={prefix}
                        rtl={rtl}
                        pure={pure}
                        crossline={crossline}
                        colGroup={colGroup}
                        className={`${prefix}table-body`}
                        components={components}
                        loading={loading}
                        emptyContent={emptyContent}
                        getCellProps={cellProps}
                        primaryKey={primaryKey}
                        getRowProps={rowProps}
                        columns={flatChildren}
                        rowRef={this.getRowRef}
                        cellRef={this.getCellRef}
                        onRowClick={onRowClick}
                        expandedIndexSimulate={expandedIndexSimulate}
                        onRowMouseEnter={onRowMouseEnter}
                        onRowMouseLeave={onRowMouseLeave}
                        dataSource={dataSource}
                        locale={locale}
                        onBodyMouseOver={this.onBodyMouseOver}
                        onBodyMouseOut={this.onBodyMouseOut}
                    />
                    {wrapperContent}
                </Wrapper>
            );
        } else {
            return null;
        }
    }

    getWrapperRef = wrapper => {
        if (!wrapper) {
            return this.wrapper;
        }
        this.wrapper = wrapper;
    };

    getAffixRef = affixRef => {
        if (!affixRef) {
            return this.affixRef;
        }
        this.affixRef = affixRef;
    };

    getHeaderCellRef = (i, j, cell) => {
        const cellRef = `header_cell_${i}_${j}`;
        if (!cell) {
            return this[cellRef];
        }
        this[cellRef] = cell;
    };

    getRowRef = (i, row) => {
        const rowRef = `row_${i}`;
        if (!row) {
            return this[rowRef];
        }
        this[rowRef] = row;
    };

    getCellRef = (i, j, cell) => {
        const cellRef = `cell_${i}_${j}`;
        if (!cell) {
            return this[cellRef];
        }
        this[cellRef] = cell;
    };

    handleColHoverClass = (rowIndex, colIndex, isAdd) => {
        const { crossline } = this.props;
        const funcName = isAdd ? 'addClass' : 'removeClass';
        if (crossline) {
            this.props.entireDataSource.forEach((val, index) => {
                try {
                    // in case of finding an unmounted component due to cached data
                    // need to clear refs of this.tableInc when dataSource Changed
                    // in virtual table
                    const currentCol = findDOMNode(
                        this.getCellRef(index, colIndex)
                    );
                    currentCol && dom[funcName](currentCol, 'hovered');
                } catch (error) {
                    return null;
                }
            });
        }
    };

    /**
     * @param event
     * @returns {Object} { rowIndex: string; colIndex: string }
     */
    findEventTarget = e => {
        const { prefix } = this.props;
        const target = dom.getClosest(e.target, `td.${prefix}table-cell`);
        const colIndex = target && target.getAttribute('data-next-table-col');
        const rowIndex = target && target.getAttribute('data-next-table-row');

        try {
            // in case of finding an unmounted component due to cached data
            // need to clear refs of this.tableInc when dataSource Changed
            // in virtual table
            const currentCol = findDOMNode(this.getCellRef(rowIndex, colIndex));
            if (currentCol === target) {
                return {
                    colIndex,
                    rowIndex,
                };
            }
        } catch (error) {
            return {};
        }

        return {};
    };

    onBodyMouseOver = e => {
        const { crossline } = this.props;
        if (!crossline) {
            return;
        }

        const { colIndex, rowIndex } = this.findEventTarget(e);
        // colIndex, rowIndex are string
        if (!colIndex || !rowIndex) {
            return;
        }
        this.handleColHoverClass(rowIndex, colIndex, true);
        this.colIndex = colIndex;
        this.rowIndex = rowIndex;
    };

    onBodyMouseOut = e => {
        const { crossline } = this.props;
        if (!crossline) {
            return;
        }

        const { colIndex, rowIndex } = this.findEventTarget(e);
        // colIndex, rowIndex are string
        if (!colIndex || !rowIndex) {
            return;
        }
        this.handleColHoverClass(this.rowIndex, this.colIndex, false);
        this.colIndex = -1;
        this.rowIndex = -1;
    };

    addColIndex = (children, start = 0) => {
        children.forEach((child, i) => {
            child.__colIndex = start + i;
        });
    };

    render() {
        const ret = this.normalizeChildrenState(this.props);
        this.groupChildren = ret.groupChildren;
        this.flatChildren = ret.flatChildren;
        /* eslint-disable no-unused-vars, prefer-const */
        let table = this.renderTable(ret.groupChildren, ret.flatChildren),
            {
                className,
                style,
                hasBorder,
                isZebra,
                loading,
                size,
                hasHeader,
                prefix,
                dataSource,
                entireDataSource,
                onSort,
                onResizeChange,
                onRowClick,
                onRowMouseEnter,
                onRowMouseLeave,
                onFilter,
                rowProps,
                cellProps,
                primaryKey,
                components,
                wrapperContent,
                lockType,
                locale,
                expandedIndexSimulate,
                refs,
                pure,
                rtl,
                emptyContent,
                filterParams,
                columns,
                sortIcons,
                loadingComponent: LoadingComponent = Loading,
                ...others
            } = this.props,
            cls = classnames({
                [`${prefix}table`]: true,
                [`${prefix}table-${size}`]: size,
                'only-bottom-border': !hasBorder,
                'no-header': !hasHeader,
                zebra: isZebra,
                [className]: className,
            });

        if (rtl) {
            others.dir = 'rtl';
        }

        const content = (
            <div
                className={cls}
                style={style}
                {...obj.pickOthers(Object.keys(Table.propTypes), others)}
            >
                {table}
            </div>
        );
        if (loading) {
            const loadingClassName = `${prefix}table-loading`;
            return (
                <LoadingComponent className={loadingClassName}>
                    {content}
                </LoadingComponent>
            );
        }
        return content;
    }
}
