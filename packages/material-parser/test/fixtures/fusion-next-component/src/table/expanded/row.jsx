import React from 'react';
import PropTypes from 'prop-types';
import { log } from '../../util';
import Row from '../lock/row';

export default class ExpandedRow extends React.Component {
    static propTypes = {
        ...Row.propTypes,
    };

    static defaultProps = {
        ...Row.defaultProps,
    };

    static contextTypes = {
        openRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        expandedRowIndent: PropTypes.array,
        expandedIndexSimulate: PropTypes.bool,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

    renderExpandedRow(record, rowIndex) {
        const {
            expandedRowRender,
            expandedRowIndent,
            openRowKeys,
            lockType,
            expandedIndexSimulate,
        } = this.context;
        const expandedIndex = expandedIndexSimulate
            ? (rowIndex - 1) / 2
            : rowIndex;

        const { columns, cellRef } = this.props;
        const colSpan = columns.length;
        const expandedCols = (columns[0] && columns[0].__colIndex) || 0;

        if (expandedRowRender) {
            const { primaryKey, prefix } = this.props,
                leftIndent = expandedRowIndent[0],
                rightIndent = expandedRowIndent[1],
                totalIndent = leftIndent + rightIndent,
                renderCols = (number, start = 0) => {
                    const ret = [];
                    for (let i = 0; i < number; i++) {
                        ret.push(
                            <td
                                key={i}
                                ref={cell => cellRef(rowIndex, i + start, cell)}
                            >
                                &nbsp;
                            </td>
                        );
                    }
                    return ret;
                };
            let content;

            if (totalIndent > colSpan && !lockType) {
                log.warning(
                    "It's not allowed expandedRowIndent is more than the number of columns."
                );
            }
            if (leftIndent < columns.length && lockType === 'left') {
                log.warning(
                    'expandedRowIndent left is less than the number of left lock columns.'
                );
            }
            if (rightIndent < columns.length && lockType === 'right') {
                log.warning(
                    'expandedRowIndent right is less than the number of right lock columns.'
                );
            }
            if (lockType) {
                return openRowKeys.indexOf(record[primaryKey]) > -1 ? (
                    <tr
                        className={`${prefix}table-expanded-row`}
                        key={`expanded-${expandedIndex}`}
                    >
                        <td
                            colSpan={colSpan}
                            ref={cell => cellRef(rowIndex, expandedCols, cell)}
                        >
                            &nbsp;
                        </td>
                    </tr>
                ) : null;
            }
            // 暴露给用户的index
            content = expandedRowRender(record, expandedIndex);
            if (!React.isValidElement(content)) {
                content = (
                    <div className={`${prefix}table-cell-wrapper`}>
                        {content}
                    </div>
                );
            }

            let rightStart = columns.length;
            columns.forEach(col => {
                col.lock === 'right' && rightStart--;
            });
            return openRowKeys.indexOf(record[primaryKey]) > -1 ? (
                <tr
                    className={`${prefix}table-expanded-row`}
                    key={`expanded-${record[primaryKey] || expandedIndex}`}
                >
                    {renderCols(leftIndent)}
                    <td colSpan={colSpan - totalIndent}>{content}</td>
                    {renderCols(rightIndent, rightStart)}
                </tr>
            ) : null;
        } else {
            return null;
        }
    }

    render() {
        /* eslint-disable no-unused-vars*/
        const { record, rowIndex, columns, ...others } = this.props;
        const { expandedIndexSimulate } = this.context;

        if (record.__expanded) {
            return this.renderExpandedRow(record, rowIndex, columns);
        }

        const newRowIndex = expandedIndexSimulate ? rowIndex / 2 : rowIndex;
        return (
            <Row
                {...others}
                record={record}
                columns={columns}
                __rowIndex={rowIndex}
                rowIndex={newRowIndex}
            />
        );
    }
}
