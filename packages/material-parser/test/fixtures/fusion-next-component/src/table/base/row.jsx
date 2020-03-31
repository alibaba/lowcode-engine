import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { obj, dom } from '../../util';
import { fetchDataByPath } from '../util';

const noop = () => {};

export default class Row extends React.Component {
    static propTypes = {
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
        wrapper: PropTypes.func,
    };

    static defaultProps = {
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
        wrapper: row => row,
    };

    static contextTypes = {
        notRenderCellIndex: PropTypes.array,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

    shouldComponentUpdate(nextProps) {
        if (nextProps.pure) {
            const isEqual = obj.shallowEqual(this.props, nextProps);
            return !isEqual;
        }

        return true;
    }

    onClick = e => {
        const { record, rowIndex } = this.props;
        this.props.onClick(record, rowIndex, e);
    };

    onMouseEnter = e => {
        const { record, rowIndex, __rowIndex } = this.props;
        const row = __rowIndex || rowIndex;
        this.onRowHover(record, row, true, e);
    };

    onMouseLeave = e => {
        const { record, rowIndex, __rowIndex } = this.props;
        const row = __rowIndex || rowIndex;
        this.onRowHover(record, row, false, e);
    };

    onRowHover(record, index, isEnter, e) {
        const { onMouseEnter, onMouseLeave } = this.props,
            currentRow = findDOMNode(this);
        if (isEnter) {
            onMouseEnter(record, index, e);
            currentRow && dom.addClass(currentRow, 'hovered');
        } else {
            onMouseLeave(record, index, e);
            currentRow && dom.removeClass(currentRow, 'hovered');
        }
    }

    renderCells(record, rowIndex) {
        const {
            Cell,
            columns,
            getCellProps,
            cellRef,
            prefix,
            primaryKey,
            // __rowIndex 是连贯的table行的索引，只有在开启expandedIndexSimulate的ExpandedTable模式下__rowIndex可能会不等于rowIndex
            __rowIndex,
            pure,
            locale,
            rtl,
        } = this.props;

        // use params first, it's for list
        rowIndex = rowIndex !== undefined ? rowIndex : this.props.rowIndex;

        const { lockType } = this.context;
        return columns.map((child, index) => {
            /* eslint-disable no-unused-vars, prefer-const */
            const {
                dataIndex,
                align,
                alignHeader,
                width,
                colSpan,
                style,
                __colIndex,
                ...others
            } = child;
            const colIndex = '__colIndex' in child ? __colIndex : index;
            // colSpan should show in body td by the way of <Table.Column colSpan={2} />
            // tbody's cell merge should only by the way of <Table cellProps={} />

            const value = fetchDataByPath(record, dataIndex);
            const attrs =
                getCellProps(rowIndex, colIndex, dataIndex, record) || {};

            if (this.context.notRenderCellIndex) {
                const matchCellIndex = this.context.notRenderCellIndex
                    .map(cellIndex => cellIndex.toString())
                    .indexOf([rowIndex, colIndex].toString());
                if (matchCellIndex > -1) {
                    this.context.notRenderCellIndex.splice(matchCellIndex, 1);
                    return null;
                }
            }
            if (
                (attrs.colSpan && attrs.colSpan > 1) ||
                (attrs.rowSpan && attrs.rowSpan > 1)
            ) {
                this._getNotRenderCellIndex(
                    colIndex,
                    rowIndex,
                    attrs.colSpan || 1,
                    attrs.rowSpan || 1
                );
            }

            const cellClass = attrs.className;
            const className = classnames({
                first: lockType !== 'right' && colIndex === 0,
                last:
                    lockType !== 'left' &&
                    (colIndex === columns.length - 1 ||
                        colIndex + attrs.colSpan === columns.length), // 考虑合并单元格的情况
                [child.className]: child.className,
                [cellClass]: cellClass,
            });

            return (
                <Cell
                    key={`${__rowIndex}-${colIndex}`}
                    {...others}
                    {...attrs}
                    data-next-table-col={colIndex}
                    data-next-table-row={rowIndex}
                    ref={cell => cellRef(__rowIndex, colIndex, cell)}
                    prefix={prefix}
                    pure={pure}
                    primaryKey={primaryKey}
                    record={record}
                    className={className}
                    value={value}
                    colIndex={colIndex}
                    rowIndex={rowIndex}
                    align={align}
                    locale={locale}
                    rtl={rtl}
                    width={width}
                />
            );
        });
    }

    _getNotRenderCellIndex(colIndex, rowIndex, colSpan, rowSpan) {
        const maxColIndex = colSpan;
        const maxRowIndex = rowSpan;
        const notRenderCellIndex = [];
        for (let i = 0; i < maxColIndex; i++) {
            for (let j = 0; j < maxRowIndex; j++) {
                notRenderCellIndex.push([rowIndex + j, colIndex + i]);
            }
        }
        [].push.apply(this.context.notRenderCellIndex, notRenderCellIndex);
    }

    render() {
        /* eslint-disable no-unused-vars*/
        const {
            prefix,
            className,
            onClick,
            onMouseEnter,
            onMouseLeave,
            columns,
            Cell,
            getCellProps,
            rowIndex,
            record,
            __rowIndex,
            children,
            primaryKey,
            cellRef,
            colGroup,
            pure,
            locale,
            expandedIndexSimulate,
            rtl,
            wrapper,
            ...others
        } = this.props;
        const cls = classnames({
            [`${prefix}table-row`]: true,
            [className]: className,
        });

        const tr = (
            <tr
                className={cls}
                role="row"
                {...others}
                onClick={this.onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {this.renderCells(record)}
                {children}
            </tr>
        );

        return wrapper(tr);
    }
}
