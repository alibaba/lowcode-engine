import React from 'react';
import PropTypes from 'prop-types';
import RowComponent from './tree/row';
import CellComponent from './tree/cell';
import { statics } from './util';

const noop = () => {};

export default function tree(BaseComponent) {
    class TreeTable extends React.Component {
        static TreeRow = RowComponent;
        static TreeCell = CellComponent;
        static propTypes = {
            /**
             * 默认情况下展开的树形表格，传入了此属性代表tree的展开为受控操作
             */
            openRowKeys: PropTypes.array,
            /**
             * 点击tree展开或者关闭的时候触发的事件
             * @param {Array} openRowKeys tree模式下展开的key
             * @param {String} currentRowKey 当前点击行的key
             * @param {Boolean} opened 当前点击是展开还是收起
             * @param {Object} currentRecord 当前点击行的记录
             */
            onRowOpen: PropTypes.func,
            /**
             * dataSource当中数据的主键，如果给定的数据源中的属性不包含该主键，会造成选择状态全部选中
             */
            primaryKey: PropTypes.string,
            /**
             * 在tree模式下的缩进尺寸， 仅在isTree为true时候有效
             */
            indent: PropTypes.number,
            /**
             * 开启Table的tree模式, 接收的数据格式中包含children则渲染成tree table
             */
            isTree: PropTypes.bool,
            locale: PropTypes.object,
            ...BaseComponent.propTypes,
        };

        static defaultProps = {
            ...BaseComponent.defaultProps,
            primaryKey: 'id',
            onRowOpen: noop,
            components: {},
            indent: 12,
        };

        static childContextTypes = {
            openTreeRowKeys: PropTypes.array,
            indent: PropTypes.number,
            treeStatus: PropTypes.array,
            onTreeNodeClick: PropTypes.func,
            isTree: PropTypes.bool,
        };

        constructor(props, context) {
            super(props, context);
            this.state = {
                openRowKeys: props.openRowKeys || [],
            };
        }

        getChildContext() {
            return {
                openTreeRowKeys: this.state.openRowKeys,
                indent: this.props.indent,
                treeStatus: this.getTreeNodeStatus(this.ds),
                onTreeNodeClick: this.onTreeNodeClick,
                isTree: this.props.isTree,
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

        normalizeDataSource(dataSource) {
            const ret = [],
                loop = function(dataSource, level) {
                    dataSource.forEach(item => {
                        item.__level = level;
                        ret.push(item);
                        if (item.children) {
                            loop(item.children, level + 1);
                        }
                    });
                };
            loop(dataSource, 0);
            this.ds = ret;
            return ret;
        }

        getTreeNodeStatus(dataSource = []) {
            const { openRowKeys } = this.state,
                { primaryKey } = this.props,
                ret = [];

            openRowKeys.forEach(openKey => {
                dataSource.forEach(item => {
                    if (item[primaryKey] === openKey) {
                        if (item.children) {
                            item.children.forEach(child => {
                                ret.push(child[primaryKey]);
                            });
                        }
                    }
                });
            });
            return ret;
        }

        onTreeNodeClick = record => {
            const { primaryKey } = this.props,
                id = record[primaryKey],
                dataSource = this.ds,
                openRowKeys = [...this.state.openRowKeys],
                index = openRowKeys.indexOf(id),
                getChildrenKeyById = function(id) {
                    const ret = [id];
                    const loop = data => {
                        data.forEach(item => {
                            ret.push(item[primaryKey]);
                            if (item.children) {
                                loop(item.children);
                            }
                        });
                    };
                    dataSource.forEach(item => {
                        if (item[primaryKey] === id) {
                            if (item.children) {
                                loop(item.children);
                            }
                        }
                    });
                    return ret;
                };

            if (index > -1) {
                // 不仅要删除当前的openRowKey，还需要删除关联子节点的openRowKey
                const ids = getChildrenKeyById(id);
                ids.forEach(id => {
                    const i = openRowKeys.indexOf(id);
                    if (i > -1) {
                        openRowKeys.splice(i, 1);
                    }
                });
            } else {
                openRowKeys.push(id);
            }

            if (!('openRowKeys' in this.props)) {
                this.setState({
                    openRowKeys,
                });
            }
            this.props.onRowOpen(openRowKeys, id, index === -1, record);
        };

        render() {
            /* eslint-disable no-unused-vars, prefer-const */
            let {
                components,
                isTree,
                dataSource,
                indent,
                ...others
            } = this.props;

            if (isTree) {
                components = { ...components };
                if (!components.Row) {
                    components.Row = RowComponent;
                }
                if (!components.Cell) {
                    components.Cell = CellComponent;
                }

                dataSource = this.normalizeDataSource(dataSource);
            }
            return (
                <BaseComponent
                    {...others}
                    dataSource={dataSource}
                    components={components}
                />
            );
        }
    }
    statics(TreeTable, BaseComponent);
    return TreeTable;
}
