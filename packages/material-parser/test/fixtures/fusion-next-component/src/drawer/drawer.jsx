import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Overlay from '../overlay';
import Inner from './inner';
import zhCN from '../locale/zh-cn';
import { obj } from '../util';

const noop = () => {};
const { Popup } = Overlay;
const { pickOthers } = obj;

/**
 * Drawer
 */
export default class Drawer extends Component {
    static displayName = 'Drawer';

    static propTypes = {
        ...(Popup.propTypes || {}),
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
        popupContainer: PropTypes.any,
    };

    static defaultProps = {
        prefix: 'next-',
        triggerType: 'click',
        trigger: null,
        closeable: true,
        onClose: noop,
        hasMask: true,
        placement: 'right',
        locale: zhCN.Drawer,
    };

    getAlign = placement => {
        let align;
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
    };

    getAnimation = placement => {
        if ('animation' in this.props) {
            return this.props.animation;
        }

        let animation;
        switch (placement) {
            case 'top':
                animation = {
                    in: 'slideInDown',
                    out: 'slideOutUp',
                };
                break;
            case 'bottom':
                animation = {
                    in: 'slideInUp',
                    out: 'slideOutDown',
                };
                break;
            case 'left':
                animation = {
                    in: 'slideInLeft',
                    out: 'slideOutLeft',
                };
                break;
            case 'right':
            default:
                animation = {
                    in: 'slideInRight',
                    out: 'slideOutRight',
                };
                break;
        }

        return animation;
    };

    getOverlayRef = ref => {
        this.overlay = ref;
    };

    mapcloseableToConfig = closeable => {
        return ['esc', 'close', 'mask'].reduce((ret, option) => {
            const key = option.charAt(0).toUpperCase() + option.substr(1);
            const value =
                typeof closeable === 'boolean'
                    ? closeable
                    : closeable.split(',').indexOf(option) > -1;

            if (option === 'esc' || option === 'mask') {
                ret[`canCloseBy${key}`] = value;
            } else {
                ret[`canCloseBy${key}Click`] = value;
            }

            return ret;
        }, {});
    };

    handleVisibleChange = (visible, reason, e) => {
        const { onClose, onVisibleChange } = this.props;

        if (visible === false) {
            onClose && onClose(reason, e);
        }

        onVisibleChange && onVisibleChange(visible, reason, e);
    };

    renderInner(closeable) {
        const {
            prefix,
            className,
            children,
            title,
            onClose,
            locale,
            headerStyle,
            bodyStyle,
            placement,
            rtl,
        } = this.props;

        const others = pickOthers(Object.keys(Drawer.propTypes), this.props);

        return (
            <Inner
                prefix={prefix}
                title={title}
                className={className}
                locale={locale}
                closeable={closeable}
                rtl={rtl}
                headerStyle={headerStyle}
                bodyStyle={bodyStyle}
                placement={placement}
                onClose={onClose.bind(this, 'closeClick')}
                {...others}
            >
                {children}
            </Inner>
        );
    }

    render() {
        const {
            prefix,
            style,
            width,
            height,
            trigger,
            triggerType,
            animation,
            hasMask,
            visible,
            placement,
            onClose,
            onVisibleChange,
            closeable,
            rtl,
            popupContainer,
            ...others
        } = this.props;

        const newStyle = {
            width,
            height,
            ...style,
        };

        const {
            canCloseByCloseClick,
            ...closeConfig
        } = this.mapcloseableToConfig(closeable);

        const newPopupProps = {
            prefix,
            visible,
            trigger,
            triggerType,
            onVisibleChange: this.handleVisibleChange,
            animation: this.getAnimation(placement),
            hasMask,
            align: this.getAlign(placement),
            ...closeConfig,
            canCloseByOutSideClick: false,
            disableScroll: true,
            ref: this.getOverlayRef,
            rtl,
            target: 'viewport',
            style: newStyle,
            needAdjust: false,
            container: popupContainer,
        };

        const inner = this.renderInner(canCloseByCloseClick);

        return (
            <Popup {...newPopupProps} {...others}>
                {inner}
            </Popup>
        );
    }
}
