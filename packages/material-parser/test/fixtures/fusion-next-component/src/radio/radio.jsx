import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import UIState from '../mixin-ui-state';
import ConfigProvider from '../config-provider';
import { obj, func } from '../util';

const { makeChain, noop } = func;
/**
 * Radio
 * @order 1
 */
class Radio extends UIState {
    static displayName = 'Radio';
    static propTypes = {
        ...ConfigProvider.propTypes,
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * 组件input的id
         */
        id: PropTypes.string,
        /**
         * 自定义内敛样式
         */
        style: PropTypes.object,
        /**
         * 设置radio是否选中
         */
        checked: PropTypes.bool,
        /**
         * 设置radio是否默认选中
         */
        defaultChecked: PropTypes.bool,
        /**
         * 通过属性配置label
         */
        label: PropTypes.node,
        /**
         * 状态变化时触发的事件
         * @param {Boolean} checked 是否选中
         * @param {Event} e Dom 事件对象
         */
        onChange: PropTypes.func,
        /**
         * 鼠标进入enter事件
         * @param {Event} e Dom 事件对象
         */
        onMouseEnter: PropTypes.func,
        /**
         * 鼠标离开事件
         * @param {Event} e Dom 事件对象
         */
        onMouseLeave: PropTypes.func,
        /**
         * radio是否被禁用
         */
        disabled: PropTypes.bool,
        /**
         * radio 的value
         */
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
        ]),
        /**
         * name
         */
        name: PropTypes.string,
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
        onChange: noop,
        onMouseLeave: noop,
        onMouseEnter: noop,
        tabIndex: 0,
        prefix: 'next-',
        isPreview: false,
    };

    static contextTypes = {
        onChange: PropTypes.func,
        __group__: PropTypes.bool,
        isButton: PropTypes.bool,
        selectedValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
        ]),
        disabled: PropTypes.bool,
    };

    constructor(props, context) {
        super(props);

        let checked;
        if (context.__group__) {
            checked = context.selectedValue === props.value;
        } else if ('checked' in props) {
            checked = props.checked;
        } else {
            checked = props.defaultChecked;
        }

        this.state = { checked };

        this.onChange = this.onChange.bind(this);
        this.disabled =
            props.disabled ||
            (context.__group__ && 'disabled' in context && context.disabled);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.__group__) {
            const { selectedValue } = nextContext;
            if ('selectedValue' in nextContext) {
                this.setState({
                    checked: selectedValue === nextProps.value,
                });
            }
        } else if ('checked' in nextProps) {
            this.setState({
                checked: nextProps.checked,
            });
        }

        this.disabled =
            nextProps.disabled ||
            (nextContext.__group__ &&
                'disabled' in nextContext &&
                nextContext.disabled);

        // when disabled, reset UIState
        if (this.disabled) {
            // only class has an impact, no effect on visual
            this.resetUIState();
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { shallowEqual } = obj;
        return (
            !shallowEqual(this.props, nextProps) ||
            !shallowEqual(this.state, nextState) ||
            !shallowEqual(this.nextContext, nextContext)
        );
    }

    onChange(e) {
        const checked = e.target.checked;
        const value = this.props.value;

        if (this.context.__group__) {
            this.context.onChange(value, e);
        } else if (this.state.checked !== checked) {
            if (!('checked' in this.props)) {
                this.setState({
                    checked: checked,
                });
            }
            this.props.onChange(checked, e);
        }
    }

    render() {
        /* eslint-disable no-unused-vars */
        const {
            id,
            className,
            children,
            style,
            label,
            onMouseEnter,
            onMouseLeave,
            tabIndex,
            rtl,
            name,
            isPreview,
            renderPreview,
            value,
            ...otherProps
        } = this.props;
        const checked = !!this.state.checked;
        const disabled = this.disabled;
        const isButton = this.context.isButton;
        const prefix = this.context.prefix || this.props.prefix;

        const others = obj.pickOthers(Radio.propTypes, otherProps);
        const othersData = obj.pickAttrsWith(others, 'data-');

        if (isPreview) {
            const previewCls = classnames(className, `${prefix}form-preview`);

            if ('renderPreview' in this.props) {
                return (
                    <div
                        id={id}
                        dir={rtl ? 'rtl' : 'ltr'}
                        {...others}
                        className={previewCls}
                    >
                        {renderPreview(checked, this.props)}
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
                    {checked && (children || label || value)}
                </p>
            );
        }

        let input = (
            <input
                {...obj.pickOthers(othersData, others)}
                name={name}
                id={id}
                tabIndex={tabIndex}
                disabled={disabled}
                checked={checked}
                type="radio"
                onChange={this.onChange}
                aria-checked={checked}
                className={`${prefix}radio-input`}
            />
        );

        // disabled do not hove focus state
        if (!disabled) {
            input = this.getStateElement(input);
        }

        const cls = classnames({
            [`${prefix}radio`]: true,
            checked,
            disabled,
            [this.getStateClassName()]: true,
        });
        const clsInner = classnames({
            [`${prefix}radio-inner`]: true,
            press: checked,
            unpress: !checked,
        });
        const clsWrapper = classnames({
            [`${prefix}radio-wrapper`]: true,
            [className]: !!className,
            checked,
            disabled,
            [this.getStateClassName()]: true,
        });
        const childrenCls = `${prefix}radio-label`;

        const radioComp = !isButton ? (
            <span className={cls}>
                <span className={clsInner} />
                {input}
            </span>
        ) : (
            <span className={`${prefix}radio-single-input`}>{input}</span>
        );

        return (
            <label
                {...othersData}
                dir={rtl ? 'rtl' : 'ltr'}
                style={style}
                aria-checked={checked}
                aria-disabled={disabled}
                className={clsWrapper}
                onMouseEnter={
                    disabled
                        ? onMouseEnter
                        : makeChain(this._onUIMouseEnter, onMouseEnter)
                }
                onMouseLeave={
                    disabled
                        ? onMouseLeave
                        : makeChain(this._onUIMouseLeave, onMouseLeave)
                }
            >
                {radioComp}
                {[children, label].map((d, i) =>
                    d !== undefined ? (
                        <span key={i} className={childrenCls}>
                            {d}
                        </span>
                    ) : null
                )}
            </label>
        );
    }
}

export default ConfigProvider.config(Radio);
