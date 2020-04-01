import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FilterComponent from './filter';
import SortComponent from './sort';
import CellComponent from './cell';
import ResizeComponent from './resize';

const noop = () => {};
export default class Header extends React.Component {
    static propTypes = {
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
        onResizeChange: PropTypes.func,
    };
    static defaultProps = {
        component: 'thead',
        columns: [],
        headerCellRef: noop,
        onFilter: noop,
        components: {},
        onSort: noop,
        onResizeChange: noop,
    };

    getCellRef = (i, j, cell) => {
        this.props.headerCellRef(i, j, cell);
    };

    onSort = (dataIndex, order, sort) => {
        this.props.onSort(dataIndex, order, sort);
    };

    render() {
        /*eslint-disable no-unused-vars */
        const {
            prefix,
            className,
            children,
            component: Tag,
            colGroup,
            columns,
            locale,
            filterParams,
            onFilter,
            components,
            affixRef,
            headerCellRef,
            onSort,
            sort,
            sortIcons,
            onResizeChange,
            pure,
            rtl,
            ...others
        } = this.props;

        const {
            Cell = CellComponent,
            Filter = FilterComponent,
            Sort = SortComponent,
            Resize = ResizeComponent,
        } = components;
        const rowSpan = columns.length;

        const header = columns.map((cols, index) => {
            const col = cols.map((col, j) => {
                /* eslint-disable no-unused-vars, prefer-const */
                let {
                    title,
                    colSpan,
                    sortable,
                    resizable,
                    dataIndex,
                    filters,
                    filterMode,
                    filterMenuProps,
                    filterProps,
                    width,
                    align,
                    alignHeader,
                    className,
                    __normalized,
                    lock,
                    ...others
                } = col;

                className = classnames({
                    [`${prefix}table-header-node`]: true,
                    [`${prefix}table-header-resizable`]: resizable,
                    [className]: className,
                });
                let attrs = {},
                    sortElement,
                    filterElement,
                    resizeElement;

                attrs.colSpan = colSpan;

                // column.group doesn't have sort resize filter
                if (!(col.children && col.children.length)) {
                    if (sortable) {
                        sortElement = (
                            <Sort
                                prefix={prefix}
                                className={`${prefix}table-header-icon`}
                                dataIndex={dataIndex}
                                onSort={this.onSort}
                                sortIcons={sortIcons}
                                sort={sort}
                                rtl={rtl}
                                locale={locale}
                            />
                        );
                    }
                    if (resizable) {
                        resizeElement = (
                            <Resize
                                prefix={prefix}
                                rtl={rtl}
                                dataIndex={dataIndex}
                                onChange={onResizeChange}
                            />
                        );
                    }

                    if (filters) {
                        filterElement = filters.length ? (
                            <Filter
                                dataIndex={dataIndex}
                                className={`${prefix}table-header-icon`}
                                filters={filters}
                                prefix={prefix}
                                locale={locale}
                                rtl={rtl}
                                filterParams={filterParams}
                                filterMode={filterMode}
                                filterMenuProps={filterMenuProps}
                                filterProps={filterProps}
                                onFilter={onFilter}
                            />
                        ) : null;
                    }
                    attrs.rowSpan = rowSpan - index;
                }

                if (+attrs.colSpan === 0) {
                    return null;
                }

                return (
                    <Cell
                        {...others}
                        {...attrs}
                        key={j}
                        prefix={prefix}
                        pure={pure}
                        rtl={rtl}
                        cell={title}
                        component="th"
                        align={alignHeader ? alignHeader : align}
                        className={className}
                        ref={this.getCellRef.bind(this, index, j)}
                        type="header"
                    >
                        {sortElement}
                        {filterElement}
                        {resizeElement}
                    </Cell>
                );
            });
            return <tr key={index}>{col}</tr>;
        });

        return (
            <Tag className={className} {...others}>
                {header}
                {children}
            </Tag>
        );
    }
}
