import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../icon';
import { KEYCODE } from '../../util';
import CellComponent from '../base/cell';

export default class TreeCell extends React.Component {
    static propTypes = {
        indent: PropTypes.number,
        locale: PropTypes.object,
        ...CellComponent.propTypes,
    };

    static defaultProps = {
        ...CellComponent.defaultProps,
        component: 'td',
        indent: 20,
    };

    static contextTypes = {
        openTreeRowKeys: PropTypes.array,
        indent: PropTypes.number,
        onTreeNodeClick: PropTypes.func,
        isTree: PropTypes.bool,
        rowSelection: PropTypes.object,
    };

    onTreeNodeClick = (record, e) => {
        e.stopPropagation();
        this.context.onTreeNodeClick(record);
    };

    expandedKeydown = (record, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.keyCode === KEYCODE.ENTER) {
            this.onTreeNodeClick(record, e);
        }
    };

    render() {
        const {
            colIndex,
            record,
            prefix,
            primaryKey,
            locale,
            rtl,
            children,
        } = this.props;
        const {
            openTreeRowKeys: openRowKeys,
            indent,
            isTree,
            rowSelection,
        } = this.context;
        const treeArrowNodeIndex = rowSelection ? 1 : 0;
        let firstCellStyle, treeArrowNode;
        if (colIndex === treeArrowNodeIndex) {
            let treeArrowType;
            if (isTree) {
                const paddingType = rtl ? 'paddingRight' : 'paddingLeft';
                firstCellStyle = {
                    [paddingType]: indent * (record.__level + 1),
                };
                treeArrowNode = (
                    <Icon
                        size="xs"
                        rtl={rtl}
                        className={`${prefix}table-tree-placeholder`}
                    />
                );
                if (record.children && record.children.length) {
                    const hasExpanded =
                        openRowKeys.indexOf(record[primaryKey]) > -1;

                    treeArrowType = hasExpanded ? 'arrow-down' : 'arrow-right';

                    treeArrowNode = (
                        <Icon
                            className={`${prefix}table-tree-arrow`}
                            type={treeArrowType}
                            size="xs"
                            rtl={rtl}
                            onClick={e => this.onTreeNodeClick(record, e)}
                            onKeyDown={e => this.expandedKeydown(record, e)}
                            role="button"
                            tabIndex="0"
                            aria-expanded={hasExpanded}
                            aria-label={
                                hasExpanded ? locale.expanded : locale.folded
                            }
                        />
                    );
                }
            }
        }
        return (
            <CellComponent
                {...this.props}
                innerStyle={firstCellStyle}
                isIconLeft
            >
                {children}
                {treeArrowNode}
            </CellComponent>
        );
    }
}
