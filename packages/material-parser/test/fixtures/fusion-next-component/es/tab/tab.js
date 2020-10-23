import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { KEYCODE, obj } from '../util';
import TabNav from './tabs/nav';
import TabContent from './tabs/content';
import { toArray } from './tabs/utils';

var noop = function noop() {};

/** Tab */
var Tab = (_temp = _class = function (_Component) {
    _inherits(Tab, _Component);

    function Tab(props, context) {
        _classCallCheck(this, Tab);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.handleTriggerEvent = function (eventType, key) {
            var _this$props = _this.props,
                triggerType = _this$props.triggerType,
                onClick = _this$props.onClick,
                onChange = _this$props.onChange;

            if (triggerType === eventType) {
                onClick(key);
                _this.setActiveKey(key);
                if (_this.state.activeKey !== key) {
                    onChange(key);
                }
            }
        };

        _this.onNavKeyDown = function (e) {
            var keyCode = e.keyCode;
            if (keyCode >= KEYCODE.LEFT && keyCode <= KEYCODE.DOWN) {
                e.preventDefault();
            }
            var newKey = void 0;
            if (keyCode === KEYCODE.RIGHT || keyCode === KEYCODE.DOWN) {
                newKey = _this.getNextActiveKey(true);
                _this.handleTriggerEvent(_this.props.triggerType, newKey);
            } else if (keyCode === KEYCODE.LEFT || keyCode === KEYCODE.UP) {
                newKey = _this.getNextActiveKey(false);
                _this.handleTriggerEvent(_this.props.triggerType, newKey);
            }
        };

        _this.state = {
            activeKey: _this.getDefaultActiveKey(props)
        };
        return _this;
    }

    Tab.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.activeKey !== undefined && this.state.activeKey !== '' + nextProps.activeKey) {
            this.setState({
                activeKey: '' + nextProps.activeKey
            });
        }
    };

    Tab.prototype.getDefaultActiveKey = function getDefaultActiveKey(props) {
        var activeKey = props.activeKey === undefined ? props.defaultActiveKey : props.activeKey;

        if (activeKey === undefined) {
            React.Children.forEach(props.children, function (child, index) {
                if (activeKey !== undefined) return;
                if (React.isValidElement(child)) {
                    if (!child.props.disabled) {
                        activeKey = child.key || index;
                    }
                }
            });
        }

        return '' + activeKey;
    };

    Tab.prototype.getNextActiveKey = function getNextActiveKey(isNext) {
        var _this2 = this;

        var children = [];
        React.Children.forEach(this.props.children, function (child) {
            if (React.isValidElement(child)) {
                if (!child.props.disabled) {
                    if (isNext) {
                        children.push(child);
                    } else {
                        children.unshift(child);
                    }
                }
            }
        });

        var length = children.length;
        var key = length && children[0].key;
        children.forEach(function (child, i) {
            if (child.key === _this2.state.activeKey) {
                if (i === length - 1) {
                    key = children[0].key;
                } else {
                    key = children[i + 1].key;
                }
            }
        });
        return key;
    };

    Tab.prototype.setActiveKey = function setActiveKey(key) {
        var activeKey = this.state.activeKey;

        // 如果 key 没变，或者受控状态下，则跳过

        if (key === activeKey || 'activeKey' in this.props) {
            return;
        }
        this.setState({
            activeKey: key
        });
    };

    Tab.prototype.render = function render() {
        var _classnames;

        var _props = this.props,
            prefix = _props.prefix,
            animation = _props.animation,
            shape = _props.shape,
            size = _props.size,
            extra = _props.extra,
            excessMode = _props.excessMode,
            tabPosition = _props.tabPosition,
            tabRender = _props.tabRender,
            triggerType = _props.triggerType,
            lazyLoad = _props.lazyLoad,
            unmountInactiveTabs = _props.unmountInactiveTabs,
            popupProps = _props.popupProps,
            navStyle = _props.navStyle,
            navClassName = _props.navClassName,
            contentStyle = _props.contentStyle,
            contentClassName = _props.contentClassName,
            className = _props.className,
            onClose = _props.onClose,
            children = _props.children,
            rtl = _props.rtl,
            device = _props.device,
            others = _objectWithoutProperties(_props, ['prefix', 'animation', 'shape', 'size', 'extra', 'excessMode', 'tabPosition', 'tabRender', 'triggerType', 'lazyLoad', 'unmountInactiveTabs', 'popupProps', 'navStyle', 'navClassName', 'contentStyle', 'contentClassName', 'className', 'onClose', 'children', 'rtl', 'device']);

        var activeKey = this.state.activeKey;


        var tabs = toArray(children);
        var isTouchable = ['phone', 'tablet'].indexOf(device) !== -1;
        var newPosition = tabPosition;
        if (rtl && ['left', 'right'].indexOf(tabPosition) >= 0) {
            newPosition = tabPosition === 'left' ? 'right' : 'left';
        }
        var classNames = classnames((_classnames = {}, _classnames[prefix + 'tabs'] = true, _classnames[prefix + 'tabs-' + shape] = shape, _classnames[prefix + 'tabs-vertical'] = shape === 'wrapped' && ['left', 'right'].indexOf(tabPosition) >= 0, _classnames[prefix + 'tabs-scrollable'] = isTouchable, _classnames[prefix + 'tabs-' + newPosition] = shape === 'wrapped', _classnames['' + (prefix + size)] = size, _classnames), className);

        var navProps = {
            prefix: prefix,
            rtl: rtl,
            animation: animation,
            activeKey: activeKey,
            excessMode: isTouchable ? 'slide' : excessMode,
            extra: extra,
            tabs: tabs,
            tabPosition: tabPosition,
            tabRender: tabRender,
            triggerType: triggerType,
            popupProps: popupProps,
            onClose: onClose,
            onTriggerEvent: this.handleTriggerEvent,
            onKeyDown: this.onNavKeyDown,
            style: navStyle,
            className: navClassName
        };

        var contentProps = {
            prefix: prefix,
            activeKey: activeKey,
            lazyLoad: lazyLoad,
            unmountInactiveTabs: unmountInactiveTabs,
            style: contentStyle,
            className: contentClassName
        };

        var tabChildren = [React.createElement(TabNav, _extends({ key: 'tab-nav' }, navProps)), React.createElement(
            TabContent,
            _extends({ key: 'tab-content' }, contentProps),
            tabs
        )];

        if (tabPosition === 'bottom') {
            tabChildren.reverse();
        }

        return React.createElement(
            'div',
            _extends({
                dir: rtl ? 'rtl' : undefined,
                className: classNames
            }, obj.pickOthers(Tab.propTypes, others)),
            tabChildren
        );
    };

    return Tab;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    device: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
    /**
     * 被激活的选项卡的 key, 赋值则tab为受控组件, 用户无法切换
     */
    activeKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 初始化时被激活的选项卡的 key
     */
    defaultActiveKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 外观形态
     */
    shape: PropTypes.oneOf(['pure', 'wrapped', 'text', 'capsule']),
    /**
     * 是否开启动效
     */
    animation: PropTypes.bool,
    /**
     * 选项卡过多时的滑动模式
     */
    excessMode: PropTypes.oneOf(['slide', 'dropdown']),
    /**
     * 导航选项卡的位置，只适用于包裹型（wrapped）选项卡
     */
    tabPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    /**
     * 尺寸
     */
    size: PropTypes.oneOf(['small', 'medium']),
    /**
     * 激活选项卡的触发方式
     */
    triggerType: PropTypes.oneOf(['hover', 'click']),
    /**
     * 是否延迟加载 TabPane 的内容, 默认开启, 即不提前渲染
     */
    lazyLoad: PropTypes.bool,
    /**
     * 是否自动卸载未处于激活状态的选项卡
     */
    unmountInactiveTabs: PropTypes.bool,
    /**
     * 导航条的自定义样式
     */
    navStyle: PropTypes.object,
    /**
     * 导航条的自定义样式类
     */
    navClassName: PropTypes.string,
    /**
     * 内容区容器的自定义样式
     */
    contentStyle: PropTypes.object,
    /**
     * 内容区容器的自定义样式类
     */
    contentClassName: PropTypes.string,
    /**
     * 导航栏附加内容
     */
    extra: PropTypes.node,
    /**
     * 点击单个选项卡时触发的回调
     */
    onClick: PropTypes.func,
    /**
     * 选项卡发生切换时的事件回调
     * @param {String|Number} key 改变后的 key
     */
    onChange: PropTypes.func,
    /**
     * 选项卡被关闭时的事件回调
     * @param {String|Number} key   关闭的选项卡的 key
     */
    onClose: PropTypes.func,
    /**
     * 自定义选项卡模板渲染函数
     * @param {String} key 当前 Tab.Item 的 key 值
     * @param {Object} props 传给 Tab.Item 的所有属性键值对
     * @return {ReactNode} 返回自定义组件
     */
    tabRender: PropTypes.func,
    /**
     * 弹层属性透传, 只有当 excessMode 为 dropdown 时生效
     */
    popupProps: PropTypes.object,
    children: PropTypes.any,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    shape: 'pure',
    size: 'medium',
    animation: true,
    tabPosition: 'top',
    excessMode: 'slide',
    triggerType: 'click',
    lazyLoad: true,
    unmountInactiveTabs: false,
    onClick: noop,
    onChange: noop,
    onClose: noop
}, _temp);
Tab.displayName = 'Tab';
export { Tab as default };