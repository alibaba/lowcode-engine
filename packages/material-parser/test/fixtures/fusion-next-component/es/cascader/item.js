import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Menu from '../menu';
import Icon from '../icon';
import { func, obj, KEYCODE } from '../util';

var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;
var CascaderMenuItem = (_temp = _class = function (_Component) {
    _inherits(CascaderMenuItem, _Component);

    function CascaderMenuItem(props) {
        _classCallCheck(this, CascaderMenuItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            loading: false
        };

        bindCtx(_this, ['handleExpand', 'handleClick', 'handleMouseEnter', 'handleKeyDown', 'removeLoading']);
        return _this;
    }

    CascaderMenuItem.prototype.addLoading = function addLoading() {
        this.setState({
            loading: true
        });
    };

    CascaderMenuItem.prototype.removeLoading = function removeLoading() {
        this.setState({
            loading: false
        });
    };

    CascaderMenuItem.prototype.setLoadingIfNeed = function setLoadingIfNeed(p) {
        if (p && typeof p.then === 'function') {
            this.addLoading();
            p.then(this.removeLoading).catch(this.removeLoading);
        }
    };

    CascaderMenuItem.prototype.handleExpand = function handleExpand(focusedFirstChild) {
        this.setLoadingIfNeed(this.props.onExpand(focusedFirstChild));
    };

    CascaderMenuItem.prototype.handleClick = function handleClick() {
        this.handleExpand(false);
    };

    CascaderMenuItem.prototype.handleMouseEnter = function handleMouseEnter() {
        this.handleExpand(false);
    };

    CascaderMenuItem.prototype.handleKeyDown = function handleKeyDown(e) {
        if (!this.props.disabled) {
            if (e.keyCode === KEYCODE.RIGHT || e.keyCode === KEYCODE.ENTER) {
                if (this.props.canExpand) {
                    this.handleExpand(true);
                }
            } else if (e.keyCode === KEYCODE.LEFT || e.keyCode === KEYCODE.ESC) {
                this.props.onFold();
            } else if (e.keyCode === KEYCODE.SPACE) {
                this.handleExpand(false);
            }
        }
    };

    CascaderMenuItem.prototype.render = function render() {
        var _cx;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            menu = _props.menu,
            disabled = _props.disabled,
            selected = _props.selected,
            onSelect = _props.onSelect,
            expanded = _props.expanded,
            canExpand = _props.canExpand,
            expandTriggerType = _props.expandTriggerType,
            checkable = _props.checkable,
            checked = _props.checked,
            indeterminate = _props.indeterminate,
            checkboxDisabled = _props.checkboxDisabled,
            onCheck = _props.onCheck,
            children = _props.children;

        var others = pickOthers(Object.keys(CascaderMenuItem.propTypes), this.props);
        var loading = this.state.loading;


        var itemProps = _extends({
            className: cx((_cx = {}, _cx[prefix + 'cascader-menu-item'] = true, _cx[prefix + 'expanded'] = expanded, _cx[className] = !!className, _cx)),
            disabled: disabled,
            menu: menu,
            onKeyDown: this.handleKeyDown,
            role: 'option'
        }, others);
        if (!disabled) {
            if (expandTriggerType === 'hover') {
                itemProps.onMouseEnter = this.handleMouseEnter;
            } else {
                itemProps.onClick = this.handleClick;
            }
        }

        var Item = void 0;
        if (checkable) {
            Item = Menu.CheckboxItem;
            itemProps.checked = checked;
            itemProps.indeterminate = indeterminate;
            itemProps.checkboxDisabled = checkboxDisabled;
            itemProps.onChange = onCheck;
        } else {
            Item = Menu.Item;
            itemProps.selected = selected;
            itemProps.onSelect = onSelect;
        }

        return React.createElement(
            Item,
            itemProps,
            children,
            canExpand ? loading ? React.createElement(Icon, {
                className: prefix + 'cascader-menu-icon-right ' + prefix + 'cascader-menu-icon-loading',
                type: 'loading'
            }) : React.createElement(Icon, {
                className: prefix + 'cascader-menu-icon-right ' + prefix + 'cascader-menu-icon-expand',
                type: 'arrow-right'
            }) : null
        );
    };

    return CascaderMenuItem;
}(Component), _class.menuChildType = 'item', _class.propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    expanded: PropTypes.bool,
    canExpand: PropTypes.bool,
    menu: PropTypes.any,
    expandTriggerType: PropTypes.oneOf(['click', 'hover']),
    onExpand: PropTypes.func,
    onFold: PropTypes.func,
    checkable: PropTypes.bool,
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    checkboxDisabled: PropTypes.bool,
    onCheck: PropTypes.func,
    children: PropTypes.node
}, _temp);
CascaderMenuItem.displayName = 'CascaderMenuItem';
export { CascaderMenuItem as default };