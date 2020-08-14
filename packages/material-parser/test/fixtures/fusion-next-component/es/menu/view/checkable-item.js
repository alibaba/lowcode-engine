import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../checkbox';
import Radio from '../../radio';
import { func, obj, KEYCODE, htmlId } from '../../util';
import Item from './item';

var noop = {};
var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;
var CheckableItem = (_temp = _class = function (_Component) {
    _inherits(CheckableItem, _Component);

    function CheckableItem(props) {
        _classCallCheck(this, CheckableItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        bindCtx(_this, ['stopPropagation', 'handleKeyDown', 'handleClick']);
        _this.id = htmlId.escapeForId('checkable-item-' + (props.id || props._key));
        return _this;
    }

    CheckableItem.prototype.stopPropagation = function stopPropagation(e) {
        e.stopPropagation();
    };

    CheckableItem.prototype.handleCheck = function handleCheck(e) {
        var _props = this.props,
            checkType = _props.checkType,
            checked = _props.checked,
            onChange = _props.onChange;

        if (!(checkType === 'radio' && checked)) {
            onChange(!checked, e);
        }
    };

    CheckableItem.prototype.handleKeyDown = function handleKeyDown(e) {
        if (e.keyCode === KEYCODE.SPACE && !this.props.checkDisabled) {
            this.handleCheck(e);
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    };

    CheckableItem.prototype.handleClick = function handleClick(e) {
        this.handleCheck(e);

        this.props.onClick && this.props.onClick(e);
    };

    CheckableItem.prototype.renderCheck = function renderCheck() {
        var _props2 = this.props,
            root = _props2.root,
            checked = _props2.checked,
            indeterminate = _props2.indeterminate,
            disabled = _props2.disabled,
            checkType = _props2.checkType,
            checkDisabled = _props2.checkDisabled,
            onChange = _props2.onChange;
        var labelToggleChecked = root.props.labelToggleChecked;

        var Check = checkType === 'radio' ? Radio : Checkbox;

        var checkProps = {
            tabIndex: '-1',
            checked: checked,
            disabled: disabled || checkDisabled
        };
        if (checkType === 'checkbox') {
            checkProps.indeterminate = indeterminate;
        }
        if (!labelToggleChecked) {
            checkProps.onChange = onChange;
            checkProps.onClick = this.stopPropagation;
        }

        return React.createElement(Check, _extends({ 'aria-labelledby': this.id }, checkProps));
    };

    CheckableItem.prototype.render = function render() {
        var _props3 = this.props,
            _key = _props3._key,
            root = _props3.root,
            checked = _props3.checked,
            disabled = _props3.disabled,
            onClick = _props3.onClick,
            helper = _props3.helper,
            children = _props3.children;
        var _root$props = root.props,
            prefix = _root$props.prefix,
            labelToggleChecked = _root$props.labelToggleChecked;

        var others = pickOthers(Object.keys(CheckableItem.propTypes), this.props);

        var newProps = _extends({
            _key: _key,
            root: root,
            disabled: disabled,
            type: 'item',
            onClick: onClick,
            onKeyDown: this.handleKeyDown
        }, others);
        if (labelToggleChecked && !disabled) {
            newProps.onClick = this.handleClick;
        }

        return React.createElement(
            Item,
            _extends({ 'aria-checked': checked }, newProps),
            this.renderCheck(),
            React.createElement(
                'span',
                { className: prefix + 'menu-item-text', id: this.id },
                children
            ),
            helper ? React.createElement(
                'div',
                { className: prefix + 'menu-item-helper' },
                helper
            ) : null
        );
    };

    return CheckableItem;
}(Component), _class.propTypes = {
    _key: PropTypes.string,
    root: PropTypes.object,
    disabled: PropTypes.bool,
    inlineIndent: PropTypes.number,
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    onChange: PropTypes.func,
    checkType: PropTypes.oneOf(['checkbox', 'radio']),
    checkDisabled: PropTypes.bool,
    helper: PropTypes.node,
    children: PropTypes.node,
    onKeyDown: PropTypes.func,
    onClick: PropTypes.func,
    id: PropTypes.string
}, _class.defaultProps = {
    disabled: false,
    checked: false,
    indeterminate: false,
    checkType: 'checkbox',
    checkDisabled: false,
    onChange: noop
}, _temp);
CheckableItem.displayName = 'CheckableItem';
export { CheckableItem as default };