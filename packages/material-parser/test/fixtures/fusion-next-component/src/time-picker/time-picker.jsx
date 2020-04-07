import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classnames from 'classnames';
import moment from 'moment';
import ConfigProvider from '../config-provider';
import Input from '../input';
import Overlay from '../overlay';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import TimePickerPanel from './panel';
import { checkDateValue, formatDateValue } from './utils';
import { onTimeKeydown } from '../date-picker/util';

const { Popup } = Overlay;
const { noop } = func;
const timePickerLocale = nextLocale.TimePicker;

/**
 * TimePicker
 */
class TimePicker extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 按钮的文案
         */
        label: PropTypes.node,
        /**
         * 输入框状态
         */
        state: PropTypes.oneOf(['error', 'success']),
        /**
         * 输入框提示
         */
        placeholder: PropTypes.string,
        /**
         * 时间值（moment 对象或时间字符串，受控状态使用）
         */
        value: checkDateValue,
        /**
         * 时间初值（moment 对象或时间字符串，非受控状态使用）
         */
        defaultValue: checkDateValue,
        /**
         * 时间选择框的尺寸
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        /**
         * 是否允许清空时间
         */
        hasClear: PropTypes.bool,
        /**
         * 时间的格式
         * https://momentjs.com/docs/#/parsing/string-format/
         */
        format: PropTypes.string,
        /**
         * 小时选项步长
         */
        hourStep: PropTypes.number,
        /**
         * 分钟选项步长
         */
        minuteStep: PropTypes.number,
        /**
         * 秒钟选项步长
         */
        secondStep: PropTypes.number,
        /**
         * 禁用小时函数
         * @param {Number} index 时 0 - 23
         * @return {Boolean} 是否禁用
         */
        disabledHours: PropTypes.func,
        /**
         * 禁用分钟函数
         * @param {Number} index 分 0 - 59
         * @return {Boolean} 是否禁用
         */
        disabledMinutes: PropTypes.func,
        /**
         * 禁用秒钟函数
         * @param {Number} index 秒 0 - 59
         * @return {Boolean} 是否禁用
         */
        disabledSeconds: PropTypes.func,
        /**
         * 渲染的可选择时间列表
         * [{
         *  label: '01',
         *  value: 1
         * }]
         * @param {Array} list 默认渲染的列表
         * @param {String} mode 渲染的菜单 hour, minute, second
         * @param {moment} value 当前时间，可能为 null
         * @return {Array} 返回需要渲染的数据
         */
        renderTimeMenuItems: PropTypes.func,
        /**
         * 弹层是否显示（受控）
         */
        visible: PropTypes.bool,
        /**
         * 弹层默认是否显示（非受控）
         */
        defaultVisible: PropTypes.bool,
        /**
         * 弹层容器
         * @param {Object} target 目标节点
         * @return {ReactNode} 容器节点
         */
        popupContainer: PropTypes.any,
        /**
         * 弹层对齐方式, 详情见Overlay 文档
         */
        popupAlign: PropTypes.string,
        /**
         * 弹层触发方式
         */
        popupTriggerType: PropTypes.oneOf(['click', 'hover']),
        /**
         * 弹层展示状态变化时的回调
         * @param {Boolean} visible 弹层是否隐藏和显示
         * @param {String} type 触发弹层显示和隐藏的来源 fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
         */
        onVisibleChange: PropTypes.func,
        /**
         * 弹层自定义样式
         */
        popupStyle: PropTypes.object,
        /**
         * 弹层自定义样式类
         */
        popupClassName: PropTypes.string,
        /**
         * 弹层属性
         */
        popupProps: PropTypes.object,
        /**
         * 是否跟随滚动
         */
        followTrigger: PropTypes.bool,
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        /**
         * 是否为预览态
         */
        isPreview: PropTypes.bool,
        /**
         * 预览态模式下渲染的内容
         * @param {MomentObject} value 时间
         */
        renderPreview: PropTypes.func,
        /**
         * 时间值改变时的回调
         * @param {Object|String} value 时间对象或时间字符串
         */
        onChange: PropTypes.func,
        className: PropTypes.string,
        name: PropTypes.string,
        inputProps: PropTypes.object,
        popupComponent: PropTypes.elementType,
        popupContent: PropTypes.node,
    };

    static defaultProps = {
        prefix: 'next-',
        rtl: false,
        locale: timePickerLocale,
        size: 'medium',
        format: 'HH:mm:ss',
        hasClear: true,
        disabled: false,
        popupAlign: 'tl tl',
        popupTriggerType: 'click',
        onChange: noop,
        onVisibleChange: noop,
    };

    constructor(props, context) {
        super(props, context);
        const value = formatDateValue(
            props.value || props.defaultValue,
            props.format
        );
        this.inputAsString =
            typeof (props.value || props.defaultValue) === 'string';
        this.state = {
            value,
            inputStr: '',
            inputing: false,
            visible: props.visible || props.defaultVisible,
        };
    }

    static getDerivedStateFromProps(props) {
        const state = {};

        if ('value' in props) {
            state.value = formatDateValue(props.value, props.format);
        }

        if ('visible' in props) {
            state.visible = props.visible;
        }

        return state;
    }

    onValueChange(newValue) {
        const ret =
            this.inputAsString && newValue
                ? newValue.format(this.props.format)
                : newValue;
        this.props.onChange(ret);
    }

    onClearValue = () => {
        this.setState({
            value: null,
        });
        if (this.state.value) {
            this.onValueChange(null);
        }
    };

    onInputChange = (inputValue, e, eventType) => {
        if (!('value' in this.props)) {
            if (eventType === 'clear' || !inputValue) {
                e.stopPropagation();
                this.onClearValue();
            }

            this.setState({
                inputStr: inputValue,
                inputing: true,
            });
        } else if (eventType === 'clear') {
            // 受控状态下用户点击 clear
            e.stopPropagation();
            this.onValueChange(null);
        }
    };

    onInputBlur = () => {
        const { inputStr } = this.state;
        if (inputStr) {
            const { format } = this.props;
            const parsed = moment(inputStr, format, true);
            if (parsed.isValid()) {
                this.setState({
                    value: parsed,
                    inputStr: '',
                });
                this.onValueChange(parsed);
            }
            this.setState({
                inputing: false,
            });
        }
    };

    onKeyown = e => {
        const { value, inputStr } = this.state;
        const {
            format,
            hourStep = 1,
            minuteStep = 1,
            secondStep = 1,
            disabledMinutes,
            disabledSeconds,
        } = this.props;

        let unit = 'second';

        if (disabledSeconds) {
            unit = disabledMinutes ? 'hour' : 'minute';
        }
        const timeStr = onTimeKeydown(
            e,
            {
                format,
                timeInputStr: inputStr,
                steps: {
                    hour: hourStep,
                    minute: minuteStep,
                    second: secondStep,
                },
                value,
            },
            unit
        );

        if (!timeStr) return;

        this.onInputChange(timeStr);
    };

    onTimePanelSelect = value => {
        if (!('value' in this.props)) {
            this.setState({
                value,
                inputing: false,
            });
        }
        if (
            !this.state.value ||
            value.valueOf() !== this.state.value.valueOf()
        ) {
            this.onValueChange(value);
        }
    };

    onVisibleChange = (visible, type) => {
        if (!('visible' in this.props)) {
            this.setState({
                visible,
            });
        }
        this.props.onVisibleChange(visible, type);
    };

    renderPreview(others) {
        const { prefix, format, className, renderPreview } = this.props;
        const { value } = this.state;
        const previewCls = classnames(className, `${prefix}form-preview`);

        const label = value ? value.format(format) : '';

        if (typeof renderPreview === 'function') {
            return (
                <div {...others} className={previewCls}>
                    {renderPreview(value, this.props)}
                </div>
            );
        }

        return (
            <p {...others} className={previewCls}>
                {label}
            </p>
        );
    }

    render() {
        const {
            prefix,
            label,
            state,
            placeholder,
            size,
            format,
            hasClear,
            hourStep,
            minuteStep,
            secondStep,
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            renderTimeMenuItems,
            inputProps,
            popupAlign,
            popupTriggerType,
            popupContainer,
            popupStyle,
            popupClassName,
            popupProps,
            popupComponent,
            popupContent,
            followTrigger,
            disabled,
            className,
            locale,
            rtl,
            isPreview,
            ...others
        } = this.props;

        const { value, inputStr, inputing, visible } = this.state;

        const triggerCls = classnames({
            [`${prefix}time-picker-trigger`]: true,
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(
                obj.pickOthers(others, TimePicker.PropTypes)
            );
        }

        const inputValue = inputing
            ? inputStr
            : (value && value.format(format)) || '';
        const sharedInputProps = {
            ...inputProps,
            size,
            disabled,
            value: inputValue,
            hasClear: value && hasClear,
            onChange: this.onInputChange,
            onBlur: this.onInputBlur,
            onPressEnter: this.onInputBlur,
            onKeyDown: this.onKeyown,
            hint: 'clock',
        };

        const triggerInput = (
            <div className={triggerCls}>
                <Input
                    {...sharedInputProps}
                    label={label}
                    state={state}
                    placeholder={placeholder || locale.placeholder}
                    className={`${prefix}time-picker-input`}
                />
            </div>
        );

        const panelProps = {
            prefix,
            locale,
            value,
            disabled,
            showHour: format.indexOf('H') > -1,
            showSecond: format.indexOf('s') > -1,
            showMinute: format.indexOf('m') > -1,
            hourStep,
            minuteStep,
            secondStep,
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            renderTimeMenuItems,
            onSelect: this.onTimePanelSelect,
        };

        const classNames = classnames(
            {
                [`${prefix}time-picker`]: true,
                [`${prefix}time-picker-${size}`]: size,
                [`${prefix}disabled`]: disabled,
            },
            className
        );

        const PopupComponent = popupComponent ? popupComponent : Popup;

        return (
            <div
                {...obj.pickOthers(TimePicker.propTypes, others)}
                className={classNames}
            >
                <PopupComponent
                    autoFocus
                    align={popupAlign}
                    {...popupProps}
                    followTrigger={followTrigger}
                    visible={visible}
                    onVisibleChange={this.onVisibleChange}
                    trigger={triggerInput}
                    container={popupContainer}
                    disabled={disabled}
                    triggerType={popupTriggerType}
                    style={popupStyle}
                    className={popupClassName}
                >
                    {popupContent ? (
                        popupContent
                    ) : (
                        <div
                            dir={others.dir}
                            className={`${prefix}time-picker-body`}
                        >
                            <div
                                className={`${prefix}time-picker-panel-header`}
                            >
                                <Input
                                    {...sharedInputProps}
                                    placeholder={format}
                                    className={`${prefix}time-picker-panel-input`}
                                />
                            </div>
                            <TimePickerPanel {...panelProps} />
                        </div>
                    )}
                </PopupComponent>
            </div>
        );
    }
}

export default polyfill(TimePicker);
