import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../icon';
import { func, obj, KEYCODE } from '../../util';
import Item from './item';

var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;

/**
 * Menu.Item
 * @order 0
 */

var SelectableItem = (_temp = _class = function (_Component) {
    _inherits(SelectableItem, _Component);

    function SelectableItem(props) {
        _classCallCheck(this, SelectableItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        bindCtx(_this, ['handleKeyDown', 'handleClick']);
        return _this;
    }

    SelectableItem.prototype.getSelected = function getSelected() {
        var _props = this.props,
            _key = _props._key,
            root = _props.root,
            selected = _props.selected;
        var selectMode = root.props.selectMode;
        var selectedKeys = root.state.selectedKeys;

        return selected || !!selectMode && selectedKeys.indexOf(_key) > -1;
    };

    SelectableItem.prototype.handleSelect = function handleSelect(e) {
        var _props2 = this.props,
            _key = _props2._key,
            root = _props2.root,
            onSelect = _props2.onSelect;

        if (onSelect) {
            onSelect(!this.getSelected(), this, e);
        } else {
            root.handleSelect(_key, !this.getSelected(), this);
        }
    };

    SelectableItem.prototype.handleKeyDown = function handleKeyDown(e) {
        if (e.keyCode === KEYCODE.SPACE && !this.props.disabled) {
            this.handleSelect(e);
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    };

    SelectableItem.prototype.handleClick = function handleClick(e) {
        this.handleSelect(e);

        this.props.onClick && this.props.onClick(e);
    };

    SelectableItem.prototype.renderSelectedIcon = function renderSelectedIcon(selected) {
        var _cx;

        var _props3 = this.props,
            root = _props3.root,
            inlineIndent = _props3.inlineIndent,
            needIndent = _props3.needIndent,
            hasSelectedIcon = _props3.hasSelectedIcon,
            isSelectIconRight = _props3.isSelectIconRight,
            type = _props3.type;
        var _root$props = root.props,
            prefix = _root$props.prefix,
            rootSelectedIcon = _root$props.hasSelectedIcon,
            rootSelectIconRight = _root$props.isSelectIconRight;


        var cls = cx((_cx = {}, _cx[prefix + 'menu-icon-selected'] = true, _cx[prefix + 'menu-icon-right'] = ('isSelectIconRight' in this.props ? isSelectIconRight : rootSelectIconRight) && type !== 'submenu', _cx));

        return ('hasSelectedIcon' in this.props ? hasSelectedIcon : rootSelectedIcon) && selected ? React.createElement(Icon, {
            style: needIndent && inlineIndent > 0 ? { left: inlineIndent + 'px' } : null,
            className: cls,
            type: 'select'
        }) : null;
    };

    SelectableItem.prototype.render = function render() {
        var _cx2;

        var _props4 = this.props,
            _key = _props4._key,
            root = _props4.root,
            className = _props4.className,
            disabled = _props4.disabled,
            helper = _props4.helper,
            children = _props4.children,
            needIndent = _props4.needIndent;
        var prefix = root.props.prefix;

        var others = pickOthers(Object.keys(SelectableItem.propTypes), this.props);
        var selected = this.getSelected();

        var newProps = _extends({
            _key: _key,
            root: root,
            disabled: disabled,
            type: 'item',
            className: cx((_cx2 = {}, _cx2[prefix + 'selected'] = selected, _cx2[className] = !!className, _cx2)),
            onKeyDown: this.handleKeyDown,
            onClick: !disabled ? this.handleClick : this.props.onClick,
            needIndent: needIndent
        }, others);

        var textProps = {};

        if ('selectMode' in root.props) {
            textProps['aria-selected'] = selected;
        }

        return React.createElement(
            Item,
            newProps,
            this.renderSelectedIcon(selected),
            React.createElement(
                'span',
                _extends({ className: prefix + 'menu-item-text' }, textProps),
                children
            ),
            helper ? React.createElement(
                'div',
                { className: prefix + 'menu-item-helper' },
                helper
            ) : null
        );
    };

    return SelectableItem;
}(Component), _class.menuChildType = 'item', _class.propTypes = {
    _key: PropTypes.string,
    root: PropTypes.object,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    inlineIndent: PropTypes.number,
    /**
     * 是否禁用
     */
    disabled: PropTypes.bool,
    /**
     * 帮助文本
     */
    helper: PropTypes.node,
    /**
     * 菜单项标签内容
     */
    children: PropTypes.node,
    className: PropTypes.string,
    onKeyDown: PropTypes.func,
    onClick: PropTypes.func,
    needIndent: PropTypes.bool,
    hasSelectedIcon: PropTypes.bool,
    isSelectIconRight: PropTypes.bool
}, _class.defaultProps = {
    disabled: false,
    needIndent: true
}, _temp);
SelectableItem.displayName = 'SelectableItem';
export { SelectableItem as default };