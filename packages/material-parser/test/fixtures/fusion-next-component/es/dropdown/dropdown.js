import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import Overlay from '../overlay';
import { func } from '../util';

var noop = func.noop,
    makeChain = func.makeChain,
    bindCtx = func.bindCtx;

var Popup = Overlay.Popup;

/**
 * Dropdown
 * @description 继承 Popup 的 API，除非特别说明
 */
var Dropdown = (_temp = _class = function (_Component) {
    _inherits(Dropdown, _Component);

    function Dropdown(props) {
        _classCallCheck(this, Dropdown);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            visible: 'visible' in props ? props.visible : props.defaultVisible || false,
            autoFocus: 'autoFocus' in props ? props.autoFocus : false
        };

        bindCtx(_this, ['onTriggerKeyDown', 'onMenuClick', 'onVisibleChange']);
        return _this;
    }

    Dropdown.prototype.getVisible = function getVisible() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

        return 'visible' in props ? props.visible : this.state.visible;
    };

    Dropdown.prototype.onMenuClick = function onMenuClick() {
        this.onVisibleChange(false, 'fromContent');
    };

    Dropdown.prototype.onVisibleChange = function onVisibleChange(visible, from) {
        this.setState({ visible: visible });

        this.props.onVisibleChange(visible, from);
    };

    Dropdown.prototype.onTriggerKeyDown = function onTriggerKeyDown() {
        var autoFocus = true;

        if ('autoFocus' in this.props) {
            autoFocus = this.props.autoFocus;
        }

        this.setState({
            autoFocus: autoFocus
        });
    };

    Dropdown.prototype.render = function render() {
        var child = Children.only(this.props.children);
        if (typeof child.type === 'function' && child.type.isNextMenu) {
            child = React.cloneElement(child, {
                onItemClick: makeChain(this.onMenuClick, child.props.onItemClick)
            });
        }

        var _props = this.props,
            trigger = _props.trigger,
            rtl = _props.rtl;

        var newTrigger = React.cloneElement(trigger, {
            onKeyDown: makeChain(this.onTriggerKeyDown, trigger.props.onKeyDown)
        });

        return React.createElement(
            Popup,
            _extends({}, this.props, {
                rtl: rtl,
                autoFocus: this.state.autoFocus,
                trigger: newTrigger,
                visible: this.getVisible(),
                onVisibleChange: this.onVisibleChange,
                canCloseByOutSideClick: true
            }),
            child
        );
    };

    return Dropdown;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 弹层内容
     */
    children: PropTypes.node,
    /**
     * 弹层当前是否显示
     */
    visible: PropTypes.bool,
    /**
     * 弹层默认是否显示
     */
    defaultVisible: PropTypes.bool,
    /**
     * 弹层显示或隐藏时触发的回调函数
     * @param {Boolean} visible 弹层是否显示
     * @param {String} type 触发弹层显示或隐藏的来源 fromContent 表示由Dropdown内容触发； fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
     */
    onVisibleChange: PropTypes.func,
    /**
     * 触发弹层显示或者隐藏的元素
     */
    trigger: PropTypes.node,
    /**
     * 触发弹层显示或隐藏的操作类型，可以是 'click'，'hover'，或者它们组成的数组，如 ['hover', 'click']
     */
    triggerType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 设置此属性，弹层无法显示或隐藏
     */
    disabled: PropTypes.bool,
    /**
     * 弹层相对于触发元素的定位, 详见 Overlay 的定位部分
     */
    align: PropTypes.string,
    /**
     * 弹层相对于trigger的定位的微调, 接收数组[hoz, ver], 表示弹层在 left / top 上的增量
     * e.g. [100, 100] 表示往右(RTL 模式下是往左) 、下分布偏移100px
     */
    offset: PropTypes.array,
    /**
     * 弹层显示或隐藏的延时时间（以毫秒为单位），在 triggerType 被设置为 hover 时生效
     */
    delay: PropTypes.number,
    /**
     * 弹层打开时是否让其中的元素自动获取焦点
     */
    autoFocus: PropTypes.bool,
    /**
     * 是否显示遮罩
     */
    hasMask: PropTypes.bool,
    /**
     * 隐藏时是否保留子节点
     */
    cache: PropTypes.bool,
    /**
     * 配置动画的播放方式，支持 { in: 'enter-class', out: 'leave-class' } 的对象参数，如果设置为 false，则不播放动画
     * @default { in: 'expandInDown', out: 'expandOutUp' }
     */
    animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
}, _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    defaultVisible: false,
    onVisibleChange: noop,
    triggerType: 'hover',
    disabled: false,
    align: 'tl bl',
    offset: [0, 0],
    delay: 200,
    hasMask: false,
    cache: false,
    onPosition: noop
}, _temp);
Dropdown.displayName = 'Dropdown';
export { Dropdown as default };