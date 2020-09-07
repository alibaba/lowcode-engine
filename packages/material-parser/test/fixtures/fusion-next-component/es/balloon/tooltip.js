import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import Overlay from '../overlay';
import BalloonInner from './inner';
import { normalMap, edgeMap } from './alignMap';
import { getDisabledCompatibleTrigger } from './util';

var Popup = Overlay.Popup;


var alignMap = normalMap;
/** Balloon.Tooltip */
var Tooltip = (_temp = _class = function (_React$Component) {
    _inherits(Tooltip, _React$Component);

    function Tooltip() {
        _classCallCheck(this, Tooltip);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Tooltip.prototype.render = function render() {
        var _props = this.props,
            id = _props.id,
            className = _props.className,
            align = _props.align,
            style = _props.style,
            prefix = _props.prefix,
            trigger = _props.trigger,
            children = _props.children,
            popupContainer = _props.popupContainer,
            popupProps = _props.popupProps,
            popupClassName = _props.popupClassName,
            popupStyle = _props.popupStyle,
            followTrigger = _props.followTrigger,
            triggerType = _props.triggerType,
            autoFocus = _props.autoFocus,
            alignEdge = _props.alignEdge,
            rtl = _props.rtl,
            delay = _props.delay,
            others = _objectWithoutProperties(_props, ['id', 'className', 'align', 'style', 'prefix', 'trigger', 'children', 'popupContainer', 'popupProps', 'popupClassName', 'popupStyle', 'followTrigger', 'triggerType', 'autoFocus', 'alignEdge', 'rtl', 'delay']);

        var trOrigin = 'trOrigin';
        if (rtl) {
            others.rtl = true;
            trOrigin = 'rtlTrOrigin';
        }

        alignMap = alignEdge ? edgeMap : normalMap;

        var transformOrigin = alignMap[align][trOrigin];
        var _offset = alignMap[align].offset;
        var _style = _extends({ transformOrigin: transformOrigin }, style);

        var content = React.createElement(
            BalloonInner,
            _extends({}, others, {
                id: id,
                prefix: prefix,
                closable: false,
                isTooltip: true,
                className: className,
                style: _style,
                align: align,
                rtl: rtl,
                alignEdge: alignEdge
            }),
            children
        );

        var triggerProps = {};
        triggerProps['aria-describedby'] = id;
        triggerProps.tabIndex = '0';

        var newTriggerType = triggerType;

        if (triggerType === 'hover' && id) {
            newTriggerType = ['focus', 'hover'];
        }

        var ariaTrigger = id ? React.cloneElement(trigger, triggerProps) : trigger;

        var newTrigger = getDisabledCompatibleTrigger(React.isValidElement(ariaTrigger) ? ariaTrigger : React.createElement(
            'span',
            null,
            ariaTrigger
        ));

        return React.createElement(
            Popup,
            _extends({
                role: 'tooltip',
                container: popupContainer,
                followTrigger: followTrigger,
                trigger: newTrigger,
                triggerType: newTriggerType,
                align: alignMap[align].align,
                offset: _offset,
                delay: delay,
                className: popupClassName,
                style: popupStyle,
                rtl: rtl,
                autoFocus: triggerType === 'focus' ? false : autoFocus,
                shouldUpdatePosition: true,
                needAdjust: false
            }, popupProps),
            content
        );
    };

    return Tooltip;
}(React.Component), _class.propTypes = {
    /**
     * 样式类名的品牌前缀
     */
    prefix: PropTypes.string,
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 自定义内联样式
     */
    style: PropTypes.object,
    /**
     * tooltip的内容
     */
    children: PropTypes.any,
    /**
     * 弹出层位置
     * @enumdesc 上, 右, 下, 左, 上左, 上右, 下左, 下右, 左上, 左下, 右上, 右下 及其 两两组合
     */
    align: PropTypes.oneOf(['t', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br', 'lt', 'lb', 'rt', 'rb']),
    /**
     * 触发元素
     */
    trigger: PropTypes.any,
    /**
     * 触发行为
     * 鼠标悬浮,  鼠标点击('hover', 'click')或者它们组成的数组，如 ['hover', 'click'], 强烈不建议使用'focus'，若有复杂交互，推荐使用triggerType为click的Balloon组件
     */
    triggerType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 弹层组件style，透传给Popup
     */
    popupStyle: PropTypes.object,
    /**
     * 弹层组件className，透传给Popup
     */
    popupClassName: PropTypes.string,
    /**
     * 弹层组件属性，透传给Popup
     */
    popupProps: PropTypes.object,
    /**
     * 是否pure render
     */
    pure: PropTypes.bool,
    /**
     * 指定浮层渲染的父节点, 可以为节点id的字符串，也可以返回节点的函数。
     */
    popupContainer: PropTypes.any,
    /**
     * 是否跟随滚动
     */
    followTrigger: PropTypes.bool,
    /**
     * 弹层id, 传入值才会支持无障碍
     */
    id: PropTypes.string,
    /**
     * 如果需要让 Tooltip 内容可被点击，可以设置这个参数，例如 100
     */
    delay: PropTypes.number
}, _class.defaultProps = {
    triggerType: 'hover',
    prefix: 'next-',
    align: 'b',
    delay: 0,
    trigger: React.createElement('span', null)
}, _temp);
Tooltip.displayName = 'Tooltip';
export { Tooltip as default };