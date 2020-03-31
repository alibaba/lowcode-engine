import React, { Children, Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dom, events, focus, func, guid, KEYCODE, support } from '../util';
import overlayManager from './manager';
import Gateway from './gateway';
import Position from './position';
import findNode from './utils/find-node';

const { saveLastFocusNode, getFocusNodeList, backLastFocusNode } = focus;
const { makeChain, noop, bindCtx } = func;

const isScrollDisplay = function(element) {
    try {
        const scrollbarStyle = window.getComputedStyle(
            element,
            '::-webkit-scrollbar'
        );
        return (
            !scrollbarStyle ||
            scrollbarStyle.getPropertyValue('display') !== 'none'
        );
    } catch (e) {
        // ignore error for firefox
    }

    return true;
};
const hasScroll = () => {
    const doc = document.documentElement;
    return (
        doc.scrollHeight > doc.clientHeight &&
        dom.scrollbar().width > 0 &&
        isScrollDisplay(document.documentElement) &&
        isScrollDisplay(document.body)
    );
};
const prefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];
const getStyleProperty = (node, name) => {
    const style = window.getComputedStyle(node);
    let ret = '';
    for (let i = 0; i < prefixes.length; i++) {
        ret = style.getPropertyValue(prefixes[i] + name);
        if (ret) {
            break;
        }
    }
    return ret;
};

const modals = [];
let bodyOverflowY, bodyPaddingRight;

/**
 * Overlay
 * */
export default class Overlay extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        rtl: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        /**
         * 弹层内容
         */
        children: PropTypes.any,
        /**
         * 是否显示弹层
         */
        visible: PropTypes.bool,
        /**
         * 弹层请求关闭时触发事件的回调函数
         * @param {String} type 弹层关闭的来源
         * @param {Object} e DOM 事件
         */
        onRequestClose: PropTypes.func,
        /**
         * 弹层定位的参照元素
         */
        target: PropTypes.any,
        /**
         * 弹层相对于参照元素的定位, 详见开发指南的[定位部分](#定位)
         */
        align: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        /**
         * 弹层相对于trigger的定位的微调, 接收数组[hoz, ver], 表示弹层在 left / top 上的增量
         * e.g. [100, 100] 表示往右(RTL 模式下是往左) 、下分布偏移100px
         */
        offset: PropTypes.array,
        /**
         * 渲染组件的容器，如果是函数需要返回 ref，如果是字符串则是该 DOM 的 id，也可以直接传入 DOM 节点
         */
        container: PropTypes.any,
        /**
         * 是否显示遮罩
         */
        hasMask: PropTypes.bool,
        /**
         * 是否支持 esc 按键关闭弹层
         */
        canCloseByEsc: PropTypes.bool,
        /**
         * 点击弹层外的区域是否关闭弹层，不显示遮罩时生效
         */
        canCloseByOutSideClick: PropTypes.bool,
        /**
         * 点击遮罩区域是否关闭弹层，显示遮罩时生效
         */
        canCloseByMask: PropTypes.bool,
        /**
         * 弹层打开前触发事件的回调函数
         */
        beforeOpen: PropTypes.func,
        /**
         * 弹层打开时触发事件的回调函数
         */
        onOpen: PropTypes.func,
        /**
         * 弹层打开后触发事件的回调函数, 如果有动画，则在动画结束后触发
         */
        afterOpen: PropTypes.func,
        /**
         * 弹层关闭前触发事件的回调函数
         */
        beforeClose: PropTypes.func,
        /**
         * 弹层关闭时触发事件的回调函数
         */
        onClose: PropTypes.func,
        /**
         * 弹层关闭后触发事件的回调函数, 如果有动画，则在动画结束后触发
         */
        afterClose: PropTypes.func,
        /**
         * 弹层定位完成前触发的事件
         */
        beforePosition: PropTypes.func,
        /**
         * 弹层定位完成时触发的事件
         * @param {Object} config 定位的参数
         * @param {Array} config.align 对齐方式，如 ['cc', 'cc']（如果开启 needAdjust，可能和预先设置的 align 不同）
         * @param {Number} config.top 距离视口顶部距离
         * @param {Number} config.left 距离视口左侧距离
         * @param {Object} node 定位参照的容器节点
         */
        onPosition: PropTypes.func,
        /**
         * 是否在每次弹层重新渲染后强制更新定位信息，一般用于弹层内容区域大小发生变化时，仍需保持原来的定位方式
         */
        shouldUpdatePosition: PropTypes.bool,
        /**
         * 弹层打开时是否让其中的元素自动获取焦点
         */
        autoFocus: PropTypes.bool,
        /**
         * 当弹层由于页面滚动等情况不在可视区域时，是否自动调整定位以出现在可视区域
         */
        needAdjust: PropTypes.bool,
        /**
         * 是否禁用页面滚动
         */
        disableScroll: PropTypes.bool,
        /**
         * 隐藏时是否保留子节点
         */
        cache: PropTypes.bool,
        /**
         * 安全节点，当点击 document 的时候，如果包含该节点则不会关闭弹层，如果是函数需要返回 ref，如果是字符串则是该 DOM 的 id，也可以直接传入 DOM 节点，或者以上值组成的数组
         */
        safeNode: PropTypes.any,
        /**
         * 弹层的根节点的样式类
         */
        wrapperClassName: PropTypes.string,
        /**
         * 弹层的根节点的内联样式
         */
        wrapperStyle: PropTypes.object,
        /**
         * 配置动画的播放方式，支持 { in: 'enter-class', out: 'leave-class' } 的对象参数，如果设置为 false，则不播放动画。 请参考 Animate 组件的文档获取可用的动画名
         * @default { in: 'expandInDown', out: 'expandOutUp' }
         */
        animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        onMaskMouseEnter: PropTypes.func,
        onMaskMouseLeave: PropTypes.func,
        onClick: PropTypes.func,
        maskClass: PropTypes.string,
        isChildrenInMask: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        visible: false,
        onRequestClose: noop,
        target: Position.VIEWPORT,
        align: 'tl bl',
        offset: [0, 0],
        hasMask: false,
        canCloseByEsc: true,
        canCloseByOutSideClick: true,
        canCloseByMask: true,
        beforeOpen: noop,
        onOpen: noop,
        afterOpen: noop,
        beforeClose: noop,
        onClose: noop,
        afterClose: noop,
        beforePosition: noop,
        onPosition: noop,
        onMaskMouseEnter: noop,
        onMaskMouseLeave: noop,
        shouldUpdatePosition: false,
        autoFocus: false,
        needAdjust: true,
        disableScroll: false,
        cache: false,
        isChildrenInMask: false,
        onClick: e => e.stopPropagation(),
        maskClass: '',
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible,
            status: 'none',
            animation: this.getAnimation(props),
        };

        this.lastAlign = props.align;

        bindCtx(this, [
            'handlePosition',
            'handleAnimateEnd',
            'handleDocumentKeyDown',
            'handleDocumentClick',
            'handleMaskClick',
            'beforeOpen',
            'beforeClose',
        ]);

        this.timeoutMap = {};
    }

    componentWillMount() {
        if (this.props.visible) {
            this.beforeOpen();
            this.props.beforeOpen();

            if (this.state.animation && support.animation) {
                this.enter();
            }
        }
    }

    componentDidMount() {
        this.componentDidUpdate({ visible: false });
        this.addDocumentEvents();

        overlayManager.addOverlay(this);

        if (this.state.visible) {
            this._isMounted = true;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this._isMounted && nextProps.visible) {
            this._isMounted = true;
        }

        const willOpen = !this.props.visible && nextProps.visible;
        const willClose = this.props.visible && !nextProps.visible;

        if (nextProps.align !== this.props.align) {
            this.lastAlign = this.props.align;
        }

        if (willOpen) {
            this.beforeOpen();
            nextProps.beforeOpen();
        } else if (willClose) {
            this.beforeClose();
            nextProps.beforeClose();
        }

        if (nextProps.animation || nextProps.animation === false) {
            this.setState({
                animation: nextProps.animation,
            });
        }

        if (nextProps.animation !== false && support.animation) {
            if (willOpen) {
                this.enter();
            } else if (willClose) {
                this.leave();
            }
        } else {
            this.setState({
                visible: nextProps.visible,
            });
        }
    }

    componentDidUpdate(prevProps) {
        const open = !prevProps.visible && this.props.visible;
        const close = prevProps.visible && !this.props.visible;
        if (this.state.animation && support.animation) {
            if (open || close) {
                this.addAnimationEvents();
            }
        } else {
            const wrapperNode = this.getWrapperNode();
            if (open) {
                setTimeout(() => {
                    this.props.onOpen();
                    this.props.afterOpen();
                    dom.addClass(wrapperNode, 'opened');
                    overlayManager.addOverlay(this);
                });
            } else if (close) {
                this.props.onClose();
                this.props.afterClose();
                dom.removeClass(wrapperNode, 'opened');
                overlayManager.removeOverlay(this);
            }
            this.setFocusNode();
        }
    }

    componentWillUnmount() {
        this._isDestroyed = true;
        this._isMounted = false;
        overlayManager.removeOverlay(this);
        this.removeDocumentEvents();
        if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
        }
        if (this._animation) {
            this._animation.off();
            this._animation = null;
        }
        this.beforeClose();
    }

    getAnimation(props) {
        if (props.animation === false) {
            return false;
        }

        if (props.animation) {
            return props.animation;
        }

        return this.getAnimationByAlign(props.align);
    }

    getAnimationByAlign(align) {
        switch (align[0]) {
            case 't':
                return {
                    in: 'expandInDown',
                    out: 'expandOutUp',
                };
            case 'b':
                return {
                    in: 'expandInUp',
                    out: 'expandOutDown',
                };
            default:
                return {
                    in: 'expandInDown',
                    out: 'expandOutUp',
                };
        }
    }

    addAnimationEvents() {
        setTimeout(() => {
            const node = this.getContentNode();
            if (node) {
                const id = guid();

                this._animation = events.on(
                    node,
                    support.animation.end,
                    this.handleAnimateEnd.bind(this, id)
                );

                const animationDelay =
                    parseFloat(getStyleProperty(node, 'animation-delay')) || 0;
                const animationDuration =
                    parseFloat(getStyleProperty(node, 'animation-duration')) ||
                    0;
                const time = animationDelay + animationDuration;
                if (time) {
                    this.timeoutMap[id] = setTimeout(() => {
                        this.handleAnimateEnd(id);
                    }, time * 1000 + 200);
                }
            }
        });
    }

    handlePosition(config) {
        const align = config.align.join(' ');

        if (
            !('animation' in this.props) &&
            this.props.needAdjust &&
            this.lastAlign !== align
        ) {
            this.setState({
                animation: this.getAnimationByAlign(align),
            });
        }

        const { status } = this.state;
        if (status === 'mounting') {
            this.setState({
                status: 'entering',
            });
        }

        this.lastAlign = align;
    }

    handleAnimateEnd(id) {
        if (this.timeoutMap[id]) {
            clearTimeout(this.timeoutMap[id]);
        }
        delete this.timeoutMap[id];

        if (this._animation) {
            this._animation.off();
            this._animation = null;
        }

        if (!this._isMounted) {
            return;
        }

        if (this.state.status === 'leaving') {
            this.setState({
                visible: false,
                status: 'none',
            });

            this.onLeaved();
        } else if (this.state.status === 'entering') {
            this.setState({
                status: 'none',
            });

            this.onEntered();
        }
    }

    enter() {
        this.setState(
            {
                visible: true,
                status: 'mounting',
            },
            () => {
                // NOTE: setState callback (second argument) now fires immediately after componentDidMount / componentDidUpdate instead of after all components have rendered.
                setTimeout(() => {
                    if (!this._isDestroyed) {
                        this.onEntering();
                    }
                });
            }
        );
    }

    leave() {
        this.setState({
            status: 'leaving',
        });

        this.onLeaving();
    }

    onEntering() {
        const wrapperNode = this.getWrapperNode();
        dom.addClass(wrapperNode, 'opened');
        this.props.onOpen();
    }

    onLeaving() {
        const wrapperNode = this.getWrapperNode();
        dom.removeClass(wrapperNode, 'opened');
        this.props.onClose();
    }

    onEntered() {
        overlayManager.addOverlay(this);
        this.setFocusNode();
        this.props.afterOpen();
    }

    onLeaved() {
        overlayManager.removeOverlay(this);
        this.setFocusNode();
        this.props.afterClose();
    }

    beforeOpen() {
        if (this.props.disableScroll) {
            if (modals.length === 0) {
                const style = {
                    overflowY: 'hidden',
                };
                const body = document.body;
                bodyOverflowY = body.style.overflowY;
                if (hasScroll()) {
                    bodyPaddingRight = body.style.paddingRight;
                    style.paddingRight = `${dom.getStyle(body, 'paddingRight') +
                        dom.scrollbar().width}px`;
                }

                dom.setStyle(body, style);
            }
            modals.push(this);
        }
    }

    beforeClose() {
        if (this.props.disableScroll) {
            const index = modals.indexOf(this);
            if (index > -1) {
                if (modals.length === 1) {
                    const style = {
                        overflowY: bodyOverflowY,
                    };
                    if (hasScroll()) {
                        style.paddingRight = bodyPaddingRight;
                    }

                    dom.setStyle(document.body, style);

                    bodyOverflowY = undefined;
                    bodyPaddingRight = undefined;
                }

                modals.splice(index, 1);
            }
        }
    }

    setFocusNode() {
        if (!this.props.autoFocus) {
            return;
        }

        if (this.state.visible && !this._hasFocused) {
            saveLastFocusNode();
            // 这个时候很可能上一个弹层的关闭事件还未触发，导致焦点已经回到触发的元素
            // 这里延时处理一下，延时的时间为 document.click 捕获触发的延时时间
            this.focusTimeout = setTimeout(() => {
                const node = this.getContentNode();
                if (node) {
                    const focusNodeList = getFocusNodeList(node);
                    if (focusNodeList.length) {
                        focusNodeList[0].focus();
                    }
                    this._hasFocused = true;
                }
            }, 100);
        } else if (!this.state.visible && this._hasFocused) {
            backLastFocusNode();
            this._hasFocused = false;
        }
    }

    getContent() {
        return this.contentRef;
    }

    getContentNode() {
        try {
            return findDOMNode(this.contentRef);
        } catch (err) {
            return null;
        }
    }

    getWrapperNode() {
        return this.gatewayRef ? this.gatewayRef.getChildNode() : null;
    }

    addDocumentEvents() {
        if (this.props.canCloseByEsc) {
            this._keydownEvents = events.on(
                document,
                'keydown',
                this.handleDocumentKeyDown
            );
        }
        if (this.props.canCloseByOutSideClick) {
            this._clickEvents = events.on(
                document,
                'click',
                this.handleDocumentClick
            );

            this._touchEvents = events.on(
                document,
                'touchend',
                this.handleDocumentClick
            );
        }
    }

    removeDocumentEvents() {
        if (this._keydownEvents) {
            this._keydownEvents.off();
            this._keydownEvents = null;
        }
        if (this._clickEvents) {
            this._clickEvents.off();
            this._clickEvents = null;
        }

        if (this._touchEvents) {
            this._touchEvents.off();
            this._touchEvents = null;
        }
    }

    handleDocumentKeyDown(e) {
        if (
            this.state.visible &&
            e.keyCode === KEYCODE.ESC &&
            overlayManager.isCurrentOverlay(this)
        ) {
            this.props.onRequestClose('keyboard', e);
        }
    }

    handleDocumentClick(e) {
        if (this.state.visible) {
            const { safeNode } = this.props;
            const safeNodes = Array.isArray(safeNode)
                ? [...safeNode]
                : [safeNode];
            safeNodes.unshift(() => this.getWrapperNode());

            for (let i = 0; i < safeNodes.length; i++) {
                const node = findNode(safeNodes[i], this.props);
                // HACK: 如果触发点击的节点是弹层内部的节点，并且在被点击后立即销毁，那么此时无法使用 node.contains(e.target)
                // 来判断此时点击的节点是否是弹层内部的节点，额外判断
                if (
                    node &&
                    (node === e.target ||
                        node.contains(e.target) ||
                        (e.target !== document &&
                            !document.documentElement.contains(e.target)))
                ) {
                    return;
                }
            }

            this.props.onRequestClose('docClick', e);
        }
    }

    handleMaskClick(e) {
        if (this.props.canCloseByMask) {
            this.props.onRequestClose('maskClick', e);
        }
    }

    saveContentRef = ref => {
        this.contentRef = ref;
    };

    saveGatewayRef = ref => {
        this.gatewayRef = ref;
    };

    // 兼容过去的用法: this.popupRef.getInstance().overlay.getInstance().getContentNode()
    getInstance() {
        return this;
    }

    render() {
        const {
            prefix,
            className,
            style,
            children: propChildren,
            target,
            align,
            offset,
            container,
            hasMask,
            needAdjust,
            autoFit,
            beforePosition,
            onPosition,
            wrapperStyle,
            rtl,
            shouldUpdatePosition: propShouldUpdatePosition,
            cache,
            wrapperClassName,
            onMaskMouseEnter,
            onMaskMouseLeave,
            maskClass,
            isChildrenInMask,
        } = this.props;
        const { visible: stateVisible, status, animation } = this.state;

        let children =
            stateVisible || (cache && this._isMounted) ? propChildren : null;
        if (children) {
            let child = Children.only(children);
            // if chlild is a functional component wrap in a component to allow a ref to be set
            if (
                typeof child.type === 'function' &&
                !(child.type.prototype instanceof Component)
            ) {
                child = <div role="none">{child}</div>;
            }
            const childClazz = classnames({
                [`${prefix}overlay-inner`]: true,
                [animation.in]: status === 'entering' || status === 'mounting',
                [animation.out]: status === 'leaving',
                [child.props.className]: !!child.props.className,
                [className]: !!className,
            });
            if (typeof child.ref === 'string') {
                throw new Error(
                    'Can not set ref by string in Overlay, use function instead.'
                );
            }

            children = React.cloneElement(child, {
                className: childClazz,
                style: { ...child.props.style, ...style },
                ref: makeChain(this.saveContentRef, child.ref),
                'aria-hidden': !stateVisible && cache && this._isMounted,
                onClick: this.props.onClick,
            });

            if (align) {
                const shouldUpdatePosition =
                    status === 'leaving' ? false : propShouldUpdatePosition;
                children = (
                    <Position
                        {...{
                            children,
                            target,
                            align,
                            offset,
                            autoFit,
                            container,
                            needAdjust,
                            beforePosition,
                            onPosition: makeChain(
                                this.handlePosition,
                                onPosition
                            ),
                            shouldUpdatePosition,
                            rtl,
                        }}
                    />
                );
            }

            const wrapperClazz = classnames([
                `${prefix}overlay-wrapper`,
                wrapperClassName,
            ]);
            const newWrapperStyle = Object.assign(
                {},
                {
                    display: stateVisible ? '' : 'none',
                },
                wrapperStyle
            );

            const maskClazz = classnames({
                [`${prefix}overlay-backdrop`]: true,
                [maskClass]: !!maskClass,
            });

            children = (
                <div
                    className={wrapperClazz}
                    style={newWrapperStyle}
                    dir={rtl ? 'rtl' : undefined}
                >
                    {hasMask ? (
                        <div
                            className={maskClazz}
                            onClick={this.handleMaskClick}
                            onMouseEnter={onMaskMouseEnter}
                            onMouseLeave={onMaskMouseLeave}
                            dir={rtl ? 'rtl' : undefined}
                        >
                            {isChildrenInMask && children}
                        </div>
                    ) : null}
                    {!isChildrenInMask && children}
                </div>
            );
        }

        return (
            <Gateway
                {...{ container, target, children }}
                ref={this.saveGatewayRef}
            />
        );
    }
}
