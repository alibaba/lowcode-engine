import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Overlay from '../overlay';
import zhCN from '../locale/zh-cn';
import { focus, obj, func, events, dom } from '../util';
import Inner from './inner';

const noop = () => {};
const { limitTabRange } = focus;
const { bindCtx } = func;
const { pickOthers } = obj;
const { getStyle, setStyle } = dom;

/**
 * Dialog
 */
export default class Dialog extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        rtl: PropTypes.bool,
        className: PropTypes.string,
        /**
         * 是否显示
         */
        visible: PropTypes.bool,
        /**
         * 标题
         */
        title: PropTypes.node,
        /**
         * 内容
         */
        children: PropTypes.node,
        /**
         * 底部内容，设置为 false，则不进行显示
         * @default [<Button type="primary">确定</Button>, <Button>取消</Button>]
         */
        footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
        /**
         * 底部按钮的对齐方式
         */
        footerAlign: PropTypes.oneOf(['left', 'center', 'right']),
        /**
         * 指定确定按钮和取消按钮是否存在以及如何排列,<br><br>**可选值**：
         * ['ok', 'cancel']（确认取消按钮同时存在，确认按钮在左）
         * ['cancel', 'ok']（确认取消按钮同时存在，确认按钮在右）
         * ['ok']（只存在确认按钮）
         * ['cancel']（只存在取消按钮）
         */
        footerActions: PropTypes.array,
        /**
         * 在点击确定按钮时触发的回调函数
         * @param {Object} event 点击事件对象
         */
        onOk: PropTypes.func,
        /**
         * 在点击取消按钮时触发的回调函数
         * @param {Object} event 点击事件对象
         */
        onCancel: PropTypes.func,
        /**
         * 应用于确定按钮的属性对象
         */
        okProps: PropTypes.object,
        /**
         * 应用于取消按钮的属性对象
         */
        cancelProps: PropTypes.object,
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
         * 对话框关闭后触发的回调函数, 如果有动画，则在动画结束后触发
         */
        afterClose: PropTypes.func,
        /**
         * 是否显示遮罩
         */
        hasMask: PropTypes.bool,
        /**
         * 显示隐藏时动画的播放方式
         * @property {String} in 进场动画
         * @property {String} out 出场动画
         */
        animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        /**
         * 对话框弹出时是否自动获得焦点
         */
        autoFocus: PropTypes.bool,
        /**
         * 对话框对齐方式, 具体见Overlay文档
         */
        align: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        /**
         * 当对话框高度超过浏览器视口高度时，是否显示所有内容而不是出现滚动条以保证对话框完整显示在浏览器视口内，该属性仅在对话框垂直水平居中时生效，即 align 被设置为 'cc cc' 时
         */
        isFullScreen: PropTypes.bool,
        /**
         * 是否在对话框重新渲染时及时更新对话框位置，一般用于对话框高度变化后依然能保证原来的对齐方式
         */
        shouldUpdatePosition: PropTypes.bool,
        /**
         * 对话框距离浏览器顶部和底部的最小间距，align 被设置为 'cc cc' 并且 isFullScreen 被设置为 true 时不生效
         */
        minMargin: PropTypes.number,
        /**
         * 透传到弹层组件的属性对象
         */
        overlayProps: PropTypes.object,
        /**
         * 自定义国际化文案对象
         * @property {String} ok 确认按钮文案
         * @property {String} cancel 取消按钮文案
         */
        locale: PropTypes.object,
        /**
         * 对话框的高度样式属性
         */
        height: PropTypes.string,
        // Do not remove this, it's for <ConfigProvider popupContainer={} />
        // see https://github.com/alibaba-fusion/next/issues/1508
        popupContainer: PropTypes.any,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        visible: false,
        footerAlign: 'right',
        footerActions: ['ok', 'cancel'],
        onOk: noop,
        onCancel: noop,
        okProps: {},
        cancelProps: {},
        closeable: 'esc,close',
        onClose: noop,
        afterClose: noop,
        hasMask: true,
        animation: {
            in: 'fadeInDown',
            out: 'fadeOutUp',
        },
        autoFocus: false,
        align: 'cc cc',
        isFullScreen: false,
        shouldUpdatePosition: false,
        minMargin: 40,
        overlayProps: {},
        locale: zhCN.Dialog,
    };

    constructor(props, context) {
        super(props, context);
        bindCtx(this, [
            'onKeyDown',
            'beforePosition',
            'adjustPosition',
            'getOverlayRef',
        ]);
    }

    componentDidMount() {
        events.on(document, 'keydown', this.onKeyDown);
        if (!this.useCSSToPosition()) {
            this.adjustPosition();
        }
    }

    componentWillUnmount() {
        events.off(document, 'keydown', this.onKeyDown);
    }

    useCSSToPosition() {
        const { align, isFullScreen } = this.props;
        return align === 'cc cc' && isFullScreen;
    }

    onKeyDown(e) {
        const node = this.getInnerNode();
        if (node) {
            limitTabRange(node, e);
        }
    }

    beforePosition() {
        if (this.props.visible && this.overlay) {
            const inner = this.getInner();
            if (inner) {
                const node = this.getInnerNode();
                if (this._lastDialogHeight !== getStyle(node, 'height')) {
                    this.revertSize(inner.bodyNode);
                }
            }
        }
    }

    adjustPosition() {
        if (this.props.visible && this.overlay) {
            const inner = this.getInner();
            if (inner) {
                const node = this.getInnerNode();

                let top = getStyle(node, 'top');
                const minMargin = this.props.minMargin;
                if (top < minMargin) {
                    top = minMargin;
                    setStyle(node, 'top', `${minMargin}px`);
                }

                const height = getStyle(node, 'height');
                const viewportHeight =
                    window.innerHeight || document.documentElement.clientHeight;
                if (viewportHeight < height + top * 2) {
                    const expectHeight = viewportHeight - top * 2;
                    this.adjustSize(inner, node, expectHeight);
                } else {
                    this.revertSize(inner.bodyNode);
                }

                this._lastDialogHeight = height;
            }
        }
    }

    adjustSize(inner, node, expectHeight) {
        const { headerNode, bodyNode, footerNode } = inner;

        const headerHeight = headerNode ? getStyle(headerNode, 'height') : 0;
        const footerHeight = footerNode ? getStyle(footerNode, 'height') : 0;
        const padding =
            getStyle(node, 'padding-top') + getStyle(node, 'padding-bottom');
        let maxBodyHeight =
            expectHeight - headerHeight - footerHeight - padding;
        if (maxBodyHeight < 0) {
            maxBodyHeight = 1;
        }

        if (bodyNode) {
            this.dialogBodyStyleMaxHeight = bodyNode.style.maxHeight;
            this.dialogBodyStyleOverflowY = bodyNode.style.overflowY;

            setStyle(bodyNode, {
                'max-height': `${maxBodyHeight}px`,
                'overflow-y': 'auto',
            });
        }
    }

    revertSize(bodyNode) {
        setStyle(bodyNode, {
            'max-height': this.dialogBodyStyleMaxHeight,
            'overflow-y': this.dialogBodyStyleOverflowY,
        });
    }

    mapcloseableToConfig(closeable) {
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
    }

    getOverlayRef(ref) {
        this.overlay = ref;
    }

    getInner() {
        return this.overlay.getInstance().getContent();
    }

    getInnerNode() {
        return this.overlay.getInstance().getContentNode();
    }

    renderInner(closeable) {
        const {
            prefix,
            className,
            title,
            children,
            footer,
            footerAlign,
            footerActions,
            onOk,
            onCancel,
            okProps,
            cancelProps,
            onClose,
            locale,
            visible,
            rtl,
            height,
        } = this.props;
        const others = pickOthers(Object.keys(Dialog.propTypes), this.props);

        return (
            <Inner
                prefix={prefix}
                className={className}
                title={title}
                footer={footer}
                footerAlign={footerAlign}
                footerActions={footerActions}
                onOk={visible ? onOk : noop}
                onCancel={visible ? onCancel : noop}
                okProps={okProps}
                cancelProps={cancelProps}
                locale={locale}
                closeable={closeable}
                rtl={rtl}
                onClose={onClose.bind(this, 'closeClick')}
                height={height}
                {...others}
            >
                {children}
            </Inner>
        );
    }

    render() {
        const {
            prefix,
            visible,
            hasMask,
            animation,
            autoFocus,
            closeable,
            onClose,
            afterClose,
            shouldUpdatePosition,
            align,
            popupContainer,
            overlayProps,
            rtl,
        } = this.props;

        const useCSS = this.useCSSToPosition();
        const {
            canCloseByCloseClick,
            ...closeConfig
        } = this.mapcloseableToConfig(closeable);
        const newOverlayProps = {
            disableScroll: true,
            container: popupContainer,
            ...overlayProps,
            prefix,
            visible,
            animation,
            hasMask,
            autoFocus,
            afterClose,
            ...closeConfig,
            canCloseByOutSideClick: false,
            align: useCSS ? false : align,
            onRequestClose: onClose,
            needAdjust: false,
            ref: this.getOverlayRef,
            rtl,
            maskClass: useCSS ? `${prefix}dialog-container` : '',
            isChildrenInMask: useCSS && hasMask,
        };
        if (!useCSS) {
            newOverlayProps.beforePosition = this.beforePosition;
            newOverlayProps.onPosition = this.adjustPosition;
            newOverlayProps.shouldUpdatePosition = shouldUpdatePosition;
        }

        const inner = this.renderInner(canCloseByCloseClick);

        // useCSS && hasMask : isFullScreen 并且 有mask的模式下，为了解决 next-overlay-backdrop 覆盖mask，使得点击mask关闭页面的功能不生效的问题，需要开启 Overlay 的 isChildrenInMask 功能，并且把 next-dialog-container 放到 next-overlay-backdrop上
        // useCSS && !hasMask : isFullScreen 并且 没有mask的情况下，需要关闭 isChildrenInMask 功能，以防止children不渲染
        // 其他模式下维持 mask 与 children 同级的关系
        return (
            <Overlay {...newOverlayProps}>
                {useCSS && !hasMask ? (
                    <div
                        className={`${prefix}dialog-container`}
                        dir={rtl ? 'rtl' : undefined}
                    >
                        {inner}
                    </div>
                ) : (
                    inner
                )}
            </Overlay>
        );
    }
}
