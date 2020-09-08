import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../icon';
import { KEYCODE } from '../util';
import RowComponent from './expanded/row';
import Col from './column';
import { statics } from './util';

var noop = function noop() {};

export default function expanded(BaseComponent) {
    var _class, _temp2;

    /** Table */
    var ExpandedTable = (_temp2 = _class = function (_React$Component) {
        _inherits(ExpandedTable, _React$Component);

        function ExpandedTable() {
            var _temp, _this, _ret;

            _classCallCheck(this, ExpandedTable);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
                openRowKeys: _this.props.openRowKeys || []
            }, _this.expandedKeydown = function (value, record, index, e) {
                e.preventDefault();
                e.stopPropagation();

                if (e.keyCode === KEYCODE.ENTER) {
                    _this.onExpandedClick(value, record, index, e);
                }
            }, _this.renderExpandedCell = function (value, index, record) {
                var _classnames;

                var _this$props = _this.props,
                    getExpandedColProps = _this$props.getExpandedColProps,
                    prefix = _this$props.prefix,
                    locale = _this$props.locale;
                var openRowKeys = _this.state.openRowKeys,
                    primaryKey = _this.props.primaryKey,
                    hasExpanded = openRowKeys.indexOf(record[primaryKey]) > -1,
                    switchNode = hasExpanded ? React.createElement(Icon, {
                    type: 'minus',
                    size: 'xs',
                    className: prefix + 'table-expand-unfold'
                }) : React.createElement(Icon, {
                    type: 'add',
                    size: 'xs',
                    className: prefix + 'table-expand-fold'
                }),
                    attrs = getExpandedColProps(record, index) || {};

                var cls = classnames((_classnames = {}, _classnames[prefix + 'table-expanded-ctrl'] = true, _classnames.disabled = attrs.disabled, _classnames[attrs.className] = attrs.className, _classnames));

                if (!attrs.disabled) {
                    attrs.onClick = _this.onExpandedClick.bind(_this, value, record, index);
                }
                return React.createElement(
                    'span',
                    _extends({}, attrs, {
                        role: 'button',
                        tabIndex: '0',
                        onKeyDown: _this.expandedKeydown.bind(_this, value, record, index),
                        'aria-label': hasExpanded ? locale.expanded : locale.folded,
                        'aria-expanded': hasExpanded,
                        className: cls
                    }),
                    switchNode
                );
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        ExpandedTable.prototype.getChildContext = function getChildContext() {
            return {
                openRowKeys: this.state.openRowKeys,
                expandedRowRender: this.props.expandedRowRender,
                expandedIndexSimulate: this.props.expandedIndexSimulate,
                expandedRowIndent: this.props.expandedRowIndent
            };
        };

        ExpandedTable.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
            if ('openRowKeys' in nextProps) {
                var openRowKeys = nextProps.openRowKeys;

                this.setState({
                    openRowKeys: openRowKeys
                });
            }
        };

        ExpandedTable.prototype.onExpandedClick = function onExpandedClick(value, record, i, e) {
            var openRowKeys = [].concat(this.state.openRowKeys),
                primaryKey = this.props.primaryKey,
                id = record[primaryKey],
                index = openRowKeys.indexOf(id);

            if (index > -1) {
                openRowKeys.splice(index, 1);
            } else {
                openRowKeys.push(id);
            }
            if (!('openRowKeys' in this.props)) {
                this.setState({
                    openRowKeys: openRowKeys
                });
            }
            this.props.onRowOpen(openRowKeys, id, index === -1, record);
            e.stopPropagation();
        };

        ExpandedTable.prototype.normalizeChildren = function normalizeChildren(children) {
            var _props = this.props,
                prefix = _props.prefix,
                size = _props.size;

            var toArrayChildren = Children.map(children, function (child, index) {
                return React.cloneElement(child, {
                    key: index
                });
            });
            toArrayChildren.unshift(React.createElement(Col, {
                title: '',
                key: 'expanded',
                cell: this.renderExpandedCell.bind(this),
                width: size === 'small' ? 34 : 50,
                className: prefix + 'table-expanded ' + prefix + 'table-prerow',
                __normalized: true
            }));
            return toArrayChildren;
        };

        ExpandedTable.prototype.normalizeDataSource = function normalizeDataSource(ds) {
            var ret = [];
            ds.forEach(function (item) {
                var itemCopy = _extends({}, item);
                itemCopy.__expanded = true;
                ret.push(item, itemCopy);
            });
            return ret;
        };

        ExpandedTable.prototype.render = function render() {
            /* eslint-disable no-unused-vars, prefer-const */
            var _props2 = this.props,
                components = _props2.components,
                openRowKeys = _props2.openRowKeys,
                expandedRowRender = _props2.expandedRowRender,
                hasExpandedRowCtrl = _props2.hasExpandedRowCtrl,
                children = _props2.children,
                dataSource = _props2.dataSource,
                entireDataSource = _props2.entireDataSource,
                getExpandedColProps = _props2.getExpandedColProps,
                expandedRowIndent = _props2.expandedRowIndent,
                onRowOpen = _props2.onRowOpen,
                onExpandedRowClick = _props2.onExpandedRowClick,
                others = _objectWithoutProperties(_props2, ['components', 'openRowKeys', 'expandedRowRender', 'hasExpandedRowCtrl', 'children', 'dataSource', 'entireDataSource', 'getExpandedColProps', 'expandedRowIndent', 'onRowOpen', 'onExpandedRowClick']);

            if (expandedRowRender && !components.Row) {
                components = _extends({}, components);
                components.Row = RowComponent;
                dataSource = this.normalizeDataSource(dataSource);
                entireDataSource = this.normalizeDataSource(entireDataSource);
            }
            if (expandedRowRender && hasExpandedRowCtrl) {
                children = this.normalizeChildren(children);
            }

            return React.createElement(
                BaseComponent,
                _extends({}, others, {
                    dataSource: dataSource,
                    entireDataSource: entireDataSource,
                    components: components
                }),
                children
            );
        };

        return ExpandedTable;
    }(React.Component), _class.ExpandedRow = RowComponent, _class.propTypes = _extends({
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
        locale: PropTypes.object
    }, BaseComponent.propTypes), _class.defaultProps = _extends({}, BaseComponent.defaultProps, {
        getExpandedColProps: noop,
        onRowOpen: noop,
        hasExpandedRowCtrl: true,
        components: {},
        expandedRowIndent: [1, 0],
        prefix: 'next-'
    }), _class.childContextTypes = {
        openRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        expandedIndexSimulate: PropTypes.bool,
        expandedRowIndent: PropTypes.array
    }, _temp2);
    ExpandedTable.displayName = 'ExpandedTable';

    statics(ExpandedTable, BaseComponent);
    return ExpandedTable;
}