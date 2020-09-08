import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Overlay from '../overlay';
import Inner from './inner';
import zhCN from '../locale/zh-cn';
import { obj } from '../util';

var noop = function noop() {};
var Popup = Overlay.Popup;
var pickOthers = obj.pickOthers;

/**
 * Drawer
 */

var Drawer = (_temp2 = _class = function (_Component) {
    _inherits(Drawer, _Component);

    function Drawer() {
        var _temp, _this, _ret;

        _classCallCheck(this, Drawer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getAlign = function (placement) {
            var align = void 0;
            switch (placement) {
                case 'top':
                    align = 'tl tl';
                    break;
                case 'bottom':
                    align = 'bl bl';
                    break;
                case 'left':
                    align = 'tl tl';
                    break;
                case 'right':
                default:
                    align = 'tr tr';
                    break;
            }

            return align;
        }, _this.getAnimation = function (placement) {
            if ('animation' in _this.props) {
                return _this.props.animation;
            }

            var animation = void 0;
            switch (placement) {
                case 'top':
                    animation = {
                        in: 'slideInDown',
                        out: 'slideOutUp'
                    };
                    break;
                case 'bottom':
                    animation = {
                        in: 'slideInUp',
                        out: 'slideOutDown'
                    };
                    break;
                case 'left':
                    animation = {
                        in: 'slideInLeft',
                        out: 'slideOutLeft'
                    };
                    break;
                case 'right':
                default:
                    animation = {
                        in: 'slideInRight',
                        out: 'slideOutRight'
                    };
                    break;
            }

            return animation;
        }, _this.getOverlayRef = function (ref) {
            _this.overlay = ref;
        }, _this.mapcloseableToConfig = function (closeable) {
            return ['esc', 'close', 'mask'].reduce(function (ret, option) {
                var key = option.charAt(0).toUpperCase() + option.substr(1);
                var value = typeof closeable === 'boolean' ? closeable : closeable.split(',').indexOf(option) > -1;

                if (option === 'esc' || option === 'mask') {
                    ret['canCloseBy' + key] = value;
                } else {
                    ret['canCloseBy' + key + 'Click'] = value;
                }

                return ret;
            }, {});
        }, _this.handleVisibleChange = function (visible, reason, e) {
            var _this$props = _this.props,
                onClose = _this$props.onClose,
                onVisibleChange = _this$props.onVisibleChange;


            if (visible === false) {
                onClose && onClose(reason, e);
            }

            onVisibleChange && onVisibleChange(visible, reason, e);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Drawer.prototype.renderInner = function renderInner(closeable) {
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            children = _props.children,
            title = _props.title,
            onClose = _props.onClose,
            locale = _props.locale,
            headerStyle = _props.headerStyle,
            bodyStyle = _props.bodyStyle,
            placement = _props.placement,
            rtl = _props.rtl;


        var others = pickOthers(Object.keys(Drawer.propTypes), this.props);

        return React.createElement(
            Inner,
            _extends({
                prefix: prefix,
                title: title,
                className: className,
                locale: locale,
                closeable: closeable,
                rtl: rtl,
                headerStyle: headerStyle,
                bodyStyle: bodyStyle,
                placement: placement,
                onClose: onClose.bind(this, 'closeClick')
            }, others),
            children
        );
    };

    Drawer.prototype.render = function render() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            style = _props2.style,
            width = _props2.width,
            height = _props2.height,
            trigger = _props2.trigger,
            triggerType = _props2.triggerType,
            animation = _props2.animation,
            hasMask = _props2.hasMask,
            visible = _props2.visible,
            placement = _props2.placement,
            onClose = _props2.onClose,
            onVisibleChange = _props2.onVisibleChange,
            closeable = _props2.closeable,
            rtl = _props2.rtl,
            popupContainer = _props2.popupContainer,
            others = _objectWithoutProperties(_props2, ['prefix', 'style', 'width', 'height', 'trigger', 'triggerType', 'animation', 'hasMask', 'visible', 'placement', 'onClose', 'onVisibleChange', 'closeable', 'rtl', 'popupContainer']);

        var newStyle = _extends({
            width: width,
            height: height
        }, style);

        var _mapcloseableToConfig = this.mapcloseableToConfig(closeable),
            canCloseByCloseClick = _mapcloseableToConfig.canCloseByCloseClick,
            closeConfig = _objectWithoutProperties(_mapcloseableToConfig, ['canCloseByCloseClick']);

        var newPopupProps = _extends({
            prefix: prefix,
            visible: visible,
            trigger: trigger,
            triggerType: triggerType,
            onVisibleChange: this.handleVisibleChange,
            animation: this.getAnimation(placement),
            hasMask: hasMask,
            align: this.getAlign(placement)
        }, closeConfig, {
            canCloseByOutSideClick: false,
            disableScroll: true,
            ref: this.getOverlayRef,
            rtl: rtl,
            target: 'viewport',
            style: newStyle,
            needAdjust: false,
            container: popupContainer
        });

        var inner = this.renderInner(canCloseByCloseClick);

        return React.createElement(
            Popup,
            _extends({}, newPopupProps, others),
            inner
        );
    };

    return Drawer;
}(Component), _class.displayName = 'Drawer', _class.propTypes = _extends({}, Popup.propTypes || {}, {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    // 不建议使用trigger
    trigger: PropTypes.element,
    triggerType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 宽度，仅在 placement是 left right 的时候生效
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 高度，仅在 placement是 top bottom 的时候生效
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 控制对话框关闭的方式，值可以为字符串或者布尔值，其中字符串是由以下值组成：
     * **close** 表示点击关闭按钮可以关闭对话框
     * **mask** 表示点击遮罩区域可以关闭对话框
     * **esc** 表示按下 esc 键可以关闭对话框
     * 如 'close' 或 'close,esc,mask'
     * 如果设置为 true，则以上关闭方式全部生效
     * 如果设置为 false，则以上关闭方式全部失效
     */
    closeable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    /**
     * 对话框关闭时触发的回调函数
     * @param {String} trigger 关闭触发行为的描述字符串
     * @param {Object} event 关闭时事件对象
     */
    onClose: PropTypes.func,
    /**
     * 位于页面的位置
     */
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    /**
     * 标题
     */
    title: PropTypes.node,
    /**
     * header上的样式
     */
    headerStyle: PropTypes.object,
    /**
     * body上的样式
     */
    bodyStyle: PropTypes.object,
    /**
     * 是否显示
     */
    visible: PropTypes.bool,
    /**
     * 是否显示遮罩
     */
    hasMask: PropTypes.bool,
    // 受控模式下(没有 trigger 的时候)，只会在关闭时触发，相当于onClose
    onVisibleChange: PropTypes.func,
    /**
     * 显示隐藏时动画的播放方式
     * @property {String} in 进场动画
     * @property {String} out 出场动画
     */
    animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    locale: PropTypes.object,
    // for ConfigProvider
    popupContainer: PropTypes.any
}), _class.defaultProps = {
    prefix: 'next-',
    triggerType: 'click',
    trigger: null,
    closeable: true,
    onClose: noop,
    hasMask: true,
    placement: 'right',
    locale: zhCN.Drawer
}, _temp2);
Drawer.displayName = 'Drawer';
export { Drawer as default };