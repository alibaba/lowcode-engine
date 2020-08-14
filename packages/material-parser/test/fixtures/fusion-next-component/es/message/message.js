import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import nextLocale from '../locale/zh-cn';
import Icon from '../icon';
import Animate from '../animate';
import ConfigProvider from '../config-provider';
import { obj } from '../util';

var noop = function noop() {};

/**
 * Message
 */
var Message = (_temp2 = _class = function (_Component) {
    _inherits(Message, _Component);

    function Message() {
        var _temp, _this, _ret;

        _classCallCheck(this, Message);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            visible: typeof _this.props.visible === 'undefined' ? _this.props.defaultVisible : _this.props.visible
        }, _this.onClose = function () {
            if (!('visible' in _this.props)) {
                _this.setState({
                    visible: false
                });
            }
            _this.props.onClose(false);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Message.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        if ('visible' in props) {
            return {
                visible: props.visible
            };
        }

        return {};
    };

    Message.prototype.render = function render() {
        var _classNames;

        /* eslint-disable no-unused-vars */
        var _props = this.props,
            prefix = _props.prefix,
            pure = _props.pure,
            className = _props.className,
            style = _props.style,
            type = _props.type,
            shape = _props.shape,
            size = _props.size,
            title = _props.title,
            children = _props.children,
            defaultVisible = _props.defaultVisible,
            propsVisible = _props.visible,
            icon = _props.iconType,
            closeable = _props.closeable,
            onClose = _props.onClose,
            afterClose = _props.afterClose,
            animation = _props.animation,
            rtl = _props.rtl,
            locale = _props.locale;

        var others = _extends({}, obj.pickOthers(Object.keys(Message.propTypes), this.props));
        /* eslint-enable */
        var visible = this.state.visible;

        var messagePrefix = prefix + 'message';

        var classes = classNames((_classNames = {}, _classNames[messagePrefix] = true, _classNames[prefix + 'message-' + type] = type, _classNames['' + prefix + shape] = shape, _classNames['' + prefix + size] = size, _classNames[prefix + 'title-content'] = !!title, _classNames[prefix + 'only-content'] = !title && !!children, _classNames[className] = className, _classNames));

        var newChildren = visible ? React.createElement(
            'div',
            _extends({
                role: 'alert',
                style: style
            }, others, {
                className: classes,
                dir: rtl ? 'rtl' : undefined
            }),
            closeable ? React.createElement(
                'a',
                {
                    role: 'button',
                    'aria-label': locale.closeAriaLabel,
                    className: messagePrefix + '-close',
                    onClick: this.onClose
                },
                React.createElement(Icon, { type: 'close' })
            ) : null,
            React.createElement(Icon, {
                className: messagePrefix + '-symbol ' + (!icon && messagePrefix + '-symbol-icon'),
                type: icon
            }),
            title ? React.createElement(
                'div',
                { className: messagePrefix + '-title' },
                title
            ) : null,
            children ? React.createElement(
                'div',
                { className: messagePrefix + '-content' },
                children
            ) : null
        ) : null;

        if (animation) {
            return React.createElement(
                Animate.Expand,
                { animationAppear: false, afterLeave: afterClose },
                newChildren
            );
        }

        return newChildren;
    };

    return Message;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    /**
     * 反馈类型
     */
    type: PropTypes.oneOf(['success', 'warning', 'error', 'notice', 'help', 'loading']),
    /**
     * 反馈外观
     */
    shape: PropTypes.oneOf(['inline', 'addon', 'toast']),
    /**
     * 反馈大小
     */
    size: PropTypes.oneOf(['medium', 'large']),
    /**
     * 标题
     */
    title: PropTypes.node,
    /**
     * 内容
     */
    children: PropTypes.node,
    /**
     * 默认是否显示
     */
    defaultVisible: PropTypes.bool,
    /**
     * 当前是否显示
     */
    visible: PropTypes.bool,
    /**
     * 显示的图标类型，会覆盖内部设置的IconType
     */
    iconType: PropTypes.string,
    /**
     * 显示关闭按钮
     */
    closeable: PropTypes.bool,
    /**
     * 关闭按钮的回调
     */
    onClose: PropTypes.func,
    /**
     * 关闭之后调用的函数
     */
    afterClose: PropTypes.func,
    /**
     * 是否开启展开收起动画
     */
    animation: PropTypes.bool,
    locale: PropTypes.object,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    type: 'success',
    shape: 'inline',
    size: 'medium',
    defaultVisible: true,
    closeable: false,
    onClose: noop,
    afterClose: noop,
    animation: true,
    locale: nextLocale.Message
}, _temp2);
Message.displayName = 'Message';


export default ConfigProvider.config(polyfill(Message));