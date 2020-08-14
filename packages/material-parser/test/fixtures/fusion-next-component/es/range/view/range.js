import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';

var _class, _temp;

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

var Tooltip = Balloon.Tooltip;
var noop = func.noop,
    bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;


function _isMultiple(slider, isFixedWidth) {
    return isFixedWidth || slider === 'double';
}

function LowerSlider(props) {
    var hasTip = props.hasTip,
        value = props.value,
        tipRender = props.tipRender,
        slider = props.slider,
        tooltipVisible = props.tooltipVisible,
        onTooltipVisibleChange = props.onTooltipVisibleChange,
        tooltipAnimation = props.tooltipAnimation;


    if (_isMultiple(slider)) {
        return hasTip ? React.createElement(
            Tooltip,
            {
                popupContainer: function popupContainer(target) {
                    return target.parentNode;
                },
                popupProps: {
                    visible: tooltipVisible,
                    onVisibleChange: onTooltipVisibleChange,
                    animation: tooltipAnimation,
                    needAdjust: false
                },
                trigger: Slider(_extends({}, props, { value: value[0] })),
                align: 't'
            },
            tipRender('' + value[0])
        ) : Slider(_extends({}, props, { value: value[0] }));
    }
    return null;
}

LowerSlider.propTypes = {
    hasTip: PropTypes.bool,
    tooltipVisible: PropTypes.bool,
    onTooltipVisibleChange: PropTypes.func,
    tooltipAnimation: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    tipRender: PropTypes.func,
    slider: PropTypes.oneOf(['single', 'double'])
};

function UpperSlider(props) {
    var newprop = _extends({}, props);
    var hasTip = newprop.hasTip,
        value = newprop.value,
        tipRender = newprop.tipRender,
        slider = newprop.slider,
        tooltipVisible = newprop.tooltipVisible,
        onTooltipVisibleChange = newprop.onTooltipVisibleChange,
        tooltipAnimation = newprop.tooltipAnimation;

    if (_isMultiple(slider)) {
        delete newprop.onKeyDown;
        return hasTip ? React.createElement(
            Tooltip,
            {
                popupContainer: function popupContainer(target) {
                    return target.parentNode;
                },
                popupProps: {
                    visible: tooltipVisible,
                    onVisibleChange: onTooltipVisibleChange,
                    animation: tooltipAnimation,
                    needAdjust: false
                },
                trigger: Slider(_extends({}, newprop, { value: value[1] })),
                align: 't'
            },
            tipRender(value[1])
        ) : Slider(_extends({}, newprop, { value: value[1] }));
    }
    return hasTip ? React.createElement(
        Tooltip,
        {
            popupContainer: function popupContainer(target) {
                return target.parentNode;
            },
            popupProps: {
                visible: tooltipVisible,
                onVisibleChange: onTooltipVisibleChange,
                animation: tooltipAnimation,
                needAdjust: false
            },
            animation: {
                in: 'fadeInUp',
                out: 'fadeOutDown'
            },
            trigger: Slider(newprop),
            align: 't'
        },
        tipRender(value)
    ) : Slider(newprop);
}

UpperSlider.propTypes = {
    hasTip: PropTypes.bool,
    tooltipVisible: PropTypes.bool,
    onTooltipVisibleChange: PropTypes.func,
    tooltipAnimation: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    tipRender: PropTypes.func,
    slider: PropTypes.oneOf(['single', 'double'])
};

function pauseEvent(e) {
    e.stopPropagation();
    e.preventDefault();
}

/** Range */
var Range = (_temp = _class = function (_React$Component) {
    _inherits(Range, _React$Component);

    function Range(props) {
        _classCallCheck(this, Range);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        var min = props.min;

        var initialValue = _isMultiple(props.slider) ? [min, min] : min;
        var defaultValue = 'defaultValue' in props ? props.defaultValue : initialValue;
        var value = props.value !== undefined ? props.value : defaultValue;

        _this.state = {
            value: value,
            tempValue: value,
            hasMovingClass: false,
            lowerTooltipVisible: false,
            upperTooltipVisible: false,
            tooltipAnimation: true
        };

        bindCtx(_this, ['handleLowerTooltipVisibleChange', 'handleUpperTooltipVisibleChange', 'onKeyDown']);
        return _this;
    }

    Range.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        if ('value' in props) {
            var min = props.min,
                slider = props.slider,
                value = props.value;
            var hasMovingClass = state.hasMovingClass;

            var newState = {
                value: value
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
    };

    Range.prototype._marksToScales = function _marksToScales(marks) {
        var result = [];
        if (Object.prototype.toString.call(marks) === '[object Object]') {
            for (var key in marks) {
                if (Object.hasOwnProperty.call(marks, key)) {
                    result.push(parseInt(key));
                }
            }
        } else {
            result = marks;
        }
        return result;
    };

    Range.prototype._calcScales = function _calcScales() {
        var _props = this.props,
            min = _props.min,
            max = _props.max,
            marks = _props.marks;

        var scales = this._marksToScales(marks);

        if (scales !== false) {
            if (Array.isArray(scales)) {
                return scales;
            } else {
                var pace = (max - min) / scales;
                var result = [];

                result.push(min);
                for (var i = 1; i < scales; i++) {
                    result.push(min + i * pace);
                }
                result.push(max);
                return result;
            }
        } else {
            return [];
        }
    };

    Range.prototype._calcMarks = function _calcMarks() {
        var _props2 = this.props,
            min = _props2.min,
            max = _props2.max,
            marks = _props2.marks;


        var result = {};

        if (Array.isArray(marks)) {
            marks.forEach(function (m) {
                result[m] = m.toString();
            });
        } else if (typeof marks === 'number') {
            var pace = (max - min) / marks;

            result[min] = min;
            for (var i = 1; i < marks; i++) {
                var mark = min + i * pace;
                var precision = getPrecision(mark);
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
    };

    Range.prototype._onMouseDown = function _onMouseDown(e) {
        if (e.button === 0) {
            this._start(e.pageX);
            this._addDocumentMouseEvents();
            pauseEvent(e);
        }
    };

    Range.prototype._onTouchStart = function _onTouchStart(e) {
        this._start(e.targetTouches[0].pageX);
        this._addDocumentTouchEvents();
        e.stopPropagation(); // preventDefault() will be ignored: https://www.chromestatus.com/features/5093566007214080
    };

    Range.prototype.onKeyDown = function onKeyDown(e) {
        if (this.props.disabled) return;

        if (e.keyCode === KEYCODE.LEFT_ARROW || e.keyCode === KEYCODE.RIGHT_ARROW) {
            e.stopPropagation();
            e.preventDefault();
            var newValue = void 0;
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
                    value: newValue
                });
                this.props.onChange(newValue);
            }
        }
    };

    Range.prototype._start = function _start(position) {
        this.setState({
            hasMovingClass: true
        });

        var tempValue = this.state.tempValue;

        var range = this.dom;
        var start = dom.getOffset(range).left;
        // used in unit test
        var width = range.clientWidth;
        if (!width) {
            if (range.style.width) {
                var index = range.style.width.indexOf('px');
                if (index !== -1) {
                    width = Number(range.style.width.slice(0, index));
                }
            }
        }

        this._moving = {
            start: start,
            end: start + width,
            startValue: tempValue
        };

        // change on start
        this._onProcess(position, true);
    };

    Range.prototype._end = function _end() {
        var startValue = this._moving.startValue;
        var _state = this.state,
            tempValue = _state.tempValue,
            value = _state.value;

        this._moving = null;
        this._removeDocumentEvents();
        this.setState({
            hasMovingClass: false,
            lowerTooltipVisible: false,
            upperTooltipVisible: false,
            tooltipAnimation: true
        });

        if (!isEqual(tempValue, startValue)) {
            // Not Controlled
            if (!('value' in this.props)) {
                this.setState({
                    value: tempValue
                });
            } else {
                this.setState({
                    // tooltipVisible: false,
                    tempValue: value,
                    value: value
                });
            }
            this.props.onChange(tempValue);
        }
    };

    Range.prototype._move = function _move(e) {
        var position = e.type === 'mousemove' ? e.pageX : e.targetTouches[0].pageX;
        this._onProcess(position);
    };

    Range.prototype._onProcess = function _onProcess(position, start) {
        var tempValue = this.state.tempValue;

        var current = this._positionToCurrent(position); //current 为当前click的value

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
                tooltipAnimation: false
            });
        } else if (this.oldDragging === 'lower' && this._moving.dragging === 'upper') {
            this.setState({
                upperTooltipVisible: true,
                lowerTooltipVisible: false
            });
        } else if (this.oldDragging === 'upper' && this._moving.dragging === 'lower') {
            this.setState({
                upperTooltipVisible: false,
                lowerTooltipVisible: true
            });
        }

        this.oldDragging = this._moving.dragging;

        var nextValue = this._currentToValue(current, tempValue, this.lastPosition, this.isFixedWidth); //计算range的新value,可能是数组,可能是单个值
        this.lastPosition = current;

        if (!isEqual(nextValue, tempValue)) {
            this.setState({
                tempValue: nextValue
            });
            this.props.onProcess(nextValue);
        }
    };

    Range.prototype._addDocumentMouseEvents = function _addDocumentMouseEvents() {
        this._onMouseMoveListener = events.on(document, 'mousemove', this._move.bind(this));
        this._onMouseUpListener = events.on(document, 'mouseup', this._end.bind(this));
    };

    Range.prototype._addDocumentTouchEvents = function _addDocumentTouchEvents() {
        this._onTouchMoveListener = events.on(document, 'touchmove', this._move.bind(this));
        this._onTouchEndListener = events.on(document, 'touchend', this._end.bind(this));
    };

    Range.prototype._removeDocumentEvents = function _removeDocumentEvents() {
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
    };

    // position => current (value type)


    Range.prototype._positionToCurrent = function _positionToCurrent(position) {
        var _moving = this._moving,
            start = _moving.start,
            end = _moving.end;
        var _props3 = this.props,
            step = _props3.step,
            min = _props3.min,
            max = _props3.max,
            rtl = _props3.rtl;


        if (position < start) {
            position = start;
        } else if (position > end) {
            position = end;
        }
        var percent = getPercent(start, end, position);
        percent = rtl ? 100 - percent : percent;
        // reset by step
        var newValue = parseFloat((Math.round(percent / 100 * (max - min) / step) * step).toFixed(getPrecision(step)));

        return min + newValue;
    };

    Range.prototype._currentToValue = function _currentToValue(current, preValue, lastPosition, isFixedWidth) {
        var dragging = this._moving.dragging;
        var _props4 = this.props,
            min = _props4.min,
            max = _props4.max;


        if (!_isMultiple(this.props.slider, isFixedWidth)) {
            return current;
        } else {
            var result = void 0;

            var precision = getPrecision(this.props.step);
            var diff = current - lastPosition;
            var newLeft = +(+preValue[0] + diff).toFixed(precision);
            var newRight = +(+preValue[1] + diff).toFixed(precision);

            var newMaxLeft = +(max - preValue[1] + preValue[0]).toFixed(precision);
            var newMinRight = +(min + preValue[1] - preValue[0]).toFixed(precision);

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
    };

    Range.prototype.handleLowerTooltipVisibleChange = function handleLowerTooltipVisibleChange(visible) {
        if (this.state.hasMovingClass) {
            return;
        }
        this.setState({
            lowerTooltipVisible: visible
        });
    };

    Range.prototype.handleUpperTooltipVisibleChange = function handleUpperTooltipVisibleChange(visible) {
        if (this.state.hasMovingClass) {
            return;
        }
        this.setState({
            upperTooltipVisible: visible
        });
    };

    Range.prototype.render = function render() {
        var _classNames,
            _this2 = this;

        var value = this._moving ? this.state.tempValue : this.state.value;

        var _props5 = this.props,
            prefix = _props5.prefix,
            min = _props5.min,
            max = _props5.max,
            disabled = _props5.disabled,
            style = _props5.style,
            id = _props5.id,
            slider = _props5.slider,
            reverse = _props5.reverse,
            className = _props5.className,
            marks = _props5.marks,
            marksPosition = _props5.marksPosition,
            hasTip = _props5.hasTip,
            tipRender = _props5.tipRender,
            fixedWidth = _props5.fixedWidth,
            defaultValue = _props5.defaultValue,
            tooltipVisible = _props5.tooltipVisible,
            rtl = _props5.rtl,
            isPreview = _props5.isPreview,
            renderPreview = _props5.renderPreview;


        var others = pickOthers(Object.keys(Range.propTypes), this.props);

        var classes = classNames((_classNames = {}, _classNames[prefix + 'range'] = true, _classNames.disabled = disabled, _classNames[className] = className, _classNames));

        if (Array.isArray(value)) {
            value.forEach(function (item, index) {
                if (item > max) {
                    value[index] = max;
                }
            });
        } else if (value > max) {
            value = max;
        }

        var commonProps = {
            prefix: prefix,
            min: min,
            max: max,
            value: value,
            reverse: reverse,
            slider: slider,
            hasTip: hasTip,
            tipRender: tipRender,
            marksPosition: marksPosition,
            tooltipVisible: tooltipVisible,
            hasMovingClass: this.state.hasMovingClass,
            disabled: disabled,
            rtl: rtl
        };

        this.isFixedWidth = fixedWidth && (value ? Array.isArray(value) : defaultValue ? Array.isArray(defaultValue) : false);

        if (isPreview) {
            var previewCls = classNames(className, prefix + 'form-preview');

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({
                        id: id,
                        dir: rtl ? 'rtl' : 'ltr'
                    }, others, {
                        className: previewCls
                    }),
                    renderPreview(value, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({
                    id: id,
                    dir: rtl ? 'rtl' : 'ltr'
                }, others, {
                    className: previewCls
                }),
                Array.isArray(value) ? value.join('~') : value
            );
        }

        return React.createElement(
            'div',
            _extends({
                ref: function ref(dom) {
                    _this2.dom = dom;
                }
            }, others, {
                style: style,
                className: classes,
                id: id,
                dir: rtl ? 'rtl' : 'ltr',
                onMouseDown: disabled ? noop : this._onMouseDown.bind(this),
                onTouchStart: disabled ? noop : this._onTouchStart.bind(this)
            }),
            marks !== false && marksPosition === 'above' ? React.createElement(Mark, _extends({}, commonProps, { marks: this._calcMarks() })) : null,
            React.createElement(
                'div',
                { className: prefix + 'range-inner' },
                React.createElement(Scale, _extends({}, commonProps, { scales: this._calcScales() })),
                React.createElement(Track, commonProps),
                this.isFixedWidth ? React.createElement(FixedSlider, commonProps) : React.createElement(
                    'div',
                    null,
                    React.createElement(Selected, commonProps),
                    React.createElement(LowerSlider, _extends({}, commonProps, {
                        hasMovingClass: this.state.hasMovingClass && this._moving && this._moving.dragging === 'lower',
                        tooltipVisible: tooltipVisible || this.state.lowerTooltipVisible,
                        onTooltipVisibleChange: this.handleLowerTooltipVisibleChange,
                        tooltipAnimation: this.state.tooltipAnimation ? {
                            in: 'expandInUp',
                            out: 'expandOutDown'
                        } : false
                    })),
                    React.createElement(UpperSlider, _extends({}, commonProps, {
                        onKeyDown: this.onKeyDown,
                        hasMovingClass: this.state.hasMovingClass && this._moving && this._moving.dragging === 'upper',
                        tooltipVisible: tooltipVisible || this.state.upperTooltipVisible,
                        onTooltipVisibleChange: this.handleUpperTooltipVisibleChange,
                        tooltipAnimation: this.state.tooltipAnimation ? {
                            in: 'expandInUp',
                            out: 'expandOutDown'
                        } : false
                    }))
                )
            ),
            marks !== false && marksPosition === 'below' ? React.createElement(Mark, _extends({}, commonProps, { marks: this._calcMarks() })) : null
        );
    };

    return Range;
}(React.Component), _class.contextTypes = {
    prefix: PropTypes.string
}, _class.propTypes = {
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
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    tempValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    /**
     * 设置初始取值。当 `slider` 为 `single` 时，使用 `Number`，否则用 `[Number, Number]`
     */
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    /**
     * 刻度数值显示逻辑（false 代表不显示，array 枚举显示的值，number 代表按 number 平分，object 表示按 key 划分，value 值显示）
     */
    marks: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.arrayOf(PropTypes.number), PropTypes.object]),
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
    renderPreview: PropTypes.func
}, _class.defaultProps = {
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
    tipRender: function tipRender(value) {
        return value;
    },
    reverse: false,
    pure: false,
    marksPosition: 'above',
    rtl: false,
    isPreview: false
}, _temp);
Range.displayName = 'Range';


export default polyfill(Range);