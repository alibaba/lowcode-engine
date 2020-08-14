import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { dom } from '../util';
import VirtualBody from './virtual/body';
import { statics } from './util';

var noop = function noop() {};
export default function virtual(BaseComponent) {
    var _class, _temp2;

    var VirtualTable = (_temp2 = _class = function (_React$Component) {
        _inherits(VirtualTable, _React$Component);

        function VirtualTable() {
            var _temp, _this, _ret;

            _classCallCheck(this, VirtualTable);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
                rowHeight: _this.props.rowHeight,
                scrollToRow: _this.props.scrollToRow,
                height: _this.props.maxBodyHeight
            }, _this.onScroll = function () {
                // 避免横向滚动带来的性能问题
                var scrollTop = _this.bodyNode.scrollTop;
                if (scrollTop === _this.lastScrollTop) {
                    return;
                }
                var start = _this.computeScrollToRow(scrollTop);
                if (!('scrollToRow' in _this.props)) {
                    _this.setState({
                        scrollToRow: start
                    });
                }
                _this.props.onBodyScroll(start);
                _this.lastScrollTop = scrollTop;
            }, _this.getBodyNode = function (node, lockType) {
                lockType = lockType ? lockType.charAt(0).toUpperCase() + lockType.substr(1) : '';
                _this['body' + lockType + 'Node'] = node;
            }, _this.getTableInstance = function (type, instance) {
                type = type ? type.charAt(0).toUpperCase() + type.substr(1) : '';
                _this['table' + type + 'Inc'] = instance;
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        VirtualTable.prototype.getChildContext = function getChildContext() {
            return {
                onVirtualScroll: this.onScroll,
                bodyHeight: this.computeBodyHeight(),
                innerTop: this.computeInnerTop(),
                getBodyNode: this.getBodyNode,
                getTableInstanceForVirtual: this.getTableInstance,
                rowSelection: this.rowSelection
            };
        };

        VirtualTable.prototype.componentWillMount = function componentWillMount() {
            var _props = this.props,
                useVirtual = _props.useVirtual,
                dataSource = _props.dataSource;


            this.hasVirtualData = useVirtual && dataSource && dataSource.length > 0;
        };

        VirtualTable.prototype.componentDidMount = function componentDidMount() {
            if (this.hasVirtualData) {
                this.lastScrollTop = this.bodyNode.scrollTop;
            }

            this.adjustScrollTop();
            this.adjustSize();
            this.reComputeSize();
        };

        VirtualTable.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
            var useVirtual = nextProps.useVirtual,
                dataSource = nextProps.dataSource;


            this.hasVirtualData = useVirtual && dataSource && dataSource.length > 0;

            if ('maxBodyHeight' in nextProps) {
                if (this.state.height !== nextProps.maxBodyHeight) {
                    this.setState({
                        height: nextProps.maxBodyHeight
                    });
                }
            }

            if ('scrollToRow' in nextProps) {
                this.setState({
                    scrollToRow: nextProps.scrollToRow
                });
            }

            if (this.state.rowHeight && 'rowHeight' in nextProps) {
                var row = this.getRowNode();
                var rowClientHeight = row && row.clientHeight;
                if (rowClientHeight && rowClientHeight !== this.state.rowHeight) {
                    this.setState({
                        rowHeight: rowClientHeight
                    });
                }
            }
        };

        VirtualTable.prototype.componentDidUpdate = function componentDidUpdate() {
            this.adjustScrollTop();
            this.adjustSize();
            this.reComputeSize();
        };

        VirtualTable.prototype.reComputeSize = function reComputeSize() {
            var rowHeight = this.state.rowHeight;

            if (typeof rowHeight === 'function' && this.hasVirtualData) {
                var row = this.getRowNode();
                var rowClientHeight = row && row.clientHeight;
                if (rowClientHeight !== this.state.rowHeight) {
                    this.setState({
                        rowHeight: rowClientHeight
                    });
                }
            }
        };

        VirtualTable.prototype.computeBodyHeight = function computeBodyHeight() {
            var rowHeight = this.state.rowHeight;
            var dataSource = this.props.dataSource;

            if (typeof rowHeight === 'function') {
                return 0;
            }
            return dataSource.length * rowHeight;
        };

        VirtualTable.prototype.computeInnerTop = function computeInnerTop() {
            var rowHeight = this.state.rowHeight;

            if (typeof rowHeight === 'function') {
                return 0;
            }

            return this.start * rowHeight;
        };

        VirtualTable.prototype.getVisibleRange = function getVisibleRange(ExpectStart) {
            var _state = this.state,
                height = _state.height,
                rowHeight = _state.rowHeight;

            var len = this.props.dataSource.length;

            var end = void 0,
                visibleCount = 0;
            var start = 0;
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
                start: start,
                end: end
            };
        };

        VirtualTable.prototype.adjustScrollTop = function adjustScrollTop() {
            if (this.hasVirtualData) {
                this.bodyNode.scrollTop = this.lastScrollTop % this.state.rowHeight + this.state.rowHeight * this.state.scrollToRow;
            }
        };

        VirtualTable.prototype.adjustSize = function adjustSize() {
            if (this.hasVirtualData) {
                var body = this.bodyNode;
                var virtualScrollNode = body.querySelector('div');
                var clientHeight = body.clientHeight,
                    clientWidth = body.clientWidth;


                var tableInc = this.tableInc;
                var tableNode = findDOMNode(tableInc);
                var prefix = this.props.prefix;

                var headerNode = tableNode.querySelector('.' + prefix + 'table-header table');
                var headerClientWidth = headerNode && headerNode.clientWidth;

                if (clientWidth < headerClientWidth) {
                    dom.setStyle(virtualScrollNode, 'min-width', headerClientWidth);
                    var leftNode = this.bodyLeftNode;
                    var rightNode = this.bodyRightNode;
                    leftNode && dom.setStyle(leftNode, 'max-height', clientHeight);
                    rightNode && dom.setStyle(rightNode, 'max-height', clientHeight);
                    this.hasScrollbar = true;
                } else {
                    dom.setStyle(virtualScrollNode, 'min-width', 'auto');
                    this.hasScrollbar = false;
                }
            }
        };

        VirtualTable.prototype.computeScrollToRow = function computeScrollToRow(offset) {
            var rowHeight = this.state.rowHeight;

            var start = parseInt(offset / rowHeight);
            this.start = start;
            return start;
        };

        VirtualTable.prototype.getRowNode = function getRowNode() {
            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of this.tableInc when dataSource Changed
                // use try catch for temporary
                return findDOMNode(this.tableInc.getRowRef(0));
            } catch (error) {
                return null;
            }
        };

        VirtualTable.prototype.render = function render() {
            /* eslint-disable no-unused-vars, prefer-const */
            var _props2 = this.props,
                useVirtual = _props2.useVirtual,
                components = _props2.components,
                dataSource = _props2.dataSource,
                fixedHeader = _props2.fixedHeader,
                rowHeight = _props2.rowHeight,
                scrollToRow = _props2.scrollToRow,
                onBodyScroll = _props2.onBodyScroll,
                others = _objectWithoutProperties(_props2, ['useVirtual', 'components', 'dataSource', 'fixedHeader', 'rowHeight', 'scrollToRow', 'onBodyScroll']);

            var entireDataSource = dataSource;
            var newDataSource = dataSource;

            this.rowSelection = this.props.rowSelection;
            if (this.hasVirtualData) {
                newDataSource = [];
                components = _extends({}, components);

                var _getVisibleRange = this.getVisibleRange(this.state.scrollToRow),
                    start = _getVisibleRange.start,
                    end = _getVisibleRange.end;

                dataSource.forEach(function (current, index, record) {
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

            return React.createElement(BaseComponent, _extends({}, others, {
                dataSource: newDataSource,
                entireDataSource: entireDataSource,
                components: components,
                fixedHeader: fixedHeader
            }));
        };

        return VirtualTable;
    }(React.Component), _class.VirtualBody = VirtualBody, _class.propTypes = _extends({
        /**
         * 是否开启虚拟滚动
         */
        useVirtual: PropTypes.bool,
        /**
         * 设置行高
         */
        rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        primaryKey: PropTypes.string,
        dataSource: PropTypes.array,
        /**
         * 在内容区域滚动的时候触发的函数
         */
        onBodyScroll: PropTypes.func
    }, BaseComponent.propTypes), _class.defaultProps = _extends({}, BaseComponent.defaultProps, {
        primaryKey: 'id',
        rowHeight: noop,
        maxBodyHeight: 200,
        components: {},
        prefix: 'next-',
        onBodyScroll: noop
    }), _class.childContextTypes = {
        onVirtualScroll: PropTypes.func,
        bodyHeight: PropTypes.number,
        innerTop: PropTypes.number,
        getBodyNode: PropTypes.func,
        getTableInstanceForVirtual: PropTypes.func,
        rowSelection: PropTypes.object
    }, _temp2);
    VirtualTable.displayName = 'VirtualTable';

    statics(VirtualTable, BaseComponent);
    return VirtualTable;
}