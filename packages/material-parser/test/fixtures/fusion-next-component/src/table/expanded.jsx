import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../icon';
import { KEYCODE } from '../util';
import RowComponent from './expanded/row';
import Col from './column';
import { statics } from './util';

const noop = () => {};

export default function expanded(BaseComponent) {
    /** Table */
    class ExpandedTable extends React.Component {
        static ExpandedRow = RowComponent;
        static propTypes = {
            /**
             * 额外渲染行的渲染函数
             * @param {Object} record 该行所对应的数据
             * @param {Number} index 该行所对应的序列
             * @returns {Element}
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
            locale: PropTypes.object,
            ...BaseComponent.propTypes,
        };

        static defaultProps = {
            ...BaseComponent.defaultProps,
            getExpandedColProps: noop,
            onRowOpen: noop,
            hasExpandedRowCtrl: true,
            components: {},
            expandedRowIndent: [1, 0],
            prefix: 'next-',
        };

        static childContextTypes = {
            openRowKeys: PropTypes.array,
            expandedRowRender: PropTypes.func,
            expandedIndexSimulate: PropTypes.bool,
            expandedRowIndent: PropTypes.array,
        };

        state = {
            openRowKeys: this.props.openRowKeys || [],
        };

        getChildContext() {
            return {
                openRowKeys: this.state.openRowKeys,
                expandedRowRender: this.props.expandedRowRender,
                expandedIndexSimulate: this.props.expandedIndexSimulate,
                expandedRowIndent: this.props.expandedRowIndent,
            };
        }

        componentWillReceiveProps(nextProps) {
            if ('openRowKeys' in nextProps) {
                const { openRowKeys } = nextProps;
                this.setState({
                    openRowKeys,
                });
            }
        }

        expandedKeydown = (value, record, index, e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === KEYCODE.ENTER) {
                this.onExpandedClick(value, record, index, e);
            }
        };

        renderExpandedCell = (value, index, record) => {
            const { getExpandedColProps, prefix, locale } = this.props;

            const { openRowKeys } = this.state,
                { primaryKey } = this.props,
                hasExpanded = openRowKeys.indexOf(record[primaryKey]) > -1,
                switchNode = hasExpanded ? (
                    <Icon
                        type="minus"
                        size="xs"
                        className={`${prefix}table-expand-unfold`}
                    />
                ) : (
                    <Icon
                        type="add"
                        size="xs"
                        className={`${prefix}table-expand-fold`}
                    />
                ),
                attrs = getExpandedColProps(record, index) || {};
            const cls = classnames({
                [`${prefix}table-expanded-ctrl`]: true,
                disabled: attrs.disabled,
                [attrs.className]: attrs.className,
            });

            if (!attrs.disabled) {
                attrs.onClick = this.onExpandedClick.bind(
                    this,
                    value,
                    record,
                    index
                );
            }
            return (
                <span
                    {...attrs}
                    role="button"
                    tabIndex="0"
                    onKeyDown={this.expandedKeydown.bind(
                        this,
                        value,
                        record,
                        index
                    )}
                    aria-label={hasExpanded ? locale.expanded : locale.folded}
                    aria-expanded={hasExpanded}
                    className={cls}
                >
                    {switchNode}
                </span>
            );
        };

        onExpandedClick(value, record, i, e) {
            const openRowKeys = [...this.state.openRowKeys],
                { primaryKey } = this.props,
                id = record[primaryKey],
                index = openRowKeys.indexOf(id);
            if (index > -1) {
                openRowKeys.splice(index, 1);
            } else {
                openRowKeys.push(id);
            }
            if (!('openRowKeys' in this.props)) {
                this.setState({
                    openRowKeys: openRowKeys,
                });
            }
            this.props.onRowOpen(openRowKeys, id, index === -1, record);
            e.stopPropagation();
        }

        normalizeChildren(children) {
            const { prefix, size } = this.props;
            const toArrayChildren = Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    key: index,
                })
            );
            toArrayChildren.unshift(
                <Col
                    title=""
                    key="expanded"
                    cell={this.renderExpandedCell.bind(this)}
                    width={size === 'small' ? 34 : 50}
                    className={`${prefix}table-expanded ${prefix}table-prerow`}
                    __normalized
                />
            );
            return toArrayChildren;
        }

        normalizeDataSource(ds) {
            const ret = [];
            ds.forEach(item => {
                const itemCopy = { ...item };
                itemCopy.__expanded = true;
                ret.push(item, itemCopy);
            });
            return ret;
        }

        render() {
            /* eslint-disable no-unused-vars, prefer-const */
            let {
                components,
                openRowKeys,
                expandedRowRender,
                hasExpandedRowCtrl,
                children,
                dataSource,
                entireDataSource,
                getExpandedColProps,
                expandedRowIndent,
                onRowOpen,
                onExpandedRowClick,
                ...others
            } = this.props;
            if (expandedRowRender && !components.Row) {
                components = { ...components };
                components.Row = RowComponent;
                dataSource = this.normalizeDataSource(dataSource);
                entireDataSource = this.normalizeDataSource(entireDataSource);
            }
            if (expandedRowRender && hasExpandedRowCtrl) {
                children = this.normalizeChildren(children);
            }

            return (
                <BaseComponent
                    {...others}
                    dataSource={dataSource}
                    entireDataSource={entireDataSource}
                    components={components}
                >
                    {children}
                </BaseComponent>
            );
        }
    }
    statics(ExpandedTable, BaseComponent);
    return ExpandedTable;
}
