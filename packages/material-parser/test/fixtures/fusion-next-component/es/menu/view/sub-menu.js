import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Animate from '../../animate';
import Icon from '../../icon';
import { func, obj } from '../../util';
import Item from './item';
import SelectabelItem from './selectable-item';
import PopupItem from './popup-item';

var Expand = Animate.Expand;
var bindCtx = func.bindCtx;

/**
 * Menu.SubMenu
 * @order 1
 */

var SubMenu = (_temp = _class = function (_Component) {
    _inherits(SubMenu, _Component);

    function SubMenu(props) {
        _classCallCheck(this, SubMenu);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        bindCtx(_this, ['handleMouseEnter', 'handleMouseLeave', 'handleClick', 'handleOpen', 'afterLeave']);
        return _this;
    }

    SubMenu.prototype.componentDidMount = function componentDidMount() {
        this.itemNode = findDOMNode(this);
    };

    SubMenu.prototype.afterLeave = function afterLeave() {
        var _props = this.props,
            focused = _props.focused,
            root = _props.root;
        var focusable = root.props.focusable;

        if (focusable && focused) {
            this.itemNode.focus();
        }
    };

    SubMenu.prototype.getOpen = function getOpen() {
        var _props2 = this.props,
            _key = _props2._key,
            root = _props2.root;
        var openKeys = root.state.openKeys;


        return openKeys.indexOf(_key) > -1;
    };

    SubMenu.prototype.getChildSelected = function getChildSelected() {
        var _props3 = this.props,
            _key = _props3._key,
            root = _props3.root;
        var selectMode = root.props.selectMode;
        var selectedKeys = root.state.selectedKeys;


        var _keyPos = root.k2n[_key].pos;

        return !!selectMode && selectedKeys.some(function (key) {
            return root.k2n[key] && root.k2n[key].pos.indexOf(_keyPos) === 0;
        });
    };

    SubMenu.prototype.handleMouseEnter = function handleMouseEnter(e) {
        this.handleOpen(true);

        this.props.onMouseEnter && this.props.onMouseEnter(e);
    };

    SubMenu.prototype.handleMouseLeave = function handleMouseLeave(e) {
        this.handleOpen(false);

        this.props.onMouseLeave && this.props.onMouseLeave(e);
    };

    SubMenu.prototype.handleClick = function handleClick(e) {
        var _props4 = this.props,
            root = _props4.root,
            selectable = _props4.selectable;
        var selectMode = root.props.selectMode;

        if (selectMode && selectable) {
            e.stopPropagation();
        }

        var open = this.getOpen();
        this.handleOpen(!open);
    };

    SubMenu.prototype.handleOpen = function handleOpen(open, triggerType, e) {
        var _props5 = this.props,
            _key = _props5._key,
            root = _props5.root;

        root.handleOpen(_key, open, triggerType, e);
    };

    SubMenu.prototype.passParentToChildren = function passParentToChildren(children) {
        var _this2 = this;

        var _props6 = this.props,
            mode = _props6.mode,
            root = _props6.root;


        return Children.map(children, function (child) {
            // to fix https://github.com/alibaba-fusion/next/issues/952
            if (typeof child !== 'function' && (typeof child === 'undefined' ? 'undefined' : _typeof(child)) !== 'object') {
                return child;
            }

            return cloneElement(child, {
                parent: _this2,
                parentMode: mode || root.props.mode
            });
        });
    };

    SubMenu.prototype.renderInline = function renderInline() {
        var _cx, _cx2, _cx3, _cx4;

        var _props7 = this.props,
            _key = _props7._key,
            level = _props7.level,
            inlineLevel = _props7.inlineLevel,
            root = _props7.root,
            className = _props7.className,
            selectableFromProps = _props7.selectable,
            label = _props7.label,
            children = _props7.children,
            noIcon = _props7.noIcon,
            subMenuContentClassName = _props7.subMenuContentClassName,
            propsTriggerType = _props7.triggerType,
            parentMode = _props7.parentMode;
        var _root$props = root.props,
            prefix = _root$props.prefix,
            selectMode = _root$props.selectMode,
            rootTriggerType = _root$props.triggerType,
            inlineArrowDirection = _root$props.inlineArrowDirection,
            expandAnimation = _root$props.expandAnimation,
            rtl = _root$props.rtl;

        var triggerType = propsTriggerType || rootTriggerType;
        var open = this.getOpen();
        var isChildSelected = this.getChildSelected();

        var others = obj.pickOthers(Object.keys(SubMenu.propTypes), this.props);

        var liProps = {
            className: cx((_cx = {}, _cx[prefix + 'menu-sub-menu-wrapper'] = true, _cx[className] = !!className, _cx))
        };
        var itemProps = {
            'aria-expanded': open,
            _key: _key,
            level: level,
            role: 'listitem',
            inlineLevel: inlineLevel,
            root: root,
            type: 'submenu',
            component: 'div',
            parentMode: parentMode,
            className: cx((_cx2 = {}, _cx2[prefix + 'opened'] = open, _cx2[prefix + 'child-selected'] = isChildSelected, _cx2))
        };
        var arrorProps = {
            type: inlineArrowDirection === 'right' ? 'arrow-right' : 'arrow-down',
            className: cx((_cx3 = {}, _cx3[prefix + 'menu-icon-arrow'] = true, _cx3[prefix + 'menu-icon-arrow-down'] = inlineArrowDirection === 'down', _cx3[prefix + 'menu-icon-arrow-right'] = inlineArrowDirection === 'right', _cx3[prefix + 'open'] = open, _cx3))
        };

        var selectable = !!selectMode && selectableFromProps;
        var NewItem = selectable ? SelectabelItem : Item;

        if (triggerType === 'hover') {
            liProps.onMouseEnter = this.handleMouseEnter;
            liProps.onMouseLeave = this.handleMouseLeave;
        } else if (selectable) {
            arrorProps.onClick = this.handleClick;
        } else {
            itemProps.onClick = this.handleClick;
        }

        var newSubMenuContentClassName = cx((_cx4 = {}, _cx4[prefix + 'menu-sub-menu'] = true, _cx4[subMenuContentClassName] = !!subMenuContentClassName, _cx4));

        var roleMenu = 'menu',
            roleItem = 'menuitem';
        if ('selectMode' in root.props) {
            roleMenu = 'listbox';
            roleItem = 'option';
        }

        var subMenu = open ? React.createElement(
            'ul',
            {
                role: roleMenu,
                dir: rtl ? 'rtl' : undefined,
                ref: 'subMenu',
                className: newSubMenuContentClassName
            },
            this.passParentToChildren(children)
        ) : null;

        return React.createElement(
            'li',
            _extends({ role: roleItem }, others, liProps),
            React.createElement(
                NewItem,
                itemProps,
                React.createElement(
                    'span',
                    { className: prefix + 'menu-item-text' },
                    label
                ),
                noIcon ? null : React.createElement(Icon, arrorProps)
            ),
            expandAnimation ? React.createElement(
                Expand,
                {
                    animationAppear: false,
                    afterLeave: this.afterLeave
                },
                subMenu
            ) : subMenu
        );
    };

    SubMenu.prototype.renderPopup = function renderPopup() {
        var _cx5;

        var _props8 = this.props,
            children = _props8.children,
            subMenuContentClassName = _props8.subMenuContentClassName,
            noIcon = _props8.noIcon,
            others = _objectWithoutProperties(_props8, ['children', 'subMenuContentClassName', 'noIcon']);

        var root = this.props.root;
        var _root$props2 = root.props,
            prefix = _root$props2.prefix,
            popupClassName = _root$props2.popupClassName,
            popupStyle = _root$props2.popupStyle,
            rtl = _root$props2.rtl;


        var newClassName = cx((_cx5 = {}, _cx5[prefix + 'menu'] = true, _cx5[prefix + 'ver'] = true, _cx5[popupClassName] = !!popupClassName, _cx5[subMenuContentClassName] = !!subMenuContentClassName, _cx5));

        others.rtl = rtl;

        return React.createElement(
            PopupItem,
            _extends({}, others, { noIcon: noIcon, hasSubMenu: true }),
            React.createElement(
                'ul',
                {
                    role: 'menu',
                    dir: rtl ? 'rtl' : undefined,
                    className: newClassName,
                    style: popupStyle
                },
                this.passParentToChildren(children)
            )
        );
    };

    SubMenu.prototype.render = function render() {
        var _props9 = this.props,
            mode = _props9.mode,
            root = _props9.root;

        var newMode = mode || root.props.mode;

        return newMode === 'popup' ? this.renderPopup() : this.renderInline();
    };

    return SubMenu;
}(Component), _class.menuChildType = 'submenu', _class.propTypes = {
    _key: PropTypes.string,
    root: PropTypes.object,
    level: PropTypes.number,
    inlineLevel: PropTypes.number,
    groupIndent: PropTypes.number,
    noIcon: PropTypes.bool,
    /**
     * 标签内容
     */
    label: PropTypes.node,
    /**
     * 是否可选，该属性仅在设置 Menu 组件 selectMode 属性后生效
     */
    selectable: PropTypes.bool,
    /**
     * 子菜单打开方式，如果设置会覆盖 Menu 上的同名属性
     * @default Menu 的 mode 属性值
     */
    mode: PropTypes.oneOf(['inline', 'popup']),
    /**
     * 菜单项或下一级子菜单
     */
    children: PropTypes.node,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    subMenuContentClassName: PropTypes.string,
    triggerType: PropTypes.oneOf(['click', 'hover']),
    align: PropTypes.oneOf(['outside', 'follow']),
    parentMode: PropTypes.oneOf(['inline', 'popup'])
}, _class.defaultProps = {
    groupIndent: 0,
    noIcon: false,
    selectable: false
}, _temp);
SubMenu.displayName = 'SubMenu';
export { SubMenu as default };