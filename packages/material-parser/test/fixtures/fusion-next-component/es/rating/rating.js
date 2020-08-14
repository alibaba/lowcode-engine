import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import Icon from '../icon';
import { func, KEYCODE, obj } from '../util';
import zhCN from '../locale/zh-cn';

var noop = func.noop,
    bindCtx = func.bindCtx;
var ENTER = KEYCODE.ENTER,
    LEFT = KEYCODE.LEFT,
    UP = KEYCODE.UP,
    RIGHT = KEYCODE.RIGHT,
    DOWN = KEYCODE.DOWN;

var supportKeys = [ENTER, LEFT, UP, RIGHT, DOWN];

// 评分组件的大小与icon的大小映射关系
var ICON_SIZE_MAP = {
    small: 'xs',
    medium: 'small',
    large: 'medium'
};

/** Rating */
var Rating = (_temp = _class = function (_Component) {
    _inherits(Rating, _Component);

    Rating.currentValue = function currentValue(min, max, hoverValue, stateValue) {
        var value = hoverValue ? hoverValue : stateValue;

        value = value >= max ? max : value;
        value = value <= min ? min : value;

        return value || 0;
    };

    function Rating(props) {
        _classCallCheck(this, Rating);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            value: 'value' in props ? props.value : props.defaultValue,
            hoverValue: 0,
            iconSpace: 0,
            iconSize: 0,
            clicked: false // 标记组件是否被点击过
        };
        _this.timer = null;

        bindCtx(_this, ['handleClick', 'handleHover', 'handleLeave', 'onKeyDown']);
        return _this;
    }

    Rating.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        var state = {};
        if ('value' in nextProps) {
            state.value = nextProps.value || 0;
        }

        if ('disabled' in nextProps || 'readOnly' in nextProps || 'isPreview' in nextProps || 'renderPreview' in nextProps) {
            state.disabled = nextProps.disabled || nextProps.readOnly || nextProps.isPreview && !('renderPreview' in nextProps);
        }

        return state;
    };

    Rating.prototype.componentDidMount = function componentDidMount() {
        this.getRenderResult();
    };

    Rating.prototype.componentWillUnmount = function componentWillUnmount() {
        this.clearTimer();
    };

    // 清除延时


    Rating.prototype.clearTimer = function clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    };

    Rating.prototype.getRenderResult = function getRenderResult() {
        var count = this.props.count;
        var _state = this.state,
            iconSpace = _state.iconSpace,
            iconSize = _state.iconSize;

        var icon = this.refs['rating-icon-0'];

        if (icon && this.underlayNode) {
            var newIconSize = icon.offsetWidth;
            var newIconSpace = (this.underlayNode.offsetWidth - count * newIconSize) / (count + 1);

            if (newIconSize !== iconSize || newIconSpace !== iconSpace) {
                this.setState({
                    iconSpace: newIconSpace,
                    iconSize: newIconSize
                });
            }
        }
    };

    Rating.prototype.getValue = function getValue(e) {
        // 如定位不准，优先纠正定位
        this.getRenderResult();

        var _props = this.props,
            allowHalf = _props.allowHalf,
            count = _props.count,
            rtl = _props.rtl;
        var _state2 = this.state,
            iconSpace = _state2.iconSpace,
            iconSize = _state2.iconSize;


        var pos = e.pageX - this.underlayNode.getBoundingClientRect().left;
        var fullNum = Math.floor(pos / (iconSpace + iconSize));
        var surplusNum = (pos - fullNum * (iconSpace + iconSize) - iconSpace) / iconSize;
        var value = Number(fullNum) + Number(surplusNum.toFixed(1));
        if (value >= count) {
            value = count;
        } else if (allowHalf) {
            var floorValue = Math.floor(value);
            if (rtl) {
                value = value - 0.5 >= floorValue ? floorValue + 1.5 : floorValue + 1;
            } else {
                value = value - 0.5 >= floorValue ? floorValue + 1 : floorValue + 0.5;
            }
        } else {
            value = Math.floor(value) + 1;
        }

        return rtl ? count - value + 1 : value;
    };

    Rating.prototype.handleHover = function handleHover(e) {
        var _this2 = this;

        if (this.state.disabled) {
            return;
        }

        var value = this.getValue(e);
        var onHoverChange = this.props.onHoverChange;

        if (value !== this.state.hoverValue) {
            this.clearTimer();

            this.timer = setTimeout(function () {
                _this2.setState({ hoverValue: value }, function () {
                    onHoverChange(value);
                });
            }, 0);
        }
    };

    Rating.prototype.handleLeave = function handleLeave() {
        if (this.state.disabled) {
            return;
        }

        this.clearTimer();

        this.setState({
            hoverValue: 0
        });
    };

    Rating.prototype.onKeyDown = function onKeyDown(e) {
        if (this.state.disabled) {
            return;
        }

        var _props2 = this.props,
            onKeyDown = _props2.onKeyDown,
            count = _props2.count;
        var disabled = this.state.disabled;

        if (disabled || supportKeys.indexOf(e.keyCode) < 0) {
            return !onKeyDown || onKeyDown(e);
        }

        var _state3 = this.state,
            hoverValue = _state3.hoverValue,
            value = _state3.value;

        var changingValue = hoverValue;
        if (changingValue === 0) {
            changingValue = value;
        }

        switch (e.keyCode) {
            case DOWN:
            case RIGHT:
                if (changingValue < count) {
                    changingValue += 1;
                } else {
                    changingValue = 1;
                }
                this.handleChecked(changingValue);
                break;
            case UP:
            case LEFT:
                if (changingValue > 1) {
                    changingValue -= 1;
                } else {
                    changingValue = count;
                }
                this.handleChecked(changingValue);
                break;
            case ENTER:
                this.props.onChange(changingValue);
                this.setState({
                    value: changingValue,
                    hoverValue: changingValue
                });
                break;
        }
        return !onKeyDown || onKeyDown(e);
    };

    Rating.prototype.handleChecked = function handleChecked(index) {
        if (this.state.disabled) {
            return;
        }

        this.setState({ hoverValue: index });
    };

    Rating.prototype.handleClick = function handleClick(e) {
        var _this3 = this;

        if (this.state.disabled) {
            return;
        }
        var value = this.getValue(e);
        if (value < 0) {
            return;
        }
        if (!('value' in this.props)) {
            this.setState({ value: value, clicked: true });
        }

        this.props.onChange(value);

        setTimeout(function () {
            _this3.setState({ clicked: false });
        }, 100);
    };

    Rating.prototype.getOverlayWidth = function getOverlayWidth() {
        var _state4 = this.state,
            hoverValue = _state4.hoverValue,
            iconSpace = _state4.iconSpace,
            iconSize = _state4.iconSize;


        if (!iconSpace || !iconSize) {
            return 'auto';
        }

        var value = Rating.currentValue(0, this.props.count, hoverValue, this.state.value);

        var floorValue = Math.floor(value);

        return iconSize * value + (floorValue + 1) * iconSpace;
    };

    Rating.prototype.getInfoLeft = function getInfoLeft() {
        var _state5 = this.state,
            value = _state5.value,
            hoverValue = _state5.hoverValue,
            iconSpace = _state5.iconSpace,
            iconSize = _state5.iconSize;

        var infoValue = hoverValue || value;
        var ceilValue = Math.ceil(infoValue);

        return iconSize * (ceilValue - 1) + ceilValue * iconSpace;
    };

    Rating.prototype.render = function render() {
        var _classNames,
            _classNames2,
            _classNames3,
            _this4 = this;

        var _props3 = this.props,
            id = _props3.id,
            prefix = _props3.prefix,
            className = _props3.className,
            showGrade = _props3.showGrade,
            count = _props3.count,
            size = _props3.size,
            iconType = _props3.iconType,
            strokeMode = _props3.strokeMode,
            readAs = _props3.readAs,
            rtl = _props3.rtl,
            isPreview = _props3.isPreview,
            renderPreview = _props3.renderPreview,
            locale = _props3.locale;
        var disabled = this.state.disabled;

        var others = obj.pickOthers(Rating.propTypes, this.props);
        var _state6 = this.state,
            hoverValue = _state6.hoverValue,
            clicked = _state6.clicked;

        var underlay = [],
            overlay = [];

        var enableA11y = !!id;

        // 获得Value
        var value = Rating.currentValue(0, count, hoverValue, this.state.value);

        // icon的sizeMap
        var sizeMap = ICON_SIZE_MAP[size];

        for (var i = 0; i < count; i++) {
            var isCurrent = Math.ceil(value - 1) === i;
            var iconCls = classNames({
                hover: hoverValue > 0 && isCurrent,
                clicked: clicked && isCurrent
            });
            var iconNode = React.createElement(Icon, { type: iconType, size: sizeMap, className: iconCls });

            underlay.push(React.createElement(
                'span',
                {
                    ref: 'rating-icon-' + i,
                    key: 'underlay-' + i,
                    className: prefix + 'rating-icon'
                },
                iconNode
            ));
            if (enableA11y) {
                overlay.push(React.createElement('input', {
                    id: id + '-' + prefix + 'star' + (i + 1),
                    key: 'input-' + i,
                    className: prefix + 'sr-only',
                    'aria-checked': i + 1 === parseInt(hoverValue),
                    checked: i + 1 === parseInt(hoverValue),
                    onChange: this.handleChecked.bind(this, i + 1),
                    type: 'radio',
                    name: 'rating'
                }));
            }

            overlay.push(React.createElement(
                'label',
                {
                    key: 'overlay-' + i,
                    htmlFor: enableA11y ? id + '-' + prefix + 'star' + (i + 1) : null,
                    className: prefix + 'rating-icon'
                },
                iconNode,
                enableA11y ? React.createElement(
                    'span',
                    { className: prefix + 'sr-only' },
                    readAs(i + 1)
                ) : null
            ));
        }

        var ratingCls = classNames([prefix + 'rating', prefix + 'rating-' + size], (_classNames = {}, _classNames[prefix + 'rating-grade-low'] = value <= count * 0.4, _classNames[prefix + 'rating-grade-high'] = value > count * 0.4, _classNames[prefix + 'rating-stroke-mode'] = strokeMode, _classNames.hover = hoverValue > 0, _classNames), className);

        var baseCls = classNames(prefix + 'rating-base', (_classNames2 = {}, _classNames2[prefix + 'rating-base-disabled'] = disabled, _classNames2));

        var previewCls = classNames((_classNames3 = {}, _classNames3[prefix + 'form-preview'] = true, _classNames3[className] = !!className, _classNames3));

        var overlayStyle = {
            width: this.getOverlayWidth()
        };
        var infoStyle = {
            left: this.getInfoLeft(),
            display: hoverValue ? 'block' : 'none'
        };

        var finalProps = disabled ? {} : {
            onClick: this.handleClick,
            onMouseOver: this.handleHover,
            onMouseMove: this.handleHover,
            onMouseLeave: this.handleLeave
        };

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview && 'renderPreview' in this.props) {
            return React.createElement(
                'div',
                _extends({ id: id }, others, { className: previewCls }),
                renderPreview(value, this.props)
            );
        }

        return React.createElement(
            'div',
            _extends({
                id: id
            }, others, {
                className: ratingCls,
                onKeyDown: this.onKeyDown,
                tabIndex: '0',
                role: 'group',
                'aria-label': locale.description
            }),
            React.createElement(
                'div',
                _extends({ className: baseCls }, finalProps),
                React.createElement(
                    'div',
                    {
                        className: prefix + 'rating-underlay',
                        ref: function ref(n) {
                            return _this4.underlayNode = n;
                        },
                        'aria-hidden': true
                    },
                    underlay
                ),
                React.createElement(
                    'div',
                    {
                        className: prefix + 'rating-overlay',
                        style: overlayStyle
                    },
                    overlay
                )
            ),
            showGrade ? React.createElement(
                'div',
                { className: prefix + 'rating-info', style: infoStyle },
                readAs(value)
            ) : null
        );
    };

    return Rating;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 默认值
     */
    defaultValue: PropTypes.number,
    /**
     * 值
     */
    value: PropTypes.number,
    /**
     * 评分的总数
     */
    count: PropTypes.number,
    /**
     * 是否显示 grade
     */
    showGrade: PropTypes.bool,
    /**
     * 尺寸
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * 是否允许半星评分
     */
    allowHalf: PropTypes.bool,
    /**
     * 用户点击评分时触发的回调
     * @param {String} value 评分值
     */
    onChange: PropTypes.func,
    /**
     * 用户hover评分时触发的回调
     * @param {String} value 评分值
     */
    onHoverChange: PropTypes.func,
    /**
     * 是否禁用
     */
    disabled: PropTypes.bool,
    /**
     * 评分文案生成方法，传入id支持无障碍时，读屏软件可读
     */
    readAs: PropTypes.func,
    // 实验属性: 自定义评分icon
    iconType: PropTypes.string,
    // 实验属性: 开启 `-webkit-text-stroke` 显示边框颜色，在IE中无效
    strokeMode: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * 自定义国际化文案对象
     */
    locale: PropTypes.object,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {number} value 评分值
     */
    renderPreview: PropTypes.func,
    /**
     * 是否为只读态，效果上同 disabeld
     */
    readOnly: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    size: 'medium',
    disabled: false,
    readOnly: false,
    isPreview: false,
    count: 5,
    showGrade: false,
    defaultValue: 0,
    readAs: function readAs(val) {
        return val;
    },
    allowHalf: false,
    iconType: 'favorites-filling',
    onChange: noop,
    onHoverChange: noop,
    locale: zhCN.Rating
}, _temp);
Rating.displayName = 'Rating';


export default polyfill(Rating);