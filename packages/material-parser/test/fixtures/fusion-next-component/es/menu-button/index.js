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
import Button from '../button';
import Icon from '../icon';
import Menu from '../menu';
import Overlay from '../overlay';
import { obj, func } from '../util';

var Popup = Overlay.Popup;

/**
 * MenuButton
 */

var MenuButton = (_temp = _class = function (_React$Component) {
    _inherits(MenuButton, _React$Component);

    function MenuButton(props, context) {
        _classCallCheck(this, MenuButton);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

        _this.clickMenuItem = function (key) {
            var _this$props;

            for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                others[_key - 1] = arguments[_key];
            }

            var selectMode = _this.props.selectMode;


            (_this$props = _this.props).onItemClick.apply(_this$props, [key].concat(others));

            if (selectMode === 'multiple') {
                return;
            }

            _this.onPopupVisibleChange(false, 'menuSelect');
        };

        _this.selectMenu = function (keys) {
            var _this$props2;

            for (var _len2 = arguments.length, others = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                others[_key2 - 1] = arguments[_key2];
            }

            if (!('selectedKeys' in _this.props)) {
                _this.setState({
                    selectedKeys: keys
                });
            }
            (_this$props2 = _this.props).onSelect.apply(_this$props2, [keys].concat(others));
        };

        _this.onPopupOpen = function () {
            var button = findDOMNode(_this);
            if (_this.props.autoWidth && button && _this.menu) {
                _this.menu.style.width = button.offsetWidth + 'px';
            }
        };

        _this.onPopupVisibleChange = function (visible, type) {
            if (!('visible' in _this.props)) {
                _this.setState({
                    visible: visible
                });
            }
            _this.props.onVisibleChange(visible, type);
        };

        _this._menuRefHandler = function (ref) {
            _this.menu = findDOMNode(ref);

            var refFn = _this.props.menuProps.ref;
            if (typeof refFn === 'function') {
                refFn(ref);
            }
        };

        _this.state = {
            selectedKeys: props.selectedKeys || props.defaultSelectedKeys,
            visible: props.visible || props.defaultVisible
        };
        return _this;
    }

    MenuButton.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
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

    MenuButton.prototype.render = function render() {
        var _classnames, _classnames2;

        var _props = this.props,
            prefix = _props.prefix,
            style = _props.style,
            className = _props.className,
            label = _props.label,
            popupTriggerType = _props.popupTriggerType,
            popupContainer = _props.popupContainer,
            popupStyle = _props.popupStyle,
            popupClassName = _props.popupClassName,
            popupProps = _props.popupProps,
            followTrigger = _props.followTrigger,
            selectMode = _props.selectMode,
            menuProps = _props.menuProps,
            children = _props.children,
            others = _objectWithoutProperties(_props, ['prefix', 'style', 'className', 'label', 'popupTriggerType', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'followTrigger', 'selectMode', 'menuProps', 'children']);

        var state = this.state;

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'menu-btn'] = true, _classnames[prefix + 'expand'] = state.visible, _classnames.opened = state.visible, _classnames), className);

        var popupClassNames = classnames((_classnames2 = {}, _classnames2[prefix + 'menu-btn-popup'] = true, _classnames2), popupClassName);

        var trigger = React.createElement(
            Button,
            _extends({
                style: style,
                className: classNames
            }, obj.pickOthers(MenuButton.propTypes, others)),
            label,
            ' ',
            React.createElement(Icon, { type: 'arrow-down', className: prefix + 'menu-btn-arrow' })
        );

        return React.createElement(
            Popup,
            _extends({}, popupProps, {
                followTrigger: followTrigger,
                visible: state.visible,
                onVisibleChange: this.onPopupVisibleChange,
                trigger: trigger,
                triggerType: popupTriggerType,
                container: popupContainer,
                onOpen: this.onPopupOpen,
                style: popupStyle,
                className: popupClassNames
            }),
            React.createElement(
                Menu,
                _extends({}, menuProps, {
                    ref: this._menuRefHandler,
                    selectedKeys: state.selectedKeys,
                    selectMode: selectMode,
                    onSelect: this.selectMenu,
                    onItemClick: this.clickMenuItem
                }),
                children
            )
        );
    };

    return MenuButton;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 按钮上的文本内容
     */
    label: PropTypes.node,
    /**
     * 弹层是否与按钮宽度相同
     */
    autoWidth: PropTypes.bool,
    /**
     * 弹层触发方式
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * 弹层容器
     */
    popupContainer: PropTypes.any,
    /**
     * 弹层展开状态
     */
    visible: PropTypes.bool,
    /**
     * 弹层默认是否展开
     */
    defaultVisible: PropTypes.bool,
    /**
     * 弹层在显示和隐藏触发的事件
     */
    onVisibleChange: PropTypes.func,
    /**
     * 弹层自定义样式
     */
    popupStyle: PropTypes.object,
    /**
     * 弹层自定义样式类
     */
    popupClassName: PropTypes.string,
    /**
     * 弹层属性透传
     */
    popupProps: PropTypes.object,
    /**
     * 是否跟随滚动
     */
    followTrigger: PropTypes.bool,
    /**
     * 默认激活的菜单项（用法同 Menu 非受控）
     */
    defaultSelectedKeys: PropTypes.array,
    /**
     * 激活的菜单项（用法同 Menu 受控）
     */
    selectedKeys: PropTypes.array,
    /**
     * 菜单的选择模式，同 Menu
     */
    selectMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 点击菜单项后的回调，同 Menu
     */
    onItemClick: PropTypes.func,
    /**
     * 选择菜单后的回调，同 Menu
     */
    onSelect: PropTypes.func,
    /**
     * 菜单属性透传
     */
    menuProps: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any
}, _class.defaultProps = {
    prefix: 'next-',
    autoWidth: true,
    popupTriggerType: 'click',
    onVisibleChange: func.noop,
    onItemClick: func.noop,
    onSelect: func.noop,
    defaultSelectedKeys: [],
    menuProps: {}
}, _temp);
MenuButton.displayName = 'MenuButton';


MenuButton.Item = Menu.Item;
MenuButton.Group = Menu.Group;
MenuButton.Divider = Menu.Divider;

export default MenuButton;