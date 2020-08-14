import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { polyfill } from 'react-lifecycles-compat';
import Overlay from '../overlay';
import Input from '../input';
import Calendar from '../calendar';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';
import { func, obj, KEYCODE } from '../util';
import { checkDateValue, formatDateValue } from './util';

var Popup = Overlay.Popup;

/**
 * DatePicker.WeekPicker
 */

var WeekPicker = (_temp = _class = function (_Component) {
    _inherits(WeekPicker, _Component);

    function WeekPicker(props, context) {
        _classCallCheck(this, WeekPicker);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var value = formatDateValue(props.value || props.defaultValue, props.format);

        _this.state = {
            value: value,
            visible: props.visible || props.defaultVisible
        };
        return _this;
    }

    WeekPicker.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var st = {};
        if ('value' in props) {
            st.value = formatDateValue(props.value, props.format);
        }

        if ('visible' in props) {
            st.visible = props.visible;
        }

        return st;
    };

    WeekPicker.prototype.renderPreview = function renderPreview(others) {
        var _props = this.props,
            prefix = _props.prefix,
            format = _props.format,
            className = _props.className,
            renderPreview = _props.renderPreview;
        var value = this.state.value;

        var previewCls = classnames(className, prefix + 'form-preview');

        var label = value ? value.format(format) : '';

        if (typeof renderPreview === 'function') {
            return React.createElement(
                'div',
                _extends({}, others, { className: previewCls }),
                renderPreview(value, this.props)
            );
        }

        return React.createElement(
            'p',
            _extends({}, others, { className: previewCls }),
            label
        );
    };

    WeekPicker.prototype.render = function render() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            rtl = _props2.rtl,
            locale = _props2.locale,
            label = _props2.label,
            state = _props2.state,
            format = _props2.format,
            defaultVisibleMonth = _props2.defaultVisibleMonth,
            onVisibleMonthChange = _props2.onVisibleMonthChange,
            disabledDate = _props2.disabledDate,
            footerRender = _props2.footerRender,
            placeholder = _props2.placeholder,
            size = _props2.size,
            disabled = _props2.disabled,
            hasClear = _props2.hasClear,
            popupTriggerType = _props2.popupTriggerType,
            popupAlign = _props2.popupAlign,
            popupContainer = _props2.popupContainer,
            popupStyle = _props2.popupStyle,
            popupClassName = _props2.popupClassName,
            popupProps = _props2.popupProps,
            popupComponent = _props2.popupComponent,
            popupContent = _props2.popupContent,
            followTrigger = _props2.followTrigger,
            className = _props2.className,
            inputProps = _props2.inputProps,
            monthCellRender = _props2.monthCellRender,
            yearCellRender = _props2.yearCellRender,
            isPreview = _props2.isPreview,
            others = _objectWithoutProperties(_props2, ['prefix', 'rtl', 'locale', 'label', 'state', 'format', 'defaultVisibleMonth', 'onVisibleMonthChange', 'disabledDate', 'footerRender', 'placeholder', 'size', 'disabled', 'hasClear', 'popupTriggerType', 'popupAlign', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'className', 'inputProps', 'monthCellRender', 'yearCellRender', 'isPreview']);

        var _state = this.state,
            visible = _state.visible,
            value = _state.value;


        var sharedInputProps = _extends({}, inputProps, {
            size: size,
            disabled: disabled,
            onChange: this.onDateInputChange,
            onKeyDown: this.onKeyDown
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(obj.pickOthers(others, WeekPicker.PropTypes));
        }

        var trigger = React.createElement(
            'div',
            { className: prefix + 'week-picker-trigger' },
            React.createElement(Input, _extends({}, sharedInputProps, {
                label: label,
                state: state,
                value: value ? value.format(format) : '',
                role: 'combobox',
                'aria-expanded': visible,
                readOnly: true,
                placeholder: placeholder || locale.weekPlaceholder,
                hint: 'calendar',
                hasClear: value && hasClear,
                className: prefix + 'week-picker-input'
            }))
        );

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(WeekPicker.propTypes, others), {
                className: classnames(prefix + 'week-picker', className)
            }),
            React.createElement(
                PopupComponent,
                _extends({
                    align: popupAlign
                }, popupProps, {
                    followTrigger: followTrigger,
                    disabled: disabled,
                    visible: visible,
                    onVisibleChange: this.onVisibleChange,
                    triggerType: popupTriggerType,
                    container: popupContainer,
                    style: popupStyle,
                    className: popupClassName,
                    trigger: trigger
                }),
                popupContent ? popupContent : React.createElement(
                    'div',
                    {
                        dir: others.dir,
                        className: prefix + 'week-picker-body'
                    },
                    React.createElement(Calendar, {
                        shape: 'panel',
                        value: value,
                        format: format,
                        className: prefix + 'calendar-week',
                        dateCellRender: this.dateRender,
                        monthCellRender: monthCellRender,
                        yearCellRender: yearCellRender,
                        onSelect: this.onSelectCalendarPanel,
                        defaultVisibleMonth: defaultVisibleMonth,
                        onVisibleMonthChange: onVisibleMonthChange,
                        disabledDate: disabledDate
                    }),
                    footerRender()
                )
            )
        );
    };

    return WeekPicker;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * 输入框内置标签
     */
    label: PropTypes.node,
    /**
     * 输入框状态
     */
    state: PropTypes.oneOf(['success', 'loading', 'error']),
    /**
     * 输入提示
     */
    placeholder: PropTypes.string,
    /**
     * 默认展现的月
     * @return {MomentObject} 返回包含指定月份的 moment 对象实例
     */
    defaultVisibleMonth: PropTypes.func,
    onVisibleMonthChange: PropTypes.func,
    /**
     * 日期值（受控）moment 对象
     */
    value: checkDateValue,
    /**
     * 初始日期值，moment 对象
     */
    defaultValue: checkDateValue,
    /**
     * 日期值的格式（用于限定用户输入和展示）
     */
    format: PropTypes.string,
    /**
     * 禁用日期函数
     * @param {MomentObject} 日期值
     * @param {String} view 当前视图类型，year: 年， month: 月, date: 日
     * @return {Boolean} 是否禁用
     */
    disabledDate: PropTypes.func,
    /**
     * 自定义面板页脚
     * @return {Node} 自定义的面板页脚组件
     */
    footerRender: PropTypes.func,
    /**
     * 日期值改变时的回调
     * @param {MomentObject|String} value 日期值
     */
    onChange: PropTypes.func,
    /**
     * 输入框尺寸
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * 是否禁用
     */
    disabled: PropTypes.bool,
    /**
     * 是否显示清空按钮
     */
    hasClear: PropTypes.bool,
    /**
     * 弹层显示状态
     */
    visible: PropTypes.bool,
    /**
     * 弹层默认是否显示
     */
    defaultVisible: PropTypes.bool,
    /**
     * 弹层展示状态变化时的回调
     * @param {Boolean} visible 弹层是否显示
     * @param {String} type 触发弹层显示和隐藏的来源 calendarSelect 表示由日期表盘的选择触发； okBtnClick 表示由确认按钮触发； fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
     */
    onVisibleChange: PropTypes.func,
    /**
     * 弹层触发方式
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * 弹层对齐方式,具体含义见 OverLay文档
     */
    popupAlign: PropTypes.string,
    /**
     * 弹层容器
     * @param {Element} target 目标元素
     * @return {Element} 弹层的容器元素
     */
    popupContainer: PropTypes.any,
    /**
     * 弹层自定义样式
     */
    popupStyle: PropTypes.object,
    /**
     * 弹层自定义样式类
     */
    popupClassName: PropTypes.string,
    /**
     * 弹层其他属性
     */
    popupProps: PropTypes.object,
    /**
     * 是否跟随滚动
     */
    followTrigger: PropTypes.bool,
    /**
     * 输入框其他属性
     */
    inputProps: PropTypes.object,
    /**
     * 自定义日期渲染函数
     * @param {Object} value 日期值（moment对象）
     * @returns {ReactNode}
     */
    dateCellRender: PropTypes.func,
    /**
     * 自定义月份渲染函数
     * @param {Object} calendarDate 对应 Calendar 返回的自定义日期对象
     * @returns {ReactNode}
     */
    monthCellRender: PropTypes.func,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {MomentObject} value 年份
     */
    renderPreview: PropTypes.func,
    yearCellRender: PropTypes.func, // 兼容 0.x yearCellRender
    locale: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    popupComponent: PropTypes.elementType,
    popupContent: PropTypes.node
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    format: 'YYYY-wo',
    size: 'medium',
    disabledDate: function disabledDate() {
        return false;
    },
    footerRender: function footerRender() {
        return null;
    },
    hasClear: true,
    popupTriggerType: 'click',
    popupAlign: 'tl tl',
    locale: nextLocale.DatePicker,
    defaultVisible: false,
    onChange: func.noop,
    onVisibleChange: func.noop
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.handleChange = function (newValue, prevValue) {
        if (!('value' in _this2.props)) {
            _this2.setState({
                value: newValue
            });
        }

        var newValueOf = newValue ? newValue.valueOf() : null;
        var preValueOf = prevValue ? prevValue.valueOf() : null;

        if (newValueOf !== preValueOf) {
            _this2.props.onChange(newValue);
        }
    };

    this.onDateInputChange = function (value, e, eventType) {
        if (eventType === 'clear' || !value) {
            e.stopPropagation();
            _this2.handleChange(null, _this2.state.value);
        }
    };

    this.onKeyDown = function (e) {
        if ([KEYCODE.UP, KEYCODE.DOWN, KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1) {
            return;
        }

        if (e.altKey && [KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1 || e.controlKey || e.shiftKey) {
            return;
        }

        var date = _this2.state.value;

        if (date && date.isValid()) {
            var stepUnit = e.altKey ? 'year' : 'month';
            switch (e.keyCode) {
                case KEYCODE.UP:
                    date.subtract(1, 'w');
                    break;
                case KEYCODE.DOWN:
                    date.add(1, 'w');
                    break;
                case KEYCODE.PAGE_UP:
                    date.subtract(1, stepUnit);
                    break;
                case KEYCODE.PAGE_DOWN:
                    date.add(1, stepUnit);
                    break;
            }
        } else {
            date = moment();
        }

        e.preventDefault();

        _this2.handleChange(date, _this2.state.value);
    };

    this.onVisibleChange = function (visible, type) {
        if (!('visible' in _this2.props)) {
            _this2.setState({
                visible: visible
            });
        }
        _this2.props.onVisibleChange(visible, type);
    };

    this.onSelectCalendarPanel = function (value) {
        _this2.handleChange(value, _this2.state.value);
        _this2.onVisibleChange(false, 'calendarSelect');
    };

    this.dateRender = function (value) {
        var _props3 = _this2.props,
            prefix = _props3.prefix,
            dateCellRender = _props3.dateCellRender;

        var selectedValue = _this2.state.value;
        var content = dateCellRender && typeof dateCellRender === 'function' ? dateCellRender(value) : value.dates();
        if (selectedValue && selectedValue.years() === value.years() && selectedValue.weeks() === value.weeks()) {
            var _classnames;

            var firstDay = moment.localeData().firstDayOfWeek();
            var endDay = firstDay - 1 < 0 ? 6 : firstDay - 1;
            return React.createElement(
                'div',
                {
                    className: classnames(prefix + 'calendar-week-active-date', (_classnames = {}, _classnames[prefix + 'calendar-week-active-start'] = value.days() === moment.localeData().firstDayOfWeek(), _classnames[prefix + 'calendar-week-active-end'] = value.days() === endDay, _classnames))
                },
                React.createElement(
                    'span',
                    null,
                    content
                )
            );
        }

        return content;
    };
}, _temp);
WeekPicker.displayName = 'WeekPicker';


export default polyfill(WeekPicker);