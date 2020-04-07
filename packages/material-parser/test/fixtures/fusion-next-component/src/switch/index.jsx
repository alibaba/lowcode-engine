import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import { KEYCODE } from '../util';
import ConfigProvider from '../config-provider';
import zhCN from '../locale/zh-cn';

/** Switch*/
class Switch extends React.Component {
    static contextTypes = {
        prefix: PropTypes.string,
    };
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        pure: PropTypes.bool,
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * 自定义内敛样式
         */
        style: PropTypes.object,
        /**
         * 打开时的内容
         */
        checkedChildren: PropTypes.any,
        /**
         * 关闭时的内容
         */
        unCheckedChildren: PropTypes.any,
        /**
         * 开关状态改变是触发此事件
         * @param {Boolean} checked 是否为打开状态
         * @param {Event} e DOM事件对象
         */
        onChange: PropTypes.func,
        /**
         * 开关当前的值(针对受控组件)
         */
        checked: PropTypes.bool,
        /**
         * 开关默认值 (针对非受控组件)
         */
        defaultChecked: PropTypes.bool,
        /**
         * 表示开关被禁用
         */
        disabled: PropTypes.bool,
        /**
         * switch的尺寸
         * @enumdesc 正常大小, 缩小版大小
         */
        size: PropTypes.oneOf(['medium', 'small']),
        /**
         * 鼠标点击事件
         * @param {Event} e DOM事件对象
         */
        onClick: PropTypes.func,
        /**
         * 键盘按键事件
         * @param {Event} e DOM事件对象
         */
        onKeyDown: PropTypes.func,
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
         * 国际化配置
         */
        locale: PropTypes.object,
    };
    static defaultProps = {
        prefix: 'next-',
        size: 'medium',
        disabled: false,
        defaultChecked: false,
        isPreview: false,
        readOnly: false,
        onChange: () => {},
        locale: zhCN.Switch,
    };

    constructor(props, context) {
        super(props, context);

        const checked = props.checked || props.defaultChecked;
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.state = {
            checked,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if ('checked' in props && props.checked !== state.checked) {
            return {
                checked: !!props.checked,
            };
        }

        return null;
    }

    onChange(ev) {
        const checked = !this.state.checked;

        if (!('checked' in this.props)) {
            this.setState({
                checked,
            });
        }
        this.props.onChange(checked, ev);
        this.props.onClick && this.props.onClick(ev);
    }

    onKeyDown(e) {
        if (e.keyCode === KEYCODE.ENTER || e.keyCode === KEYCODE.SPACE) {
            this.onChange(e);
        }
        this.props.onKeyDown && this.props.onKeyDown(e);
    }

    render() {
        const {
            prefix,
            className,
            disabled,
            readOnly,
            size,
            checkedChildren,
            unCheckedChildren,
            rtl,
            isPreview,
            renderPreview,
            locale,
            ...others
        } = this.props;
        const { checked } = this.state;
        const status = checked ? 'on' : 'off';
        const children = checked ? checkedChildren : unCheckedChildren;

        let _size = size;
        if (_size !== 'small' && _size !== 'medium') {
            _size = 'medium';
        }

        const classes = classNames({
            [`${prefix}switch`]: true,
            [`${prefix}switch-${status}`]: true,
            [`${prefix}switch-${_size}`]: true,
            [className]: className,
        });
        let attrs;
        const isDisabled = disabled || readOnly;

        if (!isDisabled) {
            attrs = {
                onClick: this.onChange,
                tabIndex: 0,
                onKeyDown: this.onKeyDown,
                disabled: false,
            };
        } else {
            attrs = {
                disabled: true,
            };
        }

        if (isPreview) {
            const previewCls = classNames(className, {
                [`${prefix}form-preview`]: true,
            });

            if ('renderPreview' in this.props) {
                return (
                    <div className={previewCls} {...others}>
                        {renderPreview(checked, this.props)}
                    </div>
                );
            }

            return (
                <p className={previewCls} {...others}>
                    {locale[status]}
                </p>
            );
        }

        return (
            <div
                role="switch"
                dir={rtl ? 'rtl' : undefined}
                tabIndex="0"
                {...others}
                className={classes}
                {...attrs}
                aria-checked={checked}
            >
                <div className={`${prefix}switch-children`}>{children}</div>
            </div>
        );
    }
}

export default ConfigProvider.config(polyfill(Switch));
