import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../icon';
import Button from '../button';
import Overlay from '../overlay';
import Menu from '../menu';
import ConfigProvider from '../config-provider';
import { dom, obj, func } from '../util';

var Popup = Overlay.Popup;

/**
 * SplitButton
 */

var SplitButton = (_temp = _class = function (_React$Component) {
    _inherits(SplitButton, _React$Component);

    function SplitButton(props, context) {
        _classCallCheck(this, SplitButton);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

        _this.selectMenuItem = function (keys) {
            var _this$props;

            for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                others[_key - 1] = arguments[_key];
            }

            if (!('selectedKeys' in _this.props)) {
                _this.setState({
                    selectedKeys: keys
                });
            }
            (_this$props = _this.props).onSelect.apply(_this$props, [keys].concat(others));
        };

        _this.clickMenuItem = function (key) {
            var _this$props2;

            for (var _len2 = arguments.length, others = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                others[_key2 - 1] = arguments[_key2];
            }

            (_this$props2 = _this.props).onItemClick.apply(_this$props2, [key].concat(others));
            _this.onVisibleChange(false, 'menuSelect');
        };

        _this.onPopupOpen = function () {
            if (_this.props.autoWidth && _this.wrapper && _this.menu) {
                dom.setStyle(_this.menu, {
                    width: _this.wrapper.offsetWidth
                });
            }
        };

        _this.onVisibleChange = function (visible, reason) {
            if (!('visible' in _this.props)) {
                _this.setState({
                    visible: visible
                });
            }
            _this.props.onVisibleChange(visible, reason);
        };

        _this._menuRefHandler = function (ref) {
            _this.menu = findDOMNode(ref);

            var refFn = _this.props.menuProps.ref;
            if (typeof refFn === 'function') {
                refFn(ref);
            }
        };

        _this._wrapperRefHandler = function (ref) {
            _this.wrapper = findDOMNode(ref);
        };

        _this.state = {
            selectedKeys: props.selectedKeys || props.defaultSelectedKeys,
            visible: props.visible || props.defaultVisible
        };
        return _this;
    }

    SplitButton.prototype.componentDidMount = function componentDidMount() {
        // 由于定位目标是 wrapper，如果弹层默认展开，wrapper 还未渲染，didMount 后强制再渲染一次，弹层重新定位
        if (this.state.visible) {
            this.forceUpdate();
        }
    };

    SplitButton.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible
            });
        }

        if ('selectedKeys' in nextProps) {
            this.setState({
                selectedKeys: nextProps.selectedKeys
            });
        }
    };

    SplitButton.prototype.render = function render() {
        var _classnames,
            _classnames2,
            _this2 = this;

        var _props = this.props,
            prefix = _props.prefix,
            label = _props.label,
            size = _props.size,
            type = _props.type,
            component = _props.component,
            ghost = _props.ghost,
            className = _props.className,
            style = _props.style,
            children = _props.children,
            triggerProps = _props.triggerProps,
            popupAlign = _props.popupAlign,
            popupTriggerType = _props.popupTriggerType,
            popupStyle = _props.popupStyle,
            popupClassName = _props.popupClassName,
            popupProps = _props.popupProps,
            followTrigger = _props.followTrigger,
            selectMode = _props.selectMode,
            menuProps = _props.menuProps,
            leftButtonProps = _props.leftButtonProps,
            disabled = _props.disabled,
            others = _objectWithoutProperties(_props, ['prefix', 'label', 'size', 'type', 'component', 'ghost', 'className', 'style', 'children', 'triggerProps', 'popupAlign', 'popupTriggerType', 'popupStyle', 'popupClassName', 'popupProps', 'followTrigger', 'selectMode', 'menuProps', 'leftButtonProps', 'disabled']);

        var state = this.state;

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'split-btn'] = true, _classnames), className);

        var sharedBtnProps = {
            type: type,
            size: size,
            component: component,
            ghost: ghost,
            disabled: disabled
        };

        var triggerClassNames = classnames((_classnames2 = {}, _classnames2[prefix + 'split-btn-trigger'] = true, _classnames2[prefix + 'expand'] = state.visible, _classnames2.opened = state.visible, _classnames2));

        var trigger = React.createElement(
            Button,
            _extends({}, triggerProps, sharedBtnProps, {
                className: triggerClassNames
            }),
            React.createElement(Icon, { type: 'arrow-down' })
        );

        return React.createElement(
            Button.Group,
            _extends({}, obj.pickOthers(SplitButton.propTypes, others), {
                className: classNames,
                style: style,
                size: size,
                ref: this._wrapperRefHandler
            }),
            React.createElement(
                Button,
                _extends({}, sharedBtnProps, leftButtonProps),
                label
            ),
            React.createElement(
                Popup,
                _extends({}, popupProps, {
                    followTrigger: followTrigger,
                    visible: state.visible,
                    onVisibleChange: this.onVisibleChange,
                    trigger: trigger,
                    triggerType: popupTriggerType,
                    align: popupAlign,
                    target: function target() {
                        return _this2.wrapper;
                    },
                    style: popupStyle,
                    shouldUpdatePosition: true,
                    className: popupClassName,
                    onOpen: this.onPopupOpen
                }),
                React.createElement(
                    Menu,
                    _extends({}, menuProps, {
                        selectMode: selectMode,
                        selectedKeys: state.selectedKeys,
                        onSelect: this.selectMenuItem,
                        onItemClick: this.clickMenuItem,
                        ref: this._menuRefHandler
                    }),
                    children
                )
            )
        );
    };

    return SplitButton;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    style: PropTypes.object,
    /**
     * 按钮的类型
     */
    type: PropTypes.oneOf(['normal', 'primary', 'secondary']),
    /**
     * 按钮组的尺寸
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * 主按钮的文案
     */
    label: PropTypes.node,
    /**
     * 设置标签类型
     */
    component: PropTypes.oneOf(['button', 'a']),
    /**
     * 是否为幽灵按钮
     */
    ghost: PropTypes.oneOf(['light', 'dark', false, true]),
    /**
     * 默认激活的菜单项（用法同 Menu 非受控）
     */
    defaultSelectedKeys: PropTypes.array,
    /**
     * 激活的菜单项（用法同 Menu 受控）
     */
    selectedKeys: PropTypes.array,
    /**
     * 菜单的选择模式
     */
    selectMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 选择菜单项时的回调，参考 Menu
     */
    onSelect: PropTypes.func,
    /**
     * 点击菜单项时的回调，参考 Menu
     */
    onItemClick: PropTypes.func,
    /**
     * 触发按钮的属性（支持 Button 的所有属性透传）
     */
    triggerProps: PropTypes.object,
    /**
     * 弹层菜单的宽度是否与按钮组一致
     */
    autoWidth: PropTypes.bool,
    /**
     * 弹层是否显示
     */
    visible: PropTypes.bool,
    /**
     * 弹层默认是否显示
     */
    defaultVisible: PropTypes.bool,
    /**
     * 弹层显示状态变化时的回调函数
     * @param {Boolean} visible 弹层显示状态
     * @param {String} type 触发弹层显示或隐藏的来源 menuSelect 表示由menu触发； fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
     */
    onVisibleChange: PropTypes.func,
    /**
     * 弹层的触发方式
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * 弹层对齐方式, 详情见Overlay align
     */
    popupAlign: PropTypes.string,
    /**
     * 弹层自定义样式
     */
    popupStyle: PropTypes.object,
    /**
     * 弹层自定义样式类
     */
    popupClassName: PropTypes.string,
    /**
     * 透传给弹层的属性
     */
    popupProps: PropTypes.object,
    /**
     * 是否跟随滚动
     */
    followTrigger: PropTypes.bool,
    /**
     * 透传给 Menu 的属性
     */
    menuProps: PropTypes.object,
    /**
     * 透传给 左侧按钮 的属性
     */
    leftButtonProps: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any
}, _class.defaultProps = {
    prefix: 'next-',
    type: 'normal',
    size: 'medium',
    autoWidth: true,
    popupTriggerType: 'click',
    onVisibleChange: func.noop,
    onItemClick: func.noop,
    onSelect: func.noop,
    defaultSelectedKeys: [],
    menuProps: {},
    leftButtonProps: {}
}, _temp);
SplitButton.displayName = 'SplitButton';


SplitButton.Item = Menu.Item;
SplitButton.Divider = Menu.Divider;
SplitButton.Group = Menu.Group;

export default ConfigProvider.config(SplitButton);