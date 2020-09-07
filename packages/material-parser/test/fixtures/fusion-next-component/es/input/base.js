import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import ConfigProvider from '../config-provider';
import { func } from '../util';
import zhCN from '../locale/zh-cn';

var Base = (_temp2 = _class = function (_React$Component) {
    _inherits(Base, _React$Component);

    function Base() {
        var _temp, _this, _ret;

        _classCallCheck(this, Base);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.saveRef = function (input) {
            _this.inputRef = input;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Base.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        if ('value' in nextProps && nextProps.value !== prevState.value) {
            var value = nextProps.value;
            return {
                value: value === undefined || value === null ? '' : value
            };
        }

        return null;
    };

    Base.prototype.ieHack = function ieHack(value) {
        return value;
    };

    Base.prototype.onChange = function onChange(e) {
        if ('stopPropagation' in e) {
            e.stopPropagation();
        } else if ('cancelBubble' in e) {
            e.cancelBubble();
        }

        var value = e.target.value;

        if (this.props.trim) {
            value = value.trim();
        }

        value = this.ieHack(value);

        // not controlled
        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        // Number('') = 0
        if (value && this.props.htmlType === 'number') {
            value = Number(value);
        }

        this.props.onChange(value, e);
    };

    Base.prototype.onKeyDown = function onKeyDown(e) {
        var value = e.target.value;
        var maxLength = this.props.maxLength;

        var len = maxLength > 0 && value ? this.getValueLength(value) : 0;
        var opts = {};

        // has enable trim and has input whitespace
        if (this.props.trim && e.keyCode === 32) {
            opts.beTrimed = true;
        }

        // has defined maxLength and has over max length and has not input backspace and delete
        if (maxLength > 0 && (len > maxLength + 1 || (len === maxLength || len === maxLength + 1) && e.keyCode !== 8 && e.keyCode !== 46)) {
            opts.overMaxLength = true;
        }

        this.props.onKeyDown(e, opts);
    };

    Base.prototype.onFocus = function onFocus(e) {
        this.setState({
            focus: true
        });
        this.props.onFocus(e);
    };

    Base.prototype.onBlur = function onBlur(e) {
        this.setState({
            focus: false
        });
        this.props.onBlur(e);
    };

    Base.prototype.renderLength = function renderLength() {
        var _classNames;

        var _props = this.props,
            maxLength = _props.maxLength,
            hasLimitHint = _props.hasLimitHint,
            prefix = _props.prefix,
            rtl = _props.rtl;

        var len = maxLength > 0 && this.state.value ? this.getValueLength(this.state.value) : 0;

        var classesLenWrap = classNames((_classNames = {}, _classNames[prefix + 'input-len'] = true, _classNames[prefix + 'error'] = len > maxLength, _classNames));

        var content = rtl ? maxLength + '/' + len : len + '/' + maxLength;

        return maxLength && hasLimitHint ? React.createElement(
            'span',
            { className: classesLenWrap },
            content
        ) : null;
    };

    Base.prototype.renderControl = function renderControl() {
        var lenWrap = this.renderLength();

        return lenWrap ? React.createElement(
            'span',
            { className: this.props.prefix + 'input-control' },
            lenWrap
        ) : null;
    };

    Base.prototype.getClass = function getClass() {
        var _classNames2;

        var _props2 = this.props,
            disabled = _props2.disabled,
            state = _props2.state,
            prefix = _props2.prefix;


        return classNames((_classNames2 = {}, _classNames2[prefix + 'input'] = true, _classNames2[prefix + 'disabled'] = !!disabled, _classNames2[prefix + 'error'] = state === 'error', _classNames2[prefix + 'warning'] = state === 'warning', _classNames2[prefix + 'focus'] = this.state.focus, _classNames2));
    };

    Base.prototype.getProps = function getProps() {
        var _props3 = this.props,
            placeholder = _props3.placeholder,
            inputStyle = _props3.inputStyle,
            disabled = _props3.disabled,
            readOnly = _props3.readOnly,
            cutString = _props3.cutString,
            maxLength = _props3.maxLength,
            name = _props3.name;

        var props = {
            style: inputStyle,
            placeholder: placeholder,
            disabled: disabled,
            readOnly: readOnly,
            name: name,
            maxLength: cutString ? maxLength : undefined,
            value: this.state.value,
            onChange: this.onChange.bind(this),
            onBlur: this.onBlur.bind(this),
            onFocus: this.onFocus.bind(this)
        };

        // fix accessibility：auto process status of aria disabled
        if (disabled) {
            props['aria-disabled'] = disabled;
        }

        return props;
    };

    Base.prototype.getInputNode = function getInputNode() {
        return this.inputRef;
    };

    Base.prototype.focus = function focus(start, end) {
        this.inputRef.focus();
        if (typeof start !== 'undefined') {
            this.inputRef.selectionStart = start;
        }
        if (typeof end !== 'undefined') {
            this.inputRef.selectionEnd = end;
        }
    };

    return Base;
}(React.Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * 当前值
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 初始化值
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 发生改变的时候触发的回调
     * @param {String} value 数据
     * @param {Event} e DOM事件对象
     */
    onChange: PropTypes.func,
    /**
     * 键盘按下的时候触发的回调
     * @param {Event} e DOM事件对象
     * @param {Object} opts 可扩展的附加信息：<br> - opts.overMaxLength: {Boolean} 已超出最大长度<br> - opts.beTrimed: {Boolean} 输入的空格被清理
     */
    onKeyDown: PropTypes.func,
    /**
     * 禁用状态
     */
    disabled: PropTypes.bool,
    /**
     * 最大长度
     */
    maxLength: PropTypes.number,
    /**
     * 是否展现最大长度样式
     */
    hasLimitHint: PropTypes.bool,
    /**
     * 当设置了maxLength时，是否截断超出字符串
     */
    cutString: PropTypes.bool,
    /**
     * 只读
     */
    readOnly: PropTypes.bool,
    /**
     * onChange返回会自动去除头尾空字符
     */
    trim: PropTypes.bool,
    /**
     * 输入提示
     */
    placeholder: PropTypes.string,
    /**
     * 获取焦点时候触发的回调
     * @param {Event} e DOM事件对象
     */
    onFocus: PropTypes.func,
    /**
     * 失去焦点时候触发的回调
     * @param {Event} e DOM事件对象
     */
    onBlur: PropTypes.func,
    /**
     * 自定义字符串计算长度方式
     * @param {String} value 数据
     * @returns {Number} 自定义长度
     */
    getValueLength: PropTypes.func,
    inputStyle: PropTypes.object,
    /**
     * 自定义class
     */
    className: PropTypes.string,
    /**
     * 自定义内联样式
     */
    style: PropTypes.object,
    /**
     * 原生type
     */
    htmlType: PropTypes.string,
    /**
     * name
     */
    name: PropTypes.string,
    rtl: PropTypes.bool,
    state: PropTypes.oneOf(['error', 'loading', 'success', 'warning']),
    locale: PropTypes.object,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {number} value 评分值
     */
    renderPreview: PropTypes.func
}), _class.defaultProps = {
    disabled: false,
    prefix: 'next-',
    maxLength: null,
    hasLimitHint: false,
    cutString: true,
    readOnly: false,
    isPreview: false,
    trim: false,
    onFocus: func.noop,
    onBlur: func.noop,
    onChange: func.noop,
    onKeyDown: func.noop,
    getValueLength: func.noop,
    locale: zhCN.Input
}, _temp2);
Base.displayName = 'Base';


export default polyfill(Base);