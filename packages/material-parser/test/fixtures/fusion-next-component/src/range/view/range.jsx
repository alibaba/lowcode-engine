import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import { events, func, KEYCODE, dom, obj } from '../../util';
import Balloon from '../../balloon';
import { getPercent, getPrecision, isEqual, getDragging } from '../utils';
import Scale from './scale';
import Track from './track';
import Selected from './selected';
import Mark from './mark';
import Slider from './slider';
import FixedSlider from './fixedSlider';

const Tooltip = Balloon.Tooltip;
const { noop, bindCtx } = func;
const { pickOthers } = obj;

function _isMultiple(slider, isFixedWidth) {
    return isFixedWidth || slider === 'double';
}

function LowerSlider(props) {
    const {
        hasTip,
        value,
        tipRender,
        slider,
        tooltipVisible,
        onTooltipVisibleChange,
        tooltipAnimation,
    } = props;

    if (_isMultiple(slider)) {
        return hasTip ? (
            <Tooltip
                popupContainer={target => target.parentNode}
                popupProps={{
                    visible: tooltipVisible,
                    onVisibleChange: onTooltipVisibleChange,
                    animation: tooltipAnimation,
                    needAdjust: false,
                }}
                trigger={Slider({ ...props, value: value[0] })}
                align="t"
            >
                {tipRender(`${value[0]}`)}
            </Tooltip>
        ) : (
            Slider({ ...props, value: value[0] })
        );
    }
    return null;
}

LowerSlider.propTypes = {
    hasTip: PropTypes.bool,
    tooltipVisible: PropTypes.bool,
    onTooltipVisibleChange: PropTypes.func,
    tooltipAnimation: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.number),
    ]),
    tipRender: PropTypes.func,
    slider: PropTypes.oneOf(['single', 'double']),
};

function UpperSlider(props) {
    const newprop = Object.assign({}, props);
    const {
        hasTip,
        value,
        tipRender,
        slider,
        tooltipVisible,
        onTooltipVisibleChange,
        tooltipAnimation,
    } = newprop;
    if (_isMultiple(slider)) {
        delete newprop.onKeyDown;
        return hasTip ? (
            <Tooltip
                popupContainer={target => target.parentNode}
                popupProps={{
                    visible: tooltipVisible,
                    onVisibleChange: onTooltipVisibleChange,
                    animation: tooltipAnimation,
                    needAdjust: false,
                }}
                trigger={Slider({ ...newprop, value: value[1] })}
                align="t"
            >
                {tipRender(value[1])}
            </Tooltip>
        ) : (
            Slider({ ...newprop, value: value[1] })
        );
    }
    return hasTip ? (
        <Tooltip
            popupContainer={target => target.parentNode}
            popupProps={{
                visible: tooltipVisible,
                onVisibleChange: onTooltipVisibleChange,
                animation: tooltipAnimation,
                needAdjust: false,
            }}
            animation={{
                in: 'fadeInUp',
                out: 'fadeOutDown',
            }}
            trigger={Slider(newprop)}
            align="t"
        >
            {tipRender(value)}
        </Tooltip>
    ) : (
        Slider(newprop)
    );
}

UpperSlider.propTypes = {
    hasTip: PropTypes.bool,
    tooltipVisible: PropTypes.bool,
    onTooltipVisibleChange: PropTypes.func,
    tooltipAnimation: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.number),
    ]),
    tipRender: PropTypes.func,
    slider: PropTypes.oneOf(['single', 'double']),
};

function pauseEvent(e) {
    e.stopPropagation();
    e.preventDefault();
}

/** Range */
class Range extends React.Component {
    static contextTypes = {
        prefix: PropTypes.string,
    };
    static propTypes = {
        /**
         * 样式类名的品牌前缀
         */
        prefix: PropTypes.string,
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * 自定义内敛样式
         */
        style: PropTypes.object,
        /**
         * 滑块个数
         * @enumdesc 单个, 两个
         */
        slider: PropTypes.oneOf(['single', 'double']),
        /**
         * 最小值
         */
        min: PropTypes.number,
        /**
         * 最大值
         */
        max: PropTypes.number,
        /**
         * 步长，取值必须大于 0，并且可被 (max - min) 整除。
         */
        step: PropTypes.number,
        /**
         * 设置当前取值。当 `slider` 为 `single` 时，使用 `Number`，否则用 `[Number, Number]`
         */
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
        ]),
        tempValue: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
        ]),
        /**
         * 设置初始取值。当 `slider` 为 `single` 时，使用 `Number`，否则用 `[Number, Number]`
         */
        defaultValue: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
        ]),
        /**
         * 刻度数值显示逻辑（false 代表不显示，array 枚举显示的值，number 代表按 number 平分，object 表示按 key 划分，value 值显示）
         */
        marks: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.object,
        ]),
        /**
         * marks显示在上方('above')or下方('below')
         */
        marksPosition: PropTypes.oneOf(['above', 'below']),
        /**
         * 值为 `true` 时，滑块为禁用状态
         */
        disabled: PropTypes.bool,
        /**
         * 当 Range 的值发生改变后，会触发 onChange 事件，并把改变后的值作为参数传入, 如果设置了value, 要配合此函数做受控使用
         * @param {String/number} value
         */
        onChange: PropTypes.func,
        /**
         * 滑块拖动的时候触发的事件,不建议在这里setState, 一般情况下不需要用, 滑动时有特殊需求时使用
         * @param {String/number} value
         */
        onProcess: PropTypes.func,
        /**
         * 是否显示 tip
         */
        hasTip: PropTypes.bool,
        /**
         * 自定义 tip 显示内容
         * @param {Number|String} value 值
         * @return {ReactNode} 显示内容
         */
        tipRender: PropTypes.func,
        id: PropTypes.string,
        /**
         * 选中态反转
         */
        reverse: PropTypes.bool,
        /**
         * 是否pure render
         */
        pure: PropTypes.bool,
        /**
         * 是否为拖动线段类型,默认slider为double, defaultValue必传且指定区间
         */
        fixedWidth: PropTypes.bool,
        /**
         * tooltip是否默认展示
         */
        tooltipVisible: PropTypes.bool,
        /**
         * 是否已rtl模式展示
         */
        rtl: PropTypes.bool,
        /**
         * 是否为预览态
         */
        isPreview: PropTypes.bool,
        /**
         * 预览态模式下渲染的内容
         * @param {number} value 评分值
         */
        renderPreview: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        slider: 'single',
        min: 0,
        max: 100,
        step: 1,
        marks: false,
        disabled: false,
        fixedWidth: false,
        tooltipVisible: false,
        hasTip: true,
        onChange: noop,
        onProcess: noop,
        tipRender: value => value,
        reverse: false,
        pure: false,
        marksPosition: 'above',
        rtl: false,
        isPreview: false,
    };

    constructor(props) {
        super(props);
        const { min } = props;
        const initialValue = _isMultiple(props.slider) ? [min, min] : min;
        const defaultValue =
            'defaultValue' in props ? props.defaultValue : initialValue;
        const value = props.value !== undefined ? props.value : defaultValue;

        this.state = {
            value,
            tempValue: value,
            hasMovingClass: false,
            lowerTooltipVisible: false,
            upperTooltipVisible: false,
            tooltipAnimation: true,
        };

        bindCtx(this, [
            'handleLowerTooltipVisibleChange',
            'handleUpperTooltipVisibleChange',
            'onKeyDown',
        ]);
    }

    static getDerivedStateFromProps(props, state) {
        if ('value' in props) {
            const { min, slider, value } = props;
            const { hasMovingClass } = state;
            const newState = {
                value,
            };

            if (value === undefined) {
                newState.value = _isMultiple(slider) ? [min, min] : min;
            }

            if (!hasMovingClass) {
                newState.tempValue = newState.value;
            }

            return newState;
        }
        return null;
    }

    _marksToScales(marks) {
        let result = [];
        if (Object.prototype.toString.call(marks) === '[object Object]') {
            for (const key in marks) {
                if (Object.hasOwnProperty.call(marks, key)) {
                    result.push(parseInt(key));
                }
            }
        } else {
            result = marks;
        }
        return result;
    }

    _calcScales() {
        const { min, max, marks } = this.props;
        const scales = this._marksToScales(marks);

        if (scales !== false) {
            if (Array.isArray(scales)) {
                return scales;
            } else {
                const pace = (max - min) / scales;
                const result = [];

                result.push(min);
                for (let i = 1; i < scales; i++) {
                    result.push(min + i * pace);
                }
                result.push(max);
                return result;
            }
        } else {
            return [];
        }
    }

    _calcMarks() {
        const { min, max, marks } = this.props;

        let result = {};

        if (Array.isArray(marks)) {
            marks.forEach(m => {
                result[m] = m.toString();
            });
        } else if (typeof marks === 'number') {
            const pace = (max - min) / marks;

            result[min] = min;
            for (let i = 1; i < marks; i++) {
                let mark = min + i * pace;
                let precision = getPrecision(mark);
                if (precision > 2) {
                    precision = 2;
                }
                mark = mark.toFixed(precision);
                result[mark] = mark;
            }
            result[max] = max;
        } else {
            result = marks;
        }
        return result;
    }

    _onMouseDown(e) {
        if (e.button === 0) {
            this._start(e.pageX);
            this._addDocumentMouseEvents();
            pauseEvent(e);
        }
    }

    _onTouchStart(e) {
        this._start(e.targetTouches[0].pageX);
        this._addDocumentTouchEvents();
        e.stopPropagation(); // preventDefault() will be ignored: https://www.chromestatus.com/features/5093566007214080
    }

    onKeyDown(e) {
        if (this.props.disabled) return;

        if (
            e.keyCode === KEYCODE.LEFT_ARROW ||
            e.keyCode === KEYCODE.RIGHT_ARROW
        ) {
            e.stopPropagation();
            e.preventDefault();
            let newValue;
            if (e.keyCode === KEYCODE.LEFT_ARROW) {
                newValue = this.state.value - this.props.step;
            } else {
                newValue = this.state.value + this.props.step;
            }
            if (newValue > this.props.max) {
                newValue = this.props.max;
            }
            if (newValue < this.props.min) {
                newValue = this.props.min;
            }
            if (newValue !== this.state.value) {
                this.setState({
                    value: newValue,
                });
                this.props.onChange(newValue);
            }
        }
    }

    _start(position) {
        this.setState({
            hasMovingClass: true,
        });

        const { tempValue } = this.state;
        const range = this.dom;
        const start = dom.getOffset(range).left;
        // used in unit test
        let width = range.clientWidth;
        if (!width) {
            if (range.style.width) {
                const index = range.style.width.indexOf('px');
                if (index !== -1) {
                    width = Number(range.style.width.slice(0, index));
                }
            }
        }

        this._moving = {
            start,
            end: start + width,
            startValue: tempValue,
        };

        // change on start
        this._onProcess(position, true);
    }

    _end() {
        const { startValue } = this._moving;
        const { tempValue, value } = this.state;
        this._moving = null;
        this._removeDocumentEvents();
        this.setState({
            hasMovingClass: false,
            lowerTooltipVisible: false,
            upperTooltipVisible: false,
            tooltipAnimation: true,
        });

        if (!isEqual(tempValue, startValue)) {
            // Not Controlled
            if (!('value' in this.props)) {
                this.setState({
                    value: tempValue,
                });
            } else {
                this.setState({
                    // tooltipVisible: false,
                    tempValue: value,
                    value,
                });
            }
            this.props.onChange(tempValue);
        }
    }

    _move(e) {
        const position =
            e.type === 'mousemove' ? e.pageX : e.targetTouches[0].pageX;
        this._onProcess(position);
    }

    _onProcess(position, start) {
        const { tempValue } = this.state;
        const current = this._positionToCurrent(position); //current 为当前click的value

        if (this.isFixedWidth) {
            if (start) {
                this.lastPosition = current;
            }
        } else if (start) {
            this.lastPosition = current;
            if (_isMultiple(this.props.slider)) {
                this._moving.dragging = getDragging(current, tempValue);
            } else {
                this._moving.dragging = 'upper';
            }

            this.setState({
                lowerTooltipVisible: this._moving.dragging === 'lower',
                upperTooltipVisible: this._moving.dragging === 'upper',
                tooltipAnimation: false,
            });
        } else if (
            this.oldDragging === 'lower' &&
            this._moving.dragging === 'upper'
        ) {
            this.setState({
                upperTooltipVisible: true,
                lowerTooltipVisible: false,
            });
        } else if (
            this.oldDragging === 'upper' &&
            this._moving.dragging === 'lower'
        ) {
            this.setState({
                upperTooltipVisible: false,
                lowerTooltipVisible: true,
            });
        }

        this.oldDragging = this._moving.dragging;

        const nextValue = this._currentToValue(
            current,
            tempValue,
            this.lastPosition,
            this.isFixedWidth
        ); //计算range的新value,可能是数组,可能是单个值
        this.lastPosition = current;

        if (!isEqual(nextValue, tempValue)) {
            this.setState({
                tempValue: nextValue,
            });
            this.props.onProcess(nextValue);
        }
    }

    _addDocumentMouseEvents() {
        this._onMouseMoveListener = events.on(
            document,
            'mousemove',
            this._move.bind(this)
        );
        this._onMouseUpListener = events.on(
            document,
            'mouseup',
            this._end.bind(this)
        );
    }

    _addDocumentTouchEvents() {
        this._onTouchMoveListener = events.on(
            document,
            'touchmove',
            this._move.bind(this)
        );
        this._onTouchEndListener = events.on(
            document,
            'touchend',
            this._end.bind(this)
        );
    }

    _removeDocumentEvents() {
        if (this._onMouseMoveListener) {
            this._onMouseMoveListener.off();
            this._onMouseMoveListener = null;
        }

        if (this._onMouseUpListener) {
            this._onMouseUpListener.off();
            this._onMouseUpListener = null;
        }

        if (this._onTouchMoveListener) {
            this._onTouchMoveListener.off();
            this._onTouchMoveListener = null;
        }

        if (this._onTouchEndListener) {
            this._onTouchEndListener.off();
            this._onTouchEndListener = null;
        }
    }

    // position => current (value type)
    _positionToCurrent(position) {
        const { start, end } = this._moving;
        const { step, min, max, rtl } = this.props;

        if (position < start) {
            position = start;
        } else if (position > end) {
            position = end;
        }
        let percent = getPercent(start, end, position);
        percent = rtl ? 100 - percent : percent;
        // reset by step
        const newValue = parseFloat(
            (Math.round(((percent / 100) * (max - min)) / step) * step).toFixed(
                getPrecision(step)
            )
        );

        return min + newValue;
    }

    _currentToValue(current, preValue, lastPosition, isFixedWidth) {
        const { dragging } = this._moving;
        const { min, max } = this.props;

        if (!_isMultiple(this.props.slider, isFixedWidth)) {
            return current;
        } else {
            let result;

            const precision = getPrecision(this.props.step);
            const diff = current - lastPosition;
            const newLeft = +(+preValue[0] + diff).toFixed(precision);
            const newRight = +(+preValue[1] + diff).toFixed(precision);

            const newMaxLeft = +(max - preValue[1] + preValue[0]).toFixed(
                precision
            );
            const newMinRight = +(min + preValue[1] - preValue[0]).toFixed(
                precision
            );

            if (isFixedWidth) {
                if (newLeft < min) {
                    result = [min, newMinRight];
                } else if (newRight > max) {
                    result = [newMaxLeft, max];
                } else {
                    result = [newLeft, newRight];
                }
            } else if (dragging === 'lower') {
                if (current > preValue[1]) {
                    result = [preValue[1], current];
                    this._moving.dragging = 'upper';
                } else {
                    result = [current, preValue[1]];
                }
            } else if (dragging === 'upper') {
                if (current < preValue[0]) {
                    result = [current, preValue[0]];
                    this._moving.dragging = 'lower';
                } else {
                    result = [preValue[0], current];
                }
            }

            return result;
        }
    }

    handleLowerTooltipVisibleChange(visible) {
        if (this.state.hasMovingClass) {
            return;
        }
        this.setState({
            lowerTooltipVisible: visible,
        });
    }

    handleUpperTooltipVisibleChange(visible) {
        if (this.state.hasMovingClass) {
            return;
        }
        this.setState({
            upperTooltipVisible: visible,
        });
    }

    render() {
        let value = this._moving ? this.state.tempValue : this.state.value;

        const {
            prefix,
            min,
            max,
            disabled,
            style,
            id,
            slider,
            reverse,
            className,
            marks,
            marksPosition,
            hasTip,
            tipRender,
            fixedWidth,
            defaultValue,
            tooltipVisible,
            rtl,
            isPreview,
            renderPreview,
        } = this.props;

        const others = pickOthers(Object.keys(Range.propTypes), this.props);

        const classes = classNames({
            [`${prefix}range`]: true,
            disabled: disabled,
            [className]: className,
        });

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (item > max) {
                    value[index] = max;
                }
            });
        } else if (value > max) {
            value = max;
        }

        const commonProps = {
            prefix,
            min,
            max,
            value,
            reverse,
            slider,
            hasTip,
            tipRender,
            marksPosition,
            tooltipVisible,
            hasMovingClass: this.state.hasMovingClass,
            disabled,
            rtl,
        };

        this.isFixedWidth =
            fixedWidth &&
            (value
                ? Array.isArray(value)
                : defaultValue
                ? Array.isArray(defaultValue)
                : false);

        if (isPreview) {
            const previewCls = classNames(className, `${prefix}form-preview`);

            if ('renderPreview' in this.props) {
                return (
                    <div
                        id={id}
                        dir={rtl ? 'rtl' : 'ltr'}
                        {...others}
                        className={previewCls}
                    >
                        {renderPreview(value, this.props)}
                    </div>
                );
            }

            return (
                <p
                    id={id}
                    dir={rtl ? 'rtl' : 'ltr'}
                    {...others}
                    className={previewCls}
                >
                    {Array.isArray(value) ? value.join('~') : value}
                </p>
            );
        }

        return (
            <div
                ref={dom => {
                    this.dom = dom;
                }}
                {...others}
                style={style}
                className={classes}
                id={id}
                dir={rtl ? 'rtl' : 'ltr'}
                onMouseDown={disabled ? noop : this._onMouseDown.bind(this)}
                onTouchStart={disabled ? noop : this._onTouchStart.bind(this)}
            >
                {marks !== false && marksPosition === 'above' ? (
                    <Mark {...commonProps} marks={this._calcMarks()} />
                ) : null}
                <div className={`${prefix}range-inner`}>
                    <Scale {...commonProps} scales={this._calcScales()} />
                    <Track {...commonProps} />
                    {this.isFixedWidth ? (
                        <FixedSlider {...commonProps} />
                    ) : (
                        <div>
                            <Selected {...commonProps} />
                            <LowerSlider
                                {...commonProps}
                                hasMovingClass={
                                    this.state.hasMovingClass &&
                                    this._moving &&
                                    this._moving.dragging === 'lower'
                                }
                                tooltipVisible={
                                    tooltipVisible ||
                                    this.state.lowerTooltipVisible
                                }
                                onTooltipVisibleChange={
                                    this.handleLowerTooltipVisibleChange
                                }
                                tooltipAnimation={
                                    this.state.tooltipAnimation
                                        ? {
                                              in: 'expandInUp',
                                              out: 'expandOutDown',
                                          }
                                        : false
                                }
                            />
                            <UpperSlider
                                {...commonProps}
                                onKeyDown={this.onKeyDown}
                                hasMovingClass={
                                    this.state.hasMovingClass &&
                                    this._moving &&
                                    this._moving.dragging === 'upper'
                                }
                                tooltipVisible={
                                    tooltipVisible ||
                                    this.state.upperTooltipVisible
                                }
                                onTooltipVisibleChange={
                                    this.handleUpperTooltipVisibleChange
                                }
                                tooltipAnimation={
                                    this.state.tooltipAnimation
                                        ? {
                                              in: 'expandInUp',
                                              out: 'expandOutDown',
                                          }
                                        : false
                                }
                            />
                        </div>
                    )}
                </div>
                {marks !== false && marksPosition === 'below' ? (
                    <Mark {...commonProps} marks={this._calcMarks()} />
                ) : null}
            </div>
        );
    }
}

export default polyfill(Range);
