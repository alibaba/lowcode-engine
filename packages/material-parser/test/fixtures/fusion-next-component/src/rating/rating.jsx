import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import Icon from '../icon';
import { func, KEYCODE, obj } from '../util';
import zhCN from '../locale/zh-cn';

const { noop, bindCtx } = func;
const { ENTER, LEFT, UP, RIGHT, DOWN } = KEYCODE;
const supportKeys = [ENTER, LEFT, UP, RIGHT, DOWN];

// 评分组件的大小与icon的大小映射关系
const ICON_SIZE_MAP = {
    small: 'xs',
    medium: 'small',
    large: 'medium',
};

/** Rating */
class Rating extends Component {
    static propTypes = {
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
        readOnly: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        size: 'medium',
        disabled: false,
        readOnly: false,
        isPreview: false,
        count: 5,
        showGrade: false,
        defaultValue: 0,
        readAs: val => val,
        allowHalf: false,
        iconType: 'favorites-filling',
        onChange: noop,
        onHoverChange: noop,
        locale: zhCN.Rating,
    };

    static currentValue(min, max, hoverValue, stateValue) {
        let value = hoverValue ? hoverValue : stateValue;

        value = value >= max ? max : value;
        value = value <= min ? min : value;

        return value || 0;
    }

    constructor(props) {
        super(props);

        this.state = {
            value: 'value' in props ? props.value : props.defaultValue,
            hoverValue: 0,
            iconSpace: 0,
            iconSize: 0,
            clicked: false, // 标记组件是否被点击过
        };
        this.timer = null;

        bindCtx(this, [
            'handleClick',
            'handleHover',
            'handleLeave',
            'onKeyDown',
        ]);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const state = {};
        if ('value' in nextProps) {
            state.value = nextProps.value || 0;
        }

        if (
            'disabled' in nextProps ||
            'readOnly' in nextProps ||
            'isPreview' in nextProps ||
            'renderPreview' in nextProps
        ) {
            state.disabled =
                nextProps.disabled ||
                nextProps.readOnly ||
                (nextProps.isPreview && !('renderPreview' in nextProps));
        }

        return state;
    }

    componentDidMount() {
        this.getRenderResult();
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    // 清除延时
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    getRenderResult() {
        const { count } = this.props;
        const { iconSpace, iconSize } = this.state;
        const icon = this.refs['rating-icon-0'];

        if (icon && this.underlayNode) {
            const newIconSize = icon.offsetWidth;
            const newIconSpace =
                (this.underlayNode.offsetWidth - count * newIconSize) /
                (count + 1);

            if (newIconSize !== iconSize || newIconSpace !== iconSpace) {
                this.setState({
                    iconSpace: newIconSpace,
                    iconSize: newIconSize,
                });
            }
        }
    }

    getValue(e) {
        // 如定位不准，优先纠正定位
        this.getRenderResult();

        const { allowHalf, count, rtl } = this.props;
        const { iconSpace, iconSize } = this.state;

        const pos = e.pageX - this.underlayNode.getBoundingClientRect().left;
        const fullNum = Math.floor(pos / (iconSpace + iconSize));
        const surplusNum =
            (pos - fullNum * (iconSpace + iconSize) - iconSpace) / iconSize;
        let value = Number(fullNum) + Number(surplusNum.toFixed(1));
        if (value >= count) {
            value = count;
        } else if (allowHalf) {
            const floorValue = Math.floor(value);
            if (rtl) {
                value =
                    value - 0.5 >= floorValue
                        ? floorValue + 1.5
                        : floorValue + 1;
            } else {
                value =
                    value - 0.5 >= floorValue
                        ? floorValue + 1
                        : floorValue + 0.5;
            }
        } else {
            value = Math.floor(value) + 1;
        }

        return rtl ? count - value + 1 : value;
    }

    handleHover(e) {
        if (this.state.disabled) {
            return;
        }

        const value = this.getValue(e);
        const { onHoverChange } = this.props;
        if (value !== this.state.hoverValue) {
            this.clearTimer();

            this.timer = setTimeout(() => {
                this.setState({ hoverValue: value }, () => {
                    onHoverChange(value);
                });
            }, 0);
        }
    }

    handleLeave() {
        if (this.state.disabled) {
            return;
        }

        this.clearTimer();

        this.setState({
            hoverValue: 0,
        });
    }

    onKeyDown(e) {
        if (this.state.disabled) {
            return;
        }

        const { onKeyDown, count } = this.props;
        const { disabled } = this.state;
        if (disabled || supportKeys.indexOf(e.keyCode) < 0) {
            return !onKeyDown || onKeyDown(e);
        }

        const { hoverValue, value } = this.state;
        let changingValue = hoverValue;
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
                    hoverValue: changingValue,
                });
                break;
        }
        return !onKeyDown || onKeyDown(e);
    }

    handleChecked(index) {
        if (this.state.disabled) {
            return;
        }

        this.setState({ hoverValue: index });
    }

    handleClick(e) {
        if (this.state.disabled) {
            return;
        }
        const value = this.getValue(e);
        if (value < 0) {
            return;
        }
        if (!('value' in this.props)) {
            this.setState({ value, clicked: true });
        }

        this.props.onChange(value);

        setTimeout(() => {
            this.setState({ clicked: false });
        }, 100);
    }

    getOverlayWidth() {
        const { hoverValue, iconSpace, iconSize } = this.state;

        if (!iconSpace || !iconSize) {
            return 'auto';
        }

        const value = Rating.currentValue(
            0,
            this.props.count,
            hoverValue,
            this.state.value
        );

        const floorValue = Math.floor(value);

        return iconSize * value + (floorValue + 1) * iconSpace;
    }

    getInfoLeft() {
        const { value, hoverValue, iconSpace, iconSize } = this.state;
        const infoValue = hoverValue || value;
        const ceilValue = Math.ceil(infoValue);

        return iconSize * (ceilValue - 1) + ceilValue * iconSpace;
    }

    render() {
        const {
            id,
            prefix,
            className,
            showGrade,
            count,
            size,
            iconType,
            strokeMode,
            readAs,
            rtl,
            isPreview,
            renderPreview,
            locale,
        } = this.props;

        const { disabled } = this.state;
        const others = obj.pickOthers(Rating.propTypes, this.props);
        const { hoverValue, clicked } = this.state;
        const underlay = [],
            overlay = [];

        const enableA11y = !!id;

        // 获得Value
        const value = Rating.currentValue(
            0,
            count,
            hoverValue,
            this.state.value
        );

        // icon的sizeMap
        const sizeMap = ICON_SIZE_MAP[size];

        for (let i = 0; i < count; i++) {
            const isCurrent = Math.ceil(value - 1) === i;
            const iconCls = classNames({
                hover: hoverValue > 0 && isCurrent,
                clicked: clicked && isCurrent,
            });
            const iconNode = (
                <Icon type={iconType} size={sizeMap} className={iconCls} />
            );

            underlay.push(
                <span
                    ref={`rating-icon-${i}`}
                    key={`underlay-${i}`}
                    className={`${prefix}rating-icon`}
                >
                    {iconNode}
                </span>
            );
            if (enableA11y) {
                overlay.push(
                    <input
                        id={`${id}-${prefix}star${i + 1}`}
                        key={`input-${i}`}
                        className={`${prefix}sr-only`}
                        aria-checked={i + 1 === parseInt(hoverValue)}
                        checked={i + 1 === parseInt(hoverValue)}
                        onChange={this.handleChecked.bind(this, i + 1)}
                        type="radio"
                        name="rating"
                    />
                );
            }

            overlay.push(
                <label
                    key={`overlay-${i}`}
                    htmlFor={enableA11y ? `${id}-${prefix}star${i + 1}` : null}
                    className={`${prefix}rating-icon`}
                >
                    {iconNode}
                    {enableA11y ? (
                        <span className={`${prefix}sr-only`}>
                            {readAs(i + 1)}
                        </span>
                    ) : null}
                </label>
            );
        }

        const ratingCls = classNames(
            [`${prefix}rating`, `${prefix}rating-${size}`],
            {
                [`${prefix}rating-grade-low`]: value <= count * 0.4,
                [`${prefix}rating-grade-high`]: value > count * 0.4,
                [`${prefix}rating-stroke-mode`]: strokeMode,
                hover: hoverValue > 0,
            },
            className
        );

        const baseCls = classNames(`${prefix}rating-base`, {
            [`${prefix}rating-base-disabled`]: disabled,
        });

        const previewCls = classNames({
            [`${prefix}form-preview`]: true,
            [className]: !!className,
        });

        const overlayStyle = {
            width: this.getOverlayWidth(),
        };
        const infoStyle = {
            left: this.getInfoLeft(),
            display: hoverValue ? 'block' : 'none',
        };

        const finalProps = disabled
            ? {}
            : {
                  onClick: this.handleClick,
                  onMouseOver: this.handleHover,
                  onMouseMove: this.handleHover,
                  onMouseLeave: this.handleLeave,
              };

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview && 'renderPreview' in this.props) {
            return (
                <div id={id} {...others} className={previewCls}>
                    {renderPreview(value, this.props)}
                </div>
            );
        }

        return (
            <div
                id={id}
                {...others}
                className={ratingCls}
                onKeyDown={this.onKeyDown}
                tabIndex="0"
                role="group"
                aria-label={locale.description}
            >
                <div className={baseCls} {...finalProps}>
                    <div
                        className={`${prefix}rating-underlay`}
                        ref={n => (this.underlayNode = n)}
                        aria-hidden
                    >
                        {underlay}
                    </div>
                    <div
                        className={`${prefix}rating-overlay`}
                        style={overlayStyle}
                    >
                        {overlay}
                    </div>
                </div>
                {showGrade ? (
                    <div className={`${prefix}rating-info`} style={infoStyle}>
                        {readAs(value)}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default polyfill(Rating);
