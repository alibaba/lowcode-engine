import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { log } from '../../util';
import Row from '../base/row';

export default class GroupListRow extends Row {
    static contextTypes = {
        listHeader: PropTypes.any,
        listFooter: PropTypes.any,
        rowSelection: PropTypes.object,
        notRenderCellIndex: PropTypes.array,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

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
            rowIndex,
            __rowIndex,
            record,
            children,
            primaryKey,
            colGroup,
            cellRef,
            getCellProps,
            locale,
            wrapper,
            rtl,
            ...others
        } = this.props;
        const cls = classnames({
            [`${prefix}table-row`]: true,
            [className]: className,
        });

        // clear notRenderCellIndex, incase of cached data
        this.context.notRenderCellIndex = [];

        return (
            <table
                className={cls}
                role="row"
                {...others}
                onClick={this.onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {colGroup}
                <tbody>
                    {this.renderContent('header')}
                    {this.renderChildren()}
                    {this.renderContent('footer')}
                </tbody>
            </table>
        );
    }

    isChildrenSelection() {
        return (
            this.context.listHeader &&
            this.context.listHeader.hasChildrenSelection
        );
    }

    isFirstLevelDataWhenNoChildren() {
        return (
            this.context.listHeader &&
            this.context.listHeader.useFirstLevelDataWhenNoChildren
        );
    }

    isSelection() {
        return this.context.listHeader && this.context.listHeader.hasSelection;
    }

    renderChildren() {
        const { record, primaryKey } = this.props;
        const { children } = record;

        let toRenderList = children;
        if (this.isFirstLevelDataWhenNoChildren()) {
            log.warning(
                `useFirstLevelDataWhenNoChildren is deprecated, change your dataSource structure, make sure there is 'children' in your dataSource.`
            );

            toRenderList = children || [record];
        }

        if (toRenderList) {
            return toRenderList.map((child, index) => {
                const cells = this.renderCells(child, index);
                if (this.isChildrenSelection()) {
                    if (!child[primaryKey]) {
                        log.warning(
                            'record.children/recored should contains primaryKey when childrenSelection is true.'
                        );
                    }
                    return <tr key={child[primaryKey]}>{cells}</tr>;
                }
                if (this.context.rowSelection) {
                    cells.shift();
                    cells[0] = React.cloneElement(cells[0], {
                        colSpan: 2,
                        ...cells[0].props,
                    });
                }
                return <tr key={index}>{cells}</tr>;
            });
        }
        return null;
    }
    renderContent(type) {
        const { columns, prefix, record, rowIndex } = this.props;
        const cameType = type.charAt(0).toUpperCase() + type.substr(1);
        const list = this.context[`list${cameType}`];
        let listNode;
        if (list) {
            if (React.isValidElement(list.cell)) {
                listNode = React.cloneElement(list.cell, {
                    record,
                    index: rowIndex,
                });
            } else if (typeof list.cell === 'function') {
                listNode = list.cell(record, rowIndex);
            }
            if (listNode) {
                let cells = this.renderCells(record);
                if (
                    type === 'header' &&
                    this.context.rowSelection &&
                    this.isSelection()
                ) {
                    cells = cells.slice(0, 1);
                    cells.push(
                        <td colSpan={columns.length - 1} key="listNode">
                            <div className={`${prefix}table-cell-wrapper`}>
                                {listNode}
                            </div>
                        </td>
                    );
                    listNode = (
                        <tr className={`${prefix}table-group-${type}`}>
                            {cells}
                        </tr>
                    );
                } else {
                    listNode = (
                        <tr className={`${prefix}table-group-${type}`}>
                            <td colSpan={columns.length}>
                                <div className={`${prefix}table-cell-wrapper`}>
                                    {listNode}
                                </div>
                            </td>
                        </tr>
                    );
                }
            }
        }
        return listNode;
    }
}
