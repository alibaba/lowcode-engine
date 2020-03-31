import React, { Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shallowElementEquals from 'shallow-element-equals';
import { dom, log, obj, events, env } from '../util';
import LockRow from './lock/row';
import LockBody from './lock/body';
import LockHeader from './lock/header';
import LockWrapper from './fixed/wrapper';
import { statics } from './util';

const { ieVersion } = env;
export default function lock(BaseComponent) {
    /** Table */
    class LockTable extends React.Component {
        static LockRow = LockRow;
        static LockBody = LockBody;
        static LockHeader = LockHeader;
        static propTypes = {
            scrollToCol: PropTypes.number,
            /**
             * 指定滚动到某一行，仅在`useVirtual`的时候生效
             */
            scrollToRow: PropTypes.number,
            ...BaseComponent.propTypes,
        };

        static defaultProps = {
            ...BaseComponent.defaultProps,
        };

        static childContextTypes = {
            getTableInstance: PropTypes.func,
            getLockNode: PropTypes.func,
            onLockBodyScroll: PropTypes.func,
            onRowMouseEnter: PropTypes.func,
            onRowMouseLeave: PropTypes.func,
        };

        constructor(props, context) {
            super(props, context);
            this.lockLeftChildren = [];
            this.lockRightChildren = [];
        }

        getChildContext() {
            return {
                getTableInstance: this.getTableInstance,
                getLockNode: this.getNode,
                onLockBodyScroll: this.onLockBodyScroll,
                onRowMouseEnter: this.onRowMouseEnter,
                onRowMouseLeave: this.onRowMouseLeave,
            };
        }

        componentDidMount() {
            events.on(window, 'resize', this.adjustSize);

            this.scroll();
            this.adjustSize();
        }

        shouldComponentUpdate(nextProps, nextState, nextContext) {
            if (nextProps.pure) {
                const isEqual = shallowElementEquals(nextProps, this.props);
                return !(
                    isEqual && obj.shallowEqual(nextContext, this.context)
                );
            }

            return true;
        }

        componentWillUpdate() {
            this._isLock = false;
        }

        componentDidUpdate() {
            this.adjustSize();
        }

        componentWillUnmount() {
            events.off(window, 'resize', this.adjustSize);
        }

        normalizeChildrenState(props) {
            let { children } = props;
            children = this.normalizeChildren(children);
            const splitChildren = this.splitFromNormalizeChildren(children);
            const { lockLeftChildren, lockRightChildren } = splitChildren;
            return {
                lockLeftChildren,
                lockRightChildren,
                children: this.mergeFromSplitLockChildren(splitChildren),
            };
        }

        // 将React结构化数据提取props转换成数组
        normalizeChildren(children) {
            let isLock = false;
            const getChildren = children => {
                const ret = [];
                Children.forEach(children, child => {
                    if (child) {
                        const props = { ...child.props };
                        if ([true, 'left', 'right'].indexOf(props.lock) > -1) {
                            isLock = true;
                            if (!('width' in props)) {
                                log.warning(
                                    `Should config width for lock column named [ ${
                                        props.dataIndex
                                    } ].`
                                );
                            }
                        }
                        ret.push(props);
                        if (child.props.children) {
                            props.children = getChildren(child.props.children);
                        }
                    }
                });
                return ret;
            };
            const ret = getChildren(children);
            ret.forEach(child => {
                // 为自定义的列特殊处理
                if (child.__normalized && isLock) {
                    // users can set lock type for column selection now, so its origin lock type comes first
                    child.lock = child.lock || 'left';
                    delete child.__normalized;
                }
            });
            this._isLock = isLock;
            return ret;
        }

        //从数组中分离出lock的列和正常的列
        splitFromNormalizeChildren(children) {
            const originChildren = deepCopy(children);
            const lockLeftChildren = deepCopy(children);
            const lockRightChildren = deepCopy(children);
            const loop = (lockChildren, condition) => {
                const ret = [];
                lockChildren.forEach(child => {
                    if (child.children) {
                        const res = loop(child.children, condition);
                        if (!res.length) {
                            ret.push(child);
                        }
                    } else {
                        const order = condition(child);
                        if (!order) {
                            ret.push(child);
                        }
                    }
                });
                ret.forEach(res => {
                    const index = lockChildren.indexOf(res);
                    lockChildren.splice(index, 1);
                });
                return lockChildren;
            };
            loop(lockLeftChildren, child => {
                if (child.lock === true || child.lock === 'left') {
                    return 'left';
                }
            });
            loop(lockRightChildren, child => {
                if (child.lock === 'right') {
                    return 'right';
                }
            });
            loop(originChildren, child => {
                return (
                    child.lock !== true &&
                    child.lock !== 'left' &&
                    child.lock !== 'right'
                );
            });
            return {
                lockLeftChildren,
                lockRightChildren,
                originChildren,
            };
        }

        //将左侧的锁列树和中间的普通树及右侧的锁列树进行合并
        mergeFromSplitLockChildren(splitChildren) {
            const { lockLeftChildren, lockRightChildren } = splitChildren;
            let { originChildren } = splitChildren;
            Array.prototype.unshift.apply(originChildren, lockLeftChildren);
            originChildren = originChildren.concat(lockRightChildren);
            return originChildren;
        }

        getTableInstance = (type, instance) => {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            this[`table${type}Inc`] = instance;
        };

        getNode = (type, node, lockType) => {
            lockType = lockType
                ? lockType.charAt(0).toUpperCase() + lockType.substr(1)
                : '';
            this[`${type}${lockType}Node`] = node;
            if (type === 'header' && !this.innerHeaderNode && !lockType) {
                this.innerHeaderNode = this.headerNode.querySelector('div');
            }
        };

        onRowMouseEnter = (record, index) => {
            if (this.isLock()) {
                const row = this.getRowNode(index);
                const leftRow = this.getRowNode(index, 'left');
                const rightRow = this.getRowNode(index, 'right');
                [row, leftRow, rightRow].forEach(row => {
                    row && dom.addClass(row, 'hovered');
                });
            }
        };

        onRowMouseLeave = (record, index) => {
            if (this.isLock()) {
                const row = this.getRowNode(index);
                const leftRow = this.getRowNode(index, 'left');
                const rightRow = this.getRowNode(index, 'right');
                [row, leftRow, rightRow].forEach(row => {
                    row && dom.removeClass(row, 'hovered');
                });
            }
        };

        scroll() {
            const { scrollToCol = 0, scrollToRow = 0 } = this.props;
            if (!scrollToCol && !scrollToRow) {
                return;
            }
            const colCellNode = this.getCellNode(0, scrollToCol);
            const rowCellNode = this.getCellNode(scrollToRow, 0);
            const bodyNodeOffset = this.bodyNode.getBoundingClientRect();
            if (colCellNode) {
                const cellNodeoffset = colCellNode.getBoundingClientRect();
                const scrollLeft = cellNodeoffset.left - bodyNodeOffset.left;
                this.bodyNode.scrollLeft = scrollLeft;
            }
            if (rowCellNode) {
                const cellNodeoffset = rowCellNode.getBoundingClientRect();
                const scrollTop = cellNodeoffset.top - bodyNodeOffset.top;
                this.bodyNode.scrollTop = scrollTop;
            }
        }

        onLockBodyScrollTop = event => {
            // set scroll top for lock columns & main body
            const target = event.target;
            if (event.currentTarget !== target) {
                return;
            }
            const distScrollTop = target.scrollTop;

            if (this.isLock() && distScrollTop !== this.lastScrollTop) {
                const lockRightBody = this.bodyRightNode,
                    lockLeftBody = this.bodyLeftNode,
                    bodyNode = this.bodyNode;

                const arr = [lockLeftBody, lockRightBody, bodyNode];

                arr.forEach(node => {
                    if (node && node.scrollTop !== distScrollTop) {
                        node.scrollTop = distScrollTop;
                    }
                });

                this.lastScrollTop = distScrollTop;
            }
        };

        onLockBodyScrollLeft = () => {
            // add shadow class for lock columns
            if (this.isLock()) {
                const { rtl } = this.props;
                const lockRightTable = rtl
                        ? this.getWrapperNode('left')
                        : this.getWrapperNode('right'),
                    lockLeftTable = rtl
                        ? this.getWrapperNode('right')
                        : this.getWrapperNode('left'),
                    shadowClassName = 'shadow';

                const x = this.bodyNode.scrollLeft;

                if (x === 0) {
                    lockLeftTable &&
                        dom.removeClass(lockLeftTable, shadowClassName);
                    lockRightTable &&
                        dom.addClass(lockRightTable, shadowClassName);
                } else if (
                    x ===
                    this.bodyNode.scrollWidth - this.bodyNode.clientWidth
                ) {
                    lockLeftTable &&
                        dom.addClass(lockLeftTable, shadowClassName);
                    lockRightTable &&
                        dom.removeClass(lockRightTable, shadowClassName);
                } else {
                    lockLeftTable &&
                        dom.addClass(lockLeftTable, shadowClassName);
                    lockRightTable &&
                        dom.addClass(lockRightTable, shadowClassName);
                }
            }
        };

        onLockBodyScroll = event => {
            this.onLockBodyScrollTop(event);
            this.onLockBodyScrollLeft();
        };

        // Table处理过后真实的lock状态
        isLock() {
            return (
                this.lockLeftChildren.length || this.lockRightChildren.length
            );
        }

        // 用户设置的lock状态
        isOriginLock() {
            return this._isLock;
        }

        adjustSize = () => {
            if (!this.adjustIfTableNotNeedLock()) {
                this.adjustHeaderSize();
                this.adjustBodySize();
                this.adjustRowHeight();
                this.onLockBodyScrollLeft();
            }
        };

        removeLockTable() {
            const lockLeftLen = this.lockLeftChildren.length;
            const lockRightLen = this.lockRightChildren.length;

            if (lockLeftLen) {
                this._notNeedAdjustLockLeft = true;
            }
            if (lockRightLen) {
                this._notNeedAdjustLockRight = true;
            }
            if (lockRightLen || lockLeftLen) {
                this.forceUpdate();
                return true;
            }
        }

        adjustIfTableNotNeedLock() {
            if (this.isOriginLock()) {
                const widthObj = this.tableInc.flatChildren
                    .map((item, index) => {
                        const cell = this.getCellNode(0, index) || {};
                        const headerCell =
                            this.getHeaderCellNode(0, index) || {};

                        return {
                            cellWidths: cell.clientWidth || 0,
                            headerWidths: headerCell.clientWidth || 0,
                        };
                    })
                    .reduce(
                        (a, b) => {
                            return {
                                cellWidths: a.cellWidths + b.cellWidths,
                                headerWidths: a.headerWidths + b.headerWidths,
                            };
                        },
                        {
                            cellWidths: 0,
                            headerWidths: 0,
                        }
                    );

                let node, width;

                try {
                    node = findDOMNode(this);
                    width = node.clientWidth;
                } catch (err) {
                    node = null;
                    width = 0;
                }

                // if the table doesn't exist, there is no need to adjust
                if (width === 0) {
                    return true;
                }

                const configWidths =
                    widthObj.cellWidths || widthObj.headerWidths;

                if (configWidths <= width && configWidths > 0) {
                    this.removeLockTable();
                } else if (
                    this._notNeedAdjustLockLeft ||
                    this._notNeedAdjustLockRight
                ) {
                    this._notNeedAdjustLockLeft = this._notNeedAdjustLockRight = false;
                    this.forceUpdate();
                } else {
                    this._notNeedAdjustLockLeft = this._notNeedAdjustLockRight = false;
                    return false;
                }
            }

            return false;
        }

        adjustBodySize() {
            const { rtl, hasHeader } = this.props;
            const header = this.headerNode;
            const paddingName = rtl ? 'paddingLeft' : 'paddingRight';
            const marginName = rtl ? 'marginLeft' : 'marginRight';
            const scrollBarSize = +dom.scrollbar().width || 0;
            const style = {
                [paddingName]: scrollBarSize,
                [marginName]: scrollBarSize,
            };
            const body = this.bodyNode,
                hasVerScroll = body && body.scrollHeight > body.clientHeight;

            if (this.isLock()) {
                const lockLeftBody = this.bodyLeftNode,
                    lockRightBody = this.bodyRightNode,
                    lockRightBodyWrapper = this.getWrapperNode('right'),
                    bodyHeight = body.offsetHeight,
                    width = hasVerScroll ? scrollBarSize : 0,
                    lockBodyHeight = bodyHeight - scrollBarSize;

                if (!hasVerScroll) {
                    style[paddingName] = 0;
                    style[marginName] = 0;
                }
                if (+scrollBarSize) {
                    style.marginBottom = -scrollBarSize;
                    style.paddingBottom = scrollBarSize;
                } else {
                    style.marginBottom = -20;
                    style.paddingBottom = 20;
                }

                const lockStyle = {
                    'max-height': lockBodyHeight,
                };
                if (!hasHeader && !+scrollBarSize) {
                    lockStyle[marginName] = 0;
                }
                if (+scrollBarSize) {
                    lockStyle[marginName] = -scrollBarSize;
                }
                lockLeftBody && dom.setStyle(lockLeftBody, lockStyle);
                lockRightBody && dom.setStyle(lockRightBody, lockStyle);
                lockRightBodyWrapper &&
                    +scrollBarSize &&
                    dom.setStyle(
                        lockRightBodyWrapper,
                        rtl ? 'left' : 'right',
                        `${width}px`
                    );
            } else {
                style.marginBottom = -scrollBarSize;
                style.paddingBottom = scrollBarSize;
                style[marginName] = 0;
                if (!hasVerScroll) {
                    style[paddingName] = 0;
                }
            }

            header && dom.setStyle(header, style);
        }

        adjustHeaderSize() {
            if (this.isLock()) {
                this.tableInc.groupChildren.forEach((child, index) => {
                    const lastIndex =
                        this.tableInc.groupChildren[index].length - 1;
                    const headerRightRow = this.getHeaderCellNode(
                            index,
                            lastIndex
                        ),
                        headerLeftRow = this.getHeaderCellNode(index, 0),
                        headerRightLockRow = this.getHeaderCellNode(
                            index,
                            0,
                            'right'
                        ),
                        headerLeftLockRow = this.getHeaderCellNode(
                            index,
                            0,
                            'left'
                        );

                    if (headerRightRow && headerRightLockRow) {
                        const maxRightRowHeight = headerRightRow.offsetHeight;

                        dom.setStyle(
                            headerRightLockRow,
                            'height',
                            maxRightRowHeight
                        );

                        setTimeout(() => {
                            const affixRef = this.tableRightInc.affixRef;
                            // if rendered then update postion of affix
                            return (
                                affixRef &&
                                affixRef.getInstance() &&
                                affixRef.getInstance().updatePosition()
                            );
                        });
                    }

                    if (headerLeftRow && headerLeftLockRow) {
                        const maxLeftRowHeight = headerLeftRow.offsetHeight;

                        dom.setStyle(
                            headerLeftLockRow,
                            'height',
                            maxLeftRowHeight
                        );

                        setTimeout(() => {
                            const affixRef = this.tableLeftInc.affixRef;
                            // if rendered then update postion of affix
                            return (
                                affixRef &&
                                affixRef.getInstance() &&
                                affixRef.getInstance().updatePosition()
                            );
                        });
                    }
                });
            }
        }

        adjustRowHeight() {
            if (this.isLock()) {
                this.tableInc.props.dataSource.forEach((item, index) => {
                    // record may be a string
                    const rowIndex =
                        typeof item === 'object' && '__rowIndex' in item
                            ? item.__rowIndex
                            : index;

                    // 同步左侧的锁列
                    this.setRowHeight(rowIndex, 'left');
                    // 同步右侧的锁列
                    this.setRowHeight(rowIndex, 'right');
                });
            }
        }

        setRowHeight(rowIndex, dir) {
            const lockRow = this.getRowNode(rowIndex, dir),
                row = this.getRowNode(rowIndex),
                rowHeight =
                    (ieVersion
                        ? row && row.offsetHeight
                        : row && parseFloat(getComputedStyle(row).height)) ||
                    'auto',
                lockHeight =
                    (ieVersion
                        ? lockRow && lockRow.offsetHeight
                        : lockRow &&
                          parseFloat(getComputedStyle(lockRow).height)) ||
                    'auto';

            if (lockRow && rowHeight !== lockHeight) {
                dom.setStyle(lockRow, 'height', rowHeight);
            }
        }

        getWrapperNode(type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of table when dataSource Changed
                // use try catch for temporary
                return findDOMNode(this.refs[`lock${type}`]);
            } catch (error) {
                return null;
            }
        }

        // remove this in next major version, keep this for temperary incase of using it
        // getFirstNormalCellNode(index) {
        //     let i = 0;
        //     let row;
        //     do {
        //         row = this.getCellNode(index, i);
        //         i++;
        //     } while (
        //         (!row || (row && row.rowSpan && row.rowSpan > 1)) &&
        //         this.tableInc.flatChildren.length > i
        //     );

        //     return row;
        // }

        getRowNode(index, type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            const table = this[`table${type}Inc`];

            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of table when dataSource Changed
                // use try catch for temporary
                return findDOMNode(table.getRowRef(index));
            } catch (error) {
                return null;
            }
        }

        getHeaderCellNode(index, i, type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            const table = this[`table${type}Inc`];

            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of table when dataSource Changed
                // use try catch for temporary
                return findDOMNode(table.getHeaderCellRef(index, i));
            } catch (error) {
                return null;
            }
        }

        getCellNode(index, i, type) {
            type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
            const table = this[`table${type}Inc`];

            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of table when dataSource Changed
                // use try catch for temporary
                return findDOMNode(table.getCellRef(index, i));
            } catch (error) {
                return null;
            }
        }

        getFlatenChildrenLength = (children = []) => {
            const loop = arr => {
                const newArray = [];
                arr.forEach(child => {
                    if (child.children) {
                        newArray.push(...loop(child.children));
                    } else {
                        newArray.push(child);
                    }
                });
                return newArray;
            };

            return loop(children).length;
        };

        render() {
            /* eslint-disable no-unused-vars, prefer-const */
            let {
                children,
                prefix,
                components,
                className,
                dataSource,
                ...others
            } = this.props;
            let {
                lockLeftChildren,
                lockRightChildren,
                children: normalizedChildren,
            } = this.normalizeChildrenState(this.props);

            const leftLen = this.getFlatenChildrenLength(lockLeftChildren);
            const rightLen = this.getFlatenChildrenLength(lockRightChildren);
            const originLen = this.getFlatenChildrenLength(normalizedChildren);

            const lengths = {
                left: leftLen,
                right: rightLen,
                origin: originLen,
            };
            if (this._notNeedAdjustLockLeft) {
                lockLeftChildren = [];
            }
            if (this._notNeedAdjustLockRight) {
                lockRightChildren = [];
            }
            this.lockLeftChildren = lockLeftChildren;
            this.lockRightChildren = lockRightChildren;

            if (this.isOriginLock()) {
                components = { ...components };
                components.Body = components.Body || LockBody;
                components.Header = components.Header || LockHeader;
                components.Wrapper = components.Wrapper || LockWrapper;
                components.Row = components.Row || LockRow;
                className = classnames({
                    [`${prefix}table-lock`]: true,
                    [`${prefix}table-wrap-empty`]: !dataSource.length,
                    [className]: className,
                });
                const content = [
                    <BaseComponent
                        {...others}
                        dataSource={dataSource}
                        key="lock-left"
                        columns={lockLeftChildren}
                        className={`${prefix}table-lock-left`}
                        lengths={lengths}
                        prefix={prefix}
                        lockType="left"
                        components={components}
                        ref="lockLeft"
                        loading={false}
                        aria-hidden
                    />,
                    <BaseComponent
                        {...others}
                        dataSource={dataSource}
                        key="lock-right"
                        columns={lockRightChildren}
                        className={`${prefix}table-lock-right`}
                        lengths={lengths}
                        prefix={prefix}
                        lockType="right"
                        components={components}
                        ref="lockRight"
                        loading={false}
                        aria-hidden
                    />,
                ];
                return (
                    <BaseComponent
                        {...others}
                        dataSource={dataSource}
                        columns={normalizedChildren}
                        prefix={prefix}
                        lengths={lengths}
                        wrapperContent={content}
                        components={components}
                        className={className}
                    />
                );
            }
            return <BaseComponent {...this.props} />;
        }
    }
    statics(LockTable, BaseComponent);
    return LockTable;
}

function deepCopy(arr) {
    let copy = arr => {
        return arr.map(item => {
            const newItem = { ...item };
            if (item.children) {
                item.children = copy(item.children);
            }
            return newItem;
        });
    };
    return copy(arr);
}
