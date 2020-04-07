import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import UIState from '../mixin-ui-state';
import ConfigProvider from '../config-provider';
import Icon from '../icon';
import { obj, func } from '../util';

const noop = func.noop;
function isChecked(selectedValue, value) {
    return selectedValue.indexOf(value) > -1;
}
/**
 * Checkbox
 * @order 1
 */
class Checkbox extends UIState {
    static displayName = 'Checkbox';
    static propTypes = {
        ...ConfigProvider.propTypes,
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * checkbox id, 挂载在input上
         */
        id: PropTypes.string,
        /**
         * 自定义内敛样式
         */
        style: PropTypes.object,
        /**
         * 选中状态
         */
        checked: PropTypes.bool,
        /**
         * 默认选中状态
         */
        defaultChecked: PropTypes.bool,
        /**
         * 禁用
         */
        disabled: PropTypes.bool,
        /**
         * 通过属性配置label，
         */
        label: PropTypes.node,
        /**
         * Checkbox 的中间状态，只会影响到 Checkbox 的样式，并不影响其 checked 属性
         */
        indeterminate: PropTypes.bool,
        /**
         *  Checkbox 的默认中间态，只会影响到 Checkbox 的样式，并不影响其 checked 属性
         */
        defaultIndeterminate: PropTypes.bool,
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
         * 鼠标离开Leave事件
         * @param {Event} e Dom 事件对象
         */
        onMouseLeave: PropTypes.func,
        /**
         * checkbox 的value
         */
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
        defaultChecked: false,
        defaultIndeterminate: false,
        onChange: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
        prefix: 'next-',
        isPreview: false,
    };

    static contextTypes = {
        onChange: PropTypes.func,
        __group__: PropTypes.bool,
        selectedValue: PropTypes.array,
        disabled: PropTypes.bool,
        prefix: PropTypes.string,
    };

    constructor(props, context) {
        super(props);

        let checked, indeterminate;

        if ('checked' in props) {
            checked = props.checked;
        } else {
            checked = props.defaultChecked;
        }

        if ('indeterminate' in props) {
            indeterminate = props.indeterminate;
        } else {
            indeterminate = props.defaultIndeterminate;
        }
        if (context.__group__) {
            checked = isChecked(context.selectedValue, props.value);
        }
        this.state = {
            checked,
            indeterminate,
        };

        this.disabled =
            props.disabled ||
            (context.__group__ && 'disabled' in context && context.disabled);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.__group__) {
            if ('selectedValue' in nextContext) {
                this.setState({
                    checked: isChecked(
                        nextContext.selectedValue,
                        nextProps.value
                    ),
                });
            }

            this.disabled =
                nextProps.disabled ||
                ('disabled' in nextContext && nextContext.disabled);
        } else {
            if ('checked' in nextProps) {
                this.setState({
                    checked: nextProps.checked,
                });
            }
            this.disabled = nextProps.disabled;
        }

        if ('indeterminate' in nextProps) {
            this.setState({
                indeterminate: nextProps.indeterminate,
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { shallowEqual } = obj;
        return (
            !shallowEqual(this.props, nextProps) ||
            !shallowEqual(this.state, nextState) ||
            !shallowEqual(this.context, nextContext)
        );
    }

    onChange(e) {
        const checked = e.target.checked;
        const value = this.props.value;

        if (this.disabled) {
            return;
        }
        if (this.context.__group__) {
            this.context.onChange(value, e);
        } else {
            if (!('checked' in this.props)) {
                this.setState({
                    checked: checked,
                });
            }

            if (!('indeterminate' in this.props)) {
                this.setState({
                    indeterminate: false,
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
            rtl,
            isPreview,
            renderPreview,
            value,
            name,
            ...otherProps
        } = this.props;
        const checked = !!this.state.checked;
        const disabled = this.disabled;
        const indeterminate = !!this.state.indeterminate;
        const prefix = this.context.prefix || this.props.prefix;

        const others = obj.pickOthers(Checkbox.propTypes, otherProps);
        const othersData = obj.pickAttrsWith(others, 'data-');
        if (otherProps.title) {
            othersData.title = otherProps.title;
        }

        let childInput = (
            <input
                {...obj.pickOthers(Checkbox.propTypes, otherProps)}
                id={id}
                value={value}
                name={name}
                disabled={disabled}
                checked={checked}
                type="checkbox"
                onChange={this.onChange}
                aria-checked={indeterminate ? 'mixed' : checked}
                className={`${prefix}checkbox-input`}
            />
        );

        // disable 无状态操作
        if (!disabled) {
            childInput = this.getStateElement(childInput);
        }
        const cls = classnames({
            [`${prefix}checkbox-wrapper`]: true,
            [className]: !!className,
            checked,
            disabled,
            indeterminate,
            [this.getStateClassName()]: true,
        });
        const labelCls = `${prefix}checkbox-label`;
        const type = indeterminate ? 'semi-select' : 'select';

        if (isPreview) {
            const previewCls = classnames(className, `${prefix}form-preview`);
            if ('renderPreview' in this.props) {
                return (
                    <div
                        id={id}
                        dir={rtl ? 'rtl' : undefined}
                        {...othersData}
                        className={previewCls}
                    >
                        {renderPreview(checked, this.props)}
                    </div>
                );
            }

            return (
                <p
                    id={id}
                    dir={rtl ? 'rtl' : undefined}
                    {...othersData}
                    className={previewCls}
                >
                    {checked && (children || label || this.state.value)}
                </p>
            );
        }

        return (
            <label
                {...othersData}
                className={cls}
                style={style}
                dir={rtl ? 'rtl' : undefined}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <span className={`${prefix}checkbox`}>
                    <span className={`${prefix}checkbox-inner`}>
                        <Icon
                            type={type}
                            size="xs"
                            className={indeterminate ? 'zoomIn' : ''}
                        />
                    </span>
                    {childInput}
                </span>
                {[label, children].map((item, i) =>
                    [undefined, null].indexOf(item) === -1 ? (
                        <span key={i} className={labelCls}>
                            {item}
                        </span>
                    ) : null
                )}
            </label>
        );
    }
}

export default ConfigProvider.config(Checkbox);
