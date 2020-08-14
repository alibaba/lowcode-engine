import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from '../animate';
import Icon from '../icon';
import { func, KEYCODE, obj, support } from '../util';
import zhCN from '../locale/zh-cn';
import ConfigProvider from '../config-provider';

var noop = func.noop,
    bindCtx = func.bindCtx;


var PRESET_COLOR_REG = /blue|green|orange|red|turquoise|yellow/;

/**
 * Tag
 */
var Tag = (_temp = _class = function (_Component) {
    _inherits(Tag, _Component);

    function Tag(props) {
        _classCallCheck(this, Tag);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.onKeyDown = function (e) {
            // 针对无障碍化要求 添加键盘SPACE事件
            var _this$props = _this.props,
                closable = _this$props.closable,
                closeArea = _this$props.closeArea,
                onClick = _this$props.onClick,
                disabled = _this$props.disabled;

            if (e.keyCode !== KEYCODE.SPACE || disabled) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (closable) {
                _this.handleClose(closeArea);
            } else {
                typeof onClick === 'function' && onClick(e);
            }
        };

        _this.state = {
            visible: true
        };

        bindCtx(_this, ['handleBodyClick', 'handleTailClick', 'handleAnimationInit', 'handleAnimationEnd', 'renderTailNode']);
        return _this;
    }

    Tag.prototype.componentWillUnmount = function componentWillUnmount() {
        this.__destroyed = true;
    };

    Tag.prototype.handleClose = function handleClose(from) {
        var _this2 = this;

        var _props = this.props,
            animation = _props.animation,
            onClose = _props.onClose;

        var hasAnimation = support.animation && animation;

        // 先执行回调
        var result = onClose(from, this.tagNode);

        // 如果回调函数返回 false，则阻止关闭行为
        if (result !== false && !this.__destroyed) {
            this.setState({
                visible: false
            }, function () {
                // 如果没有动画，则直接执行 afterClose
                !hasAnimation && _this2.props.afterClose(_this2.tagNode);
            });
        }
    };

    // 标签体点击


    Tag.prototype.handleBodyClick = function handleBodyClick(e) {
        var _props2 = this.props,
            closable = _props2.closable,
            closeArea = _props2.closeArea,
            onClick = _props2.onClick;


        if (closable && closeArea === 'tag') {
            this.handleClose('tag');
        }

        if (typeof onClick === 'function') {
            return onClick(e);
        }
    };

    Tag.prototype.handleTailClick = function handleTailClick(e) {
        e && e.preventDefault();
        e && e.stopPropagation();

        this.handleClose('tail');
    };

    Tag.prototype.handleAnimationInit = function handleAnimationInit(node) {
        this.props.afterAppear(node);
    };

    Tag.prototype.handleAnimationEnd = function handleAnimationEnd(node) {
        this.props.afterClose(node);
    };

    Tag.prototype.renderAnimatedTag = function renderAnimatedTag(children, animationName) {
        return React.createElement(
            Animate,
            {
                animation: animationName,
                afterAppear: this.handleAnimationInit,
                afterLeave: this.handleAnimationEnd
            },
            children
        );
    };

    Tag.prototype.renderTailNode = function renderTailNode() {
        var _props3 = this.props,
            prefix = _props3.prefix,
            closable = _props3.closable,
            locale = _props3.locale;


        if (!closable) {
            return null;
        }

        return React.createElement(
            'span',
            {
                className: prefix + 'tag-close-btn',
                onClick: this.handleTailClick,
                role: 'button',
                'aria-label': locale.delete
            },
            React.createElement(Icon, { type: 'close' })
        );
    };

    Tag.prototype.isPresetColor = function isPresetColor() {
        var color = this.props.color;


        if (!color) {
            return false;
        }

        return PRESET_COLOR_REG.test(color);
    };

    Tag.prototype.getTagStyle = function getTagStyle() {
        var _props4 = this.props,
            _props4$color = _props4.color,
            color = _props4$color === undefined ? '' : _props4$color,
            style = _props4.style;

        var isPresetColor = this.isPresetColor();
        var customColorStyle = {
            backgroundColor: color,
            borderColor: color,
            color: '#fff'
        };

        return _extends({}, color && !isPresetColor ? customColorStyle : null, style);
    };

    Tag.prototype.render = function render() {
        var _classNames,
            _this3 = this;

        var _props5 = this.props,
            prefix = _props5.prefix,
            type = _props5.type,
            size = _props5.size,
            color = _props5.color,
            _shape = _props5._shape,
            closable = _props5.closable,
            closeArea = _props5.closeArea,
            className = _props5.className,
            children = _props5.children,
            animation = _props5.animation,
            disabled = _props5.disabled,
            rtl = _props5.rtl;
        var visible = this.state.visible;

        var isPresetColor = this.isPresetColor();
        var others = obj.pickOthers(Tag.propTypes, this.props);
        // eslint-disable-next-line no-unused-vars

        var style = others.style,
            otherTagProps = _objectWithoutProperties(others, ['style']);

        var shape = closable ? 'closable' : _shape;
        var bodyClazz = classNames([prefix + 'tag', prefix + 'tag-' + shape, prefix + 'tag-' + size], (_classNames = {}, _classNames[prefix + 'tag-level-' + type] = !color, _classNames[prefix + 'tag-closable'] = closable, _classNames[prefix + 'tag-body-pointer'] = closable && closeArea === 'tag', _classNames[prefix + 'tag-' + color] = color && isPresetColor && type === 'primary', _classNames[prefix + 'tag-' + color + '-inverse'] = color && isPresetColor && type === 'normal', _classNames), className);

        // close btn
        var tailNode = this.renderTailNode();
        // tag node
        var tagNode = !visible ? null : React.createElement(
            'div',
            _extends({
                className: bodyClazz,
                onClick: this.handleBodyClick,
                onKeyDown: this.onKeyDown,
                tabIndex: disabled ? '' : '0',
                role: 'button',
                'aria-disabled': disabled,
                disabled: disabled,
                dir: rtl ? 'rtl' : undefined,
                ref: function ref(n) {
                    return _this3.tagNode = n;
                },
                style: this.getTagStyle()
            }, otherTagProps),
            React.createElement(
                'span',
                { className: prefix + 'tag-body' },
                children
            ),
            tailNode
        );

        if (animation && support.animation) {
            return this.renderAnimatedTag(tagNode, prefix + 'tag-zoom');
        }

        // 未开启或不支持动画
        return tagNode;
    };

    return Tag;
}(Component), _class.propTypes = {
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
    locale: PropTypes.object
}, _class.defaultProps = {
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
    locale: zhCN.Tag
}, _temp);
Tag.displayName = 'Tag';


export default ConfigProvider.config(Tag);