import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import ConfigProvider from '../config-provider';
import Overlay from '../overlay';
import Input from '../input';
import Calendar from '../calendar';
import RangeCalendar from '../calendar/range-calendar';
import TimePickerPanel from '../time-picker/panel';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import {
    PANEL,
    resetValueTime,
    formatDateValue,
    extend,
    getDateTimeFormat,
    isFunction,
    onDateKeydown,
    onTimeKeydown,
} from './util';
import PanelFooter from './module/panel-footer';

const { Popup } = Overlay;

function mapInputStateName(name) {
    return {
        startValue: 'startDateInputStr',
        endValue: 'endDateInputStr',
        startTime: 'startTimeInputStr',
        endTime: 'endTimeInputStr',
    }[name];
}

function mapTimeToValue(name) {
    return {
        startTime: 'startValue',
        endTime: 'endValue',
    }[name];
}

function getFormatValues(values, format) {
    if (!Array.isArray(values)) {
        return [null, null];
    }
    return [
        formatDateValue(values[0], format),
        formatDateValue(values[1], format),
    ];
}

/**
 * DatePicker.RangePicker
 */
export default class RangePicker extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 日期范围类型
         */
        type: PropTypes.oneOf(['date', 'month', 'year']),
        /**
         * 默认展示的起始月份
         * @return {MomentObject} 返回包含指定月份的 moment 对象实例
         */
        defaultVisibleMonth: PropTypes.func,
        onVisibleMonthChange: PropTypes.func,
        /**
         * 日期范围值数组 [moment, moment]
         */
        value: PropTypes.array,
        /**
         * 初始的日期范围值数组 [moment, moment]
         */
        defaultValue: PropTypes.array,
        /**
         * 日期格式
         */
        format: PropTypes.string,
        /**
         * 是否使用时间控件，支持传入 TimePicker 的属性
         */
        showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        /**
         * 每次选择是否重置时间（仅在 showTime 开启时有效）
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
         * 日期范围值改变时的回调 [ MomentObject|String, MomentObject|String ]
         * @param {Array<MomentObject|String>} value 日期值
         */
        onChange: PropTypes.func,
        /**
         * 点击确认按钮时的回调 返回开始时间和结束时间`[ MomentObject|String, MomentObject|String ]`
         * @return {Array} 日期范围
         */
        onOk: PropTypes.func,
        /**
         * 输入框内置标签
         */
        label: PropTypes.node,
        /**
         * 输入框状态
         */
        state: PropTypes.oneOf(['error', 'loading', 'success']),
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
         * @param {String} type 触发弹层显示和隐藏的来源 okBtnClick 表示由确认按钮触发； fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
         */
        onVisibleChange: PropTypes.func,
        /**
         * 弹层触发方式
         */
        popupTriggerType: PropTypes.oneOf(['click', 'hover']),
        /**
         * 弹层对齐方式, 具体含义见 OverLay文档
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
         * 自定义日期单元格渲染
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
         * 开始日期输入框的 aria-label 属性
         */
        startDateInputAriaLabel: PropTypes.string,
        /**
         * 开始时间输入框的 aria-label 属性
         */
        startTimeInputAriaLabel: PropTypes.string,
        /**
         * 结束日期输入框的 aria-label 属性
         */
        endDateInputAriaLabel: PropTypes.string,
        /**
         * 结束时间输入框的 aria-label 属性
         */
        endTimeInputAriaLabel: PropTypes.string,
        /**
         * 是否为预览态
         */
        isPreview: PropTypes.bool,
        /**
         * 预览态模式下渲染的内容
         * @param {Array<MomentObject, MomentObject>} value 日期区间
         */
        renderPreview: PropTypes.func,
        disableChangeMode: PropTypes.bool,
        yearRange: PropTypes.arrayOf(PropTypes.number),
        ranges: PropTypes.object, // 兼容0.x版本
        locale: PropTypes.object,
        className: PropTypes.string,
        name: PropTypes.string,
        popupComponent: PropTypes.elementType,
        popupContent: PropTypes.node,
        placeholder: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string,
        ]),
    };

    static defaultProps = {
        prefix: 'next-',
        rtl: false,
        type: 'date',
        size: 'medium',
        showTime: false,
        resetTime: false,
        format: 'YYYY-MM-DD',
        disabledDate: () => false,
        footerRender: () => null,
        hasClear: true,
        defaultVisible: false,
        popupTriggerType: 'click',
        popupAlign: 'tl tl',
        locale: nextLocale.DatePicker,
        disableChangeMode: false,
        onChange: func.noop,
        onOk: func.noop,
        onVisibleChange: func.noop,
    };

    constructor(props, context) {
        super(props, context);
        const dateTimeFormat = getDateTimeFormat(
            props.format,
            props.showTime,
            props.type
        );
        extend(dateTimeFormat, this);

        const val = props.value || props.defaultValue;
        const values = getFormatValues(val, this.dateTimeFormat);
        this.inputAsString =
            val && (typeof val[0] === 'string' || typeof val[1] === 'string');
        this.state = {
            visible: props.visible || props.defaultVisible,
            startValue: values[0],
            endValue: values[1],
            startDateInputStr: '',
            endDateInputStr: '',
            activeDateInput: 'startValue',
            startTimeInputStr: '',
            endTimeInputStr: '',
            inputing: false, // 当前是否处于输入状态
            panel: PANEL.DATE,
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('showTime' in nextProps) {
            const dateTimeFormat = getDateTimeFormat(
                nextProps.format || this.props.format,
                nextProps.showTime,
                nextProps.type
            );
            extend(dateTimeFormat, this);
        }

        if ('value' in nextProps) {
            const values = getFormatValues(
                nextProps.value,
                this.dateTimeFormat
            );
            this.setState({
                startValue: values[0],
                endValue: values[1],
            });
            this.inputAsString =
                nextProps.value &&
                (typeof nextProps.value[0] === 'string' ||
                    typeof nextProps.value[1] === 'string');
        }

        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible,
            });
        }
    }

    onValueChange = (values, handler = 'onChange') => {
        let ret;
        if (!values.length || !this.inputAsString) {
            ret = values;
        } else {
            ret = [
                values[0] ? values[0].format(this.dateTimeFormat) : null,
                values[1] ? values[1].format(this.dateTimeFormat) : null,
            ];
        }
        this.props[handler](ret);
    };

    onSelectCalendarPanel = (value, active) => {
        const { showTime, resetTime } = this.props;
        const {
            activeDateInput: prevActiveDateInput,
            startValue: prevStartValue,
            endValue: prevEndValue,
        } = this.state;

        const newState = {
            activeDateInput: active || prevActiveDateInput,
            inputing: false,
        };

        let newValue = value;
        switch (active || prevActiveDateInput) {
            case 'startValue': {
                if (
                    !prevEndValue ||
                    value.valueOf() <= prevEndValue.valueOf()
                ) {
                    newState.activeDateInput = 'endValue';
                }

                if (showTime) {
                    if (!prevStartValue) {
                        // 第一次选择，如果设置了时间默认值，则使用该默认时间
                        if (showTime.defaultValue) {
                            const defaultTimeValue = formatDateValue(
                                Array.isArray(showTime.defaultValue)
                                    ? showTime.defaultValue[0]
                                    : showTime.defaultValue,
                                this.timeFormat
                            );
                            newValue = resetValueTime(value, defaultTimeValue);
                        }
                    } else if (!resetTime) {
                        // 非第一次选择，如果开启了 resetTime ，则记住之前选择的时间值
                        newValue = resetValueTime(value, prevStartValue);
                    }
                }

                newState.startValue = newValue;

                if (prevEndValue && value.valueOf() > prevEndValue.valueOf()) {
                    newState.endValue = null;
                    newState.activeDateInput = 'endValue';
                }
                break;
            }

            case 'endValue':
                if (!prevStartValue) {
                    newState.activeDateInput = 'startValue';
                }

                if (showTime) {
                    if (!prevEndValue) {
                        // 第一次选择，如果设置了时间默认值，则使用该默认时间
                        if (showTime.defaultValue) {
                            const defaultTimeValue = formatDateValue(
                                Array.isArray(showTime.defaultValue)
                                    ? showTime.defaultValue[1] ||
                                          showTime.defaultValue[0]
                                    : showTime.defaultValue,
                                this.timeFormat
                            );
                            newValue = resetValueTime(value, defaultTimeValue);
                        }
                    } else if (!resetTime) {
                        // 非第一次选择，如果开启了 resetTime ，则记住之前选择的时间值
                        newValue = resetValueTime(value, prevEndValue);
                    }
                }

                newState.endValue = newValue;

                // 选择了一个比开始日期更小的结束日期，此时表示用户重新选择了
                if (
                    prevStartValue &&
                    value.valueOf() < prevStartValue.valueOf()
                ) {
                    newState.startValue = value;
                    newState.endValue = null;
                }
                break;
        }

        const newStartValue =
            'startValue' in newState ? newState.startValue : prevStartValue;
        const newEndValue =
            'endValue' in newState ? newState.endValue : prevEndValue;

        // 受控状态选择不更新值
        if ('value' in this.props) {
            delete newState.startValue;
            delete newState.endValue;
        }

        this.setState(newState);

        this.onValueChange([newStartValue, newEndValue]);
    };

    clearRange = () => {
        this.setState({
            startDateInputStr: '',
            endDateInputStr: '',
            startTimeInputStr: '',
            endTimeInputStr: '',
        });

        if (!('value' in this.props)) {
            this.setState({
                startValue: null,
                endValue: null,
            });
        }

        this.onValueChange([]);
    };

    onDateInputChange = (inputStr, e, eventType) => {
        if (eventType === 'clear' || !inputStr) {
            e.stopPropagation();
            this.clearRange();
        } else {
            const stateName = mapInputStateName(this.state.activeDateInput);
            this.setState({
                [stateName]: inputStr,
                inputing: this.state.activeDateInput,
            });
        }
    };

    onDateInputBlur = () => {
        const stateName = mapInputStateName(this.state.activeDateInput);
        const dateInputStr = this.state[stateName];
        if (dateInputStr) {
            const { format, disabledDate } = this.props;
            const parsed = moment(dateInputStr, format, true);

            this.setState({
                [stateName]: '',
                inputing: false,
            });

            if (parsed.isValid() && !disabledDate(parsed, 'date')) {
                const valueName = this.state.activeDateInput;
                const newValue = parsed;

                this.handleChange(valueName, newValue);
            }
        }
    };

    onDateInputKeyDown = e => {
        const { type } = this.props;
        const { activeDateInput } = this.state;
        const stateName = mapInputStateName(activeDateInput);
        const dateInputStr = this.state[stateName];
        const dateStr = onDateKeydown(
            e,
            {
                format: this.format,
                value: this.state[activeDateInput],
                dateInputStr,
            },
            type === 'date' ? 'day' : type
        );
        if (!dateStr) return;

        return this.onDateInputChange(dateStr);
    };

    onFocusDateInput = type => {
        if (type !== this.state.activeDateInput) {
            this.setState({
                activeDateInput: type,
            });
        }
        if (this.state.panel !== PANEL.DATE) {
            this.setState({
                panel: PANEL.DATE,
            });
        }
    };

    onFocusTimeInput = type => {
        if (type !== this.state.activeDateInput) {
            this.setState({
                activeDateInput: type,
            });
        }

        if (this.state.panel !== PANEL.TIME) {
            this.setState({
                panel: PANEL.TIME,
            });
        }
    };

    onSelectStartTime = value => {
        if (!('value' in this.props)) {
            this.setState({
                startValue: value,
                inputing: false,
                activeDateInput: 'startTime',
            });
        }
        if (value.valueOf() !== this.state.startValue.valueOf()) {
            this.onValueChange([value, this.state.endValue]);
        }
    };

    onSelectEndTime = value => {
        if (!('value' in this.props)) {
            this.setState({
                endValue: value,
                inputing: false,
                activeDateInput: 'endTime',
            });
        }
        if (value.valueOf() !== this.state.endValue.valueOf()) {
            this.onValueChange([this.state.startValue, value]);
        }
    };

    onTimeInputChange = inputStr => {
        const stateName = mapInputStateName(this.state.activeDateInput);
        this.setState({
            [stateName]: inputStr,
            inputing: this.state.activeDateInput,
        });
    };

    onTimeInputBlur = () => {
        const stateName = mapInputStateName(this.state.activeDateInput);
        const timeInputStr = this.state[stateName];
        if (timeInputStr) {
            const parsed = moment(timeInputStr, this.timeFormat, true);

            this.setState({
                [stateName]: '',
                inputing: false,
            });

            if (parsed.isValid()) {
                const hour = parsed.hour();
                const minute = parsed.minute();
                const second = parsed.second();
                const valueName = mapTimeToValue(this.state.activeDateInput);
                const newValue = this.state[valueName]
                    .clone()
                    .hour(hour)
                    .minute(minute)
                    .second(second);

                this.handleChange(valueName, newValue);
            }
        }
    };

    onTimeInputKeyDown = e => {
        const { showTime } = this.props;
        const { activeDateInput } = this.state;
        const stateName = mapInputStateName(activeDateInput);
        const timeInputStr = this.state[stateName];
        const {
            disabledMinutes,
            disabledSeconds,
            hourStep = 1,
            minuteStep = 1,
            secondStep = 1,
        } = typeof showTime === 'object' ? showTime : {};
        let unit = 'second';

        if (disabledSeconds) {
            unit = disabledMinutes ? 'hour' : 'minute';
        }

        const timeStr = onTimeKeydown(
            e,
            {
                format: this.timeFormat,
                timeInputStr,
                value: this.state[
                    activeDateInput.indexOf('start') ? 'startValue' : 'endValue'
                ],
                steps: {
                    hour: hourStep,
                    minute: minuteStep,
                    second: secondStep,
                },
            },
            unit
        );

        if (!timeStr) return;

        this.onTimeInputChange(timeStr);
    };

    handleChange = (valueName, newValue) => {
        if (!('value' in this.props)) {
            this.setState({
                [valueName]: newValue,
            });
        }

        const startValue =
            valueName === 'startValue' ? newValue : this.state.startValue;
        const endValue =
            valueName === 'endValue' ? newValue : this.state.endValue;

        this.onValueChange([startValue, endValue]);
    };

    onVisibleChange = (visible, type) => {
        if (!('visible' in this.props)) {
            this.setState({
                visible,
            });
        }
        this.props.onVisibleChange(visible, type);
    };

    changePanel = panel => {
        const { startValue, endValue } = this.state;
        this.setState({
            panel,
            activeDateInput:
                panel === PANEL.DATE
                    ? !!startValue && !endValue
                        ? 'endValue'
                        : 'startValue'
                    : 'startTime',
        });
    };

    onOk = () => {
        this.onVisibleChange(false, 'okBtnClick');
        this.onValueChange(
            [this.state.startValue, this.state.endValue],
            'onOk'
        );
    };

    // 如果用户没有给定时间禁用逻辑，则给默认到禁用逻辑，即如果是同一天，则时间不能是同样的
    getDisabledTime = ({ startValue, endValue }) => {
        const { disabledHours, disabledMinutes, disabledSeconds } =
            this.props.showTime || {};

        let disabledTime = {};

        if (startValue && endValue) {
            const isSameDay = startValue.format('L') === endValue.format('L');
            const newDisabledHours = isFunction(disabledHours)
                ? disabledHours
                : index => {
                      if (isSameDay && index < startValue.hour()) {
                          return true;
                      }
                  };

            const newDisabledMinutes = isFunction(disabledMinutes)
                ? disabledMinutes
                : index => {
                      if (
                          isSameDay &&
                          startValue.hour() === endValue.hour() &&
                          index < startValue.minute()
                      ) {
                          return true;
                      }
                  };

            const newDisabledSeconds = isFunction(disabledSeconds)
                ? disabledSeconds
                : index => {
                      if (
                          isSameDay &&
                          startValue.hour() === endValue.hour() &&
                          startValue.minute() === endValue.minute() &&
                          index <= startValue.second()
                      ) {
                          return true;
                      }
                  };
            disabledTime = {
                disabledHours: newDisabledHours,
                disabledMinutes: newDisabledMinutes,
                disabledSeconds: newDisabledSeconds,
            };
        }

        return disabledTime;
    };

    renderPreview([startValue, endValue], others) {
        const { prefix, format, className, renderPreview } = this.props;

        const previewCls = classnames(className, `${prefix}form-preview`);
        const startLabel = startValue ? startValue.format(format) : '';
        const endLabel = endValue ? endValue.format(format) : '';

        if (typeof renderPreview === 'function') {
            return (
                <div {...others} className={previewCls}>
                    {renderPreview([startValue, endValue], this.props)}
                </div>
            );
        }

        return (
            <p {...others} className={previewCls}>
                {startLabel} - {endLabel}
            </p>
        );
    }

    render() {
        const {
            prefix,
            rtl,
            type,
            defaultVisibleMonth,
            onVisibleMonthChange,
            showTime,
            disabledDate,
            footerRender,
            label,
            ranges = {}, // 兼容0.x ranges 属性
            state: inputState,
            size,
            disabled,
            hasClear,
            popupTriggerType,
            popupAlign,
            popupContainer,
            popupStyle,
            popupClassName,
            popupProps,
            popupComponent,
            popupContent,
            followTrigger,
            className,
            locale,
            inputProps,
            dateCellRender,
            monthCellRender,
            yearCellRender,
            startDateInputAriaLabel,
            startTimeInputAriaLabel,
            endDateInputAriaLabel,
            endTimeInputAriaLabel,
            isPreview,
            disableChangeMode,
            yearRange,
            placeholder,
            ...others
        } = this.props;

        const state = this.state;

        const classNames = classnames(
            {
                [`${prefix}range-picker`]: true,
                [`${prefix}${size}`]: size,
                [`${prefix}disabled`]: disabled,
            },
            className
        );

        const panelBodyClassName = classnames({
            [`${prefix}range-picker-body`]: true,
            [`${prefix}range-picker-body-show-time`]: showTime,
        });

        const triggerCls = classnames({
            [`${prefix}range-picker-trigger`]: true,
            [`${prefix}error`]: inputState === 'error',
        });

        const startDateInputCls = classnames({
            [`${prefix}range-picker-panel-input-start-date`]: true,
            [`${prefix}focus`]: state.activeDateInput === 'startValue',
        });

        const endDateInputCls = classnames({
            [`${prefix}range-picker-panel-input-end-date`]: true,
            [`${prefix}focus`]: state.activeDateInput === 'endValue',
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(
                [state.startValue, state.endValue],
                obj.pickOthers(others, RangePicker.PropTypes)
            );
        }

        const startDateInputValue =
            state.inputing === 'startValue'
                ? state.startDateInputStr
                : (state.startValue && state.startValue.format(this.format)) ||
                  '';
        const endDateInputValue =
            state.inputing === 'endValue'
                ? state.endDateInputStr
                : (state.endValue && state.endValue.format(this.format)) || '';

        let startTriggerValue = startDateInputValue;
        let endTriggerValue = endDateInputValue;

        const sharedInputProps = {
            ...inputProps,
            size,
            disabled,
            onChange: this.onDateInputChange,
            onBlur: this.onDateInputBlur,
            onPressEnter: this.onDateInputBlur,
            onKeyDown: this.onDateInputKeyDown,
        };

        const startDateInput = (
            <Input
                {...sharedInputProps}
                aria-label={startDateInputAriaLabel}
                placeholder={this.format}
                value={startDateInputValue}
                onFocus={() => this.onFocusDateInput('startValue')}
                className={startDateInputCls}
            />
        );

        const endDateInput = (
            <Input
                {...sharedInputProps}
                aria-label={endDateInputAriaLabel}
                placeholder={this.format}
                value={endDateInputValue}
                onFocus={() => this.onFocusDateInput('endValue')}
                className={endDateInputCls}
            />
        );

        const shareCalendarProps = {
            showOtherMonth: true,
            dateCellRender: dateCellRender,
            monthCellRender: monthCellRender,
            yearCellRender: yearCellRender,
            format: this.format,
            defaultVisibleMonth: defaultVisibleMonth,
            onVisibleMonthChange: onVisibleMonthChange,
        };

        const datePanel =
            type === 'date' ? (
                <RangeCalendar
                    {...shareCalendarProps}
                    yearRange={yearRange}
                    disableChangeMode={disableChangeMode}
                    disabledDate={disabledDate}
                    onSelect={this.onSelectCalendarPanel}
                    startValue={state.startValue}
                    endValue={state.endValue}
                />
            ) : (
                <div className={`${prefix}range-picker-panel-body`}>
                    <Calendar
                        shape="panel"
                        modes={type === 'month' ? ['month', 'year'] : ['year']}
                        {...{ ...shareCalendarProps }}
                        disabledDate={date => {
                            return (
                                state.endValue &&
                                date.isAfter(state.endValue, type)
                            );
                        }}
                        onSelect={value => {
                            const selectedValue = value
                                .clone()
                                .date(1)
                                .hour(0)
                                .minute(0)
                                .second(0);
                            if (type === 'year') {
                                selectedValue.month(0);
                            }
                            this.onSelectCalendarPanel(
                                selectedValue,
                                'startValue'
                            );
                        }}
                        value={state.startValue}
                    />
                    <Calendar
                        shape="panel"
                        modes={type === 'month' ? ['month', 'year'] : ['year']}
                        {...shareCalendarProps}
                        disabledDate={date => {
                            return (
                                state.startValue &&
                                date.isBefore(state.startValue, type)
                            );
                        }}
                        onSelect={value => {
                            const selectedValue = value
                                .clone()
                                .hour(23)
                                .minute(59)
                                .second(59);
                            if (type === 'year') {
                                selectedValue.month(11).date(31);
                            } else {
                                selectedValue.date(selectedValue.daysInMonth());
                            }
                            this.onSelectCalendarPanel(
                                selectedValue,
                                'endValue'
                            );
                        }}
                        value={state.endValue}
                    />
                </div>
            );

        let startTimeInput = null;
        let endTimeInput = null;
        let timePanel = null;
        let panelFooter = footerRender();

        if (showTime) {
            const startTimeInputValue =
                state.inputing === 'startTime'
                    ? state.startTimeInputStr
                    : (state.startValue &&
                          state.startValue.format(this.timeFormat)) ||
                      '';
            const endTimeInputValue =
                state.inputing === 'endTime'
                    ? state.endTimeInputStr
                    : (state.endValue &&
                          state.endValue.format(this.timeFormat)) ||
                      '';

            startTriggerValue =
                (state.startValue &&
                    state.startValue.format(this.dateTimeFormat)) ||
                '';
            endTriggerValue =
                (state.endValue &&
                    state.endValue.format(this.dateTimeFormat)) ||
                '';

            const sharedTimeInputProps = {
                size,
                placeholder: this.timeFormat,
                onFocus: this.onFocusTimeInput,
                onBlur: this.onTimeInputBlur,
                onPressEnter: this.onTimeInputBlur,
                onChange: this.onTimeInputChange,
                onKeyDown: this.onTimeInputKeyDown,
            };

            const startTimeInputCls = classnames({
                [`${prefix}range-picker-panel-input-start-time`]: true,
                [`${prefix}focus`]: state.activeDateInput === 'startTime',
            });

            startTimeInput = (
                <Input
                    {...sharedTimeInputProps}
                    value={startTimeInputValue}
                    aria-label={startTimeInputAriaLabel}
                    disabled={disabled || !state.startValue}
                    onFocus={() => this.onFocusTimeInput('startTime')}
                    className={startTimeInputCls}
                />
            );

            const endTimeInputCls = classnames({
                [`${prefix}range-picker-panel-input-end-time`]: true,
                [`${prefix}focus`]: state.activeDateInput === 'endTime',
            });

            endTimeInput = (
                <Input
                    {...sharedTimeInputProps}
                    value={endTimeInputValue}
                    aria-label={endTimeInputAriaLabel}
                    disabled={disabled || !state.endValue}
                    onFocus={() => this.onFocusTimeInput('endTime')}
                    className={endTimeInputCls}
                />
            );

            const showSecond = this.timeFormat.indexOf('s') > -1;
            const showMinute = this.timeFormat.indexOf('m') > -1;

            const sharedTimePickerProps = {
                ...showTime,
                prefix,
                locale,
                disabled,
                showSecond,
                showMinute,
            };

            const disabledTime = this.getDisabledTime(state);

            timePanel = (
                <div className={`${prefix}range-picker-panel-time`}>
                    <TimePickerPanel
                        {...sharedTimePickerProps}
                        disabled={disabled || !state.startValue}
                        className={`${prefix}range-picker-panel-time-start`}
                        value={state.startValue}
                        onSelect={this.onSelectStartTime}
                    />
                    <TimePickerPanel
                        {...sharedTimePickerProps}
                        {...disabledTime}
                        disabled={disabled || !state.endValue}
                        className={`${prefix}range-picker-panel-time-end`}
                        value={state.endValue}
                        onSelect={this.onSelectEndTime}
                    />
                </div>
            );
        }

        panelFooter = panelFooter || (
            <PanelFooter
                prefix={prefix}
                value={state.startValue || state.endValue}
                ranges={Object.keys(ranges).map(key => ({
                    label: key,
                    value: ranges[key],
                    onChange: values => {
                        this.setState({
                            startValue: values[0],
                            endValue: values[1],
                        });
                        this.onValueChange(values);
                    },
                }))}
                disabledOk={
                    !state.startValue ||
                    !state.endValue ||
                    state.startValue.valueOf() > state.endValue.valueOf()
                }
                locale={locale}
                panel={state.panel}
                onPanelChange={showTime ? this.changePanel : null}
                onOk={this.onOk}
            />
        );

        const panelBody = {
            [PANEL.DATE]: datePanel,
            [PANEL.TIME]: timePanel,
        }[state.panel];

        const allowClear = state.startValue && state.endValue && hasClear;
        let [startPlaceholder, endPlaceholder] = placeholder || [];

        if (typeof placeholder === 'string') {
            startPlaceholder = placeholder;
            endPlaceholder = placeholder;
        }

        const trigger = (
            <div className={triggerCls}>
                <Input
                    {...sharedInputProps}
                    readOnly
                    role="combobox"
                    aria-expanded={state.visible}
                    label={label}
                    placeholder={startPlaceholder || locale.startPlaceholder}
                    value={startTriggerValue}
                    hasBorder={false}
                    className={`${prefix}range-picker-trigger-input`}
                    onFocus={() => this.onFocusDateInput('startValue')}
                />
                <span className={`${prefix}range-picker-trigger-separator`}>
                    -
                </span>
                <Input
                    {...sharedInputProps}
                    readOnly
                    role="combobox"
                    aria-expanded={state.visible}
                    placeholder={endPlaceholder || locale.endPlaceholder}
                    value={endTriggerValue}
                    hasBorder={false}
                    className={`${prefix}range-picker-trigger-input`}
                    onFocus={() => this.onFocusDateInput('endValue')}
                    hasClear={allowClear}
                    hint="calendar"
                />
            </div>
        );

        const PopupComponent = popupComponent ? popupComponent : Popup;

        return (
            <div
                {...obj.pickOthers(RangePicker.propTypes, others)}
                className={classNames}
            >
                <PopupComponent
                    autoFocus
                    align={popupAlign}
                    {...popupProps}
                    followTrigger={followTrigger}
                    disabled={disabled}
                    visible={state.visible}
                    onVisibleChange={this.onVisibleChange}
                    triggerType={popupTriggerType}
                    container={popupContainer}
                    style={popupStyle}
                    className={popupClassName}
                    trigger={trigger}
                >
                    {popupContent ? (
                        popupContent
                    ) : (
                        <div dir={others.dir} className={panelBodyClassName}>
                            <div
                                className={`${prefix}range-picker-panel-header`}
                            >
                                <div
                                    className={`${prefix}range-picker-panel-input`}
                                >
                                    {startDateInput}
                                    {startTimeInput}
                                    <span
                                        className={`${prefix}range-picker-panel-input-separator`}
                                    >
                                        -
                                    </span>
                                    {endDateInput}
                                    {endTimeInput}
                                </div>
                            </div>
                            {panelBody}
                            {panelFooter}
                        </div>
                    )}
                </PopupComponent>
            </div>
        );
    }
}
