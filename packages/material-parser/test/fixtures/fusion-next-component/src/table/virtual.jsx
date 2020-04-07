import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { dom } from '../util';
import VirtualBody from './virtual/body';
import { statics } from './util';

const noop = () => {};
export default function virtual(BaseComponent) {
    class VirtualTable extends React.Component {
        static VirtualBody = VirtualBody;
        static propTypes = {
            /**
             * 是否开启虚拟滚动
             */
            useVirtual: PropTypes.bool,
            /**
             * 设置行高
             */
            rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
            maxBodyHeight: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            primaryKey: PropTypes.string,
            dataSource: PropTypes.array,
            /**
             * 在内容区域滚动的时候触发的函数
             */
            onBodyScroll: PropTypes.func,
            ...BaseComponent.propTypes,
        };

        static defaultProps = {
            ...BaseComponent.defaultProps,
            primaryKey: 'id',
            rowHeight: noop,
            maxBodyHeight: 200,
            components: {},
            prefix: 'next-',
            onBodyScroll: noop,
        };

        static childContextTypes = {
            onVirtualScroll: PropTypes.func,
            bodyHeight: PropTypes.number,
            innerTop: PropTypes.number,
            getBodyNode: PropTypes.func,
            getTableInstanceForVirtual: PropTypes.func,
            rowSelection: PropTypes.object,
        };

        state = {
            rowHeight: this.props.rowHeight,
            scrollToRow: this.props.scrollToRow,
            height: this.props.maxBodyHeight,
        };

        getChildContext() {
            return {
                onVirtualScroll: this.onScroll,
                bodyHeight: this.computeBodyHeight(),
                innerTop: this.computeInnerTop(),
                getBodyNode: this.getBodyNode,
                getTableInstanceForVirtual: this.getTableInstance,
                rowSelection: this.rowSelection,
            };
        }

        componentWillMount() {
            const { useVirtual, dataSource } = this.props;

            this.hasVirtualData =
                useVirtual && dataSource && dataSource.length > 0;
        }

        componentDidMount() {
            if (this.hasVirtualData) {
                this.lastScrollTop = this.bodyNode.scrollTop;
            }

            this.adjustScrollTop();
            this.adjustSize();
            this.reComputeSize();
        }

        componentWillReceiveProps(nextProps) {
            const { useVirtual, dataSource } = nextProps;

            this.hasVirtualData =
                useVirtual && dataSource && dataSource.length > 0;

            if ('maxBodyHeight' in nextProps) {
                if (this.state.height !== nextProps.maxBodyHeight) {
                    this.setState({
                        height: nextProps.maxBodyHeight,
                    });
                }
            }

            if ('scrollToRow' in nextProps) {
                this.setState({
                    scrollToRow: nextProps.scrollToRow,
                });
            }

            if (this.state.rowHeight && 'rowHeight' in nextProps) {
                const row = this.getRowNode();
                const rowClientHeight = row && row.clientHeight;
                if (
                    rowClientHeight &&
                    rowClientHeight !== this.state.rowHeight
                ) {
                    this.setState({
                        rowHeight: rowClientHeight,
                    });
                }
            }
        }

        componentDidUpdate() {
            this.adjustScrollTop();
            this.adjustSize();
            this.reComputeSize();
        }

        reComputeSize() {
            const { rowHeight } = this.state;
            if (typeof rowHeight === 'function' && this.hasVirtualData) {
                const row = this.getRowNode();
                const rowClientHeight = row && row.clientHeight;
                if (rowClientHeight !== this.state.rowHeight) {
                    this.setState({
                        rowHeight: rowClientHeight,
                    });
                }
            }
        }

        computeBodyHeight() {
            const { rowHeight } = this.state;
            const { dataSource } = this.props;
            if (typeof rowHeight === 'function') {
                return 0;
            }
            return dataSource.length * rowHeight;
        }

        computeInnerTop() {
            const { rowHeight } = this.state;
            if (typeof rowHeight === 'function') {
                return 0;
            }

            return this.start * rowHeight;
        }

        getVisibleRange(ExpectStart) {
            const { height, rowHeight } = this.state;
            const len = this.props.dataSource.length;

            let end,
                visibleCount = 0;
            let start = 0;
            if (typeof rowHeight === 'function') {
                // try get cell height;
                end = 1;
            } else {
                visibleCount = parseInt(dom.getPixels(height) / rowHeight, 10);

                if ('number' === typeof ExpectStart) {
                    start = ExpectStart < len ? ExpectStart : 0;
                }

                end = Math.min(+start + 1 + visibleCount + 10, len);
            }
            this.end = end;
            this.visibleCount = visibleCount;
            return {
                start,
                end,
            };
        }

        adjustScrollTop() {
            if (this.hasVirtualData) {
                this.bodyNode.scrollTop =
                    (this.lastScrollTop % this.state.rowHeight) +
                    this.state.rowHeight * this.state.scrollToRow;
            }
        }

        adjustSize() {
            if (this.hasVirtualData) {
                const body = this.bodyNode;
                const virtualScrollNode = body.querySelector('div');
                const { clientHeight, clientWidth } = body;

                const tableInc = this.tableInc;
                const tableNode = findDOMNode(tableInc);
                const { prefix } = this.props;
                const headerNode = tableNode.querySelector(
                    `.${prefix}table-header table`
                );
                const headerClientWidth = headerNode && headerNode.clientWidth;

                if (clientWidth < headerClientWidth) {
                    dom.setStyle(
                        virtualScrollNode,
                        'min-width',
                        headerClientWidth
                    );
                    const leftNode = this.bodyLeftNode;
                    const rightNode = this.bodyRightNode;
                    leftNode &&
                        dom.setStyle(leftNode, 'max-height', clientHeight);
                    rightNode &&
                        dom.setStyle(rightNode, 'max-height', clientHeight);
                    this.hasScrollbar = true;
                } else {
                    dom.setStyle(virtualScrollNode, 'min-width', 'auto');
                    this.hasScrollbar = false;
                }
            }
        }

        onScroll = () => {
            // 避免横向滚动带来的性能问题
            const scrollTop = this.bodyNode.scrollTop;
            if (scrollTop === this.lastScrollTop) {
                return;
            }
            const start = this.computeScrollToRow(scrollTop);
            if (!('scrollToRow' in this.props)) {
                this.setState({
                    scrollToRow: start,
                });
            }
            this.props.onBodyScroll(start);
            this.lastScrollTop = scrollTop;
        };

        computeScrollToRow(offset) {
            const { rowHeight } = this.state;
            const start = parseInt(offset / rowHeight);
            this.start = start;
            return start;
        }

        getBodyNode = (node, lockType) => {
            lockType = lockType
                ? lockType.charAt(0).toUpperCase() + lockType.substr(1)
                : '';
            this[`body${lockType}Node`] = node;
        };

        getTableInstance = (type, instance) => {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            this[`table${type}Inc`] = instance;
        };

        getRowNode() {
            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of this.tableInc when dataSource Changed
                // use try catch for temporary
                return findDOMNode(this.tableInc.getRowRef(0));
            } catch (error) {
                return null;
            }
        }

        render() {
            /* eslint-disable no-unused-vars, prefer-const */
            let {
                useVirtual,
                components,
                dataSource,
                fixedHeader,
                rowHeight,
                scrollToRow,
                onBodyScroll,
                ...others
            } = this.props;

            const entireDataSource = dataSource;
            let newDataSource = dataSource;

            this.rowSelection = this.props.rowSelection;
            if (this.hasVirtualData) {
                newDataSource = [];
                components = { ...components };
                const { start, end } = this.getVisibleRange(
                    this.state.scrollToRow
                );
                dataSource.forEach((current, index, record) => {
                    if (index >= start && index < end) {
                        current.__rowIndex = index;
                        newDataSource.push(current);
                    }
                });

                if (!components.Body) {
                    components.Body = VirtualBody;
                }
                fixedHeader = true;
            }

            return (
                <BaseComponent
                    {...others}
                    dataSource={newDataSource}
                    entireDataSource={entireDataSource}
                    components={components}
                    fixedHeader={fixedHeader}
                />
            );
        }
    }
    statics(VirtualTable, BaseComponent);
    return VirtualTable;
}
