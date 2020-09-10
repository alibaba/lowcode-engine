import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import { obj, func } from '../util';
import Tag from './tag';

var noop = func.noop,
    bindCtx = func.bindCtx;

/**
 * Tag.Selectable
 */

var Selectable = (_temp = _class = function (_Component) {
    _inherits(Selectable, _Component);

    function Selectable(props) {
        _classCallCheck(this, Selectable);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            checked: 'checked' in props ? props.checked : props.defaultChecked || false
        };

        bindCtx(_this, ['handleClick']);
        return _this;
    }

    Selectable.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        if (props.checked !== undefined && props.checked !== state.checked) {
            return {
                checked: props.checked
            };
        }

        return null;
    };

    Selectable.prototype.handleClick = function handleClick(e) {
        e && e.preventDefault();
        // IE9 不支持 pointer-events，还是可能会触发 click 事件
        if (this.props.disabled) {
            return false;
        }

        var checked = this.state.checked;


        this.setState({
            checked: !checked
        });

        this.props.onChange(!checked, e);
    };

    Selectable.prototype.render = function render() {
        var attrFilterTarget = ['checked', 'defaultChecked', 'onChange', 'className',
        // 防止这些额外的参数影响 tag 的类型
        '_shape', 'closable'];

        var others = obj.pickOthers(attrFilterTarget, this.props);
        var isChecked = 'checked' in this.props ? this.props.checked : this.state.checked;
        var clazz = classNames(this.props.className, {
            checked: isChecked
        });
        return React.createElement(Tag, _extends({}, others, {
            role: 'checkbox',
            _shape: 'checkable',
            'aria-checked': isChecked,
            className: clazz,
            onClick: this.handleClick
        }));
    };

    return Selectable;
}(Component), _class.propTypes = {
    /**
     * 标签是否被选中，受控用法
     * tag checked or not, a controlled way
     */
    checked: PropTypes.bool,
    /**
     * 标签是否默认被选中，非受控用法
     * tag checked or not by default, a uncontrolled way
     */
    defaultChecked: PropTypes.bool,
    /**
     * 选中状态变化时触发的事件
     * @param {Boolean} checked 是否选中
     * @param {Event} e Dom 事件对象
     */
    onChange: PropTypes.func,
    /**
     * 标签是否被禁用
     */
    disabled: PropTypes.bool,
    className: PropTypes.any
}, _class.defaultProps = {
    onChange: noop
}, _temp);
Selectable.displayName = 'Selectable';


export default polyfill(Selectable);