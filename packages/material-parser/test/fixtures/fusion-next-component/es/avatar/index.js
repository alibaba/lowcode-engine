import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Icon from '../icon';
import { obj } from '../util';

/**
 * Avatar
 */
var Avatar = (_temp2 = _class = function (_Component) {
    _inherits(Avatar, _Component);

    function Avatar() {
        var _temp, _this, _ret;

        _classCallCheck(this, Avatar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            isImgExist: true
        }, _this.handleImgLoadError = function () {
            var onError = _this.props.onError;

            var errorFlag = onError ? onError() : undefined;
            if (errorFlag !== false) {
                _this.setState({ isImgExist: false });
            }
        }, _this.getIconSize = function (avatarSize) {
            return typeof avatarSize === 'number' ? avatarSize / 2 : avatarSize;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Avatar.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (prevProps.src !== this.props.src) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ isImgExist: true });
        }
    };

    Avatar.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            style = _props.style,
            size = _props.size,
            icon = _props.icon,
            alt = _props.alt,
            srcSet = _props.srcSet,
            shape = _props.shape,
            src = _props.src;
        var isImgExist = this.state.isImgExist;
        var children = this.props.children;


        var others = obj.pickOthers(Avatar.propTypes, this.props);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'avatar'] = true, _classNames[prefix + 'avatar-' + shape] = !!shape, _classNames[prefix + 'avatar-image'] = src && isImgExist, _classNames[prefix + 'avatar-' + size] = typeof size === 'string', _classNames), className);

        var sizeStyle = typeof size === 'number' ? {
            width: size,
            height: size,
            lineHeight: size + 'px',
            fontSize: icon ? size / 2 : 18
        } : {};

        var iconSize = this.getIconSize(size);
        if (src) {
            if (isImgExist) {
                children = React.createElement('img', {
                    src: src,
                    srcSet: srcSet,
                    onError: this.handleImgLoadError,
                    alt: alt
                });
            } else {
                children = React.createElement(Icon, { type: 'picture', size: iconSize });
            }
        } else if (typeof icon === 'string') {
            children = React.createElement(Icon, { type: icon, size: iconSize });
        } else if (icon) {
            var newIconSize = 'size' in icon.props ? icon.props.size : iconSize;
            children = React.cloneElement(icon, { size: newIconSize });
        }

        return React.createElement(
            'span',
            _extends({
                className: cls,
                style: _extends({}, sizeStyle, style)
            }, others),
            children
        );
    };

    return Avatar;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    /**
     * 头像的大小
     */
    size: PropTypes.oneOfType([PropTypes.oneOf(['small', 'medium', 'large']), PropTypes.number]),
    /**
     * 头像的形状
     */
    shape: PropTypes.oneOf(['circle', 'square']),
    /**
     * icon 类头像的图标类型，可设为 Icon 的 `type` 或 `ReactNode`
     */
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /**
     * 图片类头像的资源地址
     */
    src: PropTypes.string,
    /**
     * 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为
     */
    onError: PropTypes.func,
    /**
     * 图像无法显示时的 alt 替代文本
     */
    alt: PropTypes.string,
    /**
     * 图片类头像响应式资源地址
     */
    srcSet: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    size: 'medium',
    shape: 'circle'
}, _temp2);
Avatar.displayName = 'Avatar';


export default ConfigProvider.config(Avatar);