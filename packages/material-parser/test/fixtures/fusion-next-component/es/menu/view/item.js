import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children, isValidElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { func, obj, KEYCODE } from '../../util';

var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;
var Item = (_temp = _class = function (_Component) {
    _inherits(Item, _Component);

    function Item(props) {
        _classCallCheck(this, Item);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        bindCtx(_this, ['handleClick', 'handleKeyDown']);
        return _this;
    }

    Item.prototype.componentDidMount = function componentDidMount() {
        this.itemNode = findDOMNode(this);

        var _props = this.props,
            parentMode = _props.parentMode,
            root = _props.root,
            menu = _props.menu;

        if (menu) {
            this.menuNode = findDOMNode(menu);
        } else if (parentMode === 'popup') {
            this.menuNode = this.itemNode.parentNode;
        } else {
            this.menuNode = findDOMNode(root);
            var _root$props = root.props,
                prefix = _root$props.prefix,
                header = _root$props.header,
                footer = _root$props.footer;

            if (header || footer) {
                this.menuNode = this.menuNode.querySelector('.' + prefix + 'menu-content');
            }
        }

        this.setFocus();
    };

    Item.prototype.componentDidUpdate = function componentDidUpdate() {
        this.setFocus();
    };

    Item.prototype.focusable = function focusable() {
        var _props2 = this.props,
            root = _props2.root,
            type = _props2.type,
            disabled = _props2.disabled;
        var focusable = root.props.focusable;

        return focusable && (type === 'submenu' || !disabled);
    };

    Item.prototype.getFocused = function getFocused() {
        var _props3 = this.props,
            _key = _props3._key,
            root = _props3.root;
        var focusedKey = root.state.focusedKey;

        return focusedKey === _key;
    };

    Item.prototype.setFocus = function setFocus() {
        var focused = this.getFocused();
        if (focused) {
            if (this.focusable()) {
                this.itemNode.focus({ preventScroll: true });
            }
            if (this.menuNode && this.menuNode.scrollHeight > this.menuNode.clientHeight) {
                var scrollBottom = this.menuNode.clientHeight + this.menuNode.scrollTop;
                var itemBottom = this.itemNode.offsetTop + this.itemNode.offsetHeight;
                if (itemBottom > scrollBottom) {
                    this.menuNode.scrollTop = itemBottom - this.menuNode.clientHeight;
                } else if (this.itemNode.offsetTop < this.menuNode.scrollTop) {
                    this.menuNode.scrollTop = this.itemNode.offsetTop;
                }
            }
        }
    };

    Item.prototype.handleClick = function handleClick(e) {
        e.stopPropagation();

        var _props4 = this.props,
            _key = _props4._key,
            root = _props4.root,
            disabled = _props4.disabled;


        if (!disabled) {
            root.handleItemClick(_key, this, e);

            this.props.onClick && this.props.onClick(e);
        } else {
            e.preventDefault();
        }
    };

    Item.prototype.handleKeyDown = function handleKeyDown(e) {
        var _props5 = this.props,
            _key = _props5._key,
            root = _props5.root,
            type = _props5.type;


        if (this.focusable()) {
            root.handleItemKeyDown(_key, type, this, e);

            switch (e.keyCode) {
                case KEYCODE.ENTER:
                    {
                        if (!(type === 'submenu')) {
                            this.handleClick(e);
                        }
                        break;
                    }
            }
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    };

    Item.prototype.getTitle = function getTitle(children) {
        var labelString = '';

        var loop = function loop(children) {
            Children.forEach(children, function (child) {
                if (isValidElement(child) && child.props.children) {
                    loop(child.props.children);
                } else if (typeof child === 'string') {
                    labelString += child;
                }
            });
        };

        loop(children);

        return labelString;
    };

    Item.prototype.render = function render() {
        var _cx;

        var _props6 = this.props,
            inlineLevel = _props6.inlineLevel,
            root = _props6.root,
            replaceClassName = _props6.replaceClassName,
            groupIndent = _props6.groupIndent,
            component = _props6.component,
            disabled = _props6.disabled,
            className = _props6.className,
            children = _props6.children,
            needIndent = _props6.needIndent,
            parentMode = _props6.parentMode,
            _key = _props6._key;

        var others = pickOthers(Object.keys(Item.propTypes), this.props);

        var _root$props2 = root.props,
            prefix = _root$props2.prefix,
            focusable = _root$props2.focusable,
            inlineIndent = _root$props2.inlineIndent,
            itemClassName = _root$props2.itemClassName,
            rtl = _root$props2.rtl;

        var focused = this.getFocused();

        var newClassName = replaceClassName ? className : cx((_cx = {}, _cx[prefix + 'menu-item'] = true, _cx[prefix + 'disabled'] = disabled, _cx[prefix + 'focused'] = !focusable && focused, _cx[itemClassName] = !!itemClassName, _cx[className] = !!className, _cx));
        if (disabled) {
            others['aria-disabled'] = true;
            others['aria-hidden'] = true;
        }

        others.tabIndex = root.tabbableKey === _key ? '0' : '-1';

        if (parentMode === 'inline' && inlineLevel > 1 && inlineIndent > 0 && needIndent) {
            var _extends2;

            var paddingProp = rtl ? 'paddingRight' : 'paddingLeft';
            others.style = _extends({}, others.style || {}, (_extends2 = {}, _extends2[paddingProp] = inlineLevel * inlineIndent - (groupIndent || 0) * 0.4 * inlineIndent + 'px', _extends2));
        }
        var TagName = component;

        var role = 'menuitem';
        if ('selectMode' in root.props) {
            role = 'option';
        }

        return React.createElement(
            TagName,
            _extends({
                role: role,
                title: this.getTitle(children)
            }, others, {
                className: newClassName,
                onClick: this.handleClick,
                onKeyDown: this.handleKeyDown
            }),
            React.createElement(
                'div',
                { className: prefix + 'menu-item-inner' },
                children
            )
        );
    };

    return Item;
}(Component), _class.propTypes = {
    _key: PropTypes.string,
    level: PropTypes.number,
    inlineLevel: PropTypes.number,
    groupIndent: PropTypes.number,
    root: PropTypes.object,
    menu: PropTypes.any,
    parent: PropTypes.object,
    parentMode: PropTypes.oneOf(['inline', 'popup']),
    type: PropTypes.oneOf(['submenu', 'item']),
    component: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    needIndent: PropTypes.bool,
    replaceClassName: PropTypes.bool
}, _class.defaultProps = {
    component: 'li',
    groupIndent: 0,
    replaceClassName: false,
    needIndent: true
}, _temp);
Item.displayName = 'Item';
export { Item as default };