import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import Checkbox from './checkbox';

const { pickOthers } = obj;

/** Checkbox.Group */
class CheckboxGroup extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * 自定义内敛样式
         */
        style: PropTypes.object,
        /**
         * 整体禁用
         */
        disabled: PropTypes.bool,
        /**
         * 可选项列表, 数据项可为 String 或者 Object, 如 `['apple', 'pear', 'orange']` 或者 `[{value: 'apple', label: '苹果',}, {value: 'pear', label: '梨'}, {value: 'orange', label: '橙子'}]`
         */
        dataSource: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.arrayOf(PropTypes.object),
        ]),
        /**
         * 被选中的值列表
         */
        value: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string,
            PropTypes.number,
        ]),
        /**
         * 默认被选中的值列表
         */
        defaultValue: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string,
            PropTypes.number,
        ]),
        /**
         * 通过子元素方式设置内部 checkbox
         */
        children: PropTypes.arrayOf(PropTypes.element),
        /**
         * 选中值改变时的事件
         * @param {Array} value 选中项列表
         * @param {Event} e Dom 事件对象
         */
        onChange: PropTypes.func,

        /**
         * 子项目的排列方式
         * - hoz: 水平排列 (default)
         * - ver: 垂直排列
         */
        itemDirection: PropTypes.oneOf(['hoz', 'ver']),
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
        dataSource: [],
        onChange: () => {},
        prefix: 'next-',
        itemDirection: 'hoz',
        isPreview: false,
    };

    static childContextTypes = {
        onChange: PropTypes.func,
        __group__: PropTypes.bool,
        selectedValue: PropTypes.array,
        disabled: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        let value = [];
        if ('value' in props) {
            value = props.value;
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        }
        if (!Array.isArray(value)) {
            if (value === null || value === undefined) {
                value = [];
            } else {
                value = [value];
            }
        }
        this.state = {
            value: [...value],
        };

        this.onChange = this.onChange.bind(this);
    }

    getChildContext() {
        return {
            __group__: true,
            onChange: this.onChange,
            selectedValue: this.state.value,
            disabled: this.props.disabled,
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            let { value } = nextProps;
            if (!Array.isArray(value)) {
                if (value === null || value === undefined) {
                    value = [];
                } else {
                    value = [value];
                }
            }
            this.setState({
                value,
            });
        }
    }

    onChange(currentValue, e) {
        const { value } = this.state;
        const index = value.indexOf(currentValue);
        const valTemp = [...value];

        if (index === -1) {
            valTemp.push(currentValue);
        } else {
            valTemp.splice(index, 1);
        }

        if (!('value' in this.props)) {
            this.setState({ value: valTemp });
        }
        this.props.onChange(valTemp, e);
    }

    render() {
        const {
            className,
            style,
            prefix,
            disabled,
            itemDirection,
            rtl,
            isPreview,
            renderPreview,
        } = this.props;
        const others = pickOthers(CheckboxGroup.propTypes, this.props);

        // 如果内嵌标签跟dataSource同时存在，以内嵌标签为主
        let children;
        const previewed = [];
        if (this.props.children) {
            children = React.Children.map(this.props.children, child => {
                if (!React.isValidElement(child)) {
                    return child;
                }
                const checked =
                    this.state.value &&
                    this.state.value.indexOf(child.props.value) > -1;

                if (checked) {
                    previewed.push({
                        label: child.props.children,
                        value: child.props.value,
                    });
                }

                return React.cloneElement(
                    child,
                    child.props.rtl === undefined ? { rtl } : null
                );
            });
        } else {
            children = this.props.dataSource.map((item, index) => {
                let option = item;
                if (typeof item !== 'object') {
                    option = {
                        label: item,
                        value: item,
                        disabled,
                    };
                }
                const checked =
                    this.state.value &&
                    this.state.value.indexOf(option.value) > -1;

                if (checked) {
                    previewed.push({
                        label: option.label,
                        value: option.value,
                    });
                }

                return (
                    <Checkbox
                        key={index}
                        value={option.value}
                        checked={checked}
                        rtl={rtl}
                        disabled={disabled || option.disabled}
                        label={option.label}
                    />
                );
            });
        }

        if (isPreview) {
            const previewCls = classnames(className, `${prefix}form-preview`);

            if ('renderPreview' in this.props) {
                return (
                    <div
                        {...others}
                        dir={rtl ? 'rtl' : undefined}
                        className={previewCls}
                    >
                        {renderPreview(previewed, this.props)}
                    </div>
                );
            }

            return (
                <p
                    {...others}
                    dir={rtl ? 'rtl' : undefined}
                    className={previewCls}
                >
                    {previewed.map(item => item.label).join(', ')}
                </p>
            );
        }

        const cls = classnames({
            [`${prefix}checkbox-group`]: true,
            [`${prefix}checkbox-group-${itemDirection}`]: true,
            [className]: !!className,
            disabled,
        });

        return (
            <span
                dir={rtl ? 'rtl' : undefined}
                {...others}
                className={cls}
                style={style}
            >
                {children}
            </span>
        );
    }
}

export default ConfigProvider.config(CheckboxGroup);
