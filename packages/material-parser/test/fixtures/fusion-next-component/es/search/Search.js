import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import Input from '../input';
import Select from '../select';
import Button from '../button';
import Icon from '../icon';
import { obj, func, KEYCODE } from '../util';
import zhCN from '../locale/zh-cn';

var Group = Input.Group;
var AutoComplete = Select.AutoComplete;

/**
 * Search
 * @description 输入框部分继承 Select.AutoComplete 的能力，可以直接用AutoComplete 的 api
 */
var Search = (_temp = _class = function (_React$Component) {
    _inherits(Search, _React$Component);

    function Search(props) {
        _classCallCheck(this, Search);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _initialiseProps.call(_this);

        var value = 'value' in props ? props.value : props.defaultValue;
        var filterValue = 'filterValue' in props ? props.filterValue : props.defaultFilterValue;

        _this.state = {
            value: typeof value === 'undefined' ? '' : value,
            filterValue: filterValue
        };
        return _this;
    }

    Search.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        var nextState = {};
        if ('value' in nextProps && nextProps.value !== prevState.value) {
            var value = nextProps.value;
            nextState.value = value === undefined || value === null ? '' : nextProps.value;
        }

        if ('filterValue' in nextProps && nextProps.filterValue !== prevState.filterValue) {
            var filterValue = nextProps.filterValue;
            nextState.filterValue = filterValue === undefined ? '' : filterValue;
        }

        if (Object.keys(nextState).length > 0) {
            return nextState;
        }

        return null;
    };

    Search.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            shape = _props.shape,
            filter = _props.filter,
            hasIcon = _props.hasIcon,
            disabled = _props.disabled,
            placeholder = _props.placeholder,
            type = _props.type,
            className = _props.className,
            style = _props.style,
            size = _props.size,
            prefix = _props.prefix,
            searchText = _props.searchText,
            dataSource = _props.dataSource,
            filterProps = _props.filterProps,
            buttonProps = _props.buttonProps,
            popupContent = _props.popupContent,
            followTrigger = _props.followTrigger,
            hasClear = _props.hasClear,
            visible = _props.visible,
            locale = _props.locale,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['shape', 'filter', 'hasIcon', 'disabled', 'placeholder', 'type', 'className', 'style', 'size', 'prefix', 'searchText', 'dataSource', 'filterProps', 'buttonProps', 'popupContent', 'followTrigger', 'hasClear', 'visible', 'locale', 'rtl']);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'search'] = true, _classNames[prefix + 'search-' + shape] = true, _classNames['' + prefix + type] = type, _classNames['' + prefix + size] = size, _classNames[className] = !!className, _classNames));

        var searchIcon = null,
            filterSelect = null,
            searchBtn = null;

        if (shape === 'simple') {
            var _classNames2;

            var _cls = classNames((_classNames2 = {}, _classNames2[prefix + 'search-icon'] = true, _classNames2[buttonProps.className] = !!buttonProps.className, _classNames2));
            hasIcon && (searchIcon = React.createElement(Icon, _extends({
                type: 'search',
                tabIndex: '0',
                role: 'button',
                'aria-disabled': disabled,
                'aria-label': locale.buttonText
            }, buttonProps, {
                className: _cls,
                onClick: this.onSearch,
                onKeyDown: this.onKeyDown
            })));
        } else {
            var _classNames3;

            var _cls2 = classNames((_classNames3 = {}, _classNames3[prefix + 'search-btn'] = true, _classNames3[buttonProps.className] = !!buttonProps.className, _classNames3));
            searchBtn = React.createElement(
                Button,
                _extends({
                    tabIndex: '0',
                    'aria-disabled': disabled,
                    'aria-label': locale.buttonText,
                    className: _cls2,
                    disabled: disabled
                }, buttonProps, {
                    onClick: this.onSearch,
                    onKeyDown: this.onKeyDown
                }),
                hasIcon ? React.createElement(Icon, { type: 'search' }) : null,
                searchText ? React.createElement(
                    'span',
                    { className: prefix + 'search-btn-text' },
                    searchText
                ) : null
            );
        }

        if (filter.length > 0) {
            filterSelect = React.createElement(Select, _extends({}, filterProps, {
                followTrigger: followTrigger,
                hasBorder: false,
                dataSource: filter,
                size: size,
                disabled: disabled,
                value: this.state.filterValue,
                onChange: this.onFilterChange
            }));
        }

        var othersAttributes = obj.pickOthers(Search.propTypes, others);
        if (visible !== undefined) {
            // 受控属性 visible 不能直接写在组件上
            othersAttributes.visible = Boolean(visible);
        }
        var dataAttr = obj.pickAttrsWith(others, 'data-');

        var left = React.createElement(
            Group,
            {
                addonBefore: filterSelect,
                className: prefix + 'search-left',
                addonBeforeClassName: prefix + 'search-left-addon'
            },
            React.createElement(AutoComplete, _extends({
                'aria-label': locale.buttonText
            }, othersAttributes, {
                followTrigger: followTrigger,
                role: 'searchbox',
                hasClear: hasClear,
                className: prefix + 'search-input',
                size: size,
                placeholder: placeholder,
                dataSource: dataSource,
                innerAfter: searchIcon,
                onPressEnter: this.onSearch,
                value: this.state.value,
                onChange: this.onChange,
                popupContent: popupContent,
                disabled: disabled
            }))
        );

        return React.createElement(
            'span',
            _extends({
                className: cls,
                style: style
            }, dataAttr, {
                dir: rtl ? 'rtl' : undefined
            }),
            searchBtn ? React.createElement(
                Group,
                { addonAfter: searchBtn },
                left
            ) : left
        );
    };

    return Search;
}(React.Component), _class.propTypes = {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string,
    /**
     * 形状
     */
    shape: PropTypes.oneOf(['normal', 'simple']),
    /**
     * 类型 shape=normal: primary/secondary; shape=simple: normal/dark;
     */
    type: PropTypes.oneOf(['primary', 'secondary', 'normal', 'dark']),
    /**
     * 大小
     * @enumdesc '大', '小'
     */
    size: PropTypes.oneOf(['large', 'medium']),
    /**
     * 搜索框默认值
     */
    defaultValue: PropTypes.string,
    /**
     * 搜索框数值
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 输入关键字时的回掉
     * @param {Object} value 输入值
     */
    onChange: PropTypes.func,
    /**
     * 点击搜索按钮触发的回调
     * @param {String} value 输入值
     * @param {String} filterValue 选项值
     */
    onSearch: PropTypes.func,
    /**
     * 选择器默认值
     */
    defaultFilterValue: PropTypes.string,
    /**
     * 选择器
     */
    filter: PropTypes.array,
    /**
     * 选择器值
     */
    filterValue: PropTypes.string,
    /**
     * 选择器发生变化时回调
     * @param {Object} filter value
     */
    onFilterChange: PropTypes.func,
    /**
     * 搜索框下拉联想列表
     */
    dataSource: PropTypes.array,
    /**
     * 默认提示
     */
    placeholder: PropTypes.string,
    /**
     * button 的内容
     */
    searchText: PropTypes.node,
    /**
     * 自定义样式
     */
    style: PropTypes.object,
    /**
     * 样式名称
     */
    className: PropTypes.string,
    /**
     * 选择器的props
     */
    filterProps: PropTypes.object,
    /**
     * 按钮的额外属性
     */
    buttonProps: PropTypes.object,
    /**
     * 自定义渲染的的下拉框
     */
    popupContent: PropTypes.node,
    /**
     * 是否跟随滚动
     */
    followTrigger: PropTypes.bool,
    /**
     * 自定义渲染的的下拉框
     */
    visible: PropTypes.bool,
    /**
     * 是否显示清除按钮
     */
    hasClear: PropTypes.bool,
    /**
     * 是否显示搜索按钮
     */
    hasIcon: PropTypes.bool,
    /**
     * 是否禁用
     */
    disabled: PropTypes.bool,
    locale: PropTypes.object,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    shape: 'normal',
    type: 'normal',
    size: 'medium',
    hasIcon: true,
    filter: [],
    locale: zhCN.Search,
    buttonProps: {},
    onChange: func.noop,
    onSearch: func.noop,
    onFilterChange: func.noop,
    hasClear: false,
    disabled: false
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onChange = function (value) {
        var _props2;

        for (var _len = arguments.length, argv = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            argv[_key - 1] = arguments[_key];
        }

        if (!('value' in _this2.props)) {
            _this2.setState({ value: value });
        }

        (_props2 = _this2.props).onChange.apply(_props2, [value].concat(argv));
    };

    this.onSearch = function () {
        if (_this2.props.disabled) {
            return;
        }
        _this2.props.onSearch(_this2.state.value, _this2.state.filterValue);
    };

    this.onFilterChange = function (filterValue) {
        if (!('filterValue' in _this2.props)) {
            _this2.setState({ filterValue: filterValue });
        }

        _this2.props.onFilterChange(filterValue);
    };

    this.onKeyDown = function (e) {
        if (_this2.props.disabled) {
            return;
        }
        if (e.keyCode !== KEYCODE.ENTER) {
            return;
        }
        _this2.onSearch();
    };
}, _temp);
Search.displayName = 'Search';


export default polyfill(Search);