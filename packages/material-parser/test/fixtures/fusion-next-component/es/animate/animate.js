import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import AnimateChild from './child';

var noop = function noop() {};
var FirstChild = function FirstChild(props) {
    var childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
};

/**
 * Animate
 */
var Animate = (_temp = _class = function (_Component) {
    _inherits(Animate, _Component);

    function Animate() {
        _classCallCheck(this, Animate);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Animate.prototype.normalizeNames = function normalizeNames(names) {
        if (typeof names === 'string') {
            return {
                appear: names + '-appear',
                appearActive: names + '-appear-active',
                enter: names + '-enter',
                enterActive: names + '-enter-active',
                leave: names + '-leave',
                leaveActive: names + '-leave-active'
            };
        }
        if ((typeof names === 'undefined' ? 'undefined' : _typeof(names)) === 'object') {
            return {
                appear: names.appear,
                appearActive: names.appear + '-active',
                enter: '' + names.enter,
                enterActive: names.enter + '-active',
                leave: '' + names.leave,
                leaveActive: names.leave + '-active'
            };
        }
    };

    Animate.prototype.render = function render() {
        var _this2 = this;

        /* eslint-disable no-unused-vars */
        var _props = this.props,
            animation = _props.animation,
            children = _props.children,
            animationAppear = _props.animationAppear,
            singleMode = _props.singleMode,
            component = _props.component,
            beforeAppear = _props.beforeAppear,
            onAppear = _props.onAppear,
            afterAppear = _props.afterAppear,
            beforeEnter = _props.beforeEnter,
            onEnter = _props.onEnter,
            afterEnter = _props.afterEnter,
            beforeLeave = _props.beforeLeave,
            onLeave = _props.onLeave,
            afterLeave = _props.afterLeave,
            others = _objectWithoutProperties(_props, ['animation', 'children', 'animationAppear', 'singleMode', 'component', 'beforeAppear', 'onAppear', 'afterAppear', 'beforeEnter', 'onEnter', 'afterEnter', 'beforeLeave', 'onLeave', 'afterLeave']);
        /* eslint-enable no-unused-vars */

        var animateChildren = Children.map(children, function (child) {
            return React.createElement(
                AnimateChild,
                {
                    key: child.key,
                    names: _this2.normalizeNames(animation),
                    onAppear: beforeAppear,
                    onAppearing: onAppear,
                    onAppeared: afterAppear,
                    onEnter: beforeEnter,
                    onEntering: onEnter,
                    onEntered: afterEnter,
                    onExit: beforeLeave,
                    onExiting: onLeave,
                    onExited: afterLeave
                },
                child
            );
        });

        return React.createElement(
            TransitionGroup,
            _extends({
                appear: animationAppear,
                component: singleMode ? FirstChild : component
            }, others),
            animateChildren
        );
    };

    return Animate;
}(Component), _class.propTypes = {
    /**
     * 动画 className
     */
    animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /**
     * 子元素第一次挂载时是否执行动画
     */
    animationAppear: PropTypes.bool,
    /**
     * 包裹子元素的标签
     */
    component: PropTypes.any,
    /**
     * 是否只有单个子元素，如果有多个子元素，请设置为 false
     */
    singleMode: PropTypes.bool,
    /**
     * 子元素
     */
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    /**
     * 执行第一次挂载动画前触发的回调函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    beforeAppear: PropTypes.func,
    /**
     * 执行第一次挂载动画，添加 xxx-appear-active 类名后触发的回调函数
     *  @param {HTMLElement} node 执行动画的 dom 元素
     */
    onAppear: PropTypes.func,
    /**
     * 执行完第一次挂载动画后触发的函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    afterAppear: PropTypes.func,
    /**
     * 执行进场动画前触发的回调函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    beforeEnter: PropTypes.func,
    /**
     * 执行进场动画，添加 xxx-enter-active 类名后触发的回调函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    onEnter: PropTypes.func,
    /**
     * 执行完进场动画后触发的回调函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    afterEnter: PropTypes.func,
    /**
     * 执行离场动画前触发的回调函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    beforeLeave: PropTypes.func,
    /**
     * 执行离场动画，添加 xxx-leave-active 类名后触发的回调函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    onLeave: PropTypes.func,
    /**
     * 执行完离场动画后触发的回调函数
     * @param {HTMLElement} node 执行动画的 dom 元素
     */
    afterLeave: PropTypes.func
}, _class.defaultProps = {
    animationAppear: true,
    component: 'div',
    singleMode: true,
    beforeAppear: noop,
    onAppear: noop,
    afterAppear: noop,
    beforeEnter: noop,
    onEnter: noop,
    afterEnter: noop,
    beforeLeave: noop,
    onLeave: noop,
    afterLeave: noop
}, _temp);
Animate.displayName = 'Animate';


export default Animate;