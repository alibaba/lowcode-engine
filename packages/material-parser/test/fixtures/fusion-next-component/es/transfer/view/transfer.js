import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../../button';
import Icon from '../../icon';
import ConfigProvider from '../../config-provider';
import zhCN from '../../locale/zh-cn';
import { func, obj } from '../../util';
import TransferPanel from '../view/transfer-panel';

var config = ConfigProvider.config;
var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;

/**
 * Transfer
 */

var Transfer = (_temp = _class = function (_Component) {
    _inherits(Transfer, _Component);

    Transfer.normalizeValue = function normalizeValue(value) {
        if (value) {
            if (Array.isArray(value)) {
                return value;
            }
            /* istanbul ignore next */
            return [value];
        }

        return [];
    };

    function Transfer(props, context) {
        _classCallCheck(this, Transfer);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        var value = props.value,
            defaultValue = props.defaultValue,
            defaultLeftChecked = props.defaultLeftChecked,
            defaultRightChecked = props.defaultRightChecked,
            dataSource = props.dataSource,
            rtl = props.rtl,
            operations = props.operations;

        if (operations.length === 0) {
            operations.push(React.createElement(Icon, { rtl: rtl, type: 'arrow-right' }));
            operations.push(React.createElement(Icon, { rtl: rtl, type: 'arrow-left' }));
        }

        var _this$filterCheckedVa = _this.filterCheckedValue(Transfer.normalizeValue(defaultLeftChecked), Transfer.normalizeValue(defaultRightChecked), dataSource),
            left = _this$filterCheckedVa.left,
            right = _this$filterCheckedVa.right;

        _this.state = {
            value: Transfer.normalizeValue('value' in props ? value : defaultValue),
            leftCheckedValue: left,
            rightCheckedValue: right
        };

        _this.leftValue = _this.getLeftValue(dataSource, _this.state.value);

        bindCtx(_this, ['handlePanelChange', 'handlePanelSort', 'handleMoveItem', 'handleSimpleMove', 'handleSimpleMoveAll']);
        return _this;
    }

    Transfer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var st = {};

        var newValue = void 0;
        if ('value' in nextProps) {
            var value = Transfer.normalizeValue(nextProps.value);
            st.value = value;
            newValue = value;
        } else {
            /* istanbul ignore next */
            newValue = this.state.value;
        }
        this.leftValue = this.getLeftValue(nextProps.dataSource, newValue);

        var _filterCheckedValue = this.filterCheckedValue(this.state.leftCheckedValue, this.state.rightCheckedValue, nextProps.dataSource),
            left = _filterCheckedValue.left,
            right = _filterCheckedValue.right;

        st.leftCheckedValue = left;
        st.rightCheckedValue = right;

        this.setState(st);
    };

    Transfer.prototype.filterCheckedValue = function filterCheckedValue(left, right, dataSource) {
        var result = {
            left: [],
            right: []
        };

        if (left.length || right.length) {
            var value = dataSource.map(function (item) {
                return item.value;
            });
            value.forEach(function (itemValue) {
                if (left.indexOf(itemValue) > -1) {
                    result.left.push(itemValue);
                } else if (right.indexOf(itemValue) > -1) {
                    result.right.push(itemValue);
                }
            });
        }

        return result;
    };

    Transfer.prototype.getLeftValue = function getLeftValue(dataSource, rightValue) {
        return dataSource.map(function (item) {
            return item.value;
        }).filter(function (itemValue) {
            return rightValue.indexOf(itemValue) === -1;
        });
    };

    Transfer.prototype.groupDatasource = function groupDatasource(value, itemValues, dataSource) {
        return value.reduce(function (ret, itemValue) {
            var index = itemValues.indexOf(itemValue);
            if (index > -1) {
                ret.push(dataSource[index]);
            }
            return ret;
        }, []);
    };

    Transfer.prototype.handlePanelChange = function handlePanelChange(position, value) {
        var _setState;

        var valuePropName = position === 'left' ? 'leftCheckedValue' : 'rightCheckedValue';
        this.setState((_setState = {}, _setState[valuePropName] = value, _setState));
    };

    Transfer.prototype.handlePanelSort = function handlePanelSort(position, dragValue, referenceValue, dragGap) {
        var _this2 = this;

        var value = position === 'right' ? this.state.value : this.leftValue;
        var currentIndex = value.indexOf(dragValue);
        var referenceIndex = value.indexOf(referenceValue);
        var expectIndex = dragGap === 'before' ? referenceIndex : referenceIndex + 1;
        if (currentIndex === expectIndex) {
            return;
        }

        value.splice(currentIndex, 1);
        if (currentIndex < expectIndex) {
            expectIndex = expectIndex - 1;
        }
        value.splice(expectIndex, 0, dragValue);

        this.setState({
            value: this.state.value
        }, function () {
            _this2.props.onSort(value, position);
        });
    };

    Transfer.prototype.handleMoveItem = function handleMoveItem(direction) {
        var _st;

        var rightValue = void 0;
        var leftValue = void 0;
        var movedValue = void 0;
        var valuePropName = void 0;

        var _state = this.state,
            value = _state.value,
            leftCheckedValue = _state.leftCheckedValue,
            rightCheckedValue = _state.rightCheckedValue;


        if (direction === 'right') {
            rightValue = leftCheckedValue.concat(value);
            leftValue = this.leftValue.filter(function (itemValue) {
                return leftCheckedValue.indexOf(itemValue) === -1;
            });
            movedValue = leftCheckedValue;
            valuePropName = 'leftCheckedValue';
        } else {
            rightValue = value.filter(function (itemValue) {
                return rightCheckedValue.indexOf(itemValue) === -1;
            });
            leftValue = rightCheckedValue.concat(this.leftValue);
            movedValue = rightCheckedValue;
            valuePropName = 'rightCheckedValue';
        }

        var st = (_st = {}, _st[valuePropName] = [], _st);

        this.setValueState(st, rightValue, leftValue, movedValue, direction);
    };

    Transfer.prototype.handleSimpleMove = function handleSimpleMove(direction, v) {
        var rightValue = void 0;
        var leftValue = void 0;

        var value = this.state.value;


        if (direction === 'right') {
            rightValue = [v].concat(value);
            leftValue = this.leftValue.filter(function (itemValue) {
                return itemValue !== v;
            });
        } else {
            rightValue = value.filter(function (itemValue) {
                return itemValue !== v;
            });
            leftValue = [v].concat(this.leftValue);
        }

        this.setValueState({}, rightValue, leftValue, [v], direction);
    };

    Transfer.prototype.handleSimpleMoveAll = function handleSimpleMoveAll(direction) {
        var rightValue = void 0;
        var leftValue = void 0;
        var movedValue = void 0;

        var dataSource = this.props.dataSource;
        var value = this.state.value;

        var disabledValue = dataSource.reduce(function (ret, item) {
            if (item.disabled) {
                ret.push(item.value);
            }

            return ret;
        }, []);

        if (direction === 'right') {
            movedValue = this.leftValue.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) === -1;
            });
            rightValue = movedValue.concat(value);
            leftValue = this.leftValue.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) > -1;
            });
        } else {
            movedValue = value.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) === -1;
            });
            rightValue = value.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) > -1;
            });
            leftValue = movedValue.concat(this.leftValue);
        }

        this.setValueState({}, rightValue, leftValue, movedValue, direction);
    };

    // eslint-disable-next-line max-params


    Transfer.prototype.setValueState = function setValueState(st, rightValue, leftValue, movedValue, direction) {
        var _this3 = this;

        var dataSource = this.props.dataSource;

        var callback = function callback() {
            if ('onChange' in _this3.props) {
                var itemValues = dataSource.map(function (item) {
                    return item.value;
                });
                var rightData = _this3.groupDatasource(rightValue, itemValues, dataSource);
                var leftData = _this3.groupDatasource(leftValue, itemValues, dataSource);
                var movedData = _this3.groupDatasource(movedValue, itemValues, dataSource);

                _this3.props.onChange(rightValue, rightData, {
                    leftValue: leftValue,
                    leftData: leftData,
                    movedValue: movedValue,
                    movedData: movedData,
                    direction: direction
                });
            }
        };

        if (!('value' in this.props)) {
            st.value = rightValue;
            this.leftValue = leftValue;
        }

        if (Object.keys(st).length) {
            this.setState(st, callback);
        } else {
            // eslint-disable-next-line callback-return
            callback();
        }
    };

    Transfer.prototype.renderCenter = function renderCenter() {
        var _props = this.props,
            prefix = _props.prefix,
            mode = _props.mode,
            operations = _props.operations,
            disabled = _props.disabled,
            leftDisabled = _props.leftDisabled,
            rightDisabled = _props.rightDisabled,
            locale = _props.locale;
        var _state2 = this.state,
            leftCheckedValue = _state2.leftCheckedValue,
            rightCheckedValue = _state2.rightCheckedValue;

        return React.createElement(
            'div',
            { className: prefix + 'transfer-operations' },
            mode === 'simple' ? React.createElement(Icon, {
                className: prefix + 'transfer-move',
                size: 'large',
                type: 'switch'
            }) : [React.createElement(
                Button,
                {
                    'aria-label': locale.moveToRight,
                    key: 'l2r',
                    className: prefix + 'transfer-operation',
                    type: leftCheckedValue.length ? 'primary' : 'normal',
                    disabled: leftDisabled || disabled || !leftCheckedValue.length,
                    onClick: this.handleMoveItem.bind(this, 'right')
                },
                operations[0]
            ), React.createElement(
                Button,
                {
                    'aria-label': locale.moveToLeft,
                    key: 'r2l',
                    className: prefix + 'transfer-operation',
                    type: rightCheckedValue.length ? 'primary' : 'normal',
                    disabled: rightDisabled || disabled || !rightCheckedValue.length,
                    onClick: this.handleMoveItem.bind(this, 'left')
                },
                operations[1]
            )]
        );
    };

    Transfer.prototype.render = function render() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            mode = _props2.mode,
            disabled = _props2.disabled,
            className = _props2.className,
            dataSource = _props2.dataSource,
            locale = _props2.locale,
            showSearch = _props2.showSearch,
            filter = _props2.filter,
            onSearch = _props2.onSearch,
            leftDisabled = _props2.leftDisabled,
            rightDisabled = _props2.rightDisabled,
            searchPlaceholder = _props2.searchPlaceholder,
            notFoundContent = _props2.notFoundContent,
            titles = _props2.titles,
            listClassName = _props2.listClassName,
            listStyle = _props2.listStyle,
            itemRender = _props2.itemRender,
            sortable = _props2.sortable,
            rtl = _props2.rtl,
            id = _props2.id,
            children = _props2.children;
        var _state3 = this.state,
            value = _state3.value,
            leftCheckedValue = _state3.leftCheckedValue,
            rightCheckedValue = _state3.rightCheckedValue;

        var itemValues = dataSource.map(function (item) {
            return item.value;
        });
        var leftDatasource = this.groupDatasource(this.leftValue, itemValues, dataSource);
        var rightDatasource = this.groupDatasource(value, itemValues, dataSource);
        var panelProps = {
            prefix: prefix,
            mode: mode,
            locale: locale,
            showSearch: showSearch,
            filter: filter,
            onSearch: onSearch,
            searchPlaceholder: searchPlaceholder,
            notFoundContent: notFoundContent,
            listClassName: listClassName,
            listStyle: listStyle,
            itemRender: itemRender,
            onMove: this.handleSimpleMove,
            onMoveAll: this.handleSimpleMoveAll,
            onChange: this.handlePanelChange,
            sortable: sortable,
            onSort: this.handlePanelSort,
            baseId: id,
            customerList: children
        };
        var others = pickOthers(Object.keys(Transfer.propTypes), this.props);

        if (rtl) {
            others.dir = 'rtl';
        }
        return React.createElement(
            'div',
            _extends({
                className: cx(prefix + 'transfer', className),
                id: id
            }, others),
            React.createElement(TransferPanel, _extends({}, panelProps, {
                position: 'left',
                dataSource: leftDatasource,
                disabled: leftDisabled || disabled,
                value: leftCheckedValue,
                title: titles[0]
            })),
            this.renderCenter(),
            React.createElement(TransferPanel, _extends({}, panelProps, {
                position: 'right',
                dataSource: rightDatasource,
                disabled: rightDisabled || disabled,
                value: rightCheckedValue,
                title: titles[1]
            }))
        );
    };

    return Transfer;
}(Component), _class.contextTypes = {
    prefix: PropTypes.string
}, _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 移动选项模式
     */
    mode: PropTypes.oneOf(['normal', 'simple']),
    /**
     * 数据源
     */
    dataSource: PropTypes.arrayOf(PropTypes.object),
    /**
     * （用于受控）当前值
     */
    value: PropTypes.arrayOf(PropTypes.string),
    /**
     * （用于非受控）初始值
     */
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    /**
     * 值发生改变的时候触发的回调函数
     * @param {Array} value 右面板值
     * @param {Array} data 右面板数据
     * @param {Object} extra 额外参数
     * @param {Array} extra.leftValue 左面板值
     * @param {Array} extra.leftData 左面板数据
     * @param {Array} extra.movedValue 发生移动的值
     * @param {Object} extra.movedData 发生移动的数据
     * @param {String} extra.direction 移动的方向，值为'left'或'right'
     */
    onChange: PropTypes.func,
    /**
     * 是否禁用
     */
    disabled: PropTypes.bool,
    /**
     * 是否禁用左侧面板
     */
    leftDisabled: PropTypes.bool,
    /**
     * 是否禁用右侧面板
     */
    rightDisabled: PropTypes.bool,
    /**
     * 列表项渲染函数
     * @param {Object} data 数据
     * @return {ReactNode} 列表项内容
     */
    itemRender: PropTypes.func,
    /**
     * 是否显示搜索框
     */
    showSearch: PropTypes.bool,
    /**
     * 自定义搜索函数
     * @param {String} searchedValue 搜索的内容
     * @param {Object} data 数据
     * @return {Boolean} 是否匹配到
     * @default 根据 label 属性匹配
     */
    filter: PropTypes.func,
    /**
     * 搜索框输入时触发的回调函数
     * @param {String} searchedValue 搜索的内容
     * @param {String} position 搜索面板的位置
     */
    onSearch: PropTypes.func,
    /**
     * 搜索框占位符
     */
    searchPlaceholder: PropTypes.string,
    /**
     * 列表为空显示内容
     */
    notFoundContent: PropTypes.node,
    /**
     * 左右面板标题
     */
    titles: PropTypes.arrayOf(PropTypes.node),
    /**
     * 向右向左移动按钮显示内容
     * @default [<Icon type="arrow-right" />, <Icon type="arrow-left" />]
     */
    operations: PropTypes.arrayOf(PropTypes.node),
    /**
     * 左面板默认选中值
     */
    defaultLeftChecked: PropTypes.arrayOf(PropTypes.string),
    /**
     * 右面板默认选中值
     */
    defaultRightChecked: PropTypes.arrayOf(PropTypes.string),
    /**
     * 左右面板列表自定义样式类名
     */
    listClassName: PropTypes.string,
    /**
     * 左右面板列表自定义样式对象
     */
    listStyle: PropTypes.object,
    /**
     * 是否允许拖拽排序
     */
    sortable: PropTypes.bool,
    /**
     * 拖拽排序时触发的回调函数
     * @param {Array} value 排序后的值
     * @param {String} position 拖拽的面板位置，值为：left 或 right
     */
    onSort: PropTypes.func,
    /**
     * 自定义国际化文案对象
     */
    locale: PropTypes.object,
    /**
     * 请设置 id 以保证transfer的可访问性
     */
    id: PropTypes.string,
    /**
     * 接收 children 自定义渲染列表
     */
    children: PropTypes.func
}), _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    mode: 'normal',
    dataSource: [],
    defaultValue: [],
    disabled: false,
    leftDisabled: false,
    rightDisabled: false,
    itemRender: function itemRender(data) {
        return data.label;
    },
    showSearch: false,
    filter: function filter(searchedValue, data) {
        var labelString = '';
        var loop = function loop(arg) {
            if (React.isValidElement(arg) && arg.props.children) {
                React.Children.forEach(arg.props.children, loop);
            } else if (typeof arg === 'string') {
                labelString += arg;
            }
        };
        loop(data.label);

        return labelString.length >= searchedValue.length && labelString.indexOf(searchedValue) > -1;
    },
    onSearch: function onSearch() {},
    notFoundContent: 'Not Found',
    titles: [],
    operations: [],
    defaultLeftChecked: [],
    defaultRightChecked: [],
    sortable: false,
    onSort: function onSort() {},
    locale: zhCN.Transfer
}, _temp);
Transfer.displayName = 'Transfer';


export default config(Transfer);