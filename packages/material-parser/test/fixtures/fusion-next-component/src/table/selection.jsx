import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';
import Radio from '../radio';
import { func, log } from '../util';
import zhCN from '../locale/zh-cn';
import SelectionRow from './selection/row';
import Col from './column';
import { statics } from './util';

const { makeChain } = func;

const unique = (arr, key = 'this') => {
    const temp = {},
        ret = [];
    arr.forEach(item => {
        let value;
        if (key === 'this') {
            value = item;
        } else {
            value = item[key];
        }
        if (!temp[value]) {
            ret.push(item);
            temp[value] = true;
        }
    });
    return ret;
};

export default function selection(BaseComponent) {
    /** Table */
    class SelectionTable extends React.Component {
        static SelectionRow = SelectionRow;
        static propTypes = {
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
             */
            rowSelection: PropTypes.object,
            primaryKey: PropTypes.string,
            dataSource: PropTypes.array,
            entireDataSource: PropTypes.array,
            ...BaseComponent.propTypes,
        };

        static defaultProps = {
            ...BaseComponent.defaultProps,
            locale: zhCN.Table,
            primaryKey: 'id',
            prefix: 'next-',
        };

        static contextTypes = {
            listHeader: PropTypes.any,
        };

        static childContextTypes = {
            rowSelection: PropTypes.object,
            selectedRowKeys: PropTypes.array,
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                selectedRowKeys:
                    props.rowSelection &&
                    'selectedRowKeys' in props.rowSelection
                        ? props.rowSelection.selectedRowKeys || []
                        : [],
            };
        }

        getChildContext() {
            return {
                rowSelection: this.props.rowSelection,
                selectedRowKeys: this.state.selectedRowKeys,
            };
        }

        componentWillReceiveProps(nextProps) {
            if (
                nextProps.rowSelection &&
                'selectedRowKeys' in nextProps.rowSelection
            ) {
                const selectedRowKeys =
                    nextProps.rowSelection.selectedRowKeys || [];
                this.setState({
                    selectedRowKeys,
                });
            }
        }

        normalizeChildren(children) {
            const { prefix, rowSelection, size } = this.props;
            if (rowSelection) {
                children = Children.map(children, (child, index) =>
                    React.cloneElement(child, {
                        key: index,
                    })
                );

                const attrs =
                    (rowSelection.columnProps && rowSelection.columnProps()) ||
                    {};

                children.unshift(
                    <Col
                        key="selection"
                        title={this.renderSelectionHeader.bind(this)}
                        cell={this.renderSelectionBody.bind(this)}
                        width={size === 'small' ? 34 : 50}
                        className={`${prefix}table-selection ${prefix}table-prerow`}
                        __normalized
                        {...attrs}
                    />
                );
                return children;
            }
            return children;
        }

        renderSelectionHeader = () => {
            const onChange = this.selectAllRow,
                attrs = {},
                {
                    rowSelection,
                    primaryKey,
                    dataSource,
                    entireDataSource,
                    locale,
                } = this.props,
                { selectedRowKeys } = this.state,
                mode = rowSelection.mode ? rowSelection.mode : 'multiple';

            let checked = !!selectedRowKeys.length;
            let indeterminate = false;

            const source = entireDataSource || dataSource;

            this.flatDataSource(source)
                .filter((record, index) => {
                    if (!rowSelection.getProps) {
                        return true;
                    } else {
                        return !(rowSelection.getProps(record, index) || {})
                            .disabled;
                    }
                })
                .map(record => record[primaryKey])
                .forEach(id => {
                    if (selectedRowKeys.indexOf(id) === -1) {
                        checked = false;
                    } else {
                        indeterminate = true;
                    }
                });
            attrs.onClick = makeChain(e => {
                e.stopPropagation();
            }, attrs.onClick);

            const userAttrs =
                (rowSelection.titleProps && rowSelection.titleProps()) || {};

            if (checked) {
                indeterminate = false;
            }
            return [
                mode === 'multiple' ? (
                    <Checkbox
                        key="_total"
                        indeterminate={indeterminate}
                        aria-label={locale.selectAll}
                        checked={checked}
                        onChange={onChange}
                        {...attrs}
                        {...userAttrs}
                    />
                ) : null,
                rowSelection.titleAddons && rowSelection.titleAddons(),
            ];
        };

        renderSelectionBody = (value, index, record) => {
            const { rowSelection, primaryKey } = this.props;
            const { selectedRowKeys } = this.state;
            const mode = rowSelection.mode ? rowSelection.mode : 'multiple';
            const checked = selectedRowKeys.indexOf(record[primaryKey]) > -1;
            const onChange = this.selectOneRow.bind(this, index, record);
            const attrs = rowSelection.getProps
                ? rowSelection.getProps(record, index) || {}
                : {};

            attrs.onClick = makeChain(e => {
                e.stopPropagation();
            }, attrs.onClick);
            return mode === 'multiple' ? (
                <Checkbox checked={checked} onChange={onChange} {...attrs} />
            ) : (
                <Radio checked={checked} onChange={onChange} {...attrs} />
            );
        };

        selectAllRow = (checked, e) => {
            const ret = [...this.state.selectedRowKeys],
                {
                    rowSelection,
                    primaryKey,
                    dataSource,
                    entireDataSource,
                } = this.props,
                { selectedRowKeys } = this.state,
                getProps = rowSelection.getProps;
            let attrs = {},
                records = [];

            const source = entireDataSource ? entireDataSource : dataSource;

            this.flatDataSource(source).forEach((record, index) => {
                const id = record[primaryKey];
                if (getProps) {
                    attrs = getProps(record, index) || {};
                }
                // 反选和全选的时候不要丢弃禁用项的选中状态
                if (
                    checked &&
                    (!attrs.disabled || selectedRowKeys.indexOf(id) > -1)
                ) {
                    ret.push(id);
                    records.push(record);
                } else if (attrs.disabled && selectedRowKeys.indexOf(id) > -1) {
                    ret.push(id);
                    records.push(record);
                } else {
                    const i = ret.indexOf(id);
                    i > -1 && ret.splice(i, 1);
                }
            });

            records = unique(records, primaryKey);
            if (typeof rowSelection.onSelectAll === 'function') {
                rowSelection.onSelectAll(checked, records);
            }
            this.triggerSelection(rowSelection, unique(ret), records);
            e.stopPropagation();
        };

        selectOneRow(index, record, checked, e) {
            let selectedRowKeys = [...this.state.selectedRowKeys],
                i;
            const { primaryKey, rowSelection, dataSource } = this.props,
                mode = rowSelection.mode ? rowSelection.mode : 'multiple',
                id = record[primaryKey];
            if (!id) {
                log.warning(
                    `Can't get value from record using given ${primaryKey} as primaryKey.`
                );
            }
            if (mode === 'multiple') {
                if (checked) {
                    selectedRowKeys.push(id);
                } else {
                    i = selectedRowKeys.indexOf(id);
                    selectedRowKeys.splice(i, 1);
                }
            } else if (checked) {
                selectedRowKeys = [id];
            }
            const records = unique(
                dataSource.filter(
                    item => selectedRowKeys.indexOf(item[primaryKey]) > -1
                ),
                primaryKey
            );
            if (typeof rowSelection.onSelect === 'function') {
                rowSelection.onSelect(checked, record, records);
            }

            this.triggerSelection(rowSelection, selectedRowKeys, records);

            e.stopPropagation();
        }
        triggerSelection(rowSelection, selectedRowKeys, records) {
            if (!('selectedRowKeys' in rowSelection)) {
                this.setState({
                    selectedRowKeys,
                });
            }
            if (typeof rowSelection.onChange === 'function') {
                rowSelection.onChange(selectedRowKeys, records);
            }
        }

        flatDataSource(dataSource) {
            let ret = dataSource;
            const { listHeader } = this.context;

            if (listHeader) {
                ret = [];
                const { hasChildrenSelection, hasSelection } = listHeader;
                dataSource.forEach(item => {
                    const children = item.children;
                    // 如果需要渲染selection才将这条记录插入到dataSource
                    // 或者没有孩子节点
                    if (hasSelection) {
                        ret.push(item);
                    }
                    if (children && hasChildrenSelection) {
                        ret = ret.concat(children);
                    }
                });
            }
            return ret;
        }

        render() {
            /* eslint-disable prefer-const */
            let { rowSelection, components, children, ...others } = this.props;

            if (rowSelection) {
                children = this.normalizeChildren(children);
                components = { ...components };
                components.Row = components.Row || SelectionRow;
            }
            return (
                <BaseComponent {...others} components={components}>
                    {children}
                </BaseComponent>
            );
        }
    }
    statics(SelectionTable, BaseComponent);
    return SelectionTable;
}
