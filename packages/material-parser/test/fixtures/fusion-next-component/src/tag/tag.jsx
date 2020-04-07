import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from '../animate';
import Icon from '../icon';
import { func, KEYCODE, obj, support } from '../util';
import zhCN from '../locale/zh-cn';
import ConfigProvider from '../config-provider';

const { noop, bindCtx } = func;

const PRESET_COLOR_REG = /blue|green|orange|red|turquoise|yellow/;

/**
 * Tag
 */
class Tag extends Component {
    static propTypes = {
        /**
         * 标签类名前缀,提供给二次开发者用
         * @default next-
         */
        prefix: PropTypes.string,
        /**
         * 标签的类型
         */
        type: PropTypes.oneOf(['normal', 'primary']),
        /**
         * 标签的尺寸（large 尺寸为兼容表单场景 large = medium）
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),

        /**
         * 标签颜色, 目前支持：blue、 green、 orange、red、 turquoise、 yellow 和 hex 颜色值 （`color keywords`作为 Tag 组件的保留字，请勿直接使用 ）, `1.19.0` 以上版本生效
         */
        color: PropTypes.string,
        /**
         * 是否开启动效
         */
        animation: PropTypes.bool,
        closeArea: PropTypes.oneOf(['tag', 'tail']),
        closable: PropTypes.bool,
        onClose: PropTypes.func,
        afterClose: PropTypes.func,
        /**
         * 标签出现动画结束后执行的回调
         */
        afterAppear: PropTypes.func,
        className: PropTypes.any,
        children: PropTypes.node,
        /**
         * 点击回调
         */
        onClick: PropTypes.func,
        _shape: PropTypes.oneOf(['default', 'closable', 'checkable']),
        disabled: PropTypes.bool,
        rtl: PropTypes.bool,
        locale: PropTypes.object,
    };

    static defaultProps = {
        prefix: 'next-',
        type: 'normal',
        size: 'medium',
        closeArea: 'tail',
        animation: false,
        onClose: noop,
        afterClose: noop,
        afterAppear: noop,
        onClick: noop,
        _shape: 'default',
        disabled: false,
        rtl: false,
        locale: zhCN.Tag,
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: true,
        };

        bindCtx(this, [
            'handleBodyClick',
            'handleTailClick',
            'handleAnimationInit',
            'handleAnimationEnd',
            'renderTailNode',
        ]);
    }

    componentWillUnmount() {
        this.__destroyed = true;
    }

    handleClose(from) {
        const { animation, onClose } = this.props;
        const hasAnimation = support.animation && animation;

        // 先执行回调
        const result = onClose(from, this.tagNode);

        // 如果回调函数返回 false，则阻止关闭行为
        if (result !== false && !this.__destroyed) {
            this.setState(
                {
                    visible: false,
                },
                () => {
                    // 如果没有动画，则直接执行 afterClose
                    !hasAnimation && this.props.afterClose(this.tagNode);
                }
            );
        }
    }

    // 标签体点击
    handleBodyClick(e) {
        const { closable, closeArea, onClick } = this.props;

        if (closable && closeArea === 'tag') {
            this.handleClose('tag');
        }

        if (typeof onClick === 'function') {
            return onClick(e);
        }
    }

    onKeyDown = e => {
        // 针对无障碍化要求 添加键盘SPACE事件
        const { closable, closeArea, onClick, disabled } = this.props;
        if (e.keyCode !== KEYCODE.SPACE || disabled) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (closable) {
            this.handleClose(closeArea);
        } else {
            typeof onClick === 'function' && onClick(e);
        }
    };

    handleTailClick(e) {
        e && e.preventDefault();
        e && e.stopPropagation();

        this.handleClose('tail');
    }

    handleAnimationInit(node) {
        this.props.afterAppear(node);
    }

    handleAnimationEnd(node) {
        this.props.afterClose(node);
    }

    renderAnimatedTag(children, animationName) {
        return (
            <Animate
                animation={animationName}
                afterAppear={this.handleAnimationInit}
                afterLeave={this.handleAnimationEnd}
            >
                {children}
            </Animate>
        );
    }

    renderTailNode() {
        const { prefix, closable, locale } = this.props;

        if (!closable) {
            return null;
        }

        return (
            <span
                className={`${prefix}tag-close-btn`}
                onClick={this.handleTailClick}
                role="button"
                aria-label={locale.delete}
            >
                <Icon type="close" />
            </span>
        );
    }

    isPresetColor() {
        const { color } = this.props;

        if (!color) {
            return false;
        }

        return PRESET_COLOR_REG.test(color);
    }

    getTagStyle() {
        const { color = '', style } = this.props;
        const isPresetColor = this.isPresetColor();
        const customColorStyle = {
            backgroundColor: color,
            borderColor: color,
            color: '#fff',
        };

        return {
            ...(color && !isPresetColor ? customColorStyle : null),
            ...style,
        };
    }

    render() {
        const {
            prefix,
            type,
            size,
            color,
            _shape,
            closable,
            closeArea,
            className,
            children,
            animation,
            disabled,
            rtl,
        } = this.props;
        const { visible } = this.state;
        const isPresetColor = this.isPresetColor();
        const others = obj.pickOthers(Tag.propTypes, this.props);
        // eslint-disable-next-line no-unused-vars
        const { style, ...otherTagProps } = others;
        const shape = closable ? 'closable' : _shape;
        const bodyClazz = classNames(
            [`${prefix}tag`, `${prefix}tag-${shape}`, `${prefix}tag-${size}`],
            {
                [`${prefix}tag-level-${type}`]: !color,
                [`${prefix}tag-closable`]: closable,
                [`${prefix}tag-body-pointer`]: closable && closeArea === 'tag',
                [`${prefix}tag-${color}`]:
                    color && isPresetColor && type === 'primary',
                [`${prefix}tag-${color}-inverse`]:
                    color && isPresetColor && type === 'normal',
            },
            className
        );

        // close btn
        const tailNode = this.renderTailNode();
        // tag node
        const tagNode = !visible ? null : (
            <div
                className={bodyClazz}
                onClick={this.handleBodyClick}
                onKeyDown={this.onKeyDown}
                tabIndex={disabled ? '' : '0'}
                role="button"
                aria-disabled={disabled}
                disabled={disabled}
                dir={rtl ? 'rtl' : undefined}
                ref={n => (this.tagNode = n)}
                style={this.getTagStyle()}
                {...otherTagProps}
            >
                <span className={`${prefix}tag-body`}>{children}</span>
                {tailNode}
            </div>
        );

        if (animation && support.animation) {
            return this.renderAnimatedTag(tagNode, `${prefix}tag-zoom`);
        }

        // 未开启或不支持动画
        return tagNode;
    }
}

export default ConfigProvider.config(Tag);
