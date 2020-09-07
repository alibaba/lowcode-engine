import _typeof from 'babel-runtime/helpers/typeof';
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
import ConfigProvider from '../config-provider';
import Overlay from '../overlay';
import Input from '../input';
import Calendar from '../calendar';
import TimePickerPanel from '../time-picker/panel';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import { PANEL, resetValueTime, checkDateValue, formatDateValue, getDateTimeFormat, extend, onDateKeydown, onTimeKeydown } from './util';
import PanelFooter from './module/panel-footer';

var Popup = Overlay.Popup;

/**
 * DatePicker
 */

var DatePicker = (_temp = _class = function (_Component) {
    _inherits(DatePicker, _Component);

    function DatePicker(props, context) {
        _classCallCheck(this, DatePicker);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var dateTimeFormat = getDateTimeFormat(props.format, props.showTime);
        extend(dateTimeFormat, _this);

        var value = formatDateValue(props.value || props.defaultValue, _this.dateTimeFormat);
        _this.inputAsString = typeof (props.value || props.defaultValue) === 'string'; // 判断用户输入是否是字符串
        _this.state = {
            value: value,
            dateInputStr: '',
            timeInputStr: '',
            inputing: false, // 当前是否处于输入状态
            visible: props.visible || props.defaultVisible,
            panel: PANEL.DATE
        };
        return _this;
    }

    DatePicker.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('showTime' in nextProps) {
            var dateTimeFormat = getDateTimeFormat(nextProps.format || this.props.format, nextProps.showTime);
            extend(dateTimeFormat, this);
        }

        if ('value' in nextProps) {
            var value = formatDateValue(nextProps.value, this.dateTimeFormat);
            this.setState({
                value: value
            });
            this.inputAsString = typeof nextProps.value === 'string';
        }

        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible
            });
        }
    };

    DatePicker.prototype.renderPreview = function renderPreview(others) {
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

    DatePicker.prototype.render = function render() {
        var _classnames, _classnames2, _classnames3, _classnames4, _PANEL$DATE$PANEL$TIM;

        var _props2 = this.props,
            prefix = _props2.prefix,
            rtl = _props2.rtl,
            locale = _props2.locale,
            label = _props2.label,
            state = _props2.state,
            defaultVisibleMonth = _props2.defaultVisibleMonth,
            onVisibleMonthChange = _props2.onVisibleMonthChange,
            showTime = _props2.showTime,
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
            dateCellRender = _props2.dateCellRender,
            monthCellRender = _props2.monthCellRender,
            yearCellRender = _props2.yearCellRender,
            dateInputAriaLabel = _props2.dateInputAriaLabel,
            timeInputAriaLabel = _props2.timeInputAriaLabel,
            isPreview = _props2.isPreview,
            disableChangeMode = _props2.disableChangeMode,
            yearRange = _props2.yearRange,
            others = _objectWithoutProperties(_props2, ['prefix', 'rtl', 'locale', 'label', 'state', 'defaultVisibleMonth', 'onVisibleMonthChange', 'showTime', 'disabledDate', 'footerRender', 'placeholder', 'size', 'disabled', 'hasClear', 'popupTriggerType', 'popupAlign', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'className', 'inputProps', 'dateCellRender', 'monthCellRender', 'yearCellRender', 'dateInputAriaLabel', 'timeInputAriaLabel', 'isPreview', 'disableChangeMode', 'yearRange']);

        var _state = this.state,
            visible = _state.visible,
            value = _state.value,
            dateInputStr = _state.dateInputStr,
            timeInputStr = _state.timeInputStr,
            panel = _state.panel,
            inputing = _state.inputing;


        var datePickerCls = classnames((_classnames = {}, _classnames[prefix + 'date-picker'] = true, _classnames), className);

        var triggerInputCls = classnames((_classnames2 = {}, _classnames2[prefix + 'date-picker-input'] = true, _classnames2[prefix + 'error'] = false, _classnames2));

        var panelBodyClassName = classnames((_classnames3 = {}, _classnames3[prefix + 'date-picker-body'] = true, _classnames3[prefix + 'date-picker-body-show-time'] = showTime, _classnames3));

        var panelDateInputCls = classnames((_classnames4 = {}, _classnames4[prefix + 'date-picker-panel-input'] = true, _classnames4[prefix + 'focus'] = panel === PANEL.DATE, _classnames4));

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(obj.pickOthers(others, DatePicker.PropTypes));
        }

        var sharedInputProps = _extends({}, inputProps, {
            size: size,
            disabled: disabled,
            onChange: this.onDateInputChange,
            onBlur: this.onDateInputBlur,
            onPressEnter: this.onDateInputBlur,
            onKeyDown: this.onKeyDown
        });

        var dateInputValue = inputing === 'date' ? dateInputStr : value && value.format(this.format) || '';
        var triggerInputValue = dateInputValue;

        var dateInput = React.createElement(Input, _extends({}, sharedInputProps, {
            'aria-label': dateInputAriaLabel,
            value: dateInputValue,
            onFocus: this.onFoucsDateInput,
            placeholder: this.format,
            className: panelDateInputCls
        }));

        var datePanel = React.createElement(Calendar, {
            shape: 'panel',
            value: value,
            format: this.format,
            dateCellRender: dateCellRender,
            monthCellRender: monthCellRender,
            yearCellRender: yearCellRender,
            onSelect: this.onSelectCalendarPanel,
            defaultVisibleMonth: defaultVisibleMonth,
            onVisibleMonthChange: onVisibleMonthChange,
            disabledDate: disabledDate,
            disableChangeMode: disableChangeMode,
            yearRange: yearRange
        });

        var panelFooter = footerRender();

        var timeInput = null;
        var timePanel = null;

        if (showTime) {
            var _classnames5;

            var timeInputValue = inputing === 'time' ? timeInputStr : value && value.format(this.timeFormat) || '';
            triggerInputValue = value && value.format(this.dateTimeFormat) || '';

            var timePanelProps = (typeof showTime === 'undefined' ? 'undefined' : _typeof(showTime)) === 'object' ? showTime : {};

            var showSecond = this.timeFormat.indexOf('s') > -1;
            var showMinute = this.timeFormat.indexOf('m') > -1;

            var panelTimeInputCls = classnames((_classnames5 = {}, _classnames5[prefix + 'date-picker-panel-input'] = true, _classnames5[prefix + 'focus'] = panel === PANEL.TIME, _classnames5));

            timeInput = React.createElement(Input, {
                placeholder: this.timeFormat,
                value: timeInputValue,
                size: size,
                'aria-label': timeInputAriaLabel,
                disabled: disabled || !value,
                onChange: this.onTimeInputChange,
                onFocus: this.onFoucsTimeInput,
                onBlur: this.onTimeInputBlur,
                onPressEnter: this.onTimeInputBlur,
                onKeyDown: this.onTimeKeyDown,
                className: panelTimeInputCls
            });

            timePanel = React.createElement(TimePickerPanel, _extends({}, timePanelProps, {
                locale: locale,
                className: prefix + 'date-picker-panel-time',
                showSecond: showSecond,
                showMinute: showMinute,
                disabled: disabled,
                prefix: prefix,
                value: value,
                onSelect: this.onSelectTimePanel
            }));

            panelFooter = panelFooter || React.createElement(PanelFooter, {
                prefix: prefix,
                locale: locale,
                value: value,
                panel: panel,
                onPanelChange: this.changePanel,
                onOk: this.onOk
            });
        }

        var panelBody = (_PANEL$DATE$PANEL$TIM = {}, _PANEL$DATE$PANEL$TIM[PANEL.DATE] = datePanel, _PANEL$DATE$PANEL$TIM[PANEL.TIME] = timePanel, _PANEL$DATE$PANEL$TIM)[panel];

        var allowClear = value && hasClear;
        var trigger = React.createElement(
            'div',
            { className: prefix + 'date-picker-trigger' },
            React.createElement(Input, _extends({}, sharedInputProps, {
                label: label,
                state: state,
                value: triggerInputValue,
                role: 'combobox',
                'aria-expanded': visible,
                readOnly: true,
                placeholder: placeholder || (showTime ? locale.datetimePlaceholder : locale.placeholder),
                hint: 'calendar',
                hasClear: allowClear,
                className: triggerInputCls
            }))
        );
        var PopupComponent = popupComponent ? popupComponent : Popup;

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(DatePicker.propTypes, others), {
                className: datePickerCls
            }),
            React.createElement(
                PopupComponent,
                _extends({
                    autoFocus: true,
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
                    { dir: others.dir, className: panelBodyClassName },
                    React.createElement(
                        'div',
                        {
                            className: prefix + 'date-picker-panel-header'
                        },
                        dateInput,
                        timeInput
                    ),
                    panelBody,
                    panelFooter
                )
            )
        );
    };

    return DatePicker;
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
     * 是否使用时间控件，传入 TimePicker 的属性 { defaultValue, format, ... }
     */
    showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    /**
     * 每次选择日期时是否重置时间（仅在 showTime 开启时有效）
     */
    resetTime: PropTypes.bool,
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
     * 点击确认按钮时的回调
     * @return {MomentObject|String} 日期值
     */
    onOk: PropTypes.func,
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
    yearCellRender: PropTypes.func, // 兼容 0.x yearCellRender
    /**
     * 日期输入框的 aria-label 属性
     */
    dateInputAriaLabel: PropTypes.string,
    /**
     * 时间输入框的 aria-label 属性
     */
    timeInputAriaLabel: PropTypes.string,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {MomentObject} value 日期
     */
    renderPreview: PropTypes.func,
    locale: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    popupComponent: PropTypes.elementType,
    popupContent: PropTypes.node,
    disableChangeMode: PropTypes.bool,
    yearRange: PropTypes.arrayOf(PropTypes.number)
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    format: 'YYYY-MM-DD',
    size: 'medium',
    showTime: false,
    resetTime: false,
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
    onVisibleChange: func.noop,
    onOk: func.noop
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onValueChange = function (newValue) {
        var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'onChange';

        var ret = _this2.inputAsString && newValue ? newValue.format(_this2.dateTimeFormat) : newValue;
        _this2.props[handler](ret);
    };

    this.onSelectCalendarPanel = function (value) {
        var _props3 = _this2.props,
            showTime = _props3.showTime,
            resetTime = _props3.resetTime;


        var prevValue = _this2.state.value;
        var newValue = value;
        if (showTime) {
            if (!prevValue) {
                // 第一次选择日期值时，如果设置了默认时间，则使用该默认时间
                if (showTime.defaultValue) {
                    var defaultTimeValue = formatDateValue(showTime.defaultValue, _this2.timeFormat);
                    newValue = resetValueTime(value, defaultTimeValue);
                }
            } else if (!resetTime) {
                // 非第一选择日期，如果开启了 resetTime 属性，则记住之前选择的时间值
                newValue = resetValueTime(value, prevValue);
            }
        }

        _this2.handleChange(newValue, prevValue, { inputing: false });

        if (!showTime) {
            _this2.onVisibleChange(false, 'calendarSelect');
        }
    };

    this.onSelectTimePanel = function (value) {
        _this2.handleChange(value, _this2.state.value, { inputing: false });
    };

    this.clearValue = function () {
        _this2.setState({
            dateInputStr: '',
            timeInputStr: ''
        });

        _this2.handleChange(null, _this2.state.value, { inputing: false });
    };

    this.onDateInputChange = function (inputStr, e, eventType) {
        if (eventType === 'clear' || !inputStr) {
            e.stopPropagation();
            _this2.clearValue();
        } else {
            _this2.setState({
                dateInputStr: inputStr,
                inputing: 'date'
            });
        }
    };

    this.onTimeInputChange = function (inputStr) {
        _this2.setState({
            timeInputStr: inputStr,
            inputing: 'time'
        });
    };

    this.onDateInputBlur = function () {
        var dateInputStr = _this2.state.dateInputStr;

        if (dateInputStr) {
            var disabledDate = _this2.props.disabledDate;

            var parsed = moment(dateInputStr, _this2.format, true);

            _this2.setState({
                dateInputStr: '',
                inputing: false
            });

            if (parsed.isValid() && !disabledDate(parsed, 'date')) {
                _this2.handleChange(parsed, _this2.state.value);
            }
        }
    };

    this.onTimeInputBlur = function () {
        var _state2 = _this2.state,
            value = _state2.value,
            timeInputStr = _state2.timeInputStr;

        if (timeInputStr) {
            var parsed = moment(timeInputStr, _this2.timeFormat, true);

            _this2.setState({
                timeInputStr: '',
                inputing: false
            });

            if (parsed.isValid()) {
                var hour = parsed.hour();
                var minute = parsed.minute();
                var second = parsed.second();
                var newValue = value.clone().hour(hour).minute(minute).second(second);

                _this2.handleChange(newValue, _this2.state.value);
            }
        }
    };

    this.onKeyDown = function (e) {
        var format = _this2.props.format;
        var _state3 = _this2.state,
            dateInputStr = _state3.dateInputStr,
            value = _state3.value;

        var dateStr = onDateKeydown(e, { format: format, dateInputStr: dateInputStr, value: value }, 'day');
        if (!dateStr) return;
        _this2.onDateInputChange(dateStr);
    };

    this.onTimeKeyDown = function (e) {
        var showTime = _this2.props.showTime;
        var _state4 = _this2.state,
            timeInputStr = _state4.timeInputStr,
            value = _state4.value;

        var _ref = (typeof showTime === 'undefined' ? 'undefined' : _typeof(showTime)) === 'object' ? showTime : {},
            disabledMinutes = _ref.disabledMinutes,
            disabledSeconds = _ref.disabledSeconds,
            _ref$hourStep = _ref.hourStep,
            hourStep = _ref$hourStep === undefined ? 1 : _ref$hourStep,
            _ref$minuteStep = _ref.minuteStep,
            minuteStep = _ref$minuteStep === undefined ? 1 : _ref$minuteStep,
            _ref$secondStep = _ref.secondStep,
            secondStep = _ref$secondStep === undefined ? 1 : _ref$secondStep;

        var unit = 'second';

        if (disabledSeconds) {
            unit = disabledMinutes ? 'hour' : 'minute';
        }

        var timeStr = onTimeKeydown(e, {
            format: _this2.timeFormat,
            timeInputStr: timeInputStr,
            value: value,
            steps: {
                hour: hourStep,
                minute: minuteStep,
                second: secondStep
            }
        }, unit);

        if (!timeStr) return;

        _this2.onTimeInputChange(timeStr);
    };

    this.handleChange = function (newValue, prevValue) {
        var others = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (!('value' in _this2.props)) {
            _this2.setState(_extends({
                value: newValue
            }, others));
        } else {
            _this2.setState(_extends({}, others));
        }

        var newValueOf = newValue ? newValue.valueOf() : null;
        var preValueOf = prevValue ? prevValue.valueOf() : null;

        if (newValueOf !== preValueOf) {
            _this2.onValueChange(newValue);
        }
    };

    this.onFoucsDateInput = function () {
        if (_this2.state.panel !== PANEL.DATE) {
            _this2.setState({
                panel: PANEL.DATE
            });
        }
    };

    this.onFoucsTimeInput = function () {
        if (_this2.state.panel !== PANEL.TIME) {
            _this2.setState({
                panel: PANEL.TIME
            });
        }
    };

    this.onVisibleChange = function (visible, type) {
        if (!('visible' in _this2.props)) {
            _this2.setState({
                visible: visible
            });
        }
        _this2.props.onVisibleChange(visible, type);
    };

    this.changePanel = function (panel) {
        _this2.setState({
            panel: panel
        });
    };

    this.onOk = function () {
        _this2.onVisibleChange(false, 'okBtnClick');
        _this2.onValueChange(_this2.state.value, 'onOk');
    };
}, _temp);
DatePicker.displayName = 'DatePicker';
export { DatePicker as default };